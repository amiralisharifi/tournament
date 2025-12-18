import { Link, useLocation } from "wouter";
import { Trophy, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { href: "/", label: "Home" },
];

const sportsMenu = [
  { href: "/padel", label: "Padel" },
  { href: "/tennis", label: "Tennis" },
  { href: "/badminton", label: "Badminton" },
  { href: "/basketball", label: "Basketball" },
  { href: "/volleyball", label: "Volleyball" },
  { href: "/football-8", label: "Football 8v8" },
  { href: "/football-5", label: "Football 5v5" },
];

export function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isSportsPage = sportsMenu.some((s) => location === s.href);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
              <Trophy className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">TourneyPro</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={location === link.href ? "secondary" : "ghost"}
                  size="sm"
                  data-testid={`nav-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={isSportsPage ? "secondary" : "ghost"}
                  size="sm"
                  data-testid="nav-dropdown-sports"
                >
                  Sports
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {sportsMenu.map((sport) => (
                  <Link key={sport.href} href={sport.href}>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      data-testid={`nav-sport-${sport.label.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {sport.label}
                    </DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/create" className="hidden sm:block">
              <Button data-testid="button-create-tournament">
                Create Tournament
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant={location === link.href ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}
              <div className="py-2">
                <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Sports
                </p>
                {sportsMenu.map((sport) => (
                  <Link key={sport.href} href={sport.href}>
                    <Button
                      variant={location === sport.href ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {sport.label}
                    </Button>
                  </Link>
                ))}
              </div>
              <Link href="/create">
                <Button className="w-full mt-2" onClick={() => setMobileMenuOpen(false)}>
                  Create Tournament
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
