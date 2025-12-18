import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Tournament, Team, Match } from "@shared/schema";

interface StandingsTableProps {
  tournament: Tournament;
}

interface TeamStats {
  team: Team;
  played: number;
  won: number;
  lost: number;
  drawn: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

function calculateStandings(tournament: Tournament): TeamStats[] {
  const { teams, matches } = tournament;
  
  const statsMap = new Map<string, TeamStats>();
  
  teams.forEach((team) => {
    statsMap.set(team.id, {
      team,
      played: 0,
      won: 0,
      lost: 0,
      drawn: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    });
  });

  matches
    .filter((m) => m.status === "completed" && m.team1Id && m.team2Id)
    .forEach((match) => {
      const team1Stats = statsMap.get(match.team1Id!);
      const team2Stats = statsMap.get(match.team2Id!);

      if (team1Stats && team2Stats) {
        team1Stats.played++;
        team2Stats.played++;

        team1Stats.goalsFor += match.team1Score;
        team1Stats.goalsAgainst += match.team2Score;
        team2Stats.goalsFor += match.team2Score;
        team2Stats.goalsAgainst += match.team1Score;

        if (match.team1Score > match.team2Score) {
          team1Stats.won++;
          team1Stats.points += 3;
          team2Stats.lost++;
        } else if (match.team2Score > match.team1Score) {
          team2Stats.won++;
          team2Stats.points += 3;
          team1Stats.lost++;
        } else {
          team1Stats.drawn++;
          team2Stats.drawn++;
          team1Stats.points += 1;
          team2Stats.points += 1;
        }
      }
    });

  statsMap.forEach((stats) => {
    stats.goalDifference = stats.goalsFor - stats.goalsAgainst;
  });

  return Array.from(statsMap.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });
}

export function StandingsTable({ tournament }: StandingsTableProps) {
  const standings = calculateStandings(tournament);

  if (standings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No teams in this tournament.</p>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead>Team</TableHead>
              <TableHead className="text-center w-12">P</TableHead>
              <TableHead className="text-center w-12">W</TableHead>
              <TableHead className="text-center w-12">D</TableHead>
              <TableHead className="text-center w-12">L</TableHead>
              <TableHead className="text-center w-16">GF</TableHead>
              <TableHead className="text-center w-16">GA</TableHead>
              <TableHead className="text-center w-16">GD</TableHead>
              <TableHead className="text-center w-16 font-bold">Pts</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {standings.map((stats, index) => (
              <TableRow key={stats.team.id} data-testid={`standings-row-${index}`}>
                <TableCell className="text-center font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium">{stats.team.name}</TableCell>
                <TableCell className="text-center">{stats.played}</TableCell>
                <TableCell className="text-center text-green-600 dark:text-green-400">{stats.won}</TableCell>
                <TableCell className="text-center text-muted-foreground">{stats.drawn}</TableCell>
                <TableCell className="text-center text-red-600 dark:text-red-400">{stats.lost}</TableCell>
                <TableCell className="text-center">{stats.goalsFor}</TableCell>
                <TableCell className="text-center">{stats.goalsAgainst}</TableCell>
                <TableCell className={`text-center font-medium ${
                  stats.goalDifference > 0 
                    ? "text-green-600 dark:text-green-400" 
                    : stats.goalDifference < 0 
                    ? "text-red-600 dark:text-red-400" 
                    : ""
                }`}>
                  {stats.goalDifference > 0 ? `+${stats.goalDifference}` : stats.goalDifference}
                </TableCell>
                <TableCell className="text-center font-bold text-lg">{stats.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
