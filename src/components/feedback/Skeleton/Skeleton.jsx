// Skeleton components for loading states
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

/**
 * ChatMessageSkeleton - Placeholder shown while waiting for AI response to start streaming
 * Matches ChatMessage layout structure (avatar + content area)
 */
export function ChatMessageSkeleton() {
  return (
    <div className="flex gap-3">
      <Skeleton circle width={32} height={32} />
      <div className="flex-1">
        <Skeleton width={100} height={14} className="mb-2" />
        <Skeleton count={3} />
        <Skeleton width="80%" />
      </div>
    </div>
  );
}
