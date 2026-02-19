import { getLadder } from "@/lib/actions";
import { LadderGroup } from "@/components/ladder-group";
import { AddPlayerDialog } from "@/components/add-player-dialog";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const ladder = await getLadder();

  // Group players by record
  const grouped = ladder.reduce((acc, entry) => {
    if (!acc[entry.record]) {
      acc[entry.record] = [];
    }
    acc[entry.record].push(entry);
    return acc;
  }, {} as Record<string, typeof ladder>);

  const groups = Object.entries(grouped).map(([record, entries]) => ({
    record,
    entries,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Ladder Standings</h1>
        <div className="flex gap-2">
          <Link href="/matches/new">
            <Button variant="outline">Submit Match</Button>
          </Link>
          <AddPlayerDialog />
        </div>
      </div>

      <section className="rounded-lg border bg-muted/40 p-4">
        <h2 className="text-lg font-semibold mb-2">Rules</h2>
        <p className="text-muted-foreground text-sm">
          Add yourself and submit your match scores. Try to play 
          everyone before challenging someone to a rematch. Rankings are determined by number of wins not win percentage to encourage more matches. And remember, have fun
        </p>
      </section>

      {ladder.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg mb-2">No players yet</p>
          <p>Add a player to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <LadderGroup
              key={group.record}
              record={group.record}
              entries={group.entries}
            />
          ))}
        </div>
      )}
    </div>
  );
}
