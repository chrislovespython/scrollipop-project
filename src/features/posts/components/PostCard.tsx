import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreVertical, Trash2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import PostComposer from './PostComposer';
import { usePostActions } from '../../../lib/hooks';
import { logger } from '../../../lib/utils';
import { type Post, type UserProfile } from '@/lib/types';
import { getUserById } from '@/lib/firebaseActions';
import { formatTime } from '../../../lib/utils';

interface PostCardProps {
  post: Post;
  currentUserId: string;
  showScrollHint?: boolean;
  onPostDeleted?: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUserId,
  showScrollHint = false,
  onPostDeleted,
}) => {
  logger.info('[PostCard] Rendering post:', post?.id);

  // local helper: format a Firestore Timestamp or Date-ish value to a short relative/time string

  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // new author state
  const [author, setAuthor] = useState<UserProfile | null>(null);

  const {
    isLiked,
    isBookmarked,
    likesCount,
    commentsCount,
    isLoading,
    setIsLiked,
    setIsBookmarked,
    setLikesCount,
    setCommentsCount,
    handleLike,
    handleComment,
    handleDelete,
    handleBookmark,
    handleShare,
  } = usePostActions(post.id, currentUserId);

  // fetch author profile when post changes
  useEffect(() => {
    let mounted = true;
    if (!post?.authorId) return;
    (async () => {
      try {
        const user = await getUserById(post.authorId);
        if (mounted) setAuthor(user);
      } catch (err) {
        logger.error('[PostCard] Error fetching author', err);
      }
    })();
    return () => { mounted = false; };
  }, [post?.authorId]);

  // Initialize state from post data
  useEffect(() => {
    setIsLiked(!!post.likedBy?.includes(currentUserId));
    //setIsBookmarked(!!post.bookmarkedBy?.includes(currentUserId));
    setLikesCount(post?.likedBy?.length ?? post?.likesCount ?? 0);
    setCommentsCount(post?.commentsCount ?? post?.comments ?? 0);
  }, [post, currentUserId, setIsLiked, setIsBookmarked, setLikesCount, setCommentsCount]);

  const isOwnPost = post.authorId === currentUserId;

  const handleCommentSubmit = async (content: string) => {
    logger.info('[PostCard] Submitting comment');
    await handleComment(content);
  };

  const confirmDelete = async () => {
    logger.info('[PostCard] Confirming delete');
    await handleDelete();
    setShowDeleteDialog(false);
    onPostDeleted?.(post.id);
  };

  // safe fallback for avatar (initials or '?')
  const displayName = author?.displayName ?? author?.username ?? post?.authorId ?? '';
  const avatarFallback = displayName
    ? displayName.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <>
      <Card className="w-full flex items-center justify-center bg-black border-none">
        <CardContent className="max-w-2xl w-full p-8 relative">
          <CardHeader className="p-0 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  {/* use avatar from fetched user; avoid using post.avatar */}
                  <AvatarImage src={author?.photoURL ?? undefined} alt={`${displayName} avatar`} />
                  <AvatarFallback className="text-2xl">{avatarFallback}</AvatarFallback>
                </Avatar>
                
                <div>
                  <p className="text-white font-bold text-lg">@{author?.username ?? post?.authorId ?? 'unknown'}</p>
                  <p className="text-gray-500 text-sm">{formatTime(post?.createdAt)}</p>
                </div>
              </div>

              {isOwnPost && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="icon"
                      className="text-gray-400 hover:text-white hover:bg-gray-800"
                      aria-label="Open post actions"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-900 border-gray-800">
                    <DropdownMenuItem
                      onClick={() => setShowDeleteDialog(true)}
                      className="text-red-500 focus:text-red-500 focus:bg-gray-800 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Post
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </CardHeader>

          <div className="mb-8">
            <p className="text-white text-3xl leading-relaxed">{post?.content}</p>
          </div>

          <CardFooter className="p-0">
            <div className="flex items-center gap-6 w-full">
              {/* Like Button */}
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={handleLike}
                disabled={isLoading}
                className={`flex items-center gap-2 hover:bg-transparent ${
                  isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                }`}
                aria-pressed={isLiked}
                aria-label={isLiked ? 'Unlike' : 'Like'}
              >
                <Heart className={`w-8 h-8 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-xl">{likesCount}</span>
              </Button>

              {/* Comment Button */}
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={() => setShowCommentDialog(true)}
                className="flex items-center gap-2 text-gray-400 hover:text-blue-500 hover:bg-transparent"
                aria-label="Open comments"
              >
                <MessageCircle className="w-8 h-8" />
                <span className="text-xl">{commentsCount}</span>
              </Button>

              {/* Share Button */}
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={handleShare}
                className="flex items-center gap-2 text-gray-400 hover:text-green-500 hover:bg-transparent"
                aria-label="Share post"
              >
                <Share2 className="w-8 h-8" />
              </Button>

              {/* Bookmark Button */}
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={handleBookmark}
                className={`flex items-center gap-2 ml-auto hover:bg-transparent ${
                  isBookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                }`}
                aria-pressed={isBookmarked}
                aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
              >
                <Bookmark className={`w-8 h-8 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </CardFooter>

          {showScrollHint && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-600 animate-bounce">
              <p className="text-sm">↓ Swipe or scroll</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comment Dialog */}
      <PostComposer
        open={showCommentDialog}
        postId={post.id}
        onOpenChange={setShowCommentDialog}
        onSubmit={handleCommentSubmit}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-gray-900 border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Post?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently delete your post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-gray-700 text-white hover:bg-gray-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PostCard;