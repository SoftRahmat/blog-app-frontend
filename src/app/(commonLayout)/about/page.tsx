import { BookOpen, MessageCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { AboutCta } from "@/components/about-cta";

export const metadata = {
  title: "About Inkline",
  description: "A thoughtful publishing community for ideas worth sharing.",
};

const values = [
  {
    icon: BookOpen,
    title: "Ideas with substance",
    copy: "We make room for useful experience, careful arguments, and stories that stay with you.",
  },
  {
    icon: MessageCircle,
    title: "Constructive conversation",
    copy: "Readers can respond, ask questions, and build on an idea without losing the human tone.",
  },
  {
    icon: Sparkles,
    title: "Responsible publishing",
    copy: "Clear moderation and accountable administration keep the platform welcoming and dependable.",
  },
];

export default function AboutPage() {
  return (
    <main>
      <section className="relative overflow-hidden border-b bg-slate-950 text-white">
        <div className="hero-grid absolute inset-0 opacity-40" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-24 lg:grid-cols-[1.15fr_.85fr] lg:items-end lg:py-32">
          <div>
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[.22em] text-amber-300">
              <Sparkles className="size-4" />
              About Inkline
            </p>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[.95] tracking-[-.05em] sm:text-7xl">
              A home for ideas worth finishing.
            </h1>
          </div>
          <p className="max-w-xl text-lg leading-8 text-slate-300">
            Inkline is an independent publishing community where writers turn
            lived experience and hard-won knowledge into stories people can use.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.2em] text-teal-600">
              Why we exist
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight">
              Good writing deserves a clear path to readers.
            </h2>
          </div>
          <div className="space-y-5 text-lg leading-8 text-muted-foreground">
            <p>
              Publishing online can become a contest for attention. Inkline
              takes a calmer approach: focused reading, practical author tools,
              and conversations attached to the ideas that started them.
            </p>
            <p>
              Writers can draft, publish, and manage their work from one place.
              Readers can discover featured stories, explore topics, and join
              moderated discussions.
            </p>
          </div>
        </div>
        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {values.map(({ icon: Icon, title, copy }) => (
            <article key={title} className="rounded-3xl border bg-card p-7">
              <div className="grid size-11 place-items-center rounded-2xl bg-teal-500/10 text-teal-700">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-6 text-xl font-bold">{title}</h3>
              <p className="mt-3 leading-7 text-muted-foreground">{copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="border-y bg-secondary/40">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-18 md:grid-cols-3">
          <div>
            <p className="text-4xl font-black">Write</p>
            <p className="mt-2 text-muted-foreground">
              Shape a draft at your own pace.
            </p>
          </div>
          <div>
            <p className="text-4xl font-black">Publish</p>
            <p className="mt-2 text-muted-foreground">
              Share it with a curious audience.
            </p>
          </div>
          <div>
            <p className="text-4xl font-black">Connect</p>
            <p className="mt-2 text-muted-foreground">
              Continue the idea through conversation.
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-5 py-24 text-center">
        <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
          Bring your next idea into focus.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
          Start writing today, or browse the community’s latest perspectives.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <AboutCta />
          <Link
            href="/blogs"
            className="rounded-full border px-6 py-3 font-bold"
          >
            Explore stories
          </Link>
        </div>
      </section>
    </main>
  );
}
