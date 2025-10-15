// src/features/posts/components/CommentsDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { useEffect, useState } from "react";
import { useAuth } from "../../../app/providers/useAuth";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { toast } from "sonner";
import { type Comment } from "../../../lib/types";

interface CommentsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    // optional callback for parent to handle submission instead of the built-in Firebase logic
    onSubmit?: (content: string) => Promise<void> | void;
    postId: string;
}

// Extend local comment type for UI fields we store/display
type UIComment = Comment & {
    id: string;
    authorUsername?: string;
    authorPhotoURL?: string;
};

const CommentsDialog = ({ open, onOpenChange, postId, onSubmit }: CommentsDialogProps) => {
    const { user } = useAuth();
    const [comments, setComments] = useState<UIComment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) return;
        const q = query(collection(db, "posts", postId, "comments"), orderBy("createdAt", "asc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const commentsData = querySnapshot.docs.map(d => {
                const data = d.data() as Comment;
                return { id: d.id, ...data } as UIComment;
            });
            setComments(commentsData);
            console.log(`Fetched ${commentsData.length} comments for post ${postId}`);
        }, (error) => {
            console.error("Error fetching comments:", error);
            toast.error("Could not load comments.");
        });
        return () => unsubscribe();
    }, [open, postId]);

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;
        setLoading(true);

        try {
            // If parent provided an onSubmit handler, delegate submission to it.
            if (onSubmit) {
                await onSubmit(newComment);
            } else {
                const commentsCollectionRef = collection(db, "posts", postId, "comments");

                const newCommentDoc = {
                    postId,
                    authorId: user.uid,
                    authorUsername: user.displayName || 'Anonymous',
                    authorPhotoURL: user.photoURL || '',
                    content: newComment,
                    createdAt: serverTimestamp(),
                };

                // Add the comment
                await addDoc(commentsCollectionRef, newCommentDoc);

                // Increment commentsCount atomically
                const postRef = doc(db, "posts", postId);
                await updateDoc(postRef, { commentsCount: increment(1) });

                console.log("Comment added successfully.");
            }

            setNewComment("");
        } catch (error) {
            console.error("Error adding comment:", error);
            toast.error("Failed to post comment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-neutral-900 border-neutral-800 text-white">
                <DialogHeader>
                    <DialogTitle>Comments</DialogTitle>
                    <DialogDescription>Join the conversation.</DialogDescription>
                </DialogHeader>
                <div className="max-h-80 overflow-y-auto space-y-4 my-4 pr-2">
                    {comments.map(comment => (
                        <div key={comment.id} className="text-sm">
                            <span className="font-bold mr-2">{comment.authorUsername}</span>
                            <span>{comment.content}</span>
                        </div>
                    ))}
                     {comments.length === 0 && <p className="text-neutral-400">No comments yet.</p>}
                </div>
                <form onSubmit={handleAddComment} className="flex gap-2">
                    <Input 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="bg-neutral-800 border-neutral-700"
                    />
                    <Button type="submit" disabled={loading}>Post</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CommentsDialog;