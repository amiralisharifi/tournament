import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Calendar, Share2, Zap, Target, ArrowRight, Circle, Feather } from "lucide-react";
import { SiNba } from "react-icons/si";

const sportTypes = [
  {
    id: "padel",
    title: "Padel",
    description: "Create tournaments for doubles padel matches with 2 players per team.",
    players: "2 per Team",
    href: "/padel",
    color: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    Icon: Target,
  },
  {
    id: "padel-americano",
    title: "Padel Americano",
    description: "Rotating partner format where everyone plays with everyone.",
    players: "Individual",
    href: "/padel-americano",
    color: "from-teal-500/20 to-cyan-500/20",
    iconColor: "text-teal-600 dark:text-teal-400",
    Icon: Zap,
  },
  {
    id: "tennis",
    title: "Tennis",
    description: "Singles and doubles tennis tournaments with bracket management.",
    players: "1-2 per Team",
    href: "/tennis",
    color: "from-lime-500/20 to-green-500/20",
    iconColor: "text-lime-600 dark:text-lime-400",
    Icon: Target,
  },
  {
    id: "badminton",
    title: "Badminton",
    description: "Singles and doubles badminton tournaments with court assignments.",
    players: "1-2 per Team",
    href: "/badminton",
    color: "from-green-500/20 to-lime-500/20",
    iconColor: "text-green-600 dark:text-green-400",
    Icon: Feather,
  },
  {
    id: "basketball",
    title: "Basketball",
    description: "5v5 basketball tournaments with team management and scoring.",
    players: "5 per Team",
    href: "/basketball",
    color: "from-orange-500/20 to-red-500/20",
    iconColor: "text-orange-600 dark:text-orange-400",
    CustomIcon: SiNba,
  },
  {
    id: "volleyball",
    title: "Volleyball",
    description: "6v6 volleyball tournaments with group stages and playoffs.",
    players: "6 per Team",
    href: "/volleyball",
    color: "from-yellow-500/20 to-amber-500/20",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    Icon: Circle,
  },
  {
    id: "football-8",
    title: "Football 8v8",
    description: "Organize 8-a-side football tournaments with full team management.",
    players: "8 per Team",
    href: "/football-8",
    color: "from-blue-500/20 to-indigo-500/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    Icon: Users,
  },
  {
    id: "football-5",
    title: "Football 5v5",
    description: "Manage futsal-style 5-a-side tournaments with bracket generation.",
    players: "5 per Team",
    href: "/football-5",
    color: "from-sky-500/20 to-cyan-500/20",
    iconColor: "text-sky-600 dark:text-sky-400",
    Icon: Users,
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
    title: "Multi-Stage Tournaments",
    description: "Group stages followed by knockout rounds, just like the pros.",
  },
  {
    icon: Share2,
    title: "Share Everywhere",
    description: "One link keeps everyone up to date with live scores and standings.",
  },
  {
    icon: Target,
    title: "Any Format",
    description: "Single elimination, round robin, or multi-stage - all in one place.",
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
              Multi-stage tournaments with group stages and knockout rounds.
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sportTypes.map((sport) => (
              <Link key={sport.id} href={sport.href}>
                <Card className="h-full hover-elevate active-elevate-2 cursor-pointer transition-all duration-200 overflow-visible group" data-testid={`card-sport-${sport.id}`}>
                  <CardHeader className="pb-3">
                    <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${sport.color} flex items-center justify-center mb-3`}>
                      {sport.CustomIcon ? (
                        <sport.CustomIcon className={`h-7 w-7 ${sport.iconColor}`} />
                      ) : sport.Icon ? (
                        <sport.Icon className={`h-7 w-7 ${sport.iconColor}`} />
                      ) : null}
                    </div>
                    <CardTitle className="flex items-center justify-between text-lg">
                      {sport.title}
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </CardTitle>
                    <CardDescription className="text-sm">{sport.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Badge variant="outline" className="text-xs">{sport.players}</Badge>
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
                Add teams or players and choose your format. Single elimination, round robin, or multi-stage with groups.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                2
              </div>
              <h3 className="font-semibold mb-2">Generate the Schedule</h3>
              <p className="text-sm text-muted-foreground">
                Brackets and fixtures are created automatically. Add venues and time slots if needed.
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
