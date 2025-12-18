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

export type TournamentType = "padel" | "football-8" | "football-5";
export type TournamentFormat = "single-elimination" | "round-robin";
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
}

export interface Tournament {
  id: string;
  name: string;
  type: TournamentType;
  format: TournamentFormat;
  teams: Team[];
  matches: Match[];
  status: "draft" | "active" | "completed";
  createdAt: string;
}

export const insertTournamentSchema = z.object({
  name: z.string().min(1, "Tournament name is required"),
  type: z.enum(["padel", "football-8", "football-5"]),
  format: z.enum(["single-elimination", "round-robin"]),
  teams: z.array(z.object({
    id: z.string(),
    name: z.string().min(1, "Team name is required"),
    players: z.array(z.object({
      id: z.string(),
      name: z.string().min(1, "Player name is required"),
    })),
  })),
});

export type InsertTournament = z.infer<typeof insertTournamentSchema>;

export const updateMatchScoreSchema = z.object({
  team1Score: z.number().min(0),
  team2Score: z.number().min(0),
  status: z.enum(["upcoming", "live", "completed"]).optional(),
});

export type UpdateMatchScore = z.infer<typeof updateMatchScoreSchema>;
