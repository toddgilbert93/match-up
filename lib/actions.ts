"use server";

import { db } from "@/db";
import { players, matches, type NewPlayer, type NewMatch } from "@/db/schema";
import { eq, and, or, desc, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createPlayer(name: string) {
  try {
    const result = await db.insert(players).values({ name }).returning();
    revalidatePath("/");
    return { success: true, player: result[0] };
  } catch (error: any) {
    if (error.message?.includes("unique constraint") || error.message?.includes("duplicate key")) {
      return { success: false, error: "Player name already exists" };
    }
    return { success: false, error: "Failed to create player" };
  }
}

export async function getPlayers() {
  return await db.select().from(players).orderBy(players.name);
}

export async function getPlayerWithMatches(id: number) {
  const [player] = await db
    .select()
    .from(players)
    .where(eq(players.id, id))
    .limit(1);

  if (!player) {
    return null;
  }

  // Get all matches where this player is player1 or player2
  const matchesAsPlayer1 = await db
    .select()
    .from(matches)
    .where(eq(matches.player1Id, id))
    .orderBy(desc(matches.createdAt));

  const matchesAsPlayer2 = await db
    .select()
    .from(matches)
    .where(eq(matches.player2Id, id))
    .orderBy(desc(matches.createdAt));

  // Get opponent info for all matches
  const allPlayerIds = new Set<number>();
  matchesAsPlayer1.forEach((m) => allPlayerIds.add(m.player2Id));
  matchesAsPlayer2.forEach((m) => allPlayerIds.add(m.player1Id));

  const opponentMap = new Map<number, typeof players.$inferSelect>();
  if (allPlayerIds.size > 0) {
    const opponentIds = Array.from(allPlayerIds);
    const opponents = await db
      .select()
      .from(players)
      .where(inArray(players.id, opponentIds));
    opponents.forEach((p) => opponentMap.set(p.id, p));
  }

  // Combine and format matches
  const allMatches = [
    ...matchesAsPlayer1.map((m) => ({
      id: m.id,
      opponent: opponentMap.get(m.player2Id)!,
      set1P1: m.set1P1,
      set1P2: m.set1P2,
      set2P1: m.set2P1,
      set2P2: m.set2P2,
      set3P1: m.set3P1,
      set3P2: m.set3P2,
      winnerId: m.winnerId,
      createdAt: m.createdAt,
      isPlayer1: true,
    })),
    ...matchesAsPlayer2.map((m) => ({
      id: m.id,
      opponent: opponentMap.get(m.player1Id)!,
      set1P1: m.set1P1,
      set1P2: m.set1P2,
      set2P1: m.set2P1,
      set2P2: m.set2P2,
      set3P1: m.set3P1,
      set3P2: m.set3P2,
      winnerId: m.winnerId,
      createdAt: m.createdAt,
      isPlayer1: false,
    })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return {
    ...player,
    matches: allMatches,
  };
}

export type LadderEntry = {
  player: typeof players.$inferSelect;
  wins: number;
  losses: number;
  record: string;
  winPercentage: number;
  totalMatches: number;
};

export async function getLadder(): Promise<LadderEntry[]> {
  const allPlayers = await getPlayers();
  const allMatches = await db.select().from(matches);

  const playerStats = new Map<
    number,
    { wins: number; losses: number; player: typeof players.$inferSelect }
  >();

  // Initialize all players
  for (const player of allPlayers) {
    playerStats.set(player.id, { wins: 0, losses: 0, player });
  }

  // Count wins and losses
  for (const match of allMatches) {
    const p1Stats = playerStats.get(match.player1Id);
    const p2Stats = playerStats.get(match.player2Id);

    if (p1Stats && p2Stats) {
      if (match.winnerId === match.player1Id) {
        p1Stats.wins++;
        p2Stats.losses++;
      } else {
        p2Stats.wins++;
        p1Stats.losses++;
      }
    }
  }

  // Convert to array and calculate records
  const ladder: LadderEntry[] = Array.from(playerStats.values()).map(
    (stats) => {
      const totalMatches = stats.wins + stats.losses;
      const winPercentage =
        totalMatches > 0 ? stats.wins / totalMatches : 0;
      return {
        player: stats.player,
        wins: stats.wins,
        losses: stats.losses,
        record: `${stats.wins}-${stats.losses}`,
        winPercentage,
        totalMatches,
      };
    }
  );

  // Sort by win percentage descending, then by total matches descending
  ladder.sort((a, b) => {
    if (b.winPercentage !== a.winPercentage) {
      return b.winPercentage - a.winPercentage;
    }
    return b.totalMatches - a.totalMatches;
  });

  return ladder;
}

export async function deleteMatch(matchId: number) {
  try {
    const [match] = await db
      .select()
      .from(matches)
      .where(eq(matches.id, matchId))
      .limit(1);

    if (!match) {
      return { success: false, error: "Match not found" };
    }

    await db.delete(matches).where(eq(matches.id, matchId));

    revalidatePath("/");
    revalidatePath(`/players/${match.player1Id}`);
    revalidatePath(`/players/${match.player2Id}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete match" };
  }
}

export async function submitMatch(data: {
  player1Id: number;
  player2Id: number;
  set1P1: number;
  set1P2: number;
  set2P1: number;
  set2P2: number;
  set3P1?: number;
  set3P2?: number;
}) {
  // Determine winner
  let winnerId: number;
  const p1SetsWon =
    (data.set1P1 > data.set1P2 ? 1 : 0) +
    (data.set2P1 > data.set2P2 ? 1 : 0) +
    (data.set3P1 && data.set3P2 && data.set3P1 > data.set3P2 ? 1 : 0);

  if (p1SetsWon >= 2) {
    winnerId = data.player1Id;
  } else {
    winnerId = data.player2Id;
  }

  try {
    const result = await db
      .insert(matches)
      .values({
        player1Id: data.player1Id,
        player2Id: data.player2Id,
        set1P1: data.set1P1,
        set1P2: data.set1P2,
        set2P1: data.set2P1,
        set2P2: data.set2P2,
        set3P1: data.set3P1,
        set3P2: data.set3P2,
        winnerId,
      })
      .returning();

    revalidatePath("/");
    revalidatePath(`/players/${data.player1Id}`);
    revalidatePath(`/players/${data.player2Id}`);
    return { success: true, match: result[0] };
  } catch (error) {
    return { success: false, error: "Failed to submit match" };
  }
}
