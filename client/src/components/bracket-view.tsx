import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import type { Tournament, Match, Team } from "@shared/schema";

interface BracketViewProps {
  tournament: Tournament;
  onEditScore?: (match: Match) => void;
}

function getTeamById(teams: Team[], id: string | null): Team | undefined {
  return teams.find((t) => t.id === id);
}

function getRoundName(round: number, totalRounds: number): string {
  const roundsFromEnd = totalRounds - round;
  if (roundsFromEnd === 0) return "Final";
  if (roundsFromEnd === 1) return "Semi Finals";
  if (roundsFromEnd === 2) return "Quarter Finals";
  return `Round ${round}`;
}

interface MatchCardProps {
  match: Match;
  teams: Team[];
  onEditScore?: (match: Match) => void;
}

function MatchCard({ match, teams, onEditScore }: MatchCardProps) {
  const team1 = getTeamById(teams, match.team1Id);
  const team2 = getTeamById(teams, match.team2Id);

  const getStatusBadge = () => {
    switch (match.status) {
      case "live":
        return <Badge className="bg-red-500 text-white text-xs">Live</Badge>;
      case "completed":
        return <Badge variant="secondary" className="text-xs">Completed</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Upcoming</Badge>;
    }
  };

  return (
    <Card className="p-3 min-w-[200px]">
      <div className="flex items-center justify-between gap-2 mb-2">
        {getStatusBadge()}
        {onEditScore && match.team1Id && match.team2Id && (
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => onEditScore(match)}
            data-testid={`button-edit-match-${match.id}`}
          >
            <Edit2 className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      <div className="space-y-2">
        <div className={`flex items-center justify-between gap-2 p-2 rounded transition-colors ${
          match.winnerId === match.team1Id ? "bg-primary/10" : "bg-muted/50"
        }`}>
          <span className={`text-sm truncate ${
            match.winnerId === match.team1Id ? "font-semibold" : ""
          }`}>
            {team1?.name || "TBD"}
          </span>
          <span className="font-mono font-bold text-lg">
            {match.status !== "upcoming" ? match.team1Score : "-"}
          </span>
        </div>
        
        <div className={`flex items-center justify-between gap-2 p-2 rounded transition-colors ${
          match.winnerId === match.team2Id ? "bg-primary/10" : "bg-muted/50"
        }`}>
          <span className={`text-sm truncate ${
            match.winnerId === match.team2Id ? "font-semibold" : ""
          }`}>
            {team2?.name || "TBD"}
          </span>
          <span className="font-mono font-bold text-lg">
            {match.status !== "upcoming" ? match.team2Score : "-"}
          </span>
        </div>
      </div>
    </Card>
  );
}

export function BracketView({ tournament, onEditScore }: BracketViewProps) {
  const { matches, teams } = tournament;
  
  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No matches generated yet.</p>
      </div>
    );
  }

  const rounds = Array.from(new Set(matches.map((m) => m.round))).sort((a, b) => a - b);
  const totalRounds = Math.max(...rounds);

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-8 min-w-max">
        {rounds.map((round) => {
          const roundMatches = matches
            .filter((m) => m.round === round)
            .sort((a, b) => a.matchNumber - b.matchNumber);

          return (
            <div key={round} className="flex flex-col">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 text-center">
                {getRoundName(round, totalRounds)}
              </h3>
              <div className="flex flex-col gap-4 justify-around flex-1">
                {roundMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    teams={teams}
                    onEditScore={onEditScore}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
