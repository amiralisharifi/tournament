import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTournamentSchema, updateMatchScoreSchema, type TournamentType } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/tournaments", async (req, res) => {
    try {
      const type = req.query.type as TournamentType | undefined;
      let tournaments;
      
      if (type) {
        tournaments = await storage.getTournamentsByType(type);
      } else {
        tournaments = await storage.getAllTournaments();
      }
      
      res.json(tournaments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tournaments" });
    }
  });

  app.get("/api/tournaments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const tournament = await storage.getTournament(id);
      
      if (!tournament) {
        return res.status(404).json({ message: "Tournament not found" });
      }
      
      res.json(tournament);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tournament" });
    }
  });

  app.post("/api/tournaments", async (req, res) => {
    try {
      const validatedData = insertTournamentSchema.parse(req.body);
      const tournament = await storage.createTournament(validatedData);
      res.status(201).json(tournament);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      if (error instanceof Error && error.message.includes("At least 2 teams")) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to create tournament" });
    }
  });

  app.patch("/api/tournaments/:tournamentId/matches/:matchId", async (req, res) => {
    try {
      const { tournamentId, matchId } = req.params;
      const validatedData = updateMatchScoreSchema.parse(req.body);
      
      const match = await storage.updateMatchScore(tournamentId, matchId, validatedData);
      
      if (!match) {
        return res.status(404).json({ message: "Match or tournament not found" });
      }
      
      res.json(match);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to update match score" });
    }
  });

  return httpServer;
}
