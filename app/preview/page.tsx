import { LadderGroup } from "@/components/ladder-group";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { LadderEntry } from "@/lib/actions";

// Mock ladder data: sorted by wins desc, then win% desc, then totalMatches desc
const MOCK_LADDER: LadderEntry[] = [
  { player: { id: 1, name: "Alex Chen", createdAt: new Date() }, wins: 8, losses: 1, record: "8-1", winPercentage: 8 / 9, totalMatches: 9 },
  { player: { id: 2, name: "Jordan Smith", createdAt: new Date() }, wins: 8, losses: 2, record: "8-2", winPercentage: 0.8, totalMatches: 10 },
  { player: { id: 3, name: "Sam Rivera", createdAt: new Date() }, wins: 6, losses: 2, record: "6-2", winPercentage: 0.75, totalMatches: 8 },
  { player: { id: 4, name: "Morgan Lee", createdAt: new Date() }, wins: 6, losses: 3, record: "6-3", winPercentage: 2 / 3, totalMatches: 9 },
  { player: { id: 5, name: "Casey Brown", createdAt: new Date() }, wins: 5, losses: 2, record: "5-2", winPercentage: 5 / 7, totalMatches: 7 },
  { player: { id: 6, name: "Riley Davis", createdAt: new Date() }, wins: 5, losses: 4, record: "5-4", winPercentage: 5 / 9, totalMatches: 9 },
  { player: { id: 7, name: "Quinn Wilson", createdAt: new Date() }, wins: 4, losses: 3, record: "4-3", winPercentage: 4 / 7, totalMatches: 7 },
  { player: { id: 8, name: "Taylor Kim", createdAt: new Date() }, wins: 4, losses: 4, record: "4-4", winPercentage: 0.5, totalMatches: 8 },
  { player: { id: 9, name: "Jamie Martinez", createdAt: new Date() }, wins: 3, losses: 2, record: "3-2", winPercentage: 0.6, totalMatches: 5 },
  { player: { id: 10, name: "Drew Johnson", createdAt: new Date() }, wins: 3, losses: 4, record: "3-4", winPercentage: 3 / 7, totalMatches: 7 },
  { player: { id: 11, name: "Skyler White", createdAt: new Date() }, wins: 2, losses: 2, record: "2-2", winPercentage: 0.5, totalMatches: 4 },
  { player: { id: 12, name: "Avery Clark", createdAt: new Date() }, wins: 2, losses: 5, record: "2-5", winPercentage: 2 / 7, totalMatches: 7 },
  { player: { id: 13, name: "Reese Adams", createdAt: new Date() }, wins: 1, losses: 3, record: "1-3", winPercentage: 0.25, totalMatches: 4 },
  { player: { id: 14, name: "Parker Evans", createdAt: new Date() }, wins: 1, losses: 5, record: "1-5", winPercentage: 1 / 6, totalMatches: 6 },
  { player: { id: 15, name: "Cameron Hall", createdAt: new Date() }, wins: 0, losses: 2, record: "0-2", winPercentage: 0, totalMatches: 2 },
  { player: { id: 16, name: "Dakota Young", createdAt: new Date() }, wins: 0, losses: 4, record: "0-4", winPercentage: 0, totalMatches: 4 },
];

export default function PreviewPage() {
  const ladder = MOCK_LADDER;

  // Group players by number of wins (same logic as homepage)
  const grouped = ladder.reduce((acc, entry) => {
    const key = entry.wins;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(entry);
    return acc;
  }, {} as Record<number, typeof ladder>);

  const groups = Object.entries(grouped)
    .map(([wins, entries]) => ({
      wins: Number(wins),
      entries,
    }))
    .sort((a, b) => b.wins - a.wins);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-2 text-sm text-amber-800 dark:text-amber-200">
        <strong>Preview:</strong> This page shows mock data. Player links may not exist.
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Ladder Standings</h1>
        <div className="flex gap-2">
          <Link href="/matches/new">
            <Button variant="outline">Submit Match</Button>
          </Link>
        </div>
      </div>

      <section className="rounded-lg border bg-muted/40 p-4">
        <h2 className="text-lg font-semibold mb-2">Rules</h2>
        <p className="text-muted-foreground text-sm">
          Add yourself and submit your match scores. Try to play everyone before
          challenging someone to a rematch. Rankings are determined by number
          of wins not win percentage to encourage more matches. And remember,
          have fun
        </p>
      </section>

      <div className="space-y-4">
        {groups.map((group) => (
          <LadderGroup
            key={group.wins}
            record={`${group.wins}`}
            entries={group.entries}
          />
        ))}
      </div>
    </div>
  );
}
