import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Star, Loader2 } from 'lucide-react';
import type { ToolWithStats } from '@shared/schema';

export default function Home() {
  const { data: tools, isLoading } = useQuery<ToolWithStats[]>({
    queryKey: ['/api/tools'],
    queryFn: async () => {
      const { data: toolsData, error: toolsError } = await supabase
        .from('tools')
        .select('*')
        .eq('visible', true)
        .order('created_at', { ascending: false });

      if (toolsError) throw toolsError;

      // Fetch reviews for each tool to calculate average rating
      const toolsWithStats = await Promise.all(
        (toolsData || []).map(async (tool) => {
          const { data: reviews } = await supabase
            .from('reviews')
            .select('rating')
            .eq('tool_id', tool.id);

          const averageRating = reviews && reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : undefined;

          return {
            ...tool,
            averageRating,
            reviewCount: reviews?.length || 0,
          };
        })
      );

      return toolsWithStats;
    },
  });

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative py-20 px-4 border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to <span className="text-primary">SteamFamily</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            A collection of community tools for gamers
          </p>
          <p className="text-muted-foreground mb-8">
            Discover powerful tools to enhance your gaming experience
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg" 
              className="gap-2"
              asChild
            >
              <a href="#tools" data-testid="button-explore">
                <Download className="h-5 w-5" />
                Explore Tools
              </a>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="gap-2"
              asChild
            >
              <a href="#community" data-testid="button-community">
                Join Community
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose SteamFamily Section */}
      <section className="py-16 px-4 border-b border-border">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-semibold text-center mb-12">
            Why Choose <span className="text-primary">SteamFamily</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '🛡️',
                title: 'Community Trusted',
                description: 'Tools vetted and reviewed by gamers',
              },
              {
                icon: '⚡',
                title: 'Easy Access',
                description: 'Quick downloads with direct links to tool providers',
              },
              {
                icon: '⭐',
                title: 'User Reviews',
                description: 'Real feedback from gamers like you',
              },
              {
                icon: '👥',
                title: 'Active Community',
                description: 'Join discussions and share experiences',
              },
            ].map((feature, idx) => (
              <Card key={idx} className="hover-elevate transition-all">
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid Section */}
      <section id="tools" className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-semibold mb-8">Featured Tools</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : tools && tools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool) => (
                <Link key={tool.id} href={`/tool/${tool.slug}`} data-testid={`link-tool-${tool.slug}`}>
                  <Card className="hover-elevate transition-all cursor-pointer h-full" data-testid={`card-tool-${tool.slug}`}>
                    {tool.images && tool.images.length > 0 && (
                      <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
                        <img
                          src={tool.images[0]}
                          alt={tool.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="pt-4">
                      <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {tool.shortDescription}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {tool.tags && tool.tags.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1" data-testid={`text-downloads-${tool.slug}`}>
                          <Download className="h-4 w-4" />
                          {tool.downloads}
                        </span>
                        {tool.averageRating && (
                          <span className="flex items-center gap-1" data-testid={`text-rating-${tool.slug}`}>
                            <Star className="h-4 w-4 fill-primary text-primary" />
                            {tool.averageRating.toFixed(1)}
                          </span>
                        )}
                      </div>
                      <Badge variant="outline">v{tool.version}</Badge>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No tools available yet</p>
              <p className="text-sm text-muted-foreground mt-2">Check back soon for gaming tools!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
