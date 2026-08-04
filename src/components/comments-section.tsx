"use client";

import { FormEvent, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { apiFetch, Comment, formatDate } from "@/lib/blog-api";

const subscribeToHydration = () => () => {};

export function CommentsSection({
  postId,
  comments,
}: {
  postId: string;
  comments: Comment[];
}) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const authenticated = hydrated && Boolean(session);
  const userId = hydrated ? session?.user.id : undefined;
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  async function create(event: FormEvent<HTMLFormElement>, parentId?: string) {
    event.preventDefault();
    const form = event.currentTarget;
    const content = String(new FormData(form).get("content") || "").trim();
    if (!content) return;
    setPending(true);
    try {
      await apiFetch("/comments", {
        method: "POST",
        body: JSON.stringify({
          postId,
          content,
          ...(parentId ? { parentId } : {}),
        }),
      });
      form.reset();
      setReplyingTo(null);
      setMessage("Comment posted.");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to post comment.",
      );
    } finally {
      setPending(false);
    }
  }
  async function edit(comment: Comment) {
    const content = window
      .prompt("Update your comment", comment.content)
      ?.trim();
    if (!content || content === comment.content) return;
    try {
      await apiFetch(`/comments/${comment.id}`, {
        method: "PATCH",
        body: JSON.stringify({ content }),
      });
      setMessage("Comment updated.");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to update comment.",
      );
    }
  }
  async function remove(comment: Comment) {
    if (!window.confirm("Delete this comment and its replies?")) return;
    try {
      await apiFetch(`/comments/${comment.id}`, { method: "DELETE" });
      setMessage("Comment deleted.");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to delete comment.",
      );
    }
  }

  function CommentItem({
    comment,
    depth = 0,
  }: {
    comment: Comment;
    depth?: number;
  }) {
    const owned = userId === comment.authorId;
    return (
      <div
        className={
          depth
            ? "ml-5 mt-4 border-l-2 pl-4"
            : "rounded-2xl bg-secondary/50 p-5"
        }
      >
        <p className="leading-7">{comment.content}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>{formatDate(comment.createdAt)}</span>
          {authenticated && depth < 2 && (
            <button
              onClick={() =>
                setReplyingTo(replyingTo === comment.id ? null : comment.id)
              }
              className="font-bold text-foreground"
            >
              Reply
            </button>
          )}
          {owned && (
            <>
              <button
                onClick={() => edit(comment)}
                className="font-bold text-foreground"
              >
                Edit
              </button>
              <button
                onClick={() => remove(comment)}
                className="font-bold text-red-600"
              >
                Delete
              </button>
            </>
          )}
        </div>
        {replyingTo === comment.id && (
          <form
            onSubmit={(event) => create(event, comment.id)}
            className="mt-4"
          >
            <textarea
              name="content"
              required
              rows={2}
              className="field py-3"
              placeholder="Write a reply…"
            />
            <button
              disabled={pending}
              className="mt-2 rounded-full bg-foreground px-4 py-2 text-xs font-bold text-background"
            >
              Reply
            </button>
          </form>
        )}
        {comment.replies?.map((reply) => (
          <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
        ))}
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-3xl border-t px-5 py-14">
      <h2 className="text-2xl font-bold">Join the conversation</h2>
      {authenticated ? (
        <form onSubmit={(event) => create(event)} className="mt-6">
          <textarea
            name="content"
            required
            rows={4}
            placeholder="Share a thoughtful response…"
            className="field resize-none py-3"
          />
          <div className="mt-3 flex justify-end">
            <button
              disabled={pending}
              className="rounded-full bg-foreground px-5 py-2.5 text-sm font-bold text-background disabled:opacity-50"
            >
              {pending ? "Posting…" : "Post comment"}
            </button>
          </div>
        </form>
      ) : (
        <p className="mt-4 rounded-xl bg-secondary p-4 text-sm">
          Sign in to comment or reply.
        </p>
      )}
      {message && (
        <p role="status" className="mt-4 text-sm text-muted-foreground">
          {message}
        </p>
      )}
      <div className="mt-10 space-y-6">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
        {comments.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Be the first to respond.
          </p>
        )}
      </div>
    </section>
  );
}
