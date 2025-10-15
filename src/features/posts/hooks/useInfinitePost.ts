// src/features/posts/hooks/useInfinitePosts.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { db } from '../../../lib/firebase';
import { collection, query, orderBy, limit, getDocs, startAfter, type DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { type Post } from '../../../lib/types';

// --- The Client-Side Algorithm ---
const calculateScore = (post: Post): number => {
    const now = new Date().getTime();
    const postTime = post.createdAt.toDate().getTime();
    const ageInHours = (now - postTime) / (1000 * 60 * 60);

    // Weights for different factors
    const likesWeight = 1.5;
    const commentsWeight = 2.0;
    const ageWeight = 1.0; // Penalize older posts

    const score = (post.likesCount * likesWeight) + (post.commentsCount * commentsWeight) - (ageInHours * ageWeight);
    console.log(`Scoring post ${post.id}: Score=${score.toFixed(2)} (Likes: ${post.likesCount}, Comments: ${post.commentsCount}, Age: ${ageInHours.toFixed(1)}h)`);
    return score;
};


export const useInfinitePosts = (batchSize = 5) => {    
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const observer = useRef<IntersectionObserver | null>(null);

    const fetchPosts = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        console.log("Fetching next batch of posts...");

        try {
            let q;
            const postsCollection = collection(db, 'posts');
            
            if (lastDoc) {
                q = query(postsCollection, orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(batchSize));
            } else {
                q = query(postsCollection, orderBy('createdAt', 'desc'), limit(batchSize));
            }
            
            const documentSnapshots = await getDocs(q);
            
            if (documentSnapshots.empty) {
                setHasMore(false);
                console.log("No more posts to load.");
                return;
            }

            const newPosts = documentSnapshots.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            } as Post));
            
            // --- Apply Algorithm: Score and Sort ---
            const scoredPosts = newPosts.map(post => ({ ...post, score: calculateScore(post) }));
            scoredPosts.sort((a, b) => b.score - a.score);

            setLastDoc(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
            setPosts(prevPosts => [...prevPosts, ...scoredPosts]);
            
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore, lastDoc, batchSize]);
    
    // Initial fetch
    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    // Infinite scroll observer
    const loadMore = useCallback((node: HTMLElement | null) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                fetchPosts();
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore, fetchPosts]);

    return { posts, loading, hasMore, loadMore };
};