"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { AuthShell, Field } from "../login/page";

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const email = String(new FormData(event.currentTarget).get("email"));
    const result = await authClient.requestPasswordReset({
      email,
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setMessage(
      result.error
        ? result.error.message || "Unable to send reset email."
        : "If an account exists for that email, a reset link is on its way.",
    );
    setPending(false);
  }
  return (
    <AuthShell
      title="Reset your password"
      copy="We’ll email you a secure link to choose a new password."
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label="Email" name="email" type="email" autoComplete="email" />
        {message && (
          <p role="status" className="rounded-xl bg-secondary p-3 text-sm">
            {message}
          </p>
        )}
        <button
          disabled={pending}
          className="w-full rounded-xl bg-foreground py-3 font-bold text-background disabled:opacity-50"
        >
          {pending ? "Sending…" : "Send reset link"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm">
        <Link href="/login" className="font-bold">
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}
