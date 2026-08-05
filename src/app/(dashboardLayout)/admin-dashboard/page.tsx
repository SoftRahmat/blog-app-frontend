"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  apiFetch,
  BlogPost,
  formatDate,
  PaginatedPosts,
  PostStatus,
} from "@/lib/blog-api";
import { AdminComments } from "@/components/admin-comments";
import { AdminUsers } from "@/components/admin-users";
import { ActionDialog } from "@/components/action-dialog";

interface Stats {
  totalPosts: number;
  publlishedPosts: number;
  draftPosts: number;
  archivedPosts: number;
  totalComments: number;
  approvedComment: number;
  totalUsers: number;
  adminCount: number;
  userCount: number;
  totalViews: number | null;
}

export default function AdminDashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as { id?: string; role?: string } | undefined;
  const [stats, setStats] = useState<Stats | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, postData] = await Promise.all([
        apiFetch<Stats>("/posts/stats"),
        apiFetch<PaginatedPosts>(
          "/posts?limit=100&sortBy=createdAt&sortOrder=desc",
        ),
      ]);
      setStats(statsData);
      setPosts(postData.data);
      setMessage("");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to load admin data.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === "ADMIN") void load();
    else if (!isPending) setLoading(false);
  }, [isPending, load, user?.role]);

  async function update(post: BlogPost, payload: Partial<BlogPost>) {
    try {
      await apiFetch(`/posts/${post.id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      setMessage("Post updated.");
      await load();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to update post.",
      );
    }
  }
  async function remove() {
    if (!deleteTarget) return;
    try {
      await apiFetch(`/posts/${deleteTarget.id}`, { method: "DELETE" });
      setMessage("Post deleted.");
      await load();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to delete post.",
      );
      throw error;
    }
  }

  if (isPending)
    return (
      <p className="text-sm text-muted-foreground">Checking permissions…</p>
    );
  if (user?.role !== "ADMIN")
    return (
      <div className="rounded-3xl border bg-background p-10 text-center">
        <h1 className="text-2xl font-black">Administrator access required</h1>
        <p className="mt-2 text-muted-foreground">
          Your account does not have permission to view this page.
        </p>
        <Link
          href="/dashboard"
          className="mt-5 inline-block rounded-full bg-foreground px-5 py-2.5 text-sm font-bold text-background"
        >
          Return to dashboard
        </Link>
      </div>
    );

  const cards = stats
    ? [
        ["Total posts", stats.totalPosts],
        ["Published", stats.publlishedPosts],
        ["Drafts", stats.draftPosts],
        ["Archived", stats.archivedPosts],
        ["Total views", stats.totalViews ?? 0],
        ["Comments", stats.totalComments],
        ["Users", stats.totalUsers],
        ["Admins", stats.adminCount],
      ]
    : [];

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-bold uppercase tracking-[.18em] text-amber-600">
          Administration
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">
          Platform overview
        </h1>
        <p className="mt-2 text-muted-foreground">
          Monitor activity and manage every published or drafted story.
        </p>
      </section>
      {message && (
        <p
          role="status"
          className="rounded-xl bg-background p-4 text-sm shadow-sm"
        >
          {message}
        </p>
      )}
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading platform data…</p>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map(([label, value]) => (
              <div key={label} className="rounded-2xl border bg-background p-5">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-2 text-3xl font-black">{value}</p>
              </div>
            ))}
          </section>
          <section>
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold">All posts</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Feature, change status, inspect, or remove any post.
                </p>
              </div>
            </div>
            <div className="mt-5 overflow-hidden rounded-2xl border bg-background">
              <div className="divide-y">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="grid gap-4 p-5 xl:grid-cols-[1fr_auto_auto_auto] xl:items-center"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-bold">
                          {post.status}
                        </span>
                        {post.isFeatured && (
                          <span className="rounded-full bg-amber-300 px-2.5 py-1 text-xs font-bold text-slate-950">
                            Featured
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatDate(post.createdAt)} · {post.views} views
                        </span>
                      </div>
                      <h3 className="mt-2 truncate font-bold">{post.title}</h3>
                    </div>
                    <select
                      aria-label={`Status for ${post.title}`}
                      value={post.status}
                      onChange={(event) =>
                        update(post, {
                          status: event.target.value as PostStatus,
                        })
                      }
                      className="field min-w-36 text-sm"
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                    <button
                      onClick={() =>
                        update(post, { isFeatured: !post.isFeatured })
                      }
                      className="rounded-full border px-4 py-2 text-sm font-semibold"
                    >
                      {post.isFeatured ? "Unfeature" : "Feature"}
                    </button>
                    <div className="flex gap-2">
                      <Link
                        href={`/blogs/${post.id}`}
                        className="rounded-full border px-4 py-2 text-sm font-semibold"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(post)}
                        className="rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
                {posts.length === 0 && (
                  <p className="p-8 text-center text-sm text-muted-foreground">
                    No posts yet.
                  </p>
                )}
              </div>
            </div>
          </section>
        </>
      )}
      <AdminUsers currentUserId={user.id} />
      <AdminComments />
      <ActionDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete post?"
        description={
          deleteTarget
            ? `“${deleteTarget.title}” will be permanently deleted.`
            : "This post will be permanently deleted."
        }
        confirmLabel="Delete"
        tone="danger"
        onConfirm={remove}
      />
    </div>
  );
}
