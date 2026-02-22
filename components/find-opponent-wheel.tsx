"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getOpponentIds } from "@/lib/actions";
import type { LadderEntry } from "@/lib/actions";

type Props = { entries: LadderEntry[] };

export function FindOpponentWheel({ entries }: Props) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [opponentIds, setOpponentIds] = useState<number[]>([]);
  const [loadingOpponents, setLoadingOpponents] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [counterIndex, setCounterIndex] = useState(0);
  const [winner, setWinner] = useState<LadderEntry | null>(null);

  const selectedId = selectedPlayerId ? Number(selectedPlayerId) : null;
  const excludeIds = new Set(selectedId ? [selectedId, ...opponentIds] : []);
  const eligibleEntries = entries.filter((e) => !excludeIds.has(e.player.id));

  useEffect(() => {
    if (!selectedId) {
      setOpponentIds([]);
      return;
    }
    let cancelled = false;
    setLoadingOpponents(true);
    getOpponentIds(selectedId).then((ids) => {
      if (!cancelled) {
        setOpponentIds(ids);
        setLoadingOpponents(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const n = eligibleEntries.length;

  const PAUSE_ON_WINNER_MS = 700;

  const spin = useCallback(() => {
    if (n < 2 || spinning) return;
    setSpinning(true);
    setWinner(null);

    const targetIndex = Math.floor(Math.random() * n);
    const duration = 3200;
    const startTime = performance.now();

    const scheduleTick = () => {
      const elapsed = performance.now() - startTime;
      if (elapsed >= duration) {
        setCounterIndex(targetIndex);
        window.setTimeout(() => {
          setWinner(eligibleEntries[targetIndex]);
          setSpinning(false);
        }, PAUSE_ON_WINNER_MS);
        return;
      }
      const progress = elapsed / duration;
      const eased = 1 - (1 - progress) ** 2;
      setCounterIndex((prev) => (prev + 1) % n);
      const nextDelay = Math.max(40, 180 - Math.floor(eased * 160));
      setTimeout(scheduleTick, nextDelay);
    };
    setTimeout(scheduleTick, 60);
  }, [eligibleEntries, n, spinning]);

  // Clear winner when selection or eligible list changes
  useEffect(() => {
    setWinner(null);
  }, [selectedPlayerId, eligibleEntries.length]);

  if (entries.length === 0) {
    return (
      <div className="rounded-lg border bg-muted/40 p-8 text-center text-muted-foreground">
        <p className="text-lg">No players on the ladder yet.</p>
        <p className="mt-1">Add players to spin for an opponent.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-8">
      <div className="w-full max-w-md space-y-2">
        <Label htmlFor="who-are-you">Find available opponents</Label>
        <div className="flex flex-nowrap items-center gap-2">
          <Select
            value={selectedPlayerId ?? ""}
            onValueChange={(v) => setSelectedPlayerId(v || null)}
          >
            <SelectTrigger id="who-are-you" className="w-[240px] shrink-0">
              <SelectValue placeholder="Select yourself on the ladder" />
            </SelectTrigger>
            <SelectContent>
              {entries.map((entry) => (
                <SelectItem key={entry.player.id} value={String(entry.player.id)}>
                  {entry.player.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size="sm"
            onClick={spin}
            disabled={!selectedId || loadingOpponents || n < 2 || spinning || !!winner}
            className="shrink-0"
          >
            {spinning ? "Picking…" : "Pick random opponent"}
          </Button>
        </div>
        <p className="min-h-[1.25rem] text-xs text-muted-foreground">
          {!selectedId
            ? " "
            : loadingOpponents
              ? "Loading…"
              : `${eligibleEntries.length} opponent${eligibleEntries.length === 1 ? "" : "s"} you haven't played`}
        </p>
      </div>

      <div className="w-full max-w-sm min-h-[220px] flex flex-col items-start justify-start">
        {!selectedId ? (
          <div className="rounded-lg border-2 border-border bg-muted/60 px-6 py-5 font-mono text-2xl tabular-nums tracking-tight text-foreground shadow-[inset_0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] w-full">
            <div className="min-h-[2.5rem] text-left text-muted-foreground">—</div>
          </div>
        ) : selectedId && loadingOpponents ? (
          <div className="rounded-lg border-2 border-border bg-muted/60 px-6 py-5 font-mono text-2xl tabular-nums tracking-tight text-foreground shadow-[inset_0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] w-full">
            <div className="min-h-[2.5rem] text-left text-muted-foreground">—</div>
          </div>
        ) : eligibleEntries.length === 0 ? (
          <div className="rounded-lg border bg-muted/40 p-8 text-left text-muted-foreground w-full">
            <p className="text-lg">You've played everyone on the ladder.</p>
            <p className="mt-1">Challenge someone to a rematch!</p>
          </div>
        ) : eligibleEntries.length === 1 ? (
          <div className="w-full rounded-lg border bg-muted/40 p-4 text-left">
            <p className="text-sm text-muted-foreground">Only one opponent left you haven't played</p>
            <p className="mt-1 text-2xl font-bold">{eligibleEntries[0].player.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {eligibleEntries[0].record}
            </p>
            <div className="mt-4 flex justify-start gap-2">
              <Link href={`/players/${eligibleEntries[0].player.id}`}>
                <Button variant="outline" size="sm">View profile</Button>
              </Link>
            </div>
          </div>
        ) : winner && !spinning ? (
          <div
            key="result"
            className="w-full animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300 rounded-lg border-2 border-border bg-muted/40 p-5 text-center shadow-sm"
          >
            <p className="text-sm text-muted-foreground">Your opponent</p>
            <p className="mt-1 text-2xl font-bold">{winner.player.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {winner.record}
            </p>
            <div className="mt-5 flex justify-center">
              <Link href={`/players/${winner.player.id}`}>
                <Button variant="outline" size="sm">
                  View profile
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div
            key="picker"
            className="rounded-lg border-2 border-border bg-muted/60 px-6 py-5 font-mono text-2xl tabular-nums tracking-tight text-foreground shadow-[inset_0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] w-full"
            aria-live="polite"
            aria-busy={spinning}
          >
            <div className="min-h-[2.5rem] truncate text-left">
              {spinning
                ? eligibleEntries[counterIndex]?.player.name ?? "—"
                : "—"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
