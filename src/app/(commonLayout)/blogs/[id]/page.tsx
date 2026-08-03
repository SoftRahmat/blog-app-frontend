import { ArrowLeft, Eye, MessageCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { API_URL, BlogPost, formatDate } from "@/lib/blog-api";
import { CommentForm } from "@/components/comment-form";

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
          <img
            src={post.thumbnail}
            alt=""
            className="max-h-[560px] w-full rounded-3xl object-cover"
          />
        </div>
      )}
      <div className="prose-copy mx-auto max-w-3xl whitespace-pre-wrap px-5 py-14 text-lg leading-8">
        {post.content}
      </div>
      <section className="mx-auto max-w-3xl border-t px-5 py-14">
        <h2 className="text-2xl font-bold">Join the conversation</h2>
        <CommentForm postId={post.id} />
        <div className="mt-10 space-y-6">
          {post.comments?.map((comment) => (
            <div key={comment.id} className="rounded-2xl bg-secondary/50 p-5">
              <p className="leading-7">{comment.content}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                {formatDate(comment.createdAt)}
              </p>
              {comment.replies?.map((reply) => (
                <div key={reply.id} className="ml-5 mt-4 border-l-2 pl-4">
                  <p>{reply.content}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
