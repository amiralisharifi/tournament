import { useState } from "react";
import { useLocation, useSearch } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft, ArrowRight, Plus, Trash2, Trophy, Users, Target, Check, Circle, Feather, Layers } from "lucide-react";
import { SiNba } from "react-icons/si";
import type { TournamentType, InsertTournament, TournamentFormat } from "@shared/schema";
import { sportConfig, tournamentTypes } from "@shared/schema";

const sportTypesList: { id: TournamentType; label: string; players: number; Icon: any; isAmericano?: boolean }[] = [
  { id: "padel", label: "Padel", players: 2, Icon: Target },
  { id: "padel-americano", label: "Padel Americano", players: 1, Icon: Target, isAmericano: true },
  { id: "tennis-singles", label: "Tennis Singles", players: 1, Icon: Target },
  { id: "tennis-doubles", label: "Tennis Doubles", players: 2, Icon: Target },
  { id: "badminton-singles", label: "Badminton Singles", players: 1, Icon: Feather },
  { id: "badminton-doubles", label: "Badminton Doubles", players: 2, Icon: Feather },
  { id: "basketball", label: "Basketball", players: 5, Icon: SiNba },
  { id: "volleyball", label: "Volleyball", players: 6, Icon: Circle },
  { id: "football-8", label: "Football 8v8", players: 8, Icon: Users },
  { id: "football-5", label: "Football 5v5", players: 5, Icon: Users },
];

const formSchema = z.object({
  name: z.string().min(1, "Tournament name is required").max(100),
  type: z.enum(tournamentTypes),
  format: z.enum(["single-elimination", "round-robin", "multi-stage", "americano"]),
  teams: z.array(z.object({
    id: z.string(),
    name: z.string().min(1, "Team name is required"),
    players: z.array(z.object({
      id: z.string(),
      name: z.string().min(1, "Player name is required"),
    })).min(1),
  })).optional(),
  players: z.array(z.object({
    id: z.string(),
    name: z.string().min(1, "Player name is required"),
  })).optional(),
  americanoSettings: z.object({
    pointsPerMatch: z.number(),
    courts: z.number(),
  }).optional(),
  stages: z.array(z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(["group", "knockout"]),
    order: z.number(),
    groupCount: z.number().optional(),
    qualifiedCount: z.number().optional(),
  })).optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateTournamentPage() {
  const [, setLocation] = useLocation();
  const searchParams = useSearch();
  const urlType = new URLSearchParams(searchParams).get("type") as TournamentType | null;
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const getPlayersCount = (type: TournamentType) => {
    return sportConfig[type]?.playersPerTeam || 2;
  };

  const createEmptyPlayer = () => ({
    id: crypto.randomUUID(),
    name: "",
  });

  const createEmptyTeam = (type: TournamentType) => ({
    id: crypto.randomUUID(),
    name: "",
    players: Array.from({ length: getPlayersCount(type) }, createEmptyPlayer),
  });

  const isAmericanoType = (type: TournamentType) => {
    return sportTypesList.find(s => s.id === type)?.isAmericano || false;
  };

  const defaultType = urlType && tournamentTypes.includes(urlType as any) ? urlType : "padel";
  const defaultIsAmericano = isAmericanoType(defaultType);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: defaultType,
      format: defaultIsAmericano ? "americano" : "single-elimination",
      teams: defaultIsAmericano ? [] : [createEmptyTeam(defaultType), createEmptyTeam(defaultType)],
      players: defaultIsAmericano ? [createEmptyPlayer(), createEmptyPlayer(), createEmptyPlayer(), createEmptyPlayer()] : [],
      americanoSettings: { pointsPerMatch: 32, courts: 1 },
      stages: [
        { id: crypto.randomUUID(), name: "Group Stage", type: "group", order: 1, groupCount: 2, qualifiedCount: 2 },
        { id: crypto.randomUUID(), name: "Knockout", type: "knockout", order: 2 },
      ],
    },
  });

  const watchType = form.watch("type");
  const watchFormat = form.watch("format");
  const watchTeams = form.watch("teams") || [];
  const watchPlayers = form.watch("players") || [];
  const watchAmericanoSettings = form.watch("americanoSettings");
  const watchStages = form.watch("stages") || [];
  const isAmericano = watchFormat === "americano";

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const payload: any = {
        name: data.name,
        type: data.type,
        format: data.format,
      };
      if (data.format === "americano") {
        payload.players = data.players;
        payload.americanoSettings = data.americanoSettings;
      } else {
        payload.teams = data.teams;
        if (data.format === "multi-stage" && data.stages) {
          payload.stages = data.stages;
        }
      }
      const response = await apiRequest("POST", "/api/tournaments", payload);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
      toast({
        title: "Tournament Created!",
        description: "Your tournament has been created successfully.",
      });
      setLocation(`/tournament/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create tournament",
        variant: "destructive",
      });
    },
  });

  const addTeam = () => {
    const currentTeams = form.getValues("teams") || [];
    form.setValue("teams", [...currentTeams, createEmptyTeam(watchType)]);
  };

  const removeTeam = (index: number) => {
    const currentTeams = form.getValues("teams") || [];
    if (currentTeams.length > 2) {
      form.setValue("teams", currentTeams.filter((_, i) => i !== index));
    }
  };

  const updateTeamName = (index: number, name: string) => {
    const currentTeams = form.getValues("teams") || [];
    currentTeams[index].name = name;
    form.setValue("teams", [...currentTeams]);
  };

  const updateTeamPlayerName = (teamIndex: number, playerIndex: number, name: string) => {
    const currentTeams = form.getValues("teams") || [];
    currentTeams[teamIndex].players[playerIndex].name = name;
    form.setValue("teams", [...currentTeams]);
  };

  const addAmericanoPlayer = () => {
    const currentPlayers = form.getValues("players") || [];
    form.setValue("players", [...currentPlayers, createEmptyPlayer()]);
  };

  const removeAmericanoPlayer = (index: number) => {
    const currentPlayers = form.getValues("players") || [];
    if (currentPlayers.length > 4) {
      form.setValue("players", currentPlayers.filter((_, i) => i !== index));
    }
  };

  const updateAmericanoPlayerName = (index: number, name: string) => {
    const currentPlayers = form.getValues("players") || [];
    currentPlayers[index].name = name;
    form.setValue("players", [...currentPlayers]);
  };

  const updateAmericanoSettings = (field: "pointsPerMatch" | "courts", value: number) => {
    const current = form.getValues("americanoSettings") || { pointsPerMatch: 32, courts: 1 };
    form.setValue("americanoSettings", { ...current, [field]: value });
  };

  const updateGroupCount = (count: number) => {
    const currentStages = form.getValues("stages") || [];
    const groupStage = currentStages.find(s => s.type === "group");
    if (groupStage) {
      groupStage.groupCount = count;
      form.setValue("stages", [...currentStages]);
    }
  };

  const onSubmit = (data: FormData) => {
    createMutation.mutate(data);
  };

  const canProceedStep1 = form.watch("name")?.trim().length > 0;
  const canProceedStep2 = isAmericano
    ? watchPlayers.length >= 4 && watchPlayers.every((p) => p.name.trim().length > 0)
    : watchTeams.every(
        (team) => team.name.trim().length > 0 && team.players.every((p) => p.name.trim().length > 0)
      );

  const steps = [
    { number: 1, title: "Details" },
    { number: 2, title: isAmericano ? "Players" : "Teams" },
    { number: 3, title: "Review" },
  ];

  const getSportLabel = (type: TournamentType) => {
    return sportTypesList.find(s => s.id === type)?.label || type;
  };

  const getFormatLabel = (format: TournamentFormat) => {
    switch (format) {
      case "single-elimination": return "Single Elimination";
      case "round-robin": return "Round Robin";
      case "multi-stage": return "Multi-Stage";
      case "americano": return "Americano";
      default: return format;
    }
  };

  return (
    <div className="min-h-screen py-8 pb-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="mb-4"
            data-testid="button-back"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Create Tournament</h1>
          <p className="text-muted-foreground mt-1">
            Set up your tournament in just a few steps.
          </p>
        </div>

        <div className="flex items-center justify-between mb-8">
          {steps.map((s, i) => (
            <div key={s.number} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  step >= s.number
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step > s.number ? <Check className="h-5 w-5" /> : s.number}
              </div>
              <span className={`ml-2 text-sm font-medium hidden sm:block ${
                step >= s.number ? "text-foreground" : "text-muted-foreground"
              }`}>
                {s.title}
              </span>
              {i < steps.length - 1 && (
                <div className={`w-12 sm:w-24 h-1 mx-2 sm:mx-4 rounded ${
                  step > s.number ? "bg-primary" : "bg-muted"
                }`} />
              )}
            </div>
          ))}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tournament Details</CardTitle>
                  <CardDescription>
                    Enter the basic information for your tournament.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tournament Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Summer Championship 2024"
                            {...field}
                            data-testid="input-tournament-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sport Type</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            const newType = value as TournamentType;
                            const isNewAmericano = isAmericanoType(newType);
                            
                            if (isNewAmericano) {
                              form.setValue("format", "americano");
                              form.setValue("teams", []);
                              if ((form.getValues("players") || []).length < 4) {
                                form.setValue("players", [
                                  createEmptyPlayer(),
                                  createEmptyPlayer(),
                                  createEmptyPlayer(),
                                  createEmptyPlayer(),
                                ]);
                              }
                            } else {
                              if (form.getValues("format") === "americano") {
                                form.setValue("format", "single-elimination");
                              }
                              form.setValue("players", []);
                              const playersCount = getPlayersCount(newType);
                              const currentTeams = form.getValues("teams") || [];
                              if (currentTeams.length < 2) {
                                form.setValue("teams", [createEmptyTeam(newType), createEmptyTeam(newType)]);
                              } else {
                                const updatedTeams = currentTeams.map((team) => ({
                                  ...team,
                                  players: Array.from({ length: playersCount }, (_, i) =>
                                    team.players[i] || createEmptyPlayer()
                                  ),
                                }));
                                form.setValue("teams", updatedTeams);
                              }
                            }
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-sport-type">
                              <SelectValue placeholder="Select a sport" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sportTypesList.map((sport) => (
                              <SelectItem key={sport.id} value={sport.id} data-testid={`option-sport-${sport.id}`}>
                                {sport.label} {sport.isAmericano ? "(Individual)" : `(${sport.players} player${sport.players !== 1 ? "s" : ""}/team)`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isAmericanoType(watchType) ? (
                    <div className="border rounded-lg p-4 bg-muted/30">
                      <h4 className="font-medium mb-2">Americano Format</h4>
                      <p className="text-sm text-muted-foreground">
                        Partners rotate each round so everyone plays with everyone. 
                        Individual points accumulate - highest total wins!
                      </p>
                    </div>
                  ) : (
                    <FormField
                      control={form.control}
                      name="format"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tournament Format</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="grid grid-cols-1 gap-4"
                            >
                              <Label
                                className={`flex flex-col rounded-md border-2 p-4 cursor-pointer transition-colors hover-elevate ${
                                  field.value === "single-elimination"
                                    ? "border-primary bg-primary/5"
                                    : "border-muted"
                                }`}
                                data-testid="radio-format-knockout"
                              >
                                <RadioGroupItem value="single-elimination" className="sr-only" />
                                <span className="font-medium">Single Elimination</span>
                                <span className="text-sm text-muted-foreground">
                                  Knockout format - lose once and you're out
                                </span>
                              </Label>
                              <Label
                                className={`flex flex-col rounded-md border-2 p-4 cursor-pointer transition-colors hover-elevate ${
                                  field.value === "round-robin"
                                    ? "border-primary bg-primary/5"
                                    : "border-muted"
                                }`}
                                data-testid="radio-format-roundrobin"
                              >
                                <RadioGroupItem value="round-robin" className="sr-only" />
                                <span className="font-medium">Round Robin</span>
                                <span className="text-sm text-muted-foreground">
                                  Everyone plays everyone - standings table
                                </span>
                              </Label>
                              <Label
                                className={`flex flex-col rounded-md border-2 p-4 cursor-pointer transition-colors hover-elevate ${
                                  field.value === "multi-stage"
                                    ? "border-primary bg-primary/5"
                                    : "border-muted"
                                }`}
                                data-testid="radio-format-multistage"
                              >
                                <RadioGroupItem value="multi-stage" className="sr-only" />
                                <div className="flex items-center gap-2">
                                  <Layers className="h-4 w-4" />
                                  <span className="font-medium">Multi-Stage</span>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  Group stage followed by knockout rounds
                                </span>
                              </Label>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {watchFormat === "multi-stage" && (
                    <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
                      <h4 className="font-medium flex items-center gap-2">
                        <Layers className="h-4 w-4" />
                        Multi-Stage Settings
                      </h4>
                      <div>
                        <Label className="text-sm">Number of Groups</Label>
                        <Select
                          value={String(watchStages.find(s => s.type === "group")?.groupCount || 2)}
                          onValueChange={(val) => updateGroupCount(parseInt(val))}
                        >
                          <SelectTrigger className="mt-1" data-testid="select-group-count">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2">2 Groups</SelectItem>
                            <SelectItem value="3">3 Groups</SelectItem>
                            <SelectItem value="4">4 Groups</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">
                          Teams will play round-robin in their group, then top teams advance to knockout.
                        </p>
                      </div>
                    </div>
                  )}

                  {isAmericanoType(watchType) && (
                    <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
                      <h4 className="font-medium">Americano Settings</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm">Points per Match</Label>
                          <Select
                            value={String(watchAmericanoSettings?.pointsPerMatch || 32)}
                            onValueChange={(val) => updateAmericanoSettings("pointsPerMatch", parseInt(val))}
                          >
                            <SelectTrigger className="mt-1" data-testid="select-points-per-match">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="16">16 points</SelectItem>
                              <SelectItem value="24">24 points</SelectItem>
                              <SelectItem value="32">32 points</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-sm">Number of Courts</Label>
                          <Select
                            value={String(watchAmericanoSettings?.courts || 1)}
                            onValueChange={(val) => updateAmericanoSettings("courts", parseInt(val))}
                          >
                            <SelectTrigger className="mt-1" data-testid="select-courts">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 court</SelectItem>
                              <SelectItem value="2">2 courts</SelectItem>
                              <SelectItem value="3">3 courts</SelectItem>
                              <SelectItem value="4">4 courts</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-4">
                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={!canProceedStep1}
                      data-testid="button-next-step-1"
                    >
                      Next: Add {isAmericanoType(watchType) ? "Players" : "Teams"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>{isAmericano ? "Players" : "Teams & Players"}</CardTitle>
                  <CardDescription>
                    {isAmericano 
                      ? "Add at least 4 players for the Americano tournament."
                      : `Add at least 2 teams with ${getPlayersCount(watchType)} player${getPlayersCount(watchType) !== 1 ? "s" : ""} each.`
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isAmericano ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {watchPlayers.map((player, index) => (
                          <div key={player.id} className="flex items-center gap-2">
                            <div className="flex-1">
                              <Label className="text-xs text-muted-foreground">Player {index + 1}</Label>
                              <Input
                                placeholder={`Player ${index + 1} name`}
                                value={player.name}
                                onChange={(e) => updateAmericanoPlayerName(index, e.target.value)}
                                data-testid={`input-americano-player-${index}`}
                              />
                            </div>
                            {watchPlayers.length > 4 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeAmericanoPlayer(index)}
                                className="shrink-0 mt-5"
                                data-testid={`button-remove-player-${index}`}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addAmericanoPlayer}
                        className="w-full"
                        data-testid="button-add-player"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Another Player
                      </Button>
                    </>
                  ) : (
                    <>
                      {watchTeams.map((team, teamIndex) => (
                        <div key={team.id} className="border rounded-lg p-4 space-y-4">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1">
                              <Label className="text-xs text-muted-foreground">Team Name</Label>
                              <Input
                                placeholder={`Team ${teamIndex + 1}`}
                                value={team.name}
                                onChange={(e) => updateTeamName(teamIndex, e.target.value)}
                                data-testid={`input-team-name-${teamIndex}`}
                              />
                            </div>
                            {watchTeams.length > 2 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeTeam(teamIndex)}
                                className="shrink-0 mt-5"
                                data-testid={`button-remove-team-${teamIndex}`}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {team.players.map((player, playerIndex) => (
                              <div key={player.id}>
                                <Label className="text-xs text-muted-foreground">
                                  Player {playerIndex + 1}
                                </Label>
                                <Input
                                  placeholder={`Player ${playerIndex + 1} name`}
                                  value={player.name}
                                  onChange={(e) => updateTeamPlayerName(teamIndex, playerIndex, e.target.value)}
                                  data-testid={`input-player-${teamIndex}-${playerIndex}`}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addTeam}
                        className="w-full"
                        data-testid="button-add-team"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Another Team
                      </Button>
                    </>
                  )}

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      data-testid="button-back-step-2"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setStep(3)}
                      disabled={!canProceedStep2}
                      data-testid="button-next-step-2"
                    >
                      Review
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Review & Create</CardTitle>
                  <CardDescription>
                    Review your tournament details before creating.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg border p-4 space-y-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Tournament Name</Label>
                      <p className="font-medium">{form.watch("name")}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Sport</Label>
                        <p className="font-medium">{getSportLabel(watchType)}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Format</Label>
                        <p className="font-medium">{getFormatLabel(watchFormat)}</p>
                      </div>
                    </div>
                    {watchFormat === "multi-stage" && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Groups</Label>
                        <p className="font-medium">
                          {watchStages.find(s => s.type === "group")?.groupCount || 2} groups
                        </p>
                      </div>
                    )}
                    {isAmericano && watchAmericanoSettings && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs text-muted-foreground">Points per Match</Label>
                          <p className="font-medium">{watchAmericanoSettings.pointsPerMatch} points</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Courts</Label>
                          <p className="font-medium">{watchAmericanoSettings.courts} court{watchAmericanoSettings.courts > 1 ? "s" : ""}</p>
                        </div>
                      </div>
                    )}
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        {isAmericano ? `Players (${watchPlayers.length})` : `Teams (${watchTeams.length})`}
                      </Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {isAmericano 
                          ? watchPlayers.map((player) => (
                              <span
                                key={player.id}
                                className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-sm"
                              >
                                {player.name}
                              </span>
                            ))
                          : watchTeams.map((team) => (
                              <span
                                key={team.id}
                                className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-sm"
                              >
                                {team.name}
                              </span>
                            ))
                        }
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(2)}
                      data-testid="button-back-step-3"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={createMutation.isPending}
                      data-testid="button-create-tournament-submit"
                    >
                      {createMutation.isPending ? (
                        "Creating..."
                      ) : (
                        <>
                          <Trophy className="mr-2 h-4 w-4" />
                          Create Tournament
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
