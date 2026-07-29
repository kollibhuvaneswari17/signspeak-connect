import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Hand, Home, Camera, History, BarChart3, Settings as SettingsIcon, Moon, Sun } from "lucide-react";
import { settingsStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/translate", label: "Translate", icon: Camera },
  { to: "/history", label: "History", icon: History },
  { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const s = settingsStore.get();
    setDark(s.darkMode);
    document.documentElement.classList.toggle("dark", s.darkMode);
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    settingsStore.set({ darkMode: next });
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient glow-brand">
              <Hand className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-lg font-bold tracking-tight">
              SignBridge <span className="text-brand-gradient">AI</span>
            </span>
          </Link>
          <nav className="ml-auto hidden items-center gap-1 md:flex">
            {nav.map((item) => {
              const active = pathname === item.to;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button
            onClick={toggleDark}
            aria-label="Toggle theme"
            className="ml-auto grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground hover:bg-secondary md:ml-2"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
        {/* mobile nav */}
        <nav className="flex items-center gap-1 overflow-x-auto border-t border-border/60 px-2 py-2 md:hidden">
          {nav.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium",
                  active ? "bg-secondary text-foreground" : "text-muted-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
