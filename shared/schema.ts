import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type TournamentType = 
  | "padel" 
  | "football-8" 
  | "football-5" 
  | "basketball"
  | "volleyball"
  | "badminton-singles"
  | "badminton-doubles"
  | "tennis-singles"
  | "tennis-doubles";

export type TournamentFormat = "single-elimination" | "round-robin" | "multi-stage";
export type MatchStatus = "upcoming" | "live" | "completed";

export interface Player {
  id: string;
  name: string;
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
}

export interface Match {
  id: string;
  tournamentId: string;
  stageId?: string;
  round: number;
  matchNumber: number;
  team1Id: string | null;
  team2Id: string | null;
  team1Score: number;
  team2Score: number;
  status: MatchStatus;
  winnerId: string | null;
  scheduledTime?: string;
  venue?: string;
  groupName?: string;
}

export interface Stage {
  id: string;
  name: string;
  type: "group" | "knockout";
  order: number;
  groups?: Group[];
  qualifiedCount?: number;
}

export interface Group {
  id: string;
  name: string;
  teamIds: string[];
}

export interface Tournament {
  id: string;
  name: string;
  type: TournamentType;
  format: TournamentFormat;
  teams: Team[];
  matches: Match[];
  stages?: Stage[];
  status: "draft" | "active" | "completed";
  createdAt: string;
}

export const tournamentTypes = [
  "padel",
  "football-8",
  "football-5",
  "basketball",
  "volleyball",
  "badminton-singles",
  "badminton-doubles",
  "tennis-singles",
  "tennis-doubles",
] as const;

export const insertTournamentSchema = z.object({
  name: z.string().min(1, "Tournament name is required"),
  type: z.enum(tournamentTypes),
  format: z.enum(["single-elimination", "round-robin", "multi-stage"]),
  teams: z.array(z.object({
    id: z.string(),
    name: z.string().min(1, "Team name is required"),
    players: z.array(z.object({
      id: z.string(),
      name: z.string().min(1, "Player name is required"),
    })),
  })),
  stages: z.array(z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(["group", "knockout"]),
    order: z.number(),
    groupCount: z.number().optional(),
    qualifiedCount: z.number().optional(),
  })).optional(),
});

export type InsertTournament = z.infer<typeof insertTournamentSchema>;

export const updateMatchScoreSchema = z.object({
  team1Score: z.number().min(0),
  team2Score: z.number().min(0),
  status: z.enum(["upcoming", "live", "completed"]).optional(),
});

export type UpdateMatchScore = z.infer<typeof updateMatchScoreSchema>;

export const sportConfig: Record<TournamentType, { playersPerTeam: number; label: string; icon: string }> = {
  "padel": { playersPerTeam: 2, label: "Padel", icon: "racquet" },
  "football-8": { playersPerTeam: 8, label: "Football 8v8", icon: "football" },
  "football-5": { playersPerTeam: 5, label: "Football 5v5", icon: "football" },
  "basketball": { playersPerTeam: 5, label: "Basketball", icon: "basketball" },
  "volleyball": { playersPerTeam: 6, label: "Volleyball", icon: "volleyball" },
  "badminton-singles": { playersPerTeam: 1, label: "Badminton Singles", icon: "badminton" },
  "badminton-doubles": { playersPerTeam: 2, label: "Badminton Doubles", icon: "badminton" },
  "tennis-singles": { playersPerTeam: 1, label: "Tennis Singles", icon: "tennis" },
  "tennis-doubles": { playersPerTeam: 2, label: "Tennis Doubles", icon: "tennis" },
};
