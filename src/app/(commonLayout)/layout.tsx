import { Navbar } from "@/components/layout/Navbar";

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>{children}</main>
      <footer className="border-t py-10"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} Inkline. Ideas worth your time.</p><p>Built for curious minds.</p></div></footer>
    </div>
  );
}
