import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { settingsStore, type Settings } from "@/lib/store";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — SignBridge AI" },
      { name: "description", content: "Configure speech, theme, language and camera settings." },
      { property: "og:title", content: "Settings — SignBridge AI" },
      { property: "og:description", content: "Personalize your SignBridge experience." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [s, setS] = useState<Settings | null>(null);

  useEffect(() => setS(settingsStore.get()), []);

  const update = (patch: Partial<Settings>) => {
    const next = settingsStore.set(patch);
    setS(next);
    if ("darkMode" in patch) document.documentElement.classList.toggle("dark", next.darkMode);
    toast.success("Saved");
  };

  if (!s) return null;

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <h1 className="text-3xl font-bold sm:text-4xl">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Preferences are saved locally in your browser.</p>

        <div className="mt-8 space-y-4">
          <Row title="Text-to-Speech" desc="Speak recognized signs aloud automatically.">
            <Switch checked={s.speech} onCheckedChange={(v) => update({ speech: v })} />
          </Row>
          <Row title="Dark mode" desc="Toggle between light and dark themes.">
            <Switch checked={s.darkMode} onCheckedChange={(v) => update({ darkMode: v })} />
          </Row>
          <Row title="Language" desc="Interface language (multilingual coming soon).">
            <Select value={s.language} onValueChange={(v) => update({ language: v as Settings["language"] })}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
              </SelectContent>
            </Select>
          </Row>
          <Row title="Camera resolution" desc="Higher resolution improves accuracy but uses more CPU.">
            <Select
              value={s.cameraResolution}
              onValueChange={(v) => update({ cameraResolution: v as Settings["cameraResolution"] })}
            >
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="480p">480p</SelectItem>
                <SelectItem value="720p">720p (recommended)</SelectItem>
                <SelectItem value="1080p">1080p</SelectItem>
              </SelectContent>
            </Select>
          </Row>
        </div>
      </div>
    </AppShell>
  );
}

function Row({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="card-elevated flex items-center justify-between gap-4 p-5">
      <div className="min-w-0">
        <Label className="text-sm font-semibold">{title}</Label>
        <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
