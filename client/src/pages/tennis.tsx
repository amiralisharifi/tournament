import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Target } from "lucide-react";
import { TournamentList } from "@/components/tournament-list";
import type { Tournament } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TennisPage() {
  const { data: singlesT = [], isLoading: loadingSingles } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments?type=tennis-singles"],
  });

  const { data: doublesT = [], isLoading: loadingDoubles } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments?type=tennis-doubles"],
  });

  return (
    <div className="min-h-screen">
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-lime-500/10 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-500/10 via-transparent to-transparent" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-lime-500/20 to-green-500/20 flex items-center justify-center">
                <Target className="h-7 w-7 text-lime-600 dark:text-lime-400" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Tennis Tournaments</h1>
                <p className="text-muted-foreground mt-1">
                  Singles and doubles tennis matches
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <Badge variant="outline">Singles (1v1)</Badge>
            <Badge variant="outline">Doubles (2v2)</Badge>
            <Badge variant="outline">Multi-Stage Support</Badge>
          </div>
        </div>
      </section>

      <section className="py-8 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="singles" className="w-full">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <TabsList>
                <TabsTrigger value="singles" data-testid="tab-tennis-singles">Singles</TabsTrigger>
                <TabsTrigger value="doubles" data-testid="tab-tennis-doubles">Doubles</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="singles">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <h2 className="text-xl font-semibold">Singles Tournaments</h2>
                <Link href="/create?type=tennis-singles">
                  <Button data-testid="button-create-tennis-singles">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Singles
                  </Button>
                </Link>
              </div>
              <TournamentList tournaments={singlesT} type="tennis-singles" isLoading={loadingSingles} />
            </TabsContent>

            <TabsContent value="doubles">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <h2 className="text-xl font-semibold">Doubles Tournaments</h2>
                <Link href="/create?type=tennis-doubles">
                  <Button data-testid="button-create-tennis-doubles">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Doubles
                  </Button>
                </Link>
              </div>
              <TournamentList tournaments={doublesT} type="tennis-doubles" isLoading={loadingDoubles} />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
