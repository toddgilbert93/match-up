import { getPlayers } from "@/lib/actions";
import { MatchForm } from "@/components/match-form";

export default async function NewMatchPage() {
  const players = await getPlayers();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Submit Match</h1>
      {players.length < 2 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg mb-2">Not enough players</p>
          <p>You need at least 2 players to submit a match.</p>
        </div>
      ) : (
        <MatchForm players={players} />
      )}
    </div>
  );
}
