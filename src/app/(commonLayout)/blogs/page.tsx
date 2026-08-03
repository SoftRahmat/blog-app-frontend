import { Search } from "lucide-react";
import Link from "next/link";
import { BlogCard } from "@/components/blog-card";
import { API_URL, PaginatedPosts } from "@/lib/blog-api";

export const metadata = { title: "Stories" };
export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const query = await searchParams;
  const page = Math.max(1, Number(query.page) || 1);
  const search = query.search?.trim() || "";
  let result: PaginatedPosts = {
    data: [],
    pagination: { total: 0, page, limit: 9, totalPages: 0 },
  };
  try {
    const params = new URLSearchParams({
      status: "PUBLISHED",
      page: String(page),
      limit: "9",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    if (search) params.set("search", search);
    const r = await fetch(`${API_URL}/posts?${params}`, { cache: "no-store" });
    if (r.ok) result = await r.json();
  } catch {}
  return (
    <div className="mx-auto max-w-7xl px-5 py-16">
      <div className="max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-[.2em] text-teal-600">
          The archive
        </p>
        <h1 className="mt-3 text-5xl font-black tracking-[-.04em]">
          Explore every story.
        </h1>
        <p className="mt-4 text-muted-foreground">
          Fresh thinking, useful lessons, and perspectives from our community.
        </p>
      </div>
      <form className="relative mt-10 max-w-xl">
        <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <input
          name="search"
          defaultValue={search}
          placeholder="Search titles, topics, and tags…"
          className="h-13 w-full rounded-full border bg-background pl-12 pr-28 outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button className="absolute right-1.5 top-1.5 rounded-full bg-foreground px-5 py-2.5 text-sm font-bold text-background">
          Search
        </button>
      </form>
      <p className="mt-10 text-sm text-muted-foreground">
        {result.pagination.total}{" "}
        {result.pagination.total === 1 ? "story" : "stories"}
        {search && ` matching “${search}”`}
      </p>
      {result.data.length ? (
        <div className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {result.data.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-3xl border border-dashed p-14 text-center">
          <h2 className="text-xl font-bold">No stories found</h2>
          <p className="mt-2 text-muted-foreground">
            Try a broader search or return to all stories.
          </p>
        </div>
      )}
      <div className="mt-12 flex justify-center gap-3">
        {page > 1 && (
          <Link
            className="rounded-full border px-5 py-2 text-sm font-semibold"
            href={`/blogs?${new URLSearchParams({ ...(search ? { search } : {}), page: String(page - 1) })}`}
          >
            Previous
          </Link>
        )}
        {page < result.pagination.totalPages && (
          <Link
            className="rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background"
            href={`/blogs?${new URLSearchParams({ ...(search ? { search } : {}), page: String(page + 1) })}`}
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
}
