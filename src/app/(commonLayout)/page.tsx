import { ArrowRight, BookOpen, PenLine, Sparkles } from "lucide-react";
import Link from "next/link";
import { BlogCard } from "@/components/blog-card";
import { API_URL, PaginatedPosts } from "@/lib/blog-api";

async function getPosts() {
  try {
    const r = await fetch(
      `${API_URL}/posts?status=PUBLISHED&limit=7&sortBy=createdAt&sortOrder=desc`,
      { next: { revalidate: 60 } },
    );
    return r.ok ? ((await r.json()) as PaginatedPosts) : null;
  } catch {
    return null;
  }
}

export default async function Home() {
  const result = await getPosts();
  const posts = result?.data ?? [];
  const featured = posts.find((post) => post.isFeatured) ?? posts[0];
  const latest = posts.filter((post) => post.id !== featured?.id).slice(0, 6);
  return (
    <>
      <section className="relative overflow-hidden border-y bg-slate-950 text-white">
        <div className="hero-grid absolute inset-0 opacity-25" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-24 lg:grid-cols-[1.3fr_.7fr] lg:py-32">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-amber-200">
              <Sparkles className="size-4" />
              Independent ideas, clearly told
            </span>
            <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[.95] tracking-[-.055em] sm:text-7xl">
              Stories that stay with you.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
              Discover sharp perspectives on technology, creativity, culture,
              and the work of building a meaningful life.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-6 py-3 font-bold text-slate-950 transition hover:bg-amber-200"
              >
                Start reading <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 font-semibold hover:bg-white/10"
              >
                <PenLine className="size-4" />
                Write a story
              </Link>
            </div>
          </div>
          <div className="hidden self-end border-l border-white/15 pl-8 lg:block">
            <BookOpen className="size-9 text-teal-300" />
            <p className="mt-5 text-2xl font-semibold">
              “Good writing makes familiar things feel newly discovered.”
            </p>
            <p className="mt-3 text-sm text-slate-400">
              The Inkline editorial principle
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="mb-9 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.2em] text-teal-600">
              Editor’s pick
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Worth your attention
            </h2>
          </div>
          <Link
            href="/blogs"
            className="hidden items-center gap-1 text-sm font-semibold sm:flex"
          >
            View all <ArrowRight className="size-4" />
          </Link>
        </div>
        {featured ? <BlogCard post={featured} featured /> : <EmptyState />}
      </section>
      {latest.length > 0 && (
        <section className="border-t bg-secondary/35">
          <div className="mx-auto max-w-7xl px-5 py-20">
            <h2 className="mb-9 text-3xl font-bold tracking-tight">
              Latest stories
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {latest.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed p-14 text-center">
      <h3 className="text-xl font-bold">The first story is being written.</h3>
      <p className="mt-2 text-muted-foreground">
        Check back soon, or sign in to publish your own.
      </p>
    </div>
  );
}
