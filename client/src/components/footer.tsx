import { Trophy } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
                <Trophy className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">TourneyPro</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-md">
              Create tournament brackets, generate fixtures and keep live standings up to date. 
              For Padel, 8-sided football, and 5-sided football tournaments.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-4">Sports</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/padel" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Padel Tournaments
                </Link>
              </li>
              <li>
                <Link href="/football-8" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  8-Sided Football
                </Link>
              </li>
              <li>
                <Link href="/football-5" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  5-Sided Football
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/create" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Create Tournament
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <p className="text-center text-sm text-muted-foreground">
            {new Date().getFullYear()} TourneyPro. Manage your tournaments with ease.
          </p>
        </div>
      </div>
    </footer>
  );
}
