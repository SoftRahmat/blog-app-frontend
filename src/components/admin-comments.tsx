"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, Comment, formatDate } from "@/lib/blog-api";

export function AdminComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [filter, setFilter] = useState<"ALL" | "APPROVED" | "REJECT">("ALL");
  const [message, setMessage] = useState("");
  const load = useCallback(async () => {
    try {
      setComments(
        await apiFetch<Comment[]>(
          `/comments${filter === "ALL" ? "" : `?status=${filter}`}`,
        ),
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to load comments.",
      );
    }
  }, [filter]);
  useEffect(() => {
    let cancelled = false;
    apiFetch<Comment[]>(
      `/comments${filter === "ALL" ? "" : `?status=${filter}`}`,
    )
      .then((data) => {
        if (!cancelled) setComments(data);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setMessage(
            error instanceof Error ? error.message : "Unable to load comments.",
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [filter]);
  async function moderate(comment: Comment, status: "APPROVED" | "REJECT") {
    try {
      await apiFetch(`/comments/${comment.id}/moderate`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setMessage(`Comment ${status === "APPROVED" ? "approved" : "rejected"}.`);
      await load();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to moderate comment.",
      );
    }
  }
  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Comment moderation</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Review community responses across every story.
          </p>
        </div>
        <div className="flex rounded-full border bg-background p-1">
          {(["ALL", "APPROVED", "REJECT"] as const).map((value) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold ${filter === value ? "bg-foreground text-background" : ""}`}
            >
              {value === "REJECT"
                ? "Rejected"
                : value[0] + value.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>
      {message && (
        <p role="status" className="mt-4 text-sm text-muted-foreground">
          {message}
        </p>
      )}
      <div className="mt-5 divide-y overflow-hidden rounded-2xl border bg-background">
        {comments.map((comment) => (
          <article key={comment.id} className="p-5">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span
                className={`rounded-full px-2.5 py-1 font-bold ${comment.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-700" : "bg-red-500/10 text-red-700"}`}
              >
                {comment.status}
              </span>
              <span className="text-muted-foreground">
                {formatDate(comment.createdAt)}
              </span>
              {comment.post && (
                <Link
                  href={`/blogs/${comment.post.id}`}
                  className="font-semibold"
                >
                  {comment.post.title}
                </Link>
              )}
            </div>
            <p className="mt-3 leading-7">{comment.content}</p>
            <div className="mt-4 flex gap-2">
              {comment.status !== "APPROVED" && (
                <button
                  onClick={() => moderate(comment, "APPROVED")}
                  className="rounded-full border px-4 py-2 text-xs font-bold"
                >
                  Approve
                </button>
              )}
              {comment.status !== "REJECT" && (
                <button
                  onClick={() => moderate(comment, "REJECT")}
                  className="rounded-full border border-red-300 px-4 py-2 text-xs font-bold text-red-600"
                >
                  Reject
                </button>
              )}
            </div>
          </article>
        ))}
        {comments.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">
            No comments in this view.
          </p>
        )}
      </div>
    </section>
  );
}
