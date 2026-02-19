"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitMatch, getPlayers } from "@/lib/actions";
import type { Player } from "@/db/schema";

interface MatchFormProps {
  players: Player[];
}

export function MatchForm({ players: initialPlayers }: MatchFormProps) {
  const router = useRouter();
  const [player1Id, setPlayer1Id] = useState<string>("");
  const [player2Id, setPlayer2Id] = useState<string>("");
  const [set1P1, setSet1P1] = useState<string>("");
  const [set1P2, setSet1P2] = useState<string>("");
  const [set2P1, setSet2P1] = useState<string>("");
  const [set2P2, setSet2P2] = useState<string>("");
  const [set3P1, setSet3P1] = useState<string>("");
  const [set3P2, setSet3P2] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine if set 3 should be shown (each player won one set)
  const showSet3 =
    set1P1 &&
    set1P2 &&
    set2P1 &&
    set2P2 &&
    ((parseInt(set1P1) > parseInt(set1P2) &&
      parseInt(set2P1) < parseInt(set2P2)) ||
      (parseInt(set1P1) < parseInt(set1P2) && parseInt(set2P1) > parseInt(set2P2)));

  function validateForm(): boolean {
    const newErrors: Record<string, string> = {};

    if (!player1Id || !player2Id) {
      newErrors.players = "Please select both players";
    } else if (player1Id === player2Id) {
      newErrors.players = "Players must be different";
    }

    const s1P1 = parseInt(set1P1);
    const s1P2 = parseInt(set1P2);
    const s2P1 = parseInt(set2P1);
    const s2P2 = parseInt(set2P2);

    if (!set1P1 || !set1P2 || isNaN(s1P1) || isNaN(s1P2)) {
      newErrors.set1 = "Set 1 scores are required";
    } else if (s1P1 === s1P2) {
      newErrors.set1 = "Set 1 must have a winner";
    } else if (Math.max(s1P1, s1P2) < 6) {
      newErrors.set1 = "Set 1 winner must have at least 6 games";
    } else if (
      Math.max(s1P1, s1P2) === 6 &&
      Math.min(s1P1, s1P2) >= 5
    ) {
      newErrors.set1 = "Set 1 cannot be 6-5; must be 6-4 or 7-5";
    }

    if (!set2P1 || !set2P2 || isNaN(s2P1) || isNaN(s2P2)) {
      newErrors.set2 = "Set 2 scores are required";
    } else if (s2P1 === s2P2) {
      newErrors.set2 = "Set 2 must have a winner";
    } else if (Math.max(s2P1, s2P2) < 6) {
      newErrors.set2 = "Set 2 winner must have at least 6 games";
    } else if (
      Math.max(s2P1, s2P2) === 6 &&
      Math.min(s2P1, s2P2) >= 5
    ) {
      newErrors.set2 = "Set 2 cannot be 6-5; must be 6-4 or 7-5";
    }

    // Check if set 3 is needed
    const p1SetsWon =
      (s1P1 > s1P2 ? 1 : 0) + (s2P1 > s2P2 ? 1 : 0);
    if (p1SetsWon === 1 && showSet3) {
      const s3P1 = parseInt(set3P1);
      const s3P2 = parseInt(set3P2);
      if (!set3P1 || !set3P2 || isNaN(s3P1) || isNaN(s3P2)) {
        newErrors.set3 = "Set 3 tiebreaker scores are required";
      } else if (s3P1 === s3P2) {
        newErrors.set3 = "Set 3 must have a winner";
      } else {
        const winner = s3P1 > s3P2 ? s3P1 : s3P2;
        const loser = s3P1 > s3P2 ? s3P2 : s3P1;
        if (winner < 10) {
          newErrors.set3 = "Set 3 winner must reach 10 points";
        } else if (winner === 10 && loser >= 9) {
          newErrors.set3 = "Set 3 winner must win by at least 2 points";
        }
      }
    } else if (p1SetsWon !== 2 && p1SetsWon !== 0) {
      newErrors.general = "Match must be best of 3 sets";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const result = await submitMatch({
      player1Id: parseInt(player1Id),
      player2Id: parseInt(player2Id),
      set1P1: parseInt(set1P1),
      set1P2: parseInt(set1P2),
      set2P1: parseInt(set2P1),
      set2P2: parseInt(set2P2),
      set3P1: showSet3 ? parseInt(set3P1) : undefined,
      set3P2: showSet3 ? parseInt(set3P2) : undefined,
    });

    setIsSubmitting(false);

    if (result.success) {
      router.push("/");
      router.refresh();
    } else {
      alert(result.error || "Failed to submit match");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {errors.general && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
          {errors.general}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="player1">Player 1</Label>
          <Select value={player1Id} onValueChange={setPlayer1Id}>
            <SelectTrigger id="player1">
              <SelectValue placeholder="Select player" />
            </SelectTrigger>
            <SelectContent>
              {initialPlayers.map((player) => (
                <SelectItem key={player.id} value={player.id.toString()}>
                  {player.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="player2">Player 2</Label>
          <Select value={player2Id} onValueChange={setPlayer2Id}>
            <SelectTrigger id="player2">
              <SelectValue placeholder="Select player" />
            </SelectTrigger>
            <SelectContent>
              {initialPlayers.map((player) => (
                <SelectItem key={player.id} value={player.id.toString()}>
                  {player.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {errors.players && (
        <p className="text-sm text-destructive">{errors.players}</p>
      )}

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-3">Set 1</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="set1P1">
                {player1Id
                  ? initialPlayers.find((p) => p.id.toString() === player1Id)
                      ?.name || "Player 1"
                  : "Player 1"}
              </Label>
              <Input
                id="set1P1"
                type="number"
                min="0"
                value={set1P1}
                onChange={(e) => setSet1P1(e.target.value)}
                placeholder="Games"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="set1P2">
                {player2Id
                  ? initialPlayers.find((p) => p.id.toString() === player2Id)
                      ?.name || "Player 2"
                  : "Player 2"}
              </Label>
              <Input
                id="set1P2"
                type="number"
                min="0"
                value={set1P2}
                onChange={(e) => setSet1P2(e.target.value)}
                placeholder="Games"
              />
            </div>
          </div>
          {errors.set1 && (
            <p className="text-sm text-destructive mt-2">{errors.set1}</p>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Set 2</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="set2P1">
                {player1Id
                  ? initialPlayers.find((p) => p.id.toString() === player1Id)
                      ?.name || "Player 1"
                  : "Player 1"}
              </Label>
              <Input
                id="set2P1"
                type="number"
                min="0"
                value={set2P1}
                onChange={(e) => setSet2P1(e.target.value)}
                placeholder="Games"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="set2P2">
                {player2Id
                  ? initialPlayers.find((p) => p.id.toString() === player2Id)
                      ?.name || "Player 2"
                  : "Player 2"}
              </Label>
              <Input
                id="set2P2"
                type="number"
                min="0"
                value={set2P2}
                onChange={(e) => setSet2P2(e.target.value)}
                placeholder="Games"
              />
            </div>
          </div>
          {errors.set2 && (
            <p className="text-sm text-destructive mt-2">{errors.set2}</p>
          )}
        </div>

        {showSet3 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Set 3 (10-Point Tiebreaker)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="set3P1">
                  {player1Id
                    ? initialPlayers.find((p) => p.id.toString() === player1Id)
                        ?.name || "Player 1"
                    : "Player 1"}
                </Label>
                <Input
                  id="set3P1"
                  type="number"
                  min="0"
                  value={set3P1}
                  onChange={(e) => setSet3P1(e.target.value)}
                  placeholder="Points"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="set3P2">
                  {player2Id
                    ? initialPlayers.find((p) => p.id.toString() === player2Id)
                        ?.name || "Player 2"
                    : "Player 2"}
                </Label>
                <Input
                  id="set3P2"
                  type="number"
                  min="0"
                  value={set3P2}
                  onChange={(e) => setSet3P2(e.target.value)}
                  placeholder="Points"
                />
              </div>
            </div>
            {errors.set3 && (
              <p className="text-sm text-destructive mt-2">{errors.set3}</p>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Match"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
