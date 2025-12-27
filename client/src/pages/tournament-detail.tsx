import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BracketView } from "@/components/bracket-view";
import { StandingsTable } from "@/components/standings-table";
import { MatchList } from "@/components/match-list";
import { ScoreDialog } from "@/components/score-dialog";
import { ArrowLeft, Trophy, Users, Calendar, Share2, Copy, Check, Layers } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Tournament, Match, TournamentType, TournamentFormat, Player } from "@shared/schema";
import { sportConfig } from "@shared/schema";

function getBackPath(type: TournamentType): string {
  if (type === "badminton-singles" || type === "badminton-doubles") return "/badminton";
  if (type === "tennis-singles" || type === "tennis-doubles") return "/tennis";
  if (type === "padel-americano") return "/padel-americano";
  return `/${type}`;
}

function getFormatLabel(format: TournamentFormat): string {
  switch (format) {
    case "single-elimination": return "Single Elimination";
    case "round-robin": return "Round Robin";
    case "multi-stage": return "Multi-Stage";
    case "americano": return "Americano";
    default: return format;
  }
}

interface AmericanoLeaderboardEntry {
  player: Player;
  matchesPlayed: number;
  totalPoints: number;
  pointsAgainst: number;
}

function calculateAmericanoLeaderboard(tournament: Tournament): AmericanoLeaderboardEntry[] {
  if (!tournament.players) return [];
  
  const playerStats = new Map<string, AmericanoLeaderboardEntry>();
  
  tournament.players.forEach((player) => {
    playerStats.set(player.id, {
      player,
      matchesPlayed: 0,
      totalPoints: 0,
      pointsAgainst: 0,
    });
  });

  tournament.matches
    .filter((m) => m.status === "completed" && m.team1PlayerIds && m.team2PlayerIds)
    .forEach((match) => {
      const team1Score = match.team1Score || 0;
      const team2Score = match.team2Score || 0;

      match.team1PlayerIds?.forEach((playerId) => {
        const stats = playerStats.get(playerId);
        if (stats) {
          stats.matchesPlayed++;
          stats.totalPoints += team1Score;
          stats.pointsAgainst += team2Score;
        }
      });

      match.team2PlayerIds?.forEach((playerId) => {
        const stats = playerStats.get(playerId);
        if (stats) {
          stats.matchesPlayed++;
          stats.totalPoints += team2Score;
          stats.pointsAgainst += team1Score;
        }
      });
    });

  return Array.from(playerStats.values()).sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    return (b.totalPoints - b.pointsAgainst) - (a.totalPoints - a.pointsAgainst);
  });
}

export default function TournamentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [scoreDialogOpen, setScoreDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: tournament, isLoading, error } = useQuery<Tournament>({
    queryKey: ["/api/tournaments", id],
  });

  const handleEditScore = (match: Match) => {
    setSelectedMatch(match);
    setScoreDialogOpen(true);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast({
        title: "Link Copied",
        description: "Tournament link copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-24 mb-4" />
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-48 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center p-8 max-w-md">
          <CardContent className="pt-6">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Tournament Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The tournament you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const typeLabel = sportConfig[tournament.type]?.label || tournament.type;
  const completedMatches = tournament.matches.filter((m) => m.status === "completed").length;
  const liveMatches = tournament.matches.filter((m) => m.status === "live").length;
  const upcomingMatches = tournament.matches.filter((m) => m.status === "upcoming").length;

  const isAmericano = tournament.format === "americano";
  const americanoLeaderboard = isAmericano ? calculateAmericanoLeaderboard(tournament) : [];
  const participantCount = isAmericano 
    ? (tournament.players?.length || 0) 
    : tournament.teams.length;

  const hasGroupStage = tournament.format === "multi-stage" && tournament.stages?.some(s => s.type === "group");
  const hasKnockout = tournament.format === "single-elimination" || 
    (tournament.format === "multi-stage" && tournament.stages?.some(s => s.type === "knockout"));

  const getDefaultTab = () => {
    if (tournament.format === "americano") return "leaderboard";
    if (tournament.format === "single-elimination") return "bracket";
    if (tournament.format === "round-robin") return "standings";
    if (tournament.format === "multi-stage") return hasGroupStage ? "groups" : "bracket";
    return "matches";
  };

  return (
    <div className="min-h-screen py-8 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link href={getBackPath(tournament.type)}>
          <Button variant="ghost" className="mb-4" data-testid="button-back-to-list">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {typeLabel}
          </Button>
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-3xl font-bold tracking-tight" data-testid="text-tournament-name">
                {tournament.name}
              </h1>
              <Badge variant={tournament.status === "active" ? "default" : "secondary"}>
                {tournament.status === "active" ? "Active" : tournament.status === "completed" ? "Completed" : "Draft"}
              </Badge>
              {liveMatches > 0 && (
                <Badge className="bg-red-500 text-white">
                  {liveMatches} Live
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 text-muted-foreground flex-wrap">
              <span>{typeLabel}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                {tournament.format === "multi-stage" && <Layers className="h-3.5 w-3.5" />}
                {getFormatLabel(tournament.format)}
              </span>
              <span>•</span>
              <span>{participantCount} {isAmericano ? "Players" : "Teams"}</span>
            </div>
          </div>

          <Button variant="outline" onClick={handleCopyLink} data-testid="button-share">
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Share2 className="mr-2 h-4 w-4" />
                Share Tournament
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono">{participantCount}</p>
                  <p className="text-xs text-muted-foreground">{isAmericano ? "Players" : "Teams"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono">{tournament.matches.length}</p>
                  <p className="text-xs text-muted-foreground">Total Matches</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono">{completedMatches}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono">{upcomingMatches}</p>
                  <p className="text-xs text-muted-foreground">Upcoming</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue={getDefaultTab()} className="w-full">
          <TabsList className="mb-6">
            {isAmericano && (
              <TabsTrigger value="leaderboard" data-testid="tab-leaderboard">Leaderboard</TabsTrigger>
            )}
            {tournament.format === "single-elimination" && (
              <TabsTrigger value="bracket" data-testid="tab-bracket">Bracket</TabsTrigger>
            )}
            {tournament.format === "round-robin" && (
              <TabsTrigger value="standings" data-testid="tab-standings">Standings</TabsTrigger>
            )}
            {tournament.format === "multi-stage" && hasGroupStage && (
              <TabsTrigger value="groups" data-testid="tab-groups">Groups</TabsTrigger>
            )}
            {tournament.format === "multi-stage" && hasKnockout && (
              <TabsTrigger value="bracket" data-testid="tab-bracket">Knockout</TabsTrigger>
            )}
            <TabsTrigger value="matches" data-testid="tab-matches">Matches</TabsTrigger>
            <TabsTrigger value="teams" data-testid="tab-teams">{isAmericano ? "Players" : "Teams"}</TabsTrigger>
          </TabsList>

          {isAmericano && (
            <TabsContent value="leaderboard">
              <Card>
                <CardHeader>
                  <CardTitle>Player Leaderboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">#</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Player</th>
                          <th className="text-center py-3 px-4 font-medium text-muted-foreground">Matches</th>
                          <th className="text-center py-3 px-4 font-medium text-muted-foreground">Points</th>
                          <th className="text-center py-3 px-4 font-medium text-muted-foreground">+/-</th>
                        </tr>
                      </thead>
                      <tbody>
                        {americanoLeaderboard.map((entry, index) => (
                          <tr key={entry.player.id} className="border-b last:border-0" data-testid={`leaderboard-row-${entry.player.id}`}>
                            <td className="py-3 px-4">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                index === 0 ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400" :
                                index === 1 ? "bg-gray-400/20 text-gray-600 dark:text-gray-400" :
                                index === 2 ? "bg-orange-500/20 text-orange-600 dark:text-orange-400" :
                                "bg-muted text-muted-foreground"
                              }`}>
                                {index + 1}
                              </div>
                            </td>
                            <td className="py-3 px-4 font-medium">{entry.player.name}</td>
                            <td className="py-3 px-4 text-center font-mono">{entry.matchesPlayed}</td>
                            <td className="py-3 px-4 text-center font-mono font-bold">{entry.totalPoints}</td>
                            <td className={`py-3 px-4 text-center font-mono ${
                              entry.totalPoints - entry.pointsAgainst > 0 ? "text-green-600 dark:text-green-400" :
                              entry.totalPoints - entry.pointsAgainst < 0 ? "text-red-600 dark:text-red-400" :
                              "text-muted-foreground"
                            }`}>
                              {entry.totalPoints - entry.pointsAgainst > 0 ? "+" : ""}{entry.totalPoints - entry.pointsAgainst}
                            </td>
                          </tr>
                        ))}
                        {americanoLeaderboard.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-muted-foreground">
                              No matches completed yet. Start playing to see the leaderboard!
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {tournament.format === "single-elimination" && (
            <TabsContent value="bracket">
              <BracketView tournament={tournament} onEditScore={handleEditScore} />
            </TabsContent>
          )}

          {tournament.format === "round-robin" && (
            <TabsContent value="standings">
              <StandingsTable tournament={tournament} />
            </TabsContent>
          )}

          {tournament.format === "multi-stage" && hasGroupStage && (
            <TabsContent value="groups">
              <div className="space-y-8">
                {tournament.stages?.filter(s => s.type === "group").map((stage) => (
                  <div key={stage.id}>
                    {stage.groups?.map((group) => {
                      const groupTeams = tournament.teams.filter(t => group.teamIds.includes(t.id));
                      const groupMatches = tournament.matches.filter(m => m.groupName === group.name);
                      
                      return (
                        <div key={group.id} className="mb-8">
                          <h3 className="text-lg font-semibold mb-4">{group.name}</h3>
                          <StandingsTable 
                            tournament={{
                              ...tournament,
                              teams: groupTeams,
                              matches: groupMatches,
                            }} 
                          />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </TabsContent>
          )}

          {tournament.format === "multi-stage" && hasKnockout && (
            <TabsContent value="bracket">
              <BracketView tournament={tournament} onEditScore={handleEditScore} />
            </TabsContent>
          )}

          <TabsContent value="matches">
            <MatchList tournament={tournament} onEditScore={handleEditScore} />
          </TabsContent>

          <TabsContent value="teams">
            {isAmericano ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {tournament.players?.map((player, index) => (
                  <Card key={player.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium" data-testid={`player-name-${player.id}`}>{player.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {americanoLeaderboard.find(e => e.player.id === player.id)?.totalPoints || 0} points
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tournament.teams.map((team) => (
                  <Card key={team.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {team.players.map((player, index) => (
                          <div
                            key={player.id}
                            className="flex items-center gap-2 text-sm"
                            data-testid={`team-player-${team.id}-${index}`}
                          >
                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                              {index + 1}
                            </div>
                            <span>{player.name}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <ScoreDialog
          match={selectedMatch}
          teams={tournament.teams}
          tournamentId={tournament.id}
          open={scoreDialogOpen}
          onOpenChange={setScoreDialogOpen}
        />
      </div>
    </div>
  );
}
