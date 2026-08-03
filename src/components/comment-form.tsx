"use client";
import { FormEvent, useState } from "react";
import { apiFetch } from "@/lib/blog-api";

export function CommentForm({ postId }: { postId: string }) {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const content = new FormData(form).get("content")?.toString().trim();
    if (!content) return;
    setPending(true);
    try {
      await apiFetch("/comments", {
        method: "POST",
        body: JSON.stringify({ postId, content }),
      });
      form.reset();
      setMessage("Comment posted. Refresh to see it.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to post comment.",
      );
    } finally {
      setPending(false);
    }
  }
  return (
    <form onSubmit={submit} className="mt-6">
      <textarea
        name="content"
        required
        rows={4}
        placeholder="Share a thoughtful response…"
        className="w-full resize-none rounded-2xl border bg-background p-4 outline-none focus:ring-2 focus:ring-teal-500"
      />
      <div className="mt-3 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {message || "Sign in to leave a comment."}
        </p>
        <button
          disabled={pending}
          className="rounded-full bg-foreground px-5 py-2.5 text-sm font-bold text-background disabled:opacity-50"
        >
          {pending ? "Posting…" : "Post comment"}
        </button>
      </div>
    </form>
  );
}
