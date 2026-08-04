import { Search } from "lucide-react";
import Link from "next/link";
import { BlogCard } from "@/components/blog-card";
import { API_URL, PaginatedPosts } from "@/lib/blog-api";

export const metadata = { title: "Stories" };
type Query = {
  search?: string;
  page?: string;
  tags?: string;
  featured?: string;
  sort?: string;
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<Query>;
}) {
  const query = await searchParams;
  const page = Math.max(1, Number(query.page) || 1);
  const search = query.search?.trim() || "";
  const tags = query.tags?.trim() || "";
  const featured = query.featured || "all";
  const sort = query.sort || "newest";
  const sortMap: Record<string, [string, string]> = {
    newest: ["createdAt", "desc"],
    oldest: ["createdAt", "asc"],
    popular: ["views", "desc"],
    title: ["title", "asc"],
  };
  const [sortBy, sortOrder] = sortMap[sort] || sortMap.newest;
  let result: PaginatedPosts = {
    data: [],
    pagination: { total: 0, page, limit: 9, totalPages: 0 },
  };
  let failed = false;
  try {
    const params = new URLSearchParams({
      status: "PUBLISHED",
      page: String(page),
      limit: "9",
      sortBy,
      sortOrder,
    });
    if (search) params.set("search", search);
    if (tags) params.set("tags", tags);
    if (featured !== "all") params.set("isFeatured", featured);
    const response = await fetch(`${API_URL}/posts?${params}`, {
      cache: "no-store",
    });
    if (!response.ok) failed = true;
    else result = await response.json();
  } catch {
    failed = true;
  }

  const preserved = {
    ...(search ? { search } : {}),
    ...(tags ? { tags } : {}),
    ...(featured !== "all" ? { featured } : {}),
    ...(sort !== "newest" ? { sort } : {}),
  };
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
      <form className="mt-10 grid gap-3 rounded-2xl border bg-secondary/30 p-4 md:grid-cols-[2fr_1fr_1fr_1fr_auto]">
        <label className="relative">
          <span className="sr-only">Search</span>
          <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <input
            name="search"
            defaultValue={search}
            placeholder="Search stories…"
            className="field pl-12"
          />
        </label>
        <label>
          <span className="sr-only">Tags</span>
          <input
            name="tags"
            defaultValue={tags}
            placeholder="Tags: design, tech"
            className="field"
          />
        </label>
        <label>
          <span className="sr-only">Featured</span>
          <select name="featured" defaultValue={featured} className="field">
            <option value="all">All stories</option>
            <option value="true">Featured only</option>
            <option value="false">Not featured</option>
          </select>
        </label>
        <label>
          <span className="sr-only">Sort</span>
          <select name="sort" defaultValue={sort} className="field">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="popular">Most viewed</option>
            <option value="title">Title A–Z</option>
          </select>
        </label>
        <button className="rounded-xl bg-foreground px-5 py-3 text-sm font-bold text-background">
          Apply
        </button>
      </form>
      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {result.pagination.total}{" "}
          {result.pagination.total === 1 ? "story" : "stories"}
          {search && ` matching “${search}”`}
        </p>
        {(search || tags || featured !== "all" || sort !== "newest") && (
          <Link href="/blogs" className="text-sm font-bold">
            Clear filters
          </Link>
        )}
      </div>
      {failed ? (
        <div className="mt-8 rounded-3xl border border-red-200 bg-red-500/5 p-10 text-center">
          <h2 className="font-bold">Stories are temporarily unavailable</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Please try again in a moment.
          </p>
        </div>
      ) : result.data.length ? (
        <div className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {result.data.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-3xl border border-dashed p-14 text-center">
          <h2 className="text-xl font-bold">No stories found</h2>
          <p className="mt-2 text-muted-foreground">
            Try removing a filter or using a broader search.
          </p>
        </div>
      )}
      {result.pagination.totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="mt-12 flex flex-wrap justify-center gap-2"
        >
          {page > 1 && (
            <PageLink page={page - 1} query={preserved}>
              Previous
            </PageLink>
          )}
          {Array.from(
            { length: result.pagination.totalPages },
            (_, index) => index + 1,
          )
            .filter(
              (number) =>
                number === 1 ||
                number === result.pagination.totalPages ||
                Math.abs(number - page) <= 1,
            )
            .map((number, index, visible) => (
              <span key={number} className="contents">
                {index > 0 && number - visible[index - 1] > 1 && (
                  <span className="px-2 py-2">…</span>
                )}
                <PageLink
                  page={number}
                  query={preserved}
                  active={number === page}
                >
                  {number}
                </PageLink>
              </span>
            ))}
          {page < result.pagination.totalPages && (
            <PageLink page={page + 1} query={preserved}>
              Next
            </PageLink>
          )}
        </nav>
      )}
    </div>
  );
}

function PageLink({
  page,
  query,
  active,
  children,
}: {
  page: number;
  query: Record<string, string>;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={`rounded-full px-4 py-2 text-sm font-semibold ${active ? "bg-foreground text-background" : "border bg-background"}`}
      href={`/blogs?${new URLSearchParams({ ...query, page: String(page) })}`}
    >
      {children}
    </Link>
  );
}
