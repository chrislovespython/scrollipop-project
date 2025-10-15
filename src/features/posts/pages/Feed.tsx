// src/features/posts/pages/Feed.tsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../../../components/ui/carousel";
import { useInfinitePosts } from "../hooks/useInfinitePost";
import PostCard from "../components/PostCard";
import { useEffect, useState } from "react";
import { type UserProfile } from "@/lib/types";
import { getCurrentUser } from "@/lib/firebaseActions";

const Feed = () => {
  const { posts, loading, hasMore, loadMore } = useInfinitePosts();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    console.log("Feed component mounted. Initial posts loading:", loading);
    (async () => {
      try {
        const loggedUser = await getCurrentUser();
        setUser(loggedUser);
      } catch {
        // keep silent; logger inside getCurrentUser will handle details
        setUser(null);
      }
    })();
    // run once on mount
  }, [loading]);

  if (loading && posts.length === 0) {
    return <div className="flex items-center justify-center h-screen">Loading posts...</div>;
  }

  return (
    <div className="h-screen w-full flex justify-center items-center bg-black">
      <div className="w-full max-w-md h-full">
        <Carousel
          opts={{
            align: "start",
          }}
          orientation="vertical"
          className="w-full h-full"
        >
          <CarouselContent className="-mt-1 h-full">
            {posts.map((post) => (
              <CarouselItem key={post.id} className="pt-1 md:basis-full h-full">
                <PostCard currentUserId={user?.uid ?? ""} post={post} />
              </CarouselItem>
            ))}
            {/* Infinite scroll trigger */}
            {hasMore && (
              <CarouselItem className="pt-1 md:basis-full h-full">
                 <div ref={loadMore} className="flex justify-center items-center h-full text-white">
                    Loading more...
                 </div>
              </CarouselItem>
            )}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default Feed;