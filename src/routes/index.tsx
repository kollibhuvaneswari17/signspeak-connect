import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import {
  Camera, Cpu, Sparkles, Globe2, Zap, Accessibility, ArrowRight, Hand,
  Waves, Mic2, Database, Layers,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SignBridge AI — Real-Time Sign Language Translator" },
      { name: "description", content: "AI-powered real-time sign language to text & speech translator. Built for accessibility, aligned with SDG 9." },
      { property: "og:title", content: "SignBridge AI — Real-Time Sign Language Translator" },
      { property: "og:description", content: "Bridge communication gaps with real-time AI sign language translation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <AppShell>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-20%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-brand-gradient opacity-30 blur-3xl" />
          <div className="absolute right-[-10%] top-[30%] h-[400px] w-[400px] rounded-full bg-accent/40 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-brand-gradient" />
              SDG 9 Innovation Hackathon Project
            </div>
            <h1 className="mt-6 font-display text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              Sign language,
              <br />
              <span className="text-brand-gradient">translated in real time.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              SignBridge AI uses computer vision and deep learning to turn hand gestures into text and speech —
              instantly. Bridging conversations between the hearing-impaired and the world.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="bg-brand-gradient glow-brand text-white hover:opacity-90">
                <Link to="/translate">
                  <Camera className="mr-2 h-5 w-5" /> Start Translation
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/dashboard">
                  View Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Preview card */}
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="card-elevated overflow-hidden p-2">
              <div className="grid gap-2 rounded-xl bg-muted/30 p-6 sm:grid-cols-3">
                {[
                  { label: "Current Gesture", value: "HELLO", accent: true },
                  { label: "Confidence", value: "97%" },
                  { label: "Status", value: "Recognized" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl bg-card p-5">
                    <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {s.label}
                    </div>
                    <div className={`mt-2 font-display text-3xl font-bold ${s.accent ? "text-brand-gradient" : ""}`}>
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About + SDG */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="card-elevated p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
              <Hand className="h-3.5 w-3.5" /> About the project
            </div>
            <h2 className="mt-4 text-3xl font-bold">Communication, without barriers</h2>
            <p className="mt-4 text-muted-foreground">
              Over 70 million people worldwide use sign language as their primary means of communication.
              SignBridge AI closes the gap with instant, on-device gesture recognition — no interpreter required.
            </p>
          </div>
          <div className="card-elevated relative overflow-hidden p-8">
            <div className="absolute inset-0 -z-10 bg-brand-gradient opacity-10" />
            <div className="inline-flex items-center gap-2 rounded-full bg-background/70 px-3 py-1 text-xs font-semibold backdrop-blur">
              <Globe2 className="h-3.5 w-3.5" /> SDG 9 Objective
            </div>
            <h2 className="mt-4 text-3xl font-bold">Industry, Innovation & Infrastructure</h2>
            <p className="mt-4 text-muted-foreground">
              Building inclusive, resilient AI infrastructure that empowers every person — supporting SDG 9,
              SDG 10 (Reduced Inequalities) and SDG 4 (Quality Education).
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="text-center">
          <h2 className="text-4xl font-bold">Features</h2>
          <p className="mt-3 text-muted-foreground">Everything you need for real-time signing.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Camera, title: "Live Camera Detection", desc: "Real-time hand landmark tracking with MediaPipe." },
            { icon: Cpu, title: "AI Gesture Recognition", desc: "Neural classifier maps landmarks to signs instantly." },
            { icon: Mic2, title: "Text-to-Speech", desc: "Speak recognized signs aloud with one click." },
            { icon: Database, title: "Conversation History", desc: "Every translation saved and searchable." },
            { icon: Accessibility, title: "Accessible by Design", desc: "Dark mode, keyboard-first, screen-reader friendly." },
            { icon: Zap, title: "Blazing Fast", desc: "Runs entirely in the browser — no server round-trip." },
          ].map((f) => (
            <div key={f.title} className="card-elevated group p-6 transition-transform hover:-translate-y-1">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-gradient glow-brand">
                <f.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="card-elevated p-10">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-brand-gradient" />
            <h2 className="text-3xl font-bold">Powered by</h2>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              "React 19", "TanStack Start", "Tailwind CSS v4", "MediaPipe Hands",
              "TensorFlow.js Ready", "Web Speech API", "OpenCV Pipeline", "FastAPI Ready", "SQLite",
            ].map((t) => (
              <span key={t} className="rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm font-medium">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 pb-24 text-center sm:px-6">
        <div className="card-elevated relative overflow-hidden p-12">
          <div className="absolute inset-0 -z-10 bg-brand-gradient opacity-15" />
          <Waves className="mx-auto h-10 w-10 text-brand-gradient" />
          <h2 className="mt-4 text-4xl font-bold">Ready to bridge the conversation?</h2>
          <p className="mt-3 text-muted-foreground">Try the live translator — no signup required.</p>
          <Button asChild size="lg" className="mt-8 bg-brand-gradient glow-brand text-white hover:opacity-90">
            <Link to="/translate">
              <Camera className="mr-2 h-5 w-5" /> Launch Translator
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        SignBridge AI · Built for SDG 9 · {new Date().getFullYear()}
      </footer>
    </AppShell>
  );
}
