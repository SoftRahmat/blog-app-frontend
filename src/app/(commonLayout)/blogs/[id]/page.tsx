import { ArrowLeft, Eye, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { API_URL, BlogPost, formatDate } from "@/lib/blog-api";
import { CommentsSection } from "@/components/comments-section";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let post: BlogPost | null = null;
  try {
    const r = await fetch(`${API_URL}/posts/${id}`, { cache: "no-store" });
    if (r.ok) post = await r.json();
  } catch {}
  if (!post) notFound();
  return (
    <article>
      <header className="border-y bg-secondary/35">
        <div className="mx-auto max-w-4xl px-5 py-16">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            All stories
          </Link>
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-background px-3 py-1 text-xs font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="mt-6 text-4xl font-black leading-tight tracking-[-.04em] sm:text-6xl">
            {post.title}
          </h1>
          <div className="mt-7 flex flex-wrap gap-5 text-sm text-muted-foreground">
            <span>{formatDate(post.createdAt)}</span>
            <span className="flex items-center gap-1.5">
              <Eye className="size-4" />
              {post.views} views
            </span>
            <span className="flex items-center gap-1.5">
              <MessageCircle className="size-4" />
              {post._count?.comments ?? post.comments?.length ?? 0} comments
            </span>
          </div>
        </div>
      </header>
      {post.thumbnail && (
        <div className="mx-auto mt-10 max-w-5xl px-5">
          <Image
            src={post.thumbnail}
            alt=""
            width={1280}
            height={720}
            unoptimized
            className="max-h-140 w-full rounded-3xl object-cover"
          />
        </div>
      )}
      <div className="prose-copy mx-auto max-w-3xl whitespace-pre-wrap px-5 py-14 text-lg leading-8">
        {post.content}
      </div>
      <CommentsSection postId={post.id} comments={post.comments ?? []} />
    </article>
  );
}
