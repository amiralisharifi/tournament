import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Zap } from "lucide-react";
import { TournamentList } from "@/components/tournament-list";
import type { Tournament } from "@shared/schema";

export default function PadelAmericanoPage() {
  const { data: tournaments = [], isLoading } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments?type=padel-americano"],
  });

  return (
    <div className="min-h-screen">
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center">
                <Zap className="h-7 w-7 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Padel Americano</h1>
                <p className="text-muted-foreground mt-1">
                  Rotating partners - everyone plays with everyone
                </p>
              </div>
            </div>
            <Link href="/create?type=padel-americano">
              <Button size="lg" data-testid="button-create-americano-tournament">
                <Plus className="mr-2 h-4 w-4" />
                Create Tournament
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <Badge variant="outline">Individual Players</Badge>
            <Badge variant="outline">Rotating Partners</Badge>
            <Badge variant="outline">Points-Based Scoring</Badge>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">How Americano Works</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Players compete individually but play in pairs each round</li>
              <li>Partners rotate so everyone plays with everyone else</li>
              <li>Each match is played to a fixed number of points (16, 24, or 32)</li>
              <li>Individual points accumulate - highest total wins the tournament</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-8 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold mb-6">Your Americano Tournaments</h2>
          <TournamentList tournaments={tournaments} type="padel-americano" isLoading={isLoading} />
        </div>
      </section>
    </div>
  );
}
