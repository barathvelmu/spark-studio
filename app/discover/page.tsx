import { DiscoverGrid } from "@/components/DiscoverGrid";

export default function DiscoverPage() {
  return (
    <div className="max-w-page mx-auto px-7 lg:px-9 py-11">
      <header className="mb-10">
        <h1 className="font-display text-h1 text-text mb-2">Discover</h1>
        <p className="text-body-lg text-text-muted">
          Play projects, peek at the code, and remix anything you like.
        </p>
      </header>
      <DiscoverGrid />
    </div>
  );
}
