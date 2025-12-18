import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users } from "lucide-react";
import { TournamentList } from "@/components/tournament-list";
import type { Tournament } from "@shared/schema";

export default function Football5Page() {
  const { data: tournaments = [], isLoading } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments?type=football-5"],
  });

  return (
    <div className="min-h-screen">
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center">
                <Users className="h-7 w-7 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">5-Sided Football</h1>
                <p className="text-muted-foreground mt-1">
                  Futsal-style tournaments with 5 players
                </p>
              </div>
            </div>
            <Link href="/create?type=football-5">
              <Button size="lg" data-testid="button-create-football5-tournament">
                <Plus className="mr-2 h-4 w-4" />
                Create Tournament
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <Badge variant="outline">5 Players per Team</Badge>
            <Badge variant="outline">Fast-Paced</Badge>
            <Badge variant="outline">Knockout & Round Robin</Badge>
          </div>
        </div>
      </section>

      <section className="py-8 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold mb-6">Your Tournaments</h2>
          <TournamentList tournaments={tournaments} type="football-5" isLoading={isLoading} />
        </div>
      </section>
    </div>
  );
}
