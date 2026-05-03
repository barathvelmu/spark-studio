import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-bg/80 backdrop-blur border-b border-border">
      <div className="max-w-page mx-auto flex items-center justify-between h-16 px-7 lg:px-9">
        <Link href="/" className="font-display font-extrabold text-h3 text-text">
          Spark Studio
        </Link>
        <nav className="flex items-center gap-6 text-label text-text-muted">
          <Link href="/ideas" className="hover:text-text transition-colors">Ideas</Link>
          <Link href="/discover" className="hover:text-text transition-colors">Discover</Link>
          <Link
            href="/builder"
            className="bg-primary hover:bg-primary-hover text-white font-bold rounded-lg px-5 h-11 inline-flex items-center transition-colors"
          >
            Start Building
          </Link>
        </nav>
      </div>
    </header>
  );
}
