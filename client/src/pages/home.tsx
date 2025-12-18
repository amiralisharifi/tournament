import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Calendar, Share2, Zap, Target, ArrowRight } from "lucide-react";

const sportTypes = [
  {
    id: "padel",
    title: "Padel",
    description: "Create tournaments for doubles padel matches with 2 players per team.",
    players: "2 Players per Team",
    icon: "🎾",
    href: "/padel",
    color: "from-emerald-500/20 to-teal-500/20",
  },
  {
    id: "football-8",
    title: "8-Sided Football",
    description: "Organize 8-a-side football tournaments with full team management.",
    players: "8 Players per Team",
    icon: "⚽",
    href: "/football-8",
    color: "from-blue-500/20 to-indigo-500/20",
  },
  {
    id: "football-5",
    title: "5-Sided Football",
    description: "Manage futsal-style 5-a-side tournaments with bracket generation.",
    players: "5 Players per Team",
    icon: "⚽",
    href: "/football-5",
    color: "from-orange-500/20 to-amber-500/20",
  },
];

const features = [
  {
    icon: Zap,
    title: "Set Up in Minutes",
    description: "Add teams, choose your format, and the bracket is ready instantly.",
  },
  {
    icon: Calendar,
    title: "Real Schedules",
    description: "Generate fixtures around your venues and time slots automatically.",
  },
  {
    icon: Share2,
    title: "Share Everywhere",
    description: "One link keeps everyone up to date with live scores and standings.",
  },
  {
    icon: Target,
    title: "Any Format",
    description: "Single elimination, round robin, or group stages - all in one place.",
  },
];

const stats = [
  { value: "500+", label: "Tournaments Created" },
  { value: "2,000+", label: "Matches Played" },
  { value: "10,000+", label: "Players Registered" },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              Tournament Management Made Simple
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Your Tournament,{" "}
              <span className="text-primary">Your Rules</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create tournament brackets, generate fixtures and keep live standings up to date. 
              For Padel, 8-sided football, and 5-sided football tournaments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/create">
                <Button size="lg" className="w-full sm:w-auto" data-testid="button-hero-create">
                  <Trophy className="mr-2 h-5 w-5" />
                  Start Your Tournament
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" data-testid="button-hero-learn">
                Learn How It Works
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Choose Your Sport</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select a sport to view existing tournaments or create a new one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sportTypes.map((sport) => (
              <Link key={sport.id} href={sport.href}>
                <Card className="h-full hover-elevate active-elevate-2 cursor-pointer transition-all duration-200 overflow-visible group">
                  <CardHeader>
                    <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${sport.color} flex items-center justify-center text-3xl mb-4`}>
                      {sport.id === "padel" ? (
                        <Target className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    <CardTitle className="flex items-center justify-between">
                      {sport.title}
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </CardTitle>
                    <CardDescription>{sport.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline">{sport.players}</Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why Choose TourneyPro</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to run professional tournaments without the complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                1
              </div>
              <h3 className="font-semibold mb-2">Set Up Your Tournament</h3>
              <p className="text-sm text-muted-foreground">
                Add teams or players and choose your format. The bracket is created immediately.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                2
              </div>
              <h3 className="font-semibold mb-2">Generate the Schedule</h3>
              <p className="text-sm text-muted-foreground">
                Define days, time slots, and venues. The scheduler assigns everything automatically.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                3
              </div>
              <h3 className="font-semibold mb-2">Update Scores & Share</h3>
              <p className="text-sm text-muted-foreground">
                Enter results from your phone. Brackets and standings update live on a public link.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl sm:text-5xl font-bold font-mono mb-2">{stat.value}</div>
                <div className="text-primary-foreground/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Create your first tournament in minutes. No complex systems or spreadsheets required.
          </p>
          <Link href="/create">
            <Button size="lg" data-testid="button-cta-create">
              <Trophy className="mr-2 h-5 w-5" />
              Create Your Tournament
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
