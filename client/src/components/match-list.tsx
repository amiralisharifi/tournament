import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Calendar, MapPin } from "lucide-react";
import type { Tournament, Match, Team, Player } from "@shared/schema";

interface MatchListProps {
  tournament: Tournament;
  onEditScore?: (match: Match) => void;
}

function getTeamById(teams: Team[], id: string | null): Team | undefined {
  return teams.find((t) => t.id === id);
}

function getPlayerById(players: Player[] | undefined, id: string): Player | undefined {
  return players?.find((p) => p.id === id);
}

function getAmericanoPairName(match: Match, playerIds: string[] | undefined, players: Player[] | undefined): string {
  if (!playerIds || playerIds.length === 0) return "TBD";
  const names = playerIds
    .map(id => getPlayerById(players, id)?.name || "?")
    .filter(Boolean);
  return names.length > 0 ? names.join(" & ") : "TBD";
}

export function MatchList({ tournament, onEditScore }: MatchListProps) {
  const { matches, teams, players, format } = tournament;
  const isAmericano = format === "americano";

  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No matches scheduled yet.</p>
      </div>
    );
  }

  const sortedMatches = [...matches].sort((a, b) => {
    const statusOrder = { live: 0, upcoming: 1, completed: 2 };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return a.round - b.round || a.matchNumber - b.matchNumber;
  });

  const groupedMatches = sortedMatches.reduce((acc, match) => {
    const key = match.status;
    if (!acc[key]) acc[key] = [];
    acc[key].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

  const sections = [
    { key: "live", title: "Live Now", matches: groupedMatches.live || [] },
    { key: "upcoming", title: "Upcoming", matches: groupedMatches.upcoming || [] },
    { key: "completed", title: "Completed", matches: groupedMatches.completed || [] },
  ];

  return (
    <div className="space-y-8">
      {sections
        .filter((s) => s.matches.length > 0)
        .map((section) => (
          <div key={section.key}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              {section.title}
              {section.key === "live" && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
              )}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.matches.map((match) => {
                const team1 = getTeamById(teams, match.team1Id);
                const team2 = getTeamById(teams, match.team2Id);
                
                const team1Name = isAmericano 
                  ? getAmericanoPairName(match, match.team1PlayerIds, players)
                  : (team1?.name || "TBD");
                const team2Name = isAmericano 
                  ? getAmericanoPairName(match, match.team2PlayerIds, players)
                  : (team2?.name || "TBD");
                
                const canEditScore = isAmericano 
                  ? (match.team1PlayerIds?.length === 2 && match.team2PlayerIds?.length === 2)
                  : (match.team1Id && match.team2Id);

                return (
                  <Card key={match.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3 gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant={
                            match.status === "live" ? "default" :
                            match.status === "completed" ? "secondary" : "outline"
                          }>
                            {match.status === "live" ? "Live" :
                             match.status === "completed" ? "Completed" : "Upcoming"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Round {match.round}, Match {match.matchNumber}
                          </span>
                        </div>
                        {onEditScore && canEditScore && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEditScore(match)}
                            data-testid={`button-edit-match-list-${match.id}`}
                          >
                            <Edit2 className="h-3 w-3 mr-1" />
                            Score
                          </Button>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <div className={`flex-1 text-center p-3 rounded-lg ${
                          match.winnerId === match.team1Id ? "bg-primary/10" : "bg-muted/50"
                        }`}>
                          <p className={`font-medium text-sm ${
                            match.winnerId === match.team1Id ? "text-primary" : ""
                          }`}>
                            {team1Name}
                          </p>
                          <p className="text-2xl font-mono font-bold mt-1">
                            {match.status !== "upcoming" ? match.team1Score : "-"}
                          </p>
                        </div>

                        <span className="text-muted-foreground font-medium">vs</span>

                        <div className={`flex-1 text-center p-3 rounded-lg ${
                          match.winnerId === match.team2Id ? "bg-primary/10" : "bg-muted/50"
                        }`}>
                          <p className={`font-medium text-sm ${
                            match.winnerId === match.team2Id ? "text-primary" : ""
                          }`}>
                            {team2Name}
                          </p>
                          <p className="text-2xl font-mono font-bold mt-1">
                            {match.status !== "upcoming" ? match.team2Score : "-"}
                          </p>
                        </div>
                      </div>

                      {(match.scheduledTime || match.venue) && (
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground flex-wrap">
                          {match.scheduledTime && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {match.scheduledTime}
                            </span>
                          )}
                          {match.venue && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {match.venue}
                            </span>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
    </div>
  );
}
