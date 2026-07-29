import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Trash2, Download, History as HistoryIcon } from "lucide-react";
import { historyStore, type HistoryEntry } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Conversation History — SignBridge AI" },
      { name: "description", content: "Review every sign you've translated." },
      { property: "og:title", content: "Conversation History — SignBridge AI" },
      { property: "og:description", content: "Your saved sign language translations." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [items, setItems] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setItems(historyStore.list());
  }, []);

  const clear = () => {
    historyStore.clear();
    setItems([]);
    toast.success("History cleared");
  };

  const download = () => {
    const rows = [["Time", "Gesture", "Text", "Confidence"], ...items.map((i) => [
      new Date(i.time).toISOString(), i.gesture, i.text, `${Math.round(i.confidence * 100)}%`,
    ])];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `signbridge-history-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
          <div className="min-w-0">
            <h1 className="truncate text-3xl font-bold sm:text-4xl">Conversation History</h1>
            <p className="mt-1 text-sm text-muted-foreground">{items.length} translation{items.length === 1 ? "" : "s"} saved locally.</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button variant="outline" onClick={download} disabled={!items.length}>
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
            <Button variant="destructive" onClick={clear} disabled={!items.length}>
              <Trash2 className="mr-2 h-4 w-4" /> Clear
            </Button>
          </div>
        </header>

        <div className="card-elevated mt-8 overflow-hidden">
          {items.length === 0 ? (
            <div className="grid place-items-center p-16 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary">
                <HistoryIcon className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="mt-4 font-medium">No history yet</p>
              <p className="mt-1 text-sm text-muted-foreground">Head to the translator to start signing.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 bg-muted/40 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <div>Time</div><div>Gesture</div><div>Text</div><div>Confidence</div>
              </div>
              {items.map((i) => (
                <div key={i.id} className="grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-4 px-6 py-3 text-sm">
                  <div className="text-muted-foreground">{new Date(i.time).toLocaleString()}</div>
                  <div className="font-semibold text-brand-gradient">{i.gesture}</div>
                  <div>{i.text}</div>
                  <div className="font-mono text-xs text-muted-foreground">{Math.round(i.confidence * 100)}%</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
