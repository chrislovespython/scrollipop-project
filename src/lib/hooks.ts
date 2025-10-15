import { useState } from 'react';
import { toast } from 'sonner';
import { 
  toggleLikePost, 
  addComment, 
  deletePost, 
  toggleBookmarkPost,
  sharePost,
} from '@/lib/firebaseActions';
import { type Comment } from './types';
import { logger } from './utils';
import { Timestamp } from 'firebase/firestore';

export const usePostActions = (postId: string, currentUserId: string) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    logger.info('[usePostActions] Handling like for post:', postId);
    setIsLoading(true);
    
    try {
      const newLikedState = await toggleLikePost(postId, currentUserId);
      setIsLiked(newLikedState);
      setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);
      
      logger.info('[usePostActions] Like updated successfully');
    } catch (error) {
      logger.error('[usePostActions] Error updating like:', error);
      toast.error("Failed to like post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleComment = async (content: string) => {
    logger.info('[usePostActions] Handling comment for post:', postId);
    setIsLoading(true);
    
    try {
      const commentData: Omit<Comment, 'id'> = {
        postId,
        authorId: currentUserId,
        content,
        createdAt: Timestamp.now(),
      };
      
      await addComment(commentData);
      setCommentsCount(prev => prev + 1);
      
      toast.info("Comment added!");
      
      logger.info('[usePostActions] Comment added successfully');
    } catch (error) {
      logger.error('[usePostActions] Error adding comment:', error);
      toast.error("Failed to add comment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    logger.info('[usePostActions] Handling delete for post:', postId);
    setIsLoading(true);
    
    try {
      await deletePost(postId);
      
      toast.info("Post deleted");
      
      logger.info('[usePostActions] Post deleted successfully');
    } catch (error) {
      logger.error('[usePostActions] Error deleting post:', error);
      toast.error("Failed to delete post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmark = async () => {
    logger.info('[usePostActions] Handling bookmark for post:', postId);
    
    try {
      const newBookmarkState = await toggleBookmarkPost(postId, currentUserId);
      setIsBookmarked(newBookmarkState);
      
      toast.info(newBookmarkState ? "Post bookmarked!" : "Bookmark removed");
      
      logger.info('[usePostActions] Bookmark updated successfully');
    } catch (error) {
      logger.error('[usePostActions] Error updating bookmark:', error);
      toast.error("Failed to update bookmark. Please try again.");
    }
  };

  const handleShare = async () => {
    logger.info('[usePostActions] Handling share for post:', postId);
    
    try {
      const url = sharePost(postId);
      await navigator.clipboard.writeText(url);
      
      toast.info("Post link copied to clipboard!");
      
      logger.info('[usePostActions] Post link copied successfully');
    } catch (error) {
      logger.error('[usePostActions] Error sharing post:', error);
      toast.error("Failed to copy link. Please try again.");
    }
  };

  return {
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
  };
};