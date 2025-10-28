import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';
import { supabase } from '@/lib/supabase';
import { queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, ExternalLink, Star, MessageSquare, ChevronLeft, Loader2 } from 'lucide-react';
import type { Tool, ReviewWithUser } from '@shared/schema';
import { useState, useEffect } from 'react';
import { DownloadModal } from '@/components/DownloadModal';
import { ReviewForm } from '@/components/ReviewForm';
import { ReviewList } from '@/components/ReviewList';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { ImageCarousel } from '@/components/ImageCarousel';

export default function ToolDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadType, setDownloadType] = useState<'primary' | 'mirror'>('primary');

  const { data: tool, isLoading } = useQuery<Tool>({
    queryKey: ['/api/tools', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: reviews = [] } = useQuery<ReviewWithUser[]>({
    queryKey: ['/api/reviews', tool?.id],
    queryFn: async () => {
      if (!tool?.id) return [];
      
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          user:profiles(display_name, avatar_url, email)
        `)
        .eq('tool_id', tool.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(r => ({
        ...r,
        user: r.user as any,
      }));
    },
    enabled: !!tool?.id,
  });

  // Implement real-time review updates using Supabase subscriptions
  useEffect(() => {
    if (!tool?.id) return;

    const channel = supabase
      .channel(`reviews:${tool.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews',
          filter: `tool_id=eq.${tool.id}`,
        },
        (payload) => {
          console.log('Real-time review update:', payload);
          // Invalidate queries to refetch with updated data
          queryClient.invalidateQueries({ queryKey: ['/api/reviews', tool.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tool?.id]);

  const trackDownloadMutation = useMutation({
    mutationFn: async (type: 'primary' | 'mirror') => {
      if (!tool) return;

      // Increment download count
      await supabase.rpc('increment_downloads', { tool_id: tool.id });

      // Log download
      await supabase.from('downloads_log').insert({
        tool_id: tool.id,
        user_id: user?.id || null,
        ip_hash: null, // Would need server-side implementation for real IP hashing
      });

      return type;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tools', slug] });
      toast({
        title: 'Download started',
        description: 'Your download should begin shortly',
      });
    },
  });

  const handleDownloadClick = (type: 'primary' | 'mirror') => {
    setDownloadType(type);
    setShowDownloadModal(true);
  };

  const handleConfirmDownload = () => {
    if (!tool) return;
    
    trackDownloadMutation.mutate(downloadType);
    
    const url = downloadType === 'primary' ? tool.downloadUrl : tool.mirrorUrl;
    if (url) {
      window.open(url, '_blank');
    }
    
    setShowDownloadModal(false);
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" data-testid="loader-tool-detail" />
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" data-testid="text-not-found">Tool Not Found</h1>
          <Link href="/">
            <Button variant="outline" data-testid="button-back-home">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Breadcrumb */}
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-6 gap-2" data-testid="button-back">
            <ChevronLeft className="h-4 w-4" />
            Back to Tools
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Screenshots */}
            {tool.images && tool.images.length > 0 && (
              <ImageCarousel images={tool.images} alt={tool.title} />
            )}

            {/* Description Card */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-3xl mb-2 break-words" data-testid="text-tool-title">
                      {tool.title}
                    </CardTitle>
                    <p className="text-muted-foreground break-words" data-testid="text-short-description">{tool.shortDescription}</p>
                  </div>
                  <Badge variant="outline" className="whitespace-nowrap" data-testid="badge-version">v{tool.version}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2" data-testid="container-tags">
                  {tool.tags && tool.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" data-testid={`badge-tag-${idx}`}>
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <Separator />
                
                <div 
                  className="prose prose-invert max-w-none break-words"
                  dangerouslySetInnerHTML={{ __html: tool.fullDescription }}
                  data-testid="text-full-description"
                />
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Reviews
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {reviews.length > 0 && (
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Star className="h-6 w-6 fill-primary text-primary" />
                      <span className="text-3xl font-bold" data-testid="text-average-rating">
                        {averageRating.toFixed(1)}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div data-testid="text-review-count">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</div>
                    </div>
                  </div>
                )}

                {user ? (
                  <ReviewForm toolId={tool.id} />
                ) : (
                  <div className="text-center py-8 border border-dashed border-border rounded-lg">
                    <p className="text-muted-foreground mb-4">Login to write a review</p>
                    <Link href="/login">
                      <Button data-testid="button-login-to-review">Login</Button>
                    </Link>
                  </div>
                )}

                <Separator />

                <ReviewList reviews={reviews} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Download</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full gap-2" 
                  size="lg"
                  onClick={() => handleDownloadClick('primary')}
                  data-testid="button-download"
                >
                  <Download className="h-5 w-5" />
                  Download
                </Button>

                {tool.mirrorUrl && (
                  <Button 
                    variant="outline" 
                    className="w-full gap-2"
                    onClick={() => handleDownloadClick('mirror')}
                    data-testid="button-mirror"
                  >
                    <Download className="h-5 w-5" />
                    Mirror Download
                  </Button>
                )}

                <Separator />

                <div className="space-y-3">
                  {tool.donateUrl && (
                    <Button 
                      variant="secondary" 
                      className="w-full gap-2"
                      asChild
                    >
                      <a href={tool.donateUrl} target="_blank" rel="noopener noreferrer" data-testid="button-donate">
                        <ExternalLink className="h-4 w-4" />
                        Support Creator
                      </a>
                    </Button>
                  )}

                  {tool.telegramUrl && (
                    <Button 
                      variant="secondary" 
                      className="w-full gap-2"
                      asChild
                    >
                      <a href={tool.telegramUrl} target="_blank" rel="noopener noreferrer" data-testid="button-telegram">
                        <ExternalLink className="h-4 w-4" />
                        Telegram Channel
                      </a>
                    </Button>
                  )}
                </div>

                <Separator />

                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Downloads:</span>
                    <span className="font-medium" data-testid="text-download-count">{tool.downloads}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Version:</span>
                    <span className="font-medium" data-testid="text-version">{tool.version}</span>
                  </div>
                  {reviews.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rating:</span>
                      <span className="font-medium flex items-center gap-1" data-testid="text-rating-sidebar">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        {averageRating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <DownloadModal
        open={showDownloadModal}
        onOpenChange={setShowDownloadModal}
        tool={tool}
        downloadType={downloadType}
        onConfirm={handleConfirmDownload}
      />
    </div>
  );
}
