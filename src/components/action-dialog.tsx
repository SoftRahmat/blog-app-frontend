"use client";

import { useState } from "react";
import { Check, PenLine, Trash2, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type ActionDialogTone = "default" | "warning" | "danger";

type ActionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  tone?: ActionDialogTone;
  inputLabel?: string;
  initialValue?: string;
  onConfirm: (value?: string) => void | Promise<void>;
};

const toneStyles = {
  default: {
    label: "Confirm action",
    icon: Check,
    accent: "from-teal-500 via-amber-400",
    glow: "bg-teal-500/10 text-teal-600 ring-teal-500/25 dark:text-teal-300",
    kickerClass: "text-teal-600 dark:text-teal-300",
  },
  warning: {
    label: "Review this change",
    icon: TriangleAlert,
    accent: "from-amber-500 via-orange-400",
    glow: "bg-amber-500/10 text-amber-700 ring-amber-500/25 dark:text-amber-300",
    kickerClass: "text-amber-700 dark:text-amber-300",
  },
  danger: {
    label: "Irreversible action",
    icon: Trash2,
    accent: "from-red-600 via-orange-500",
    glow: "bg-red-500/10 text-red-600 ring-red-500/25 dark:text-red-300",
    kickerClass: "text-red-600 dark:text-red-300",
  },
} as const;

export function ActionDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  tone = "default",
  inputLabel,
  initialValue = "",
  onConfirm,
}: ActionDialogProps) {
  const [value, setValue] = useState(initialValue);
  const [pending, setPending] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const visual = toneStyles[tone];
  const Icon = inputLabel ? PenLine : visual.icon;
  const trimmedValue = value.trim();

  async function confirm() {
    setAttempted(true);
    if (inputLabel && !trimmedValue) return;

    setPending(true);
    try {
      await onConfirm(inputLabel ? trimmedValue : undefined);
      onOpenChange(false);
    } catch {
      // The caller owns user-facing API feedback; keep the dialog open so the
      // action can be retried without losing its context or edited value.
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !pending && onOpenChange(next)}>
      <DialogContent className="overflow-hidden border-0 bg-card p-0 shadow-[0_30px_90px_rgba(0,0,0,.35)] ring-1 ring-foreground/10">
        <div
          className={cn("h-1 bg-linear-to-r to-transparent", visual.accent)}
        />
        <div className="grid gap-4 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,.10),transparent_45%)] px-6 pt-7 pb-6 pr-14 sm:grid-cols-[auto_1fr]">
          <div
            className={cn(
              "grid size-12 place-items-center rounded-2xl ring-1 shadow-lg",
              visual.glow,
            )}
            aria-hidden="true"
          >
            <Icon className="size-5" />
          </div>
          <div>
            <p
              className={cn(
                "text-[.68rem] font-black tracking-[.16em] uppercase",
                visual.kickerClass,
              )}
            >
              {inputLabel ? "Make it clearer" : visual.label}
            </p>
            <DialogTitle className="mt-1 text-2xl">{title}</DialogTitle>
            <DialogDescription className="mt-2">
              {description}
            </DialogDescription>
          </div>
        </div>

        {inputLabel && (
          <div className="px-6 pb-6">
            <label htmlFor="action-dialog-value" className="text-sm font-bold">
              {inputLabel}
            </label>
            <textarea
              id="action-dialog-value"
              autoFocus
              rows={5}
              maxLength={2000}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              aria-invalid={attempted && !trimmedValue}
              aria-describedby={
                attempted && !trimmedValue ? "action-dialog-error" : undefined
              }
              className="field mt-2 min-h-32 resize-y py-3"
            />
            {attempted && !trimmedValue && (
              <p
                id="action-dialog-error"
                className="mt-2 text-sm font-semibold text-destructive"
              >
                A value is required.
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col-reverse gap-2 border-t bg-secondary/45 px-6 py-4 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            disabled={pending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant={tone === "danger" ? "destructive" : "default"}
            disabled={pending}
            onClick={confirm}
          >
            {pending ? "Working…" : confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
