import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Minus, Plus } from "lucide-react";
import type { Match, Team, MatchStatus } from "@shared/schema";

interface ScoreDialogProps {
  match: Match | null;
  teams: Team[];
  tournamentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getTeamById(teams: Team[], id: string | null): Team | undefined {
  return teams.find((t) => t.id === id);
}

export function ScoreDialog({ match, teams, tournamentId, open, onOpenChange }: ScoreDialogProps) {
  const { toast } = useToast();
  const [team1Score, setTeam1Score] = useState(match?.team1Score || 0);
  const [team2Score, setTeam2Score] = useState(match?.team2Score || 0);
  const [status, setStatus] = useState<MatchStatus>(match?.status || "upcoming");

  useEffect(() => {
    if (match) {
      setTeam1Score(match.team1Score);
      setTeam2Score(match.team2Score);
      setStatus(match.status);
    }
  }, [match]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!match) return;
      const response = await apiRequest("PATCH", `/api/tournaments/${tournamentId}/matches/${match.id}`, {
        team1Score,
        team2Score,
        status,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments", tournamentId] });
      toast({
        title: "Score Updated",
        description: "The match score has been updated successfully.",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update score",
        variant: "destructive",
      });
    },
  });

  if (!match) return null;

  const team1 = getTeamById(teams, match.team1Id);
  const team2 = getTeamById(teams, match.team2Id);

  const handleOpen = (isOpen: boolean) => {
    if (isOpen && match) {
      setTeam1Score(match.team1Score);
      setTeam2Score(match.team2Score);
      setStatus(match.status);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Score</DialogTitle>
          <DialogDescription>
            Enter the match score for this game.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 text-center">
              <p className="font-medium mb-3">{team1?.name || "Team 1"}</p>
              <div className="flex items-center justify-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setTeam1Score(Math.max(0, team1Score - 1))}
                  data-testid="button-team1-minus"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-4xl font-mono font-bold w-16 text-center" data-testid="text-team1-score">
                  {team1Score}
                </span>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setTeam1Score(team1Score + 1)}
                  data-testid="button-team1-plus"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <span className="text-2xl text-muted-foreground font-medium">-</span>

            <div className="flex-1 text-center">
              <p className="font-medium mb-3">{team2?.name || "Team 2"}</p>
              <div className="flex items-center justify-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setTeam2Score(Math.max(0, team2Score - 1))}
                  data-testid="button-team2-minus"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-4xl font-mono font-bold w-16 text-center" data-testid="text-team2-score">
                  {team2Score}
                </span>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setTeam2Score(team2Score + 1)}
                  data-testid="button-team2-plus"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Label className="mb-3 block">Match Status</Label>
            <RadioGroup
              value={status}
              onValueChange={(v) => setStatus(v as MatchStatus)}
              className="grid grid-cols-3 gap-2"
            >
              <Label
                className={`flex items-center justify-center rounded-md border-2 p-3 cursor-pointer transition-colors ${
                  status === "upcoming" ? "border-primary bg-primary/5" : "border-muted"
                }`}
                data-testid="radio-status-upcoming"
              >
                <RadioGroupItem value="upcoming" className="sr-only" />
                <span className="text-sm">Upcoming</span>
              </Label>
              <Label
                className={`flex items-center justify-center rounded-md border-2 p-3 cursor-pointer transition-colors ${
                  status === "live" ? "border-primary bg-primary/5" : "border-muted"
                }`}
                data-testid="radio-status-live"
              >
                <RadioGroupItem value="live" className="sr-only" />
                <span className="text-sm">Live</span>
              </Label>
              <Label
                className={`flex items-center justify-center rounded-md border-2 p-3 cursor-pointer transition-colors ${
                  status === "completed" ? "border-primary bg-primary/5" : "border-muted"
                }`}
                data-testid="radio-status-completed"
              >
                <RadioGroupItem value="completed" className="sr-only" />
                <span className="text-sm">Completed</span>
              </Label>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            data-testid="button-cancel-score"
          >
            Cancel
          </Button>
          <Button
            onClick={() => updateMutation.mutate()}
            disabled={updateMutation.isPending}
            data-testid="button-save-score"
          >
            {updateMutation.isPending ? "Saving..." : "Save Score"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
