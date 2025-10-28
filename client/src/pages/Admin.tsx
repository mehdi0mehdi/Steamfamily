// Admin panel visible only to admins — implementer: ensure Supabase RLS/policies protect admin writes.
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import { queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2, Plus, Edit, Trash2, Save } from 'lucide-react';
import type { Tool } from '@shared/schema';
import { useLocation } from 'wouter';

export default function Admin() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Check admin access
  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!profile.is_admin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">You do not have permission to access the admin panel.</p>
            <Button onClick={() => setLocation('/')}>Back to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    shortDescription: '',
    fullDescription: '',
    images: '',
    tags: '',
    downloadUrl: '',
    mirrorUrl: '',
    donateUrl: '',
    telegramUrl: '',
    version: '',
    visible: true,
    downloads: 0,
  });

  const { data: tools, isLoading } = useQuery<Tool[]>({
    queryKey: ['/api/admin/tools'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!profile?.is_admin,
  });

  const saveToolMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const toolData = {
        slug: data.slug.toLowerCase().replace(/\s+/g, '-'),
        title: data.title,
        short_description: data.shortDescription,
        full_description: data.fullDescription,
        images: data.images.split(',').map(s => s.trim()).filter(Boolean),
        tags: data.tags.split(',').map(s => s.trim()).filter(Boolean),
        download_url: data.downloadUrl,
        mirror_url: data.mirrorUrl || null,
        donate_url: data.donateUrl || null,
        telegram_url: data.telegramUrl || null,
        version: data.version,
        visible: data.visible,
        downloads: data.downloads,
      };

      if (editingTool) {
        const { error } = await supabase
          .from('tools')
          .update(toolData)
          .eq('id', editingTool.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('tools')
          .insert(toolData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: editingTool ? 'Tool updated successfully' : 'Tool created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/tools'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tools'] });
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteToolMutation = useMutation({
    mutationFn: async (toolId: string) => {
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', toolId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Tool deleted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/tools'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tools'] });
    },
  });

  const resetForm = () => {
    setFormData({
      slug: '',
      title: '',
      shortDescription: '',
      fullDescription: '',
      images: '',
      tags: '',
      downloadUrl: '',
      mirrorUrl: '',
      donateUrl: '',
      telegramUrl: '',
      version: '',
      visible: true,
      downloads: 0,
    });
    setEditingTool(null);
    setIsCreating(false);
  };

  const startEdit = (tool: Tool) => {
    setEditingTool(tool);
    setIsCreating(true);
    setFormData({
      slug: tool.slug,
      title: tool.title,
      shortDescription: tool.short_description,
      fullDescription: tool.full_description,
      images: tool.images?.join(', ') || '',
      tags: tool.tags?.join(', ') || '',
      downloadUrl: tool.download_url,
      mirrorUrl: tool.mirror_url || '',
      donateUrl: tool.donate_url || '',
      telegramUrl: tool.telegram_url || '',
      version: tool.version,
      visible: tool.visible,
      downloads: tool.downloads,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveToolMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          {!isCreating && (
            <Button onClick={() => setIsCreating(true)} className="gap-2" data-testid="button-create-tool">
              <Plus className="h-4 w-4" />
              Add New Tool
            </Button>
          )}
        </div>

        {isCreating && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingTool ? 'Edit Tool' : 'Create New Tool'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Tool Name *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      data-testid="input-title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="tool-name"
                      required
                      data-testid="input-slug"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="shortDescription">Short Description *</Label>
                    <Textarea
                      id="shortDescription"
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      required
                      className="resize-none"
                      data-testid="input-short-description"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="fullDescription">Full Description (HTML allowed) *</Label>
                    <Textarea
                      id="fullDescription"
                      value={formData.fullDescription}
                      onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                      required
                      className="min-h-40 resize-none font-mono text-sm"
                      data-testid="input-full-description"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="images">Image URLs (comma-separated)</Label>
                    <Input
                      id="images"
                      value={formData.images}
                      onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                      placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                      data-testid="input-images"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="gaming, utility, mod"
                      data-testid="input-tags"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="downloadUrl">Download URL *</Label>
                    <Input
                      id="downloadUrl"
                      type="url"
                      value={formData.downloadUrl}
                      onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                      required
                      data-testid="input-download-url"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mirrorUrl">Mirror URL</Label>
                    <Input
                      id="mirrorUrl"
                      type="url"
                      value={formData.mirrorUrl}
                      onChange={(e) => setFormData({ ...formData, mirrorUrl: e.target.value })}
                      data-testid="input-mirror-url"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="donateUrl">Donate URL</Label>
                    <Input
                      id="donateUrl"
                      type="url"
                      value={formData.donateUrl}
                      onChange={(e) => setFormData({ ...formData, donateUrl: e.target.value })}
                      data-testid="input-donate-url"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telegramUrl">Telegram URL</Label>
                    <Input
                      id="telegramUrl"
                      type="url"
                      value={formData.telegramUrl}
                      onChange={(e) => setFormData({ ...formData, telegramUrl: e.target.value })}
                      data-testid="input-telegram-url"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="version">Version *</Label>
                    <Input
                      id="version"
                      value={formData.version}
                      onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                      placeholder="1.0.0"
                      required
                      data-testid="input-version"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="downloads">Initial Download Count</Label>
                    <Input
                      id="downloads"
                      type="number"
                      value={formData.downloads}
                      onChange={(e) => setFormData({ ...formData, downloads: parseInt(e.target.value) || 0 })}
                      data-testid="input-downloads"
                    />
                  </div>

                  <div className="flex items-center space-x-2 md:col-span-2">
                    <Switch
                      id="visible"
                      checked={formData.visible}
                      onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
                      data-testid="switch-visible"
                    />
                    <Label htmlFor="visible">Visible to public</Label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={saveToolMutation.isPending} data-testid="button-save-tool">
                    {saveToolMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {editingTool ? 'Update Tool' : 'Create Tool'}
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm} data-testid="button-cancel">
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>All Tools</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : tools && tools.length > 0 ? (
              <div className="space-y-4">
                {tools.map((tool) => (
                  <div
                    key={tool.id}
                    className="flex items-start gap-4 p-4 border border-border rounded-lg"
                    data-testid={`tool-item-${tool.slug}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold">{tool.title}</h3>
                        <Badge variant="outline">v{tool.version}</Badge>
                        {!tool.visible && <Badge variant="secondary">Hidden</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 break-words">
                        {tool.short_description}
                      </p>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span>Downloads: {tool.downloads}</span>
                        <span>Slug: {tool.slug}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => startEdit(tool)}
                        data-testid={`button-edit-${tool.slug}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          if (confirm(`Delete "${tool.title}"?`)) {
                            deleteToolMutation.mutate(tool.id);
                          }
                        }}
                        data-testid={`button-delete-${tool.slug}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No tools yet. Create your first tool above!
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
