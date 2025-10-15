// src/types/index.ts
import { Timestamp } from "firebase/firestore";

export interface Post {
    id: string;
    authorId: string;
    content: string;
    createdAt: Timestamp;
    likesCount: number;
    commentsCount: number;
    likedBy: string[];
    bookmarkedBy: string[];
    comments?: Comment[]; // Optional array of comments
  score?: number; // Optional score for client-side algorithm
}

export interface Comment {
    postId: string;
    authorId: string;
    content: string;
    createdAt: Timestamp;
}

// Main user profile
export type UserProfile = {
  uid: string;          // Firebase Auth UID
  username: string;     // must be unique
  displayName: string;
  email: string;
  photoURL: string;
  bio: string;
  createdAt: Timestamp;
  verified: boolean;
  posts: Post[];
};

// A document inside users/{userId}/followers
export type Follower = {
  uid: string;          // UID of the follower
  followedAt: Timestamp;
};

// A document inside users/{userId}/following
export type Following = {
  uid: string;          // UID of the user being followed
  followedAt: Timestamp;
};
