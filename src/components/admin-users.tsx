"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  ActionDialog,
  type ActionDialogTone,
} from "@/components/action-dialog";
import { apiFetch, formatDate } from "@/lib/blog-api";

type Role = "USER" | "ADMIN";
type Status = "ACTIVE" | "SUSPENDED";
interface ManagedUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: Role;
  status: Status;
  createdAt: string;
  _count: { posts: number; comments: number; sessions: number };
}
interface UsersResponse {
  data: ManagedUser[];
  pagination: { total: number };
}
interface PendingUserAction {
  user: ManagedUser;
  payload: { role?: Role; status?: Status };
  action: string;
  tone: ActionDialogTone;
}

export function AdminUsers({ currentUserId }: { currentUserId?: string }) {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [pendingAction, setPendingAction] = useState<PendingUserAction | null>(
    null,
  );

  const load = useCallback(async (query = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "100" });
      if (query) params.set("search", query);
      const result = await apiFetch<UsersResponse>(`/users?${params}`);
      setUsers(result.data);
      setMessage("");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to load users.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void apiFetch<UsersResponse>("/users?limit=100")
      .then((result) => setUsers(result.data))
      .catch((error) =>
        setMessage(
          error instanceof Error ? error.message : "Unable to load users.",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  function requestUpdate(
    user: ManagedUser,
    payload: { role?: Role; status?: Status },
  ) {
    const action =
      payload.status === "SUSPENDED"
        ? "suspend"
        : payload.status === "ACTIVE"
          ? "activate"
          : "change the role of";
    setPendingAction({
      user,
      payload,
      action,
      tone: payload.status === "SUSPENDED" ? "warning" : "default",
    });
  }

  async function update() {
    if (!pendingAction) return;
    try {
      await apiFetch(`/users/${pendingAction.user.id}`, {
        method: "PATCH",
        body: JSON.stringify(pendingAction.payload),
      });
      setMessage(`${pendingAction.user.name}'s account was updated.`);
      await load(search);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to update user.",
      );
      throw error;
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void load(search.trim());
  }

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">User accounts</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage access, roles, and active sessions.
          </p>
        </div>
        <form onSubmit={submit} className="flex gap-2">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="field min-w-64"
            placeholder="Search name or email"
            aria-label="Search users"
          />
          <button className="rounded-xl bg-foreground px-4 text-sm font-bold text-background">
            Search
          </button>
        </form>
      </div>
      {message && (
        <p role="status" className="mt-4 rounded-xl bg-secondary p-4 text-sm">
          {message}
        </p>
      )}
      <div className="mt-5 overflow-x-auto rounded-2xl border bg-background">
        <table className="w-full min-w-215 text-left text-sm">
          <thead className="border-b bg-secondary/60 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Activity</th>
              <th className="p-4">Joined</th>
              <th className="p-4">Role</th>
              <th className="p-4">Access</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="p-4">
                  <p className="font-bold">
                    {user.name}
                    {user.id === currentUserId && (
                      <span className="ml-2 text-xs text-teal-600">You</span>
                    )}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {user.email} ·{" "}
                    {user.emailVerified ? "Verified" : "Unverified"}
                  </p>
                </td>
                <td className="p-4 text-muted-foreground">
                  {user._count.posts} posts · {user._count.comments} comments
                </td>
                <td className="p-4 text-muted-foreground">
                  {formatDate(user.createdAt)}
                </td>
                <td className="p-4">
                  <select
                    value={user.role}
                    onChange={(event) =>
                      requestUpdate(user, { role: event.target.value as Role })
                    }
                    className="field min-w-28 text-sm"
                    aria-label={`Role for ${user.name}`}
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
                <td className="p-4">
                  <button
                    disabled={user.id === currentUserId}
                    onClick={() =>
                      requestUpdate(user, {
                        status:
                          user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE",
                      })
                    }
                    className={`rounded-full px-4 py-2 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-40 ${user.status === "ACTIVE" ? "border border-red-300 text-red-600" : "bg-teal-600 text-white"}`}
                  >
                    {user.status === "ACTIVE" ? "Suspend" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
            {!loading && users.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-muted-foreground"
                >
                  No users found.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-muted-foreground"
                >
                  Loading users…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ActionDialog
        open={Boolean(pendingAction)}
        onOpenChange={(open) => !open && setPendingAction(null)}
        title="Update account?"
        description={
          pendingAction
            ? `Are you sure you want to ${pendingAction.action} ${pendingAction.user.name}?`
            : "Review this account change before continuing."
        }
        confirmLabel="Confirm"
        tone={pendingAction?.tone}
        onConfirm={update}
      />
    </section>
  );
}
