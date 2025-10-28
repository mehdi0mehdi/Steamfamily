import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { ReviewWithUser } from '@shared/schema';
import { formatDistanceToNow } from 'date-fns';

interface ReviewListProps {
  reviews: ReviewWithUser[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No reviews yet. Be the first to review this tool!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-border pb-6 last:border-b-0" data-testid={`review-${review.id}`}>
          <div className="flex items-start gap-4">
            <Avatar>
              <AvatarImage src={review.user.avatar_url || undefined} />
              <AvatarFallback>
                {(review.user.display_name || review.user.email || 'U')[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                <div>
                  <p className="font-medium" data-testid="text-reviewer-name">
                    {review.user.display_name || review.user.email}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? 'fill-primary text-primary'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm break-words whitespace-pre-wrap" data-testid="text-review-body">
                {review.body}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
