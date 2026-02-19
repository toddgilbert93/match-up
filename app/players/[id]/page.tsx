import { getPlayerWithMatches, getLadder } from "@/lib/actions";
import { MatchTable } from "@/components/match-table";
import { DeletePlayerButton } from "@/components/delete-player-button";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function PlayerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const playerId = parseInt(params.id);
  if (isNaN(playerId)) {
    notFound();
  }

  const playerData = await getPlayerWithMatches(playerId);
  if (!playerData) {
    notFound();
  }

  const ladder = await getLadder();
  const playerStats = ladder.find((entry) => entry.player.id === playerId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="outline">← Back to Ladder</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{playerData.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {playerStats && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Record</div>
                <div className="text-2xl font-bold">{playerStats.record}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Win Percentage
                </div>
                <div className="text-2xl font-bold">
                  {(playerStats.winPercentage * 100).toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Total Matches
                </div>
                <div className="text-2xl font-bold">
                  {playerStats.totalMatches}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Match History</CardTitle>
        </CardHeader>
        <CardContent>
          <MatchTable matches={playerData.matches} currentPlayerId={playerId} />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <DeletePlayerButton
          playerId={playerData.id}
          playerName={playerData.name}
        />
      </div>
    </div>
  );
}
