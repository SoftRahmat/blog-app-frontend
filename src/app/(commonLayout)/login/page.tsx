"use client";
import { FormEvent, useState } from "react";
import { ArrowRight, Chrome } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const data = new FormData(e.currentTarget);
    const result = await authClient.signIn.email({
      email: String(data.get("email")),
      password: String(data.get("password")),
      callbackURL: `${window.location.origin}${new URLSearchParams(window.location.search).get("callbackURL") || "/dashboard"}`,
    });
    if (result.error) setError(result.error.message || "Unable to sign in.");
    setPending(false);
  }
  return (
    <AuthShell
      title="Welcome back"
      copy="Continue where you left off and share your next idea."
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label="Email" name="email" type="email" autoComplete="email" />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
        />
        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-teal-700"
          >
            Forgot password?
          </Link>
        </div>
        {error && (
          <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-600">
            {error}
          </p>
        )}
        <button
          disabled={pending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-3 font-bold text-background disabled:opacity-50"
        >
          {pending ? "Signing in…" : "Sign in"}
          <ArrowRight className="size-4" />
        </button>
      </form>
      <Divider />
      <button
        onClick={() =>
          authClient.signIn.social({
            provider: "google",
            callbackURL: `${window.location.origin}/dashboard`,
          })
        }
        className="flex w-full items-center justify-center gap-2 rounded-xl border py-3 font-semibold"
      >
        <Chrome className="size-4" />
        Continue with Google
      </button>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to Inkline?{" "}
        <Link className="font-bold text-foreground" href="/register">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({
  title,
  copy,
  children,
}: {
  title: string;
  copy: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-[calc(100vh-73px)] lg:grid-cols-2">
      <div className="hidden bg-slate-950 p-14 text-white lg:flex lg:flex-col lg:justify-between">
        <Link href="/" className="text-xl font-black">
          INKLINE<span className="text-amber-300">.</span>
        </Link>
        <blockquote className="max-w-lg text-4xl font-bold leading-tight tracking-tight">
          Your voice deserves more than a draft folder.
        </blockquote>
        <p className="text-sm text-slate-400">
          Publish clearly. Connect thoughtfully.
        </p>
      </div>
      <div className="flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-black tracking-tight">{title}</h1>
          <p className="mt-3 mb-8 text-muted-foreground">{copy}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
export function Field(
  props: React.InputHTMLAttributes<HTMLInputElement> & { label: string },
) {
  return (
    <label className="block text-sm font-semibold">
      {props.label}
      <input
        {...props}
        required
        className="mt-2 h-12 w-full rounded-xl border bg-background px-4 font-normal outline-none focus:ring-2 focus:ring-teal-500"
      />
    </label>
  );
}
function Divider() {
  return (
    <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
      <span className="h-px flex-1 bg-border" />
      OR
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
