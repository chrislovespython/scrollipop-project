import { ArrowLeft, MapPin, Calendar, Link as LinkIcon } from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

type Post = {
  id: string;
  body: string;
  time: string;
  likes?: number;
};

const samplePosts: Post[] = [
  {
    id: "1",
    body: "Welcome to my profile — building something neat with Tailwind + shadcn!",
    time: "2h",
    likes: 12,
  },
  {
    id: "2",
    body: "Mobile-first design FTW. Resize the window to see layout adapt.",
    time: "1d",
    likes: 34,
  },
  {
    id: "3",
    body: "Small demo feed item with responsive spacing and avatar.",
    time: "3d",
    likes: 8,
  },
];

export default function Profile() {
  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      {/* top nav (mobile-first) */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 border-b dark:border-slate-800">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            aria-label="Back"
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <div className="font-semibold">Your Name</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              1,234 posts
            </div>
          </div>
          <div>
            <Button size="sm">Following</Button>
          </div>
        </div>
      </div>

      {/* profile header */}
      <header className="max-w-2xl mx-auto">
        <div className="h-36 bg-gradient-to-r from-sky-400 to-indigo-500 relative">
          {/* cover image placeholder */}
          <img
            src="/images/cover-placeholder.jpg"
            alt="cover"
            className="object-cover w-full h-full opacity-20"
            onError={(e) => {
              // fallback styling if image not present
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </div>

        <div className="px-4 -mt-10">
          <div className="flex items-start gap-4">
            <div className="shrink-0">
              <Avatar className="h-20 w-20 ring-4 ring-white dark:ring-slate-900">
                <AvatarImage src="/images/avatar-placeholder.png" alt="avatar" />
                <AvatarFallback>YN</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h1 className="text-lg font-bold">Your Name</h1>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    @yourhandle
                  </div>
                </div>
                <div className="hidden sm:block">
                  <Button variant="outline" size="sm">
                    Edit profile
                  </Button>
                </div>
              </div>

              <p className="mt-3 text-sm">
                Short bio about yourself. Links, interests, or a fun one-liner.
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>City, Country</span>
                </div>
                <div className="flex items-center gap-1">
                  <LinkIcon className="h-4 w-4" />
                  <a
                    href="https://example.com"
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    example.com
                  </a>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined January 2024</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm">
                <div>
                  <span className="font-semibold">180</span>{" "}
                  <span className="text-slate-500 dark:text-slate-400">Following</span>
                </div>
                <div>
                  <span className="font-semibold">2,345</span>{" "}
                  <span className="text-slate-500 dark:text-slate-400">Followers</span>
                </div>
              </div>
            </div>
          </div>

          {/* small Edit button for mobile */}
          <div className="mt-3 sm:hidden">
            <Button variant="outline" size="sm" className="w-full">
              Edit profile
            </Button>
          </div>
        </div>

        <Separator className="mt-4" />
      </header>

      {/* content */}
      <section className="max-w-2xl mx-auto px-4 py-4">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="replies">Replies</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="p-0 mt-4">
            <div className="space-y-3">
              {samplePosts.map((post) => (
                <Card key={post.id} className="p-3">
                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/images/avatar-placeholder.png" alt="me" />
                      <AvatarFallback>YN</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Your Name</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            @{`yourhandle`} · {post.time}
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-sm">{post.body}</p>
                      <div className="mt-3 text-sm text-slate-500 flex items-center gap-4">
                        <div>💬 0</div>
                        <div>🔁 0</div>
                        <div>❤️ {post.likes ?? 0}</div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="replies" className="p-0 mt-4">
            <div className="space-y-3">
              <Card className="p-4">
                <div className="text-sm text-slate-500">
                  No replies yet — when you reply to posts they will show up here.
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="media" className="p-0 mt-4">
            <div className="grid grid-cols-3 gap-2">
              {/* placeholder media grid */}
              <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded" />
              <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded" />
              <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded" />
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}