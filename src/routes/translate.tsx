import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, CameraOff, Volume2, VolumeX, Loader2, Sparkles } from "lucide-react";
import { recognizeGesture, SUPPORTED_GESTURES, type Landmark } from "@/lib/gestures";
import { historyStore, statsStore, settingsStore } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/translate")({
  head: () => ({
    meta: [
      { title: "Live Translator — SignBridge AI" },
      { name: "description", content: "Real-time sign language translation using your webcam." },
      { property: "og:title", content: "Live Translator — SignBridge AI" },
      { property: "og:description", content: "Turn hand gestures into text and speech instantly." },
    ],
  }),
  component: TranslatePage,
});

const RES_MAP = {
  "480p": { width: 640, height: 480 },
  "720p": { width: 1280, height: 720 },
  "1080p": { width: 1920, height: 1080 },
} as const;

function TranslatePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const landmarkerRef = useRef<any>(null);
  const rafRef = useRef<number>(0);
  const lastSpokenRef = useRef<{ text: string; t: number }>({ text: "", t: 0 });
  const lastLoggedRef = useRef<{ text: string; t: number }>({ text: "", t: 0 });

  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);
  const [muted, setMuted] = useState(false);
  const [current, setCurrent] = useState<{ text: string; name: string; confidence: number } | null>(null);
  const [status, setStatus] = useState("Idle");
  const [transcript, setTranscript] = useState<string[]>([]);

  const speak = useCallback((text: string) => {
    if (muted || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1;
    u.pitch = 1;
    window.speechSynthesis.speak(u);
  }, [muted]);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setActive(false);
    setStatus("Stopped");
  }, []);

  const start = useCallback(async () => {
    setLoading(true);
    setStatus("Loading model…");
    try {
      const { HandLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm",
      );
      const landmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 1,
      });
      landmarkerRef.current = landmarker;

      setStatus("Starting camera…");
      const res = RES_MAP[settingsStore.get().cameraResolution];
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: res.width, height: res.height, facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      const video = videoRef.current!;
      video.srcObject = stream;
      await video.play();

      statsStore.incrementSession();
      setActive(true);
      setStatus("Live — show a sign");
      loop();
    } catch (err) {
      console.error(err);
      toast.error("Couldn't start camera. Please allow camera access.");
      setStatus("Error");
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loop = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const landmarker = landmarkerRef.current;
    if (!video || !canvas || !landmarker) return;

    const process = () => {
      if (!videoRef.current || !streamRef.current) return;
      const w = video.videoWidth;
      const h = video.videoHeight;
      if (w && h) {
        if (canvas.width !== w) { canvas.width = w; canvas.height = h; }
        const ctx = canvas.getContext("2d")!;
        ctx.save();
        ctx.clearRect(0, 0, w, h);
        // mirror
        ctx.translate(w, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, w, h);
        ctx.restore();

        const result = landmarker.detectForVideo(video, performance.now());
        if (result?.landmarks?.length) {
          const lms = result.landmarks[0] as Landmark[];
          drawLandmarks(ctx, lms, w, h);
          const match = recognizeGesture(lms);
          if (match) {
            setCurrent(match);
            setStatus("Recognized Successfully");
            const now = Date.now();
            // Debounce logging + speech: same gesture must be stable, and re-trigger only after 1.5s
            if (
              lastLoggedRef.current.text !== match.text ||
              now - lastLoggedRef.current.t > 1500
            ) {
              lastLoggedRef.current = { text: match.text, t: now };
              historyStore.add({
                id: `${now}-${Math.random().toString(36).slice(2, 7)}`,
                time: now,
                gesture: match.name,
                text: match.text,
                confidence: match.confidence,
              });
              statsStore.incrementGesture(match.confidence);
              setTranscript((prev) => [...prev.slice(-20), match.text]);
              if (lastSpokenRef.current.text !== match.text || now - lastSpokenRef.current.t > 1500) {
                lastSpokenRef.current = { text: match.text, t: now };
                speak(match.text);
              }
            }
          } else {
            setStatus("Hand detected — no match");
          }
        } else {
          setStatus("Show your hand");
        }
      }
      rafRef.current = requestAnimationFrame(process);
    };
    rafRef.current = requestAnimationFrame(process);
  }, [speak]);

  useEffect(() => () => stop(), [stop]);

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
          <div className="min-w-0">
            <h1 className="truncate text-3xl font-bold sm:text-4xl">Live Translator</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Grant camera access, then sign one of the supported gestures below.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            {active ? (
              <Button variant="destructive" onClick={stop}>
                <CameraOff className="mr-2 h-4 w-4" /> Stop
              </Button>
            ) : (
              <Button
                onClick={start}
                disabled={loading}
                className="bg-brand-gradient glow-brand text-white hover:opacity-90"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
                {loading ? "Loading…" : "Start Camera"}
              </Button>
            )}
          </div>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Video */}
          <div className="lg:col-span-2">
            <div className="card-elevated relative aspect-video overflow-hidden bg-black">
              <video ref={videoRef} playsInline muted className="hidden" />
              <canvas ref={canvasRef} className="h-full w-full object-cover" />
              {!active && (
                <div className="absolute inset-0 grid place-items-center bg-gradient-to-b from-black/60 to-black/80 text-center">
                  <div>
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-gradient glow-brand">
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                    <p className="mt-4 text-white/80">Camera is off</p>
                    <p className="mt-1 text-xs text-white/50">Click "Start Camera" to begin</p>
                  </div>
                </div>
              )}
              <div className="absolute left-4 top-4 flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${active ? "bg-emerald-400 animate-pulse" : "bg-white/40"}`} />
                <span className="text-xs font-medium text-white/90">{status}</span>
              </div>
            </div>

            {/* Transcript */}
            <div className="card-elevated mt-6 p-6">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="h-4 w-4 text-brand-gradient" /> Recognized Text
              </div>
              <div className="mt-3 min-h-16 rounded-xl bg-muted/40 p-4 text-lg leading-relaxed">
                {transcript.length ? transcript.join(" · ") : (
                  <span className="text-muted-foreground">Your translations will appear here…</span>
                )}
              </div>
            </div>
          </div>

          {/* Panel */}
          <div className="space-y-6">
            <div className="card-elevated p-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Current Gesture
              </div>
              <div className="mt-3 font-display text-4xl font-bold text-brand-gradient">
                {current?.name ?? "—"}
              </div>
              <div className="mt-6 space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Confidence</span>
                    <span className="font-mono">{current ? `${Math.round(current.confidence * 100)}%` : "0%"}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-brand-gradient transition-all duration-300"
                      style={{ width: `${(current?.confidence ?? 0) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium">{status}</span>
                </div>
              </div>
            </div>

            <div className="card-elevated p-6">
              <div className="text-sm font-semibold">Supported gestures</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {SUPPORTED_GESTURES.map((g) => (
                  <Badge key={g.name} variant="secondary" className="text-xs">{g.name}</Badge>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Tip: hold the sign steady for ~1 second in good lighting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

// Draw hand skeleton — MediaPipe hand connections
const CONNECTIONS: [number, number][] = [
  [0,1],[1,2],[2,3],[3,4],
  [0,5],[5,6],[6,7],[7,8],
  [5,9],[9,10],[10,11],[11,12],
  [9,13],[13,14],[14,15],[15,16],
  [13,17],[17,18],[18,19],[19,20],[0,17],
];
function drawLandmarks(ctx: CanvasRenderingContext2D, lms: Landmark[], w: number, h: number) {
  ctx.save();
  // Landmarks come from the un-mirrored video; canvas is mirrored via transform above,
  // but we've reset with save/restore. Mirror x manually here.
  const px = (p: Landmark) => (1 - p.x) * w;
  const py = (p: Landmark) => p.y * h;
  ctx.strokeStyle = "rgba(147, 197, 253, 0.9)";
  ctx.lineWidth = 3;
  for (const [a, b] of CONNECTIONS) {
    ctx.beginPath();
    ctx.moveTo(px(lms[a]), py(lms[a]));
    ctx.lineTo(px(lms[b]), py(lms[b]));
    ctx.stroke();
  }
  ctx.fillStyle = "#a78bfa";
  for (const p of lms) {
    ctx.beginPath();
    ctx.arc(px(p), py(p), 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
