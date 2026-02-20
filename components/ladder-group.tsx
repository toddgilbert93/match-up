import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import type { LadderEntry } from "@/lib/actions";

interface LadderGroupProps {
  record: string; // kept for backwards compatibility with callers
  entries: LadderEntry[];
}

export function LadderGroup({ entries }: LadderGroupProps) {
  const wins = entries[0].wins;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {wins} win{wins !== 1 ? "s" : ""}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {entries.map((entry) => (
            <Link
              key={entry.player.id}
              href={`/players/${entry.player.id}`}
              className="block p-2 rounded hover:bg-accent transition-colors"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {entry.player.name} ({entry.record})
                </span>
                <span className="text-sm text-muted-foreground">
                  {entry.totalMatches} match{entry.totalMatches !== 1 ? "es" : ""}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
