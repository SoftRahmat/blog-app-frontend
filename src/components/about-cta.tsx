"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { authClient } from "@/lib/auth-client";

const subscribeToHydration = () => () => {};

export function AboutCta() {
  const { data: session } = authClient.useSession();
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );

  return (
    <Link
      href={hydrated && session ? "/dashboard" : "/register"}
      className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 font-bold text-background"
    >
      Start writing <ArrowRight className="size-4" />
    </Link>
  );
}
