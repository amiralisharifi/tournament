import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Calendar, ArrowRight, Plus } from "lucide-react";
import type { Tournament, TournamentType } from "@shared/schema";

interface TournamentListProps {
  tournaments: Tournament[];
  type: TournamentType;
  isLoading?: boolean;
}

const typeLabels: Record<TournamentType, string> = {
  padel: "Padel",
  "football-8": "8-Sided Football",
  "football-5": "5-Sided Football",
};

const playersPerTeam: Record<TournamentType, number> = {
  padel: 2,
  "football-8": 8,
  "football-5": 5,
};

export function TournamentList({ tournaments, type, isLoading }: TournamentListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="h-5 bg-muted rounded w-16" />
                <div className="h-5 bg-muted rounded w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (tournaments.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Trophy className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Tournaments Yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first {typeLabels[type]} tournament to get started.
          </p>
          <Link href={`/create?type=${type}`}>
            <Button data-testid="button-create-first-tournament">
              <Plus className="mr-2 h-4 w-4" />
              Create Tournament
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tournaments.map((tournament) => {
        const completedMatches = tournament.matches.filter((m) => m.status === "completed").length;
        const totalMatches = tournament.matches.length;
        const liveMatches = tournament.matches.filter((m) => m.status === "live").length;

        return (
          <Link key={tournament.id} href={`/tournament/${tournament.id}`}>
            <Card className="h-full hover-elevate active-elevate-2 cursor-pointer transition-all duration-200 overflow-visible group">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-1">{tournament.name}</CardTitle>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                </div>
                <CardDescription className="flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {tournament.teams.length} Teams
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {completedMatches}/{totalMatches} Matches
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={tournament.status === "active" ? "default" : "secondary"}>
                    {tournament.status === "active" ? "Active" : tournament.status === "completed" ? "Completed" : "Draft"}
                  </Badge>
                  <Badge variant="outline">
                    {tournament.format === "single-elimination" ? "Knockout" : "Round Robin"}
                  </Badge>
                  {liveMatches > 0 && (
                    <Badge className="bg-red-500 text-white">
                      {liveMatches} Live
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
