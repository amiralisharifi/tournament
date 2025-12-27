import { 
  type User, 
  type InsertUser,
  type Tournament,
  type InsertTournament,
  type Match,
  type UpdateMatchScore,
  type TournamentType,
  type Stage,
  type Group,
  type Player,
  type AmericanoSettings
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllTournaments(): Promise<Tournament[]>;
  getTournamentsByType(type: TournamentType): Promise<Tournament[]>;
  getTournament(id: string): Promise<Tournament | undefined>;
  createTournament(data: InsertTournament): Promise<Tournament>;
  updateMatchScore(tournamentId: string, matchId: string, data: UpdateMatchScore): Promise<Match | undefined>;
}

function generateSingleEliminationMatches(teams: { id: string; name: string }[], stageId?: string): Match[] {
  const matches: Match[] = [];
  const numTeams = teams.length;
  
  if (numTeams < 2) {
    throw new Error("At least 2 teams are required for a tournament");
  }
  
  const nextPowerOf2 = Math.pow(2, Math.ceil(Math.log2(numTeams)));
  const numByes = nextPowerOf2 - numTeams;
  const numRounds = Math.ceil(Math.log2(nextPowerOf2));
  
  const teamsWithByes: { id: string; name: string }[] = [...teams];
  for (let i = 0; i < numByes; i++) {
    teamsWithByes.push({ id: `bye-${i}`, name: "BYE" });
  }
  
  const shuffled = [...teamsWithByes].sort(() => Math.random() - 0.5);
  
  let globalMatchNumber = 1;
  
  for (let round = 1; round <= numRounds; round++) {
    const matchesInRound = Math.pow(2, numRounds - round);
    
    for (let matchInRound = 0; matchInRound < matchesInRound; matchInRound++) {
      if (round === 1) {
        const team1Index = matchInRound * 2;
        const team2Index = matchInRound * 2 + 1;
        const team1 = shuffled[team1Index];
        const team2 = shuffled[team2Index];
        
        const team1IsBye = team1.id.startsWith("bye-");
        const team2IsBye = team2.id.startsWith("bye-");
        
        if (team1IsBye && team2IsBye) {
          matches.push({
            id: randomUUID(),
            tournamentId: "",
            stageId,
            round,
            matchNumber: globalMatchNumber++,
            team1Id: null,
            team2Id: null,
            team1Score: 0,
            team2Score: 0,
            status: "upcoming",
            winnerId: null,
          });
        } else if (team1IsBye) {
          matches.push({
            id: randomUUID(),
            tournamentId: "",
            stageId,
            round,
            matchNumber: globalMatchNumber++,
            team1Id: team2.id,
            team2Id: null,
            team1Score: 0,
            team2Score: 0,
            status: "completed",
            winnerId: team2.id,
          });
        } else if (team2IsBye) {
          matches.push({
            id: randomUUID(),
            tournamentId: "",
            stageId,
            round,
            matchNumber: globalMatchNumber++,
            team1Id: team1.id,
            team2Id: null,
            team1Score: 0,
            team2Score: 0,
            status: "completed",
            winnerId: team1.id,
          });
        } else {
          matches.push({
            id: randomUUID(),
            tournamentId: "",
            stageId,
            round,
            matchNumber: globalMatchNumber++,
            team1Id: team1.id,
            team2Id: team2.id,
            team1Score: 0,
            team2Score: 0,
            status: "upcoming",
            winnerId: null,
          });
        }
      } else {
        matches.push({
          id: randomUUID(),
          tournamentId: "",
          stageId,
          round,
          matchNumber: globalMatchNumber++,
          team1Id: null,
          team2Id: null,
          team1Score: 0,
          team2Score: 0,
          status: "upcoming",
          winnerId: null,
        });
      }
    }
  }
  
  for (let round = 1; round < numRounds; round++) {
    const currentRoundMatches = matches.filter(m => m.round === round);
    const nextRoundMatches = matches.filter(m => m.round === round + 1);
    
    currentRoundMatches.forEach((match, indexInRound) => {
      if (match.winnerId) {
        const nextMatchIndex = Math.floor(indexInRound / 2);
        const nextMatch = nextRoundMatches[nextMatchIndex];
        
        if (nextMatch) {
          const isFirstSlot = indexInRound % 2 === 0;
          if (isFirstSlot) {
            nextMatch.team1Id = match.winnerId;
          } else {
            nextMatch.team2Id = match.winnerId;
          }
        }
      }
    });
  }
  
  return matches;
}

function generateRoundRobinMatches(teams: { id: string; name: string }[], stageId?: string, groupName?: string): Match[] {
  const matches: Match[] = [];
  
  if (teams.length < 2) {
    throw new Error("At least 2 teams are required for a tournament");
  }
  
  let matchNumber = 1;
  
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      matches.push({
        id: randomUUID(),
        tournamentId: "",
        stageId,
        round: 1,
        matchNumber: matchNumber++,
        team1Id: teams[i].id,
        team2Id: teams[j].id,
        team1Score: 0,
        team2Score: 0,
        status: "upcoming",
        winnerId: null,
        groupName,
      });
    }
  }
  
  return matches;
}

function generateMultiStageMatches(
  teams: { id: string; name: string }[],
  stageConfigs: { id: string; name: string; type: "group" | "knockout"; order: number; groupCount?: number; qualifiedCount?: number }[]
): { matches: Match[]; stages: Stage[] } {
  const matches: Match[] = [];
  const stages: Stage[] = [];
  
  const sortedConfigs = [...stageConfigs].sort((a, b) => a.order - b.order);
  
  for (const config of sortedConfigs) {
    const stage: Stage = {
      id: config.id,
      name: config.name,
      type: config.type,
      order: config.order,
      qualifiedCount: config.qualifiedCount,
    };
    
    if (config.type === "group") {
      const groupCount = config.groupCount || 2;
      const groups: Group[] = [];
      const teamsPerGroup = Math.ceil(teams.length / groupCount);
      
      for (let g = 0; g < groupCount; g++) {
        const groupTeams = teams.slice(g * teamsPerGroup, (g + 1) * teamsPerGroup);
        const groupName = `Group ${String.fromCharCode(65 + g)}`;
        
        groups.push({
          id: randomUUID(),
          name: groupName,
          teamIds: groupTeams.map(t => t.id),
        });
        
        const groupMatches = generateRoundRobinMatches(groupTeams, config.id, groupName);
        matches.push(...groupMatches);
      }
      
      stage.groups = groups;
    } else if (config.type === "knockout") {
      if (config.order === 1) {
        const knockoutMatches = generateSingleEliminationMatches(teams, config.id);
        matches.push(...knockoutMatches);
      }
    }
    
    stages.push(stage);
  }
  
  return { matches, stages };
}

function getMatchPositionInRound(matches: Match[], match: Match): number {
  const roundMatches = matches
    .filter(m => m.round === match.round && m.stageId === match.stageId)
    .sort((a, b) => a.matchNumber - b.matchNumber);
  return roundMatches.findIndex(m => m.id === match.id);
}

function advanceWinnerToNextRound(matches: Match[], completedMatch: Match): void {
  if (!completedMatch.winnerId) return;
  
  const stageMatches = matches.filter(m => m.stageId === completedMatch.stageId);
  const round = completedMatch.round;
  const positionInRound = getMatchPositionInRound(stageMatches, completedMatch);
  if (positionInRound === -1) return;
  
  const nextRoundMatches = stageMatches
    .filter(m => m.round === round + 1)
    .sort((a, b) => a.matchNumber - b.matchNumber);
  
  if (nextRoundMatches.length === 0) return;
  
  const nextMatchPosition = Math.floor(positionInRound / 2);
  const nextMatch = nextRoundMatches[nextMatchPosition];
  
  if (!nextMatch) return;
  
  const isFirstSlot = positionInRound % 2 === 0;
  
  if (isFirstSlot) {
    nextMatch.team1Id = completedMatch.winnerId;
  } else {
    nextMatch.team2Id = completedMatch.winnerId;
  }
}

function clearWinnerFromNextRound(matches: Match[], match: Match, previousWinnerId: string | null): void {
  if (!previousWinnerId) return;
  
  const stageMatches = matches.filter(m => m.stageId === match.stageId);
  const round = match.round;
  const positionInRound = getMatchPositionInRound(stageMatches, match);
  if (positionInRound === -1) return;
  
  const nextRoundMatches = stageMatches
    .filter(m => m.round === round + 1)
    .sort((a, b) => a.matchNumber - b.matchNumber);
  
  if (nextRoundMatches.length === 0) return;
  
  const nextMatchPosition = Math.floor(positionInRound / 2);
  const nextMatch = nextRoundMatches[nextMatchPosition];
  
  if (!nextMatch) return;
  
  const isFirstSlot = positionInRound % 2 === 0;
  
  if (isFirstSlot && nextMatch.team1Id === previousWinnerId) {
    nextMatch.team1Id = null;
    if (nextMatch.status === "completed") {
      nextMatch.status = "upcoming";
      nextMatch.team1Score = 0;
      nextMatch.team2Score = 0;
      const oldWinner = nextMatch.winnerId;
      nextMatch.winnerId = null;
      clearWinnerFromNextRound(matches, nextMatch, oldWinner);
    }
  } else if (!isFirstSlot && nextMatch.team2Id === previousWinnerId) {
    nextMatch.team2Id = null;
    if (nextMatch.status === "completed") {
      nextMatch.status = "upcoming";
      nextMatch.team1Score = 0;
      nextMatch.team2Score = 0;
      const oldWinner = nextMatch.winnerId;
      nextMatch.winnerId = null;
      clearWinnerFromNextRound(matches, nextMatch, oldWinner);
    }
  }
}

function generateAmericanoMatches(players: Player[], courts: number): Match[] {
  const matches: Match[] = [];
  const n = players.length;
  
  if (n < 4) {
    throw new Error("At least 4 players are required for Americano");
  }
  
  const allValidMatches: { team1: [number, number]; team2: [number, number] }[] = [];
  
  for (let a = 0; a < n; a++) {
    for (let b = a + 1; b < n; b++) {
      for (let c = 0; c < n; c++) {
        if (c === a || c === b) continue;
        for (let d = c + 1; d < n; d++) {
          if (d === a || d === b) continue;
          if (a < c || (a === c && b < d)) {
            allValidMatches.push({ team1: [a, b], team2: [c, d] });
          }
        }
      }
    }
  }
  
  const shuffledMatches = allValidMatches.sort(() => Math.random() - 0.5);
  
  const partnerCounts = new Map<string, number>();
  const getPartnerKey = (p1: number, p2: number) => 
    p1 < p2 ? `${p1}-${p2}` : `${p2}-${p1}`;
  
  const maxPartnerships = Math.min(3, n - 1);
  const selectedMatches: typeof allValidMatches = [];
  
  for (const match of shuffledMatches) {
    const key1 = getPartnerKey(match.team1[0], match.team1[1]);
    const key2 = getPartnerKey(match.team2[0], match.team2[1]);
    
    const count1 = partnerCounts.get(key1) || 0;
    const count2 = partnerCounts.get(key2) || 0;
    
    if (count1 < maxPartnerships && count2 < maxPartnerships) {
      selectedMatches.push(match);
      partnerCounts.set(key1, count1 + 1);
      partnerCounts.set(key2, count2 + 1);
    }
  }
  
  const usedMatches = new Set<number>();
  let round = 1;
  let matchNumber = 1;
  
  while (usedMatches.size < selectedMatches.length) {
    const playersUsedInRound = new Set<number>();
    let matchesThisRound = 0;
    
    for (let i = 0; i < selectedMatches.length && matchesThisRound < courts; i++) {
      if (usedMatches.has(i)) continue;
      
      const matchData = selectedMatches[i];
      const matchPlayers = [matchData.team1[0], matchData.team1[1], matchData.team2[0], matchData.team2[1]];
      
      const hasConflict = matchPlayers.some(p => playersUsedInRound.has(p));
      if (hasConflict) continue;
      
      matchPlayers.forEach(p => playersUsedInRound.add(p));
      usedMatches.add(i);
      
      const team1PlayerIds = [players[matchData.team1[0]].id, players[matchData.team1[1]].id];
      const team2PlayerIds = [players[matchData.team2[0]].id, players[matchData.team2[1]].id];
      
      matches.push({
        id: randomUUID(),
        tournamentId: "",
        round,
        matchNumber: matchNumber++,
        team1Id: `round-${round}-match-${matchesThisRound}-team1`,
        team2Id: `round-${round}-match-${matchesThisRound}-team2`,
        team1Score: 0,
        team2Score: 0,
        status: "upcoming",
        winnerId: null,
        team1PlayerIds,
        team2PlayerIds,
      });
      
      matchesThisRound++;
    }
    
    if (matchesThisRound === 0) {
      break;
    }
    
    round++;
  }
  
  return matches;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private tournaments: Map<string, Tournament>;

  constructor() {
    this.users = new Map();
    this.tournaments = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllTournaments(): Promise<Tournament[]> {
    return Array.from(this.tournaments.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getTournamentsByType(type: TournamentType): Promise<Tournament[]> {
    return Array.from(this.tournaments.values())
      .filter(t => t.type === type)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getTournament(id: string): Promise<Tournament | undefined> {
    return this.tournaments.get(id);
  }

  async createTournament(data: InsertTournament): Promise<Tournament> {
    const id = randomUUID();
    
    if (data.format === "americano") {
      if (!data.players || data.players.length < 4) {
        throw new Error("At least 4 players are required for Americano");
      }
      
      const validatedPlayers = data.players.map(p => ({
        id: randomUUID(),
        name: p.name,
      }));
      
      const courts = data.americanoSettings?.courts || 1;
      const matches = generateAmericanoMatches(validatedPlayers, courts);
      matches.forEach(m => m.tournamentId = id);
      
      const tournament: Tournament = {
        id,
        name: data.name,
        type: data.type,
        format: data.format,
        teams: [],
        matches,
        players: validatedPlayers,
        americanoSettings: data.americanoSettings || { pointsPerMatch: 32, courts: 1 },
        status: "active",
        createdAt: new Date().toISOString(),
      };
      
      this.tournaments.set(id, tournament);
      return tournament;
    }
    
    if (!data.teams || data.teams.length < 2) {
      throw new Error("At least 2 teams are required for a tournament");
    }
    
    const validatedTeams = data.teams.map(t => ({
      id: randomUUID(),
      name: t.name,
      players: t.players.map(p => ({
        id: randomUUID(),
        name: p.name,
      })),
    }));
    
    let matches: Match[];
    let stages: Stage[] | undefined;
    
    if (data.format === "single-elimination") {
      matches = generateSingleEliminationMatches(validatedTeams);
    } else if (data.format === "round-robin") {
      matches = generateRoundRobinMatches(validatedTeams);
    } else if (data.format === "multi-stage" && data.stages) {
      const result = generateMultiStageMatches(validatedTeams, data.stages);
      matches = result.matches;
      stages = result.stages;
    } else {
      matches = generateSingleEliminationMatches(validatedTeams);
    }
    
    matches.forEach(m => m.tournamentId = id);
    
    const tournament: Tournament = {
      id,
      name: data.name,
      type: data.type,
      format: data.format,
      teams: validatedTeams,
      matches,
      stages,
      status: "active",
      createdAt: new Date().toISOString(),
    };
    
    this.tournaments.set(id, tournament);
    return tournament;
  }

  async updateMatchScore(
    tournamentId: string, 
    matchId: string, 
    data: UpdateMatchScore
  ): Promise<Match | undefined> {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) return undefined;
    
    const match = tournament.matches.find(m => m.id === matchId);
    if (!match) return undefined;
    
    const previousWinnerId = match.winnerId;
    const wasCompleted = match.status === "completed";
    
    match.team1Score = data.team1Score;
    match.team2Score = data.team2Score;
    
    if (data.status) {
      match.status = data.status;
    }
    
    if (match.status === "completed") {
      if (match.team1Score > match.team2Score) {
        match.winnerId = match.team1Id;
      } else if (match.team2Score > match.team1Score) {
        match.winnerId = match.team2Id;
      } else {
        match.winnerId = null;
      }
      
      const isKnockoutMatch = tournament.format === "single-elimination" || 
        (tournament.format === "multi-stage" && tournament.stages?.find(s => s.id === match.stageId)?.type === "knockout");
      
      if (isKnockoutMatch) {
        if (wasCompleted && previousWinnerId && previousWinnerId !== match.winnerId) {
          clearWinnerFromNextRound(tournament.matches, match, previousWinnerId);
        }
        
        if (match.winnerId) {
          advanceWinnerToNextRound(tournament.matches, match);
        }
      }
    } else {
      match.winnerId = null;
      
      const isKnockoutMatch = tournament.format === "single-elimination" || 
        (tournament.format === "multi-stage" && tournament.stages?.find(s => s.id === match.stageId)?.type === "knockout");
      
      if (isKnockoutMatch && wasCompleted && previousWinnerId) {
        clearWinnerFromNextRound(tournament.matches, match, previousWinnerId);
      }
    }
    
    const playableMatches = tournament.matches.filter(
      m => m.team1Id && m.team2Id && !m.team1Id.startsWith("bye-")
    );
    const allCompleted = playableMatches.length > 0 && 
      playableMatches.every(m => m.status === "completed");
    
    tournament.status = allCompleted ? "completed" : "active";
    
    return match;
  }
}

export const storage = new MemStorage();
