import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Home from "@/pages/home";
import PadelPage from "@/pages/padel";
import Football8Page from "@/pages/football-8";
import Football5Page from "@/pages/football-5";
import CreateTournamentPage from "@/pages/create-tournament";
import TournamentDetailPage from "@/pages/tournament-detail";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/padel" component={PadelPage} />
      <Route path="/football-8" component={Football8Page} />
      <Route path="/football-5" component={Football5Page} />
      <Route path="/create" component={CreateTournamentPage} />
      <Route path="/tournament/:id" component={TournamentDetailPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="tourneypro-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col bg-background">
            <Navbar />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
          </div>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
