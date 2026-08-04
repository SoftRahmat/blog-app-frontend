import { ArrowUpRight, Clock3, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { BlogPost, excerpt, formatDate } from "@/lib/blog-api";

export function BlogCard({
  post,
  featured = false,
}: {
  post: BlogPost;
  featured?: boolean;
}) {
  return (
    <article
      className={`group overflow-hidden rounded-3xl border bg-card transition hover:-translate-y-1 hover:shadow-xl ${featured ? "md:grid md:grid-cols-2" : ""}`}
    >
      <div
        className={`relative overflow-hidden bg-muted ${featured ? "min-h-72" : "aspect-[16/10]"}`}
      >
        {post.thumbnail ? (
          <Image
            src={post.thumbnail}
            alt=""
            fill
            unoptimized
            sizes={featured ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"}
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,#f59e0b55,transparent_36%),radial-gradient(circle_at_75%_65%,#14b8a655,transparent_40%),linear-gradient(135deg,#172554,#0f172a)]" />
        )}
        {post.isFeatured && (
          <span className="absolute left-5 top-5 rounded-full bg-amber-300 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-950">
            Featured
          </span>
        )}
      </div>
      <div className="flex flex-col p-6 md:p-8">
        <div className="mb-4 flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-secondary px-3 py-1 text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        <h2
          className={`${featured ? "text-3xl" : "text-xl"} font-bold tracking-tight`}
        >
          <Link href={`/blogs/${post.id}`}>{post.title}</Link>
        </h2>
        <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
          {excerpt(post.content, featured ? 240 : 130)}
        </p>
        <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock3 className="size-3.5" />
            {formatDate(post.createdAt)}
          </span>
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <MessageCircle className="size-3.5" />
              {post._count?.comments ?? 0}
            </span>
            <ArrowUpRight className="size-4 text-foreground" />
          </span>
        </div>
      </div>
    </article>
  );
}
