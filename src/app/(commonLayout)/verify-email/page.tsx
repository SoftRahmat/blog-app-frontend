"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function VerifyEmailPage() {
  const [state, setState] = useState<"verifying" | "success" | "error">(
    "verifying",
  );
  const [message, setMessage] = useState("Verifying your email address…");

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      queueMicrotask(() => {
        setState("error");
        setMessage("This verification link is missing its token.");
      });
      return;
    }
    authClient.verifyEmail({ query: { token } }).then((result) => {
      if (result.error) {
        setState("error");
        setMessage(
          result.error.message || "This link is invalid or has expired.",
        );
      } else {
        setState("success");
        setMessage("Your email is verified. You can now sign in and publish.");
      }
    });
  }, []);

  return (
    <AuthCard
      title={
        state === "success"
          ? "Email verified"
          : state === "error"
            ? "Verification failed"
            : "One moment"
      }
      message={message}
    >
      {state === "success" && (
        <Link
          href="/dashboard"
          className="block rounded-xl bg-foreground py-3 text-center font-bold text-background"
        >
          Continue to dashboard
        </Link>
      )}
      {state === "error" && <ResendVerification />}
    </AuthCard>
  );
}

function ResendVerification() {
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email"));
    const result = await authClient.sendVerificationEmail({
      email,
      callbackURL: `${window.location.origin}/dashboard`,
    });
    setMessage(
      result.error
        ? result.error.message || "Unable to send email."
        : "A new verification email has been sent.",
    );
  }
  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-left text-sm font-semibold">
        Email
        <input name="email" type="email" required className="field mt-2" />
      </label>
      <button className="w-full rounded-xl bg-foreground py-3 font-bold text-background">
        Send a new link
      </button>
      {message && (
        <p role="status" className="text-sm text-muted-foreground">
          {message}
        </p>
      )}
    </form>
  );
}

function AuthCard({
  title,
  message,
  children,
}: {
  title: string;
  message: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-5 py-16">
      <div className="w-full rounded-3xl border bg-background p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 grid size-14 place-items-center rounded-full bg-teal-500/10 text-2xl">
          ✦
        </div>
        <h1 className="text-3xl font-black tracking-tight">{title}</h1>
        <p className="my-4 text-sm leading-6 text-muted-foreground">
          {message}
        </p>
        {children}
      </div>
    </div>
  );
}
