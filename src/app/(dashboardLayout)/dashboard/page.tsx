"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ActionDialog } from "@/components/action-dialog";
import { apiFetch, BlogPost, formatDate, PostStatus } from "@/lib/blog-api";

type FormState = {
  title: string;
  content: string;
  thumbnail: string;
  tags: string;
  status: PostStatus;
};
const emptyForm: FormState = {
  title: "",
  content: "",
  thumbnail: "",
  tags: "",
  status: "DRAFT",
};

export default function DashboardPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      setPosts(await apiFetch<BlogPost[]>("/posts/my-posts"));
      setMessage("");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to load your stories.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      thumbnail: form.thumbnail.trim() || null,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      status: form.status,
    };
    try {
      if (editingId)
        await apiFetch(`/posts/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      else
        await apiFetch("/posts", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      setForm(emptyForm);
      setEditingId(null);
      setMessage(editingId ? "Story updated." : "Story created.");
      await loadPosts();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to save your story.",
      );
    } finally {
      setSaving(false);
    }
  }

  function edit(post: BlogPost) {
    setEditingId(post.id);
    setForm({
      title: post.title,
      content: post.content,
      thumbnail: post.thumbnail || "",
      tags: post.tags.join(", "),
      status: post.status,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove() {
    if (!deleteTarget) return;
    try {
      await apiFetch(`/posts/${deleteTarget.id}`, { method: "DELETE" });
      setMessage("Story deleted.");
      await loadPosts();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to delete this story.",
      );
      throw error;
    }
  }

  const published = posts.filter((post) => post.status === "PUBLISHED").length;
  const totalViews = posts.reduce((total, post) => total + post.views, 0);

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-bold uppercase tracking-[.18em] text-teal-600">
          Writer workspace
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight">Your stories</h1>
            <p className="mt-2 text-muted-foreground">
              Draft, publish, and manage your writing.
            </p>
          </div>
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          ["Total stories", posts.length],
          ["Published", published],
          ["Total views", totalViews],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border bg-background p-5">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-black">{value}</p>
          </div>
        ))}
      </section>
      <section className="rounded-3xl border bg-background p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {editingId ? "Edit story" : "Create a story"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              You can save as a draft or publish immediately.
            </p>
          </div>
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
              className="text-sm font-semibold"
            >
              Cancel edit
            </button>
          )}
        </div>
        <form onSubmit={submit} className="mt-6 space-y-5">
          <Field label="Title">
            <input
              required
              maxLength={225}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="field"
              placeholder="A clear, compelling title"
            />
          </Field>
          <Field label="Content">
            <textarea
              required
              rows={10}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="field resize-y py-3"
              placeholder="Write your story…"
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Thumbnail URL">
              <input
                type="url"
                value={form.thumbnail}
                onChange={(e) =>
                  setForm({ ...form, thumbnail: e.target.value })
                }
                className="field"
                placeholder="https://…"
              />
            </Field>
            <Field label="Tags">
              <input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="field"
                placeholder="design, technology, life"
              />
            </Field>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as PostStatus })
                }
                className="field min-w-44"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </Field>
            <button
              disabled={saving}
              className="rounded-full bg-foreground px-6 py-3 text-sm font-bold text-background disabled:opacity-50"
            >
              {saving ? "Saving…" : editingId ? "Save changes" : "Create story"}
            </button>
          </div>
          {message && (
            <p role="status" className="rounded-xl bg-secondary p-3 text-sm">
              {message}
            </p>
          )}
        </form>
      </section>
      <section>
        <h2 className="text-2xl font-bold">All your stories</h2>
        {loading ? (
          <p className="mt-5 text-sm text-muted-foreground">Loading stories…</p>
        ) : posts.length === 0 ? (
          <div className="mt-5 rounded-3xl border border-dashed bg-background p-10 text-center">
            <p className="font-bold">You have not written anything yet.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Use the form above to create your first story.
            </p>
          </div>
        ) : (
          <div className="mt-5 overflow-hidden rounded-2xl border bg-background">
            <div className="divide-y">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${post.status === "PUBLISHED" ? "bg-emerald-500/10 text-emerald-700" : "bg-secondary"}`}
                      >
                        {post.status}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(post.updatedAt)} · {post.views} views ·{" "}
                        {post._count?.comments ?? 0} comments
                      </span>
                    </div>
                    <h3 className="mt-2 truncate text-lg font-bold">
                      {post.title}
                    </h3>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Link
                      href={`/blogs/${post.id}`}
                      className="rounded-full border px-4 py-2 text-sm font-semibold"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => edit(post)}
                      className="rounded-full border px-4 py-2 text-sm font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(post)}
                      className="rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
      <ActionDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete story?"
        description={
          deleteTarget
            ? `“${deleteTarget.title}” and its comments will be permanently deleted.`
            : "This story and its comments will be permanently deleted."
        }
        confirmLabel="Delete"
        tone="danger"
        onConfirm={remove}
      />
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block flex-1 text-sm font-semibold">
      {label}
      <span className="mt-2 block">{children}</span>
    </label>
  );
}
