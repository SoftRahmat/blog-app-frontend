"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { AuthShell, Field } from "../login/page";

export default function ResetPasswordPage() {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password"));
    const confirmation = String(data.get("confirmation"));
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      setMessage("This reset link is invalid or incomplete.");
      return;
    }
    if (password.length < 8) {
      setMessage("Use at least 8 characters.");
      return;
    }
    if (password !== confirmation) {
      setMessage("The passwords do not match.");
      return;
    }
    setPending(true);
    const result = await authClient.resetPassword({
      newPassword: password,
      token,
    });
    setPending(false);
    if (result.error)
      setMessage(
        result.error.message || "This reset link is invalid or expired.",
      );
    else {
      setSuccess(true);
      setMessage("Your password has been updated.");
    }
  }
  return (
    <AuthShell
      title="Choose a new password"
      copy="Use at least eight characters and keep it somewhere safe."
    >
      {success ? (
        <>
          <p className="rounded-xl bg-emerald-500/10 p-4 text-sm text-emerald-700">
            {message}
          </p>
          <Link
            href="/login"
            className="mt-4 block rounded-xl bg-foreground py-3 text-center font-bold text-background"
          >
            Sign in
          </Link>
        </>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <Field
            label="New password"
            name="password"
            type="password"
            autoComplete="new-password"
          />
          <Field
            label="Confirm password"
            name="confirmation"
            type="password"
            autoComplete="new-password"
          />
          {message && (
            <p role="alert" className="rounded-xl bg-secondary p-3 text-sm">
              {message}
            </p>
          )}
          <button
            disabled={pending}
            className="w-full rounded-xl bg-foreground py-3 font-bold text-background disabled:opacity-50"
          >
            {pending ? "Updating…" : "Update password"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
