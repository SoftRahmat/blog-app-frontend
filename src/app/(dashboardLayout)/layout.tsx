"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as { name?: string; role?: string } | undefined;

  useEffect(() => {
    if (!isPending && !session)
      router.replace(`/login?callbackURL=${encodeURIComponent(pathname)}`);
  }, [isPending, pathname, router, session]);

  if (isPending || !session) {
    return (
      <div className="grid min-h-screen place-items-center bg-secondary/30">
        <p className="text-sm font-semibold text-muted-foreground">
          Loading your workspace…
        </p>
      </div>
    );
  }

  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="min-h-screen bg-secondary/25">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5">
          <Link href="/" className="text-xl font-black tracking-tight">
            INKLINE<span className="text-amber-500">.</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold">{user?.name}</p>
              <p className="text-xs text-muted-foreground">
                {isAdmin ? "Administrator" : "Writer"}
              </p>
            </div>
            <button
              onClick={() =>
                authClient.signOut({
                  fetchOptions: { onSuccess: () => router.push("/") },
                })
              }
              className="rounded-full border px-4 py-2 text-sm font-semibold"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-2xl border bg-background p-3">
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className="block rounded-xl bg-foreground px-4 py-3 text-sm font-bold text-background"
            >
              My stories
            </Link>
            {isAdmin && (
              <Link
                href="/admin-dashboard"
                className="block rounded-xl px-4 py-3 text-sm font-semibold hover:bg-secondary"
              >
                Admin overview
              </Link>
            )}
            <Link
              href="/blogs"
              className="block rounded-xl px-4 py-3 text-sm font-semibold hover:bg-secondary"
            >
              Browse stories
            </Link>
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
