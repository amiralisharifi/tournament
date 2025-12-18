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
import { ArrowLeft, Trophy, Users, Calendar, Share2, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Tournament, Match } from "@shared/schema";

const typeLabels = {
  padel: "Padel",
  "football-8": "8-Sided Football",
  "football-5": "5-Sided Football",
};

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

  const completedMatches = tournament.matches.filter((m) => m.status === "completed").length;
  const liveMatches = tournament.matches.filter((m) => m.status === "live").length;
  const upcomingMatches = tournament.matches.filter((m) => m.status === "upcoming").length;

  return (
    <div className="min-h-screen py-8 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link href={`/${tournament.type === "padel" ? "padel" : tournament.type}`}>
          <Button variant="ghost" className="mb-4" data-testid="button-back-to-list">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {typeLabels[tournament.type]}
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
              <span>{typeLabels[tournament.type]}</span>
              <span>•</span>
              <span>{tournament.format === "single-elimination" ? "Single Elimination" : "Round Robin"}</span>
              <span>•</span>
              <span>{tournament.teams.length} Teams</span>
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
                  <p className="text-2xl font-bold font-mono">{tournament.teams.length}</p>
                  <p className="text-xs text-muted-foreground">Teams</p>
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

        <Tabs defaultValue={tournament.format === "single-elimination" ? "bracket" : "standings"} className="w-full">
          <TabsList className="mb-6">
            {tournament.format === "single-elimination" && (
              <TabsTrigger value="bracket" data-testid="tab-bracket">Bracket</TabsTrigger>
            )}
            {tournament.format === "round-robin" && (
              <TabsTrigger value="standings" data-testid="tab-standings">Standings</TabsTrigger>
            )}
            <TabsTrigger value="matches" data-testid="tab-matches">Matches</TabsTrigger>
            <TabsTrigger value="teams" data-testid="tab-teams">Teams</TabsTrigger>
          </TabsList>

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

          <TabsContent value="matches">
            <MatchList tournament={tournament} onEditScore={handleEditScore} />
          </TabsContent>

          <TabsContent value="teams">
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
