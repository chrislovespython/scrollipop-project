import { 
  doc, 
  updateDoc, 
  deleteDoc, 
  increment, 
  collection, 
  addDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { logger } from './utils';
import type { Comment, Post, UserProfile } from './types';
import { auth } from './firebase';
import { setDoc, Timestamp } from "firebase/firestore"

// Like/Unlike a post
export const toggleLikePost = async (postId: string, userId: string): Promise<boolean> => {
  logger.info('[firebaseActions] Toggling like for post:', postId);
  
  try {
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);
    
    if (!postSnap.exists()) {
      throw new Error('Post not found');
    }
    
    const likedBy = postSnap.data().likedBy || [];
    const isLiked = likedBy.includes(userId);
    
    await updateDoc(postRef, {
      likes: increment(isLiked ? -1 : 1),
      likedBy: isLiked ? arrayRemove(userId) : arrayUnion(userId)
    });
    
    logger.info('[firebaseActions] Like toggled successfully:', !isLiked);
    return !isLiked;
  } catch (error) {
    logger.error('[firebaseActions] Error toggling like:', error);
    throw error;
  }
};

// Add a comment
export const addComment = async (commentData: Omit<Comment, 'id'>): Promise<string> => {
  logger.info('[firebaseActions] Adding comment to post:', commentData);
  
  try {
    const commentRef = await addDoc(collection(db, 'comments'), {
      ...commentData,
      timestamp: serverTimestamp()
    });
    
    // Increment comment count on post
    const postRef = doc(db, 'posts', commentData.postId);
    await updateDoc(postRef, {
      comments: increment(1)
    });
    
    logger.info('[firebaseActions] Comment added successfully:', commentRef.id);
    return commentRef.id;
  } catch (error) {
    logger.error('[firebaseActions] Error adding comment:', error);
    throw error;
  }
};

// Delete a post
export const deletePost = async (postId: string): Promise<void> => {
  logger.info('[firebaseActions] Deleting post:', postId);
  
  try {
    await deleteDoc(doc(db, 'posts', postId));
    logger.info('[firebaseActions] Post deleted successfully');
  } catch (error) {
    logger.error('[firebaseActions] Error deleting post:', error);
    throw error;
  }
};

// Bookmark a post
export const toggleBookmarkPost = async (postId: string, userId: string): Promise<boolean> => {
  logger.info('[firebaseActions] Toggling bookmark for post:', postId);
  
  try {
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);
    
    if (!postSnap.exists()) {
      throw new Error('Post not found');
    }
    
    const bookmarkedBy = postSnap.data().bookmarkedBy || [];
    const isBookmarked = bookmarkedBy.includes(userId);
    
    await updateDoc(postRef, {
      bookmarkedBy: isBookmarked ? arrayRemove(userId) : arrayUnion(userId)
    });
    
    logger.info('[firebaseActions] Bookmark toggled successfully:', !isBookmarked);
    return !isBookmarked;
  } catch (error) {
    logger.error('[firebaseActions] Error toggling bookmark:', error);
    throw error;
  }
};

// Share post (copy link)
export const sharePost = (postId: string): string => {
  const url = `${window.location.origin}/post/${postId}`;
  logger.info('[firebaseActions] Sharing post URL:', url);
  return url;
};

// Fetch a single post by id and map to Post type
export const getPostById = async (postId: string): Promise<Post | null> => {
  logger.info('[firebaseActions] Fetching post:', postId);
  try {
    const postRef = doc(db, 'posts', postId);
    const snap = await getDoc(postRef);
    if (!snap.exists()) return null;
    const data = snap.data();

    const post: Post = {
      id: snap.id,
      authorId: data.authorId ?? data.uid ?? '',
      content: data.content ?? '',
      createdAt: data.createdAt ?? data.timestamp ?? null,
      likesCount: data.likes ?? data.likesCount ?? 0,
      commentsCount: data.comments ?? data.commentsCount ?? 0,
      likedBy: data.likedBy ?? [],
      bookmarkedBy: data.bookmarkedBy ?? [],
      comments: data.commentsList ?? undefined,
      score: data.score
    };

    return post;
  } catch (error) {
    logger.error('[firebaseActions] Error fetching post:', error);
    throw error;
  }
};

// Fetch user profile by id
export const getUserById = async (userId: string): Promise<UserProfile | null> => {
  logger.info('[firebaseActions] Fetching user:', userId);
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return null;
    const data = snap.data();

    const user: UserProfile = {
      uid: snap.id,
      username: data.username ?? '',
      displayName: data.displayName ?? data.name ?? '',
      email: data.email ?? '',
      photoURL: data.photoURL ?? data.avatar ?? '',
      bio: data.bio ?? '',
      createdAt: data.createdAt ?? null,
      verified: data.verified ?? false,
      posts: data.posts ?? []
    };

    return user;
  } catch (error) {
    logger.error('[firebaseActions] Error fetching user:', error);
    throw error;
  }
};

// Get currently authenticated user (tries Firestore profile first, falls back to auth user)
export const getCurrentUser = async (): Promise<UserProfile | null> => {
  logger.info('[firebaseActions] Getting current authenticated user');
  try {
    const current = auth.currentUser;
    if (!current) return null;

    // Prefer the Firestore user profile if available
    const profile = await getUserById(current.uid);
    if (profile) return profile;

    // Fallback: map Auth user to UserProfile


    return profile;
  } catch (error) {
    logger.error('[firebaseActions] Error getting current user:', error);
    throw error;
  }
};

export const createOrUpdateUserDoc = async (user: UserProfile) => {
    if (!user?.uid) return
    const uid: string = user.uid
    const displayName: string = user.displayName ?? ""
    const email: string = user.email ?? ""
    const photoURL: string = user.photoURL ?? ""
    // simple username fallback (displayName without spaces OR email local-part) + short uid suffix
    const baseName = displayName ? displayName.replace(/\s+/g, "").toLowerCase() : email.split("@")[0] ?? "user"
    const username = `${baseName}-${uid.slice(0, 6)}`

    const userDoc: UserProfile = {
      uid,
      username,
      displayName,
      email,
      photoURL,
      bio: "",
      createdAt: serverTimestamp() as Timestamp,
      verified: false,
      posts: [],
    }

    // create or merge user doc
    await setDoc(doc(db, "users", uid), userDoc, { merge: true })
  }

