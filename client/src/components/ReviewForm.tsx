import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase, containsUrl, sanitizeBadWords } from '@/lib/supabase';
import { queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Star, Loader2 } from 'lucide-react';

interface ReviewFormProps {
  toolId: string;
}

export function ReviewForm({ toolId }: ReviewFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [body, setBody] = useState('');

  const createReviewMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Must be logged in');
      if (rating === 0) throw new Error('Please select a rating');
      if (body.length < 10) throw new Error('Review must be at least 10 characters');

      // Linkless reviews: client uses regex /(https?:\/\/|www\.)/i to reject URLs. Server policies also reject them.
      if (containsUrl(body)) {
        throw new Error('Reviews cannot contain URLs or links');
      }

      const sanitizedBody = sanitizeBadWords(body);

      const { error } = await supabase.from('reviews').insert({
        tool_id: toolId,
        user_id: user.id,
        rating,
        body: sanitizedBody,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Your review has been posted',
      });
      setRating(0);
      setBody('');
      queryClient.invalidateQueries({ queryKey: ['/api/reviews', toolId] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createReviewMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-testid="form-review">
      <div>
        <label className="text-sm font-medium mb-2 block">Your Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-110"
              data-testid={`button-star-${star}`}
            >
              <Star
                className={`h-8 w-8 ${
                  star <= (hoverRating || rating)
                    ? 'fill-primary text-primary'
                    : 'text-muted-foreground'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Your Review</label>
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share your experience with this tool..."
          className="min-h-32 resize-none"
          maxLength={2000}
          data-testid="input-review-body"
        />
        <div className="text-xs text-muted-foreground mt-1">
          {body.length}/2000 characters
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={createReviewMutation.isPending || rating === 0 || body.length < 10}
        className="w-full"
        data-testid="button-submit-review"
      >
        {createReviewMutation.isPending ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Posting...
          </>
        ) : (
          'Post Review'
        )}
      </Button>
    </form>
  );
}
