"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteMatch } from "@/lib/actions";
import type { Player } from "@/db/schema";

interface Match {
  id: number;
  opponent: Player;
  set1P1: number;
  set1P2: number;
  set2P1: number;
  set2P2: number;
  set3P1: number | null;
  set3P2: number | null;
  winnerId: number;
  createdAt: Date;
  isPlayer1: boolean;
}

interface MatchTableProps {
  matches: Match[];
  currentPlayerId: number;
}

export function MatchTable({ matches, currentPlayerId }: MatchTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function handleDelete(matchId: number) {
    if (!confirm("Are you sure you want to delete this match?")) return;

    setDeletingId(matchId);
    const result = await deleteMatch(matchId);
    setDeletingId(null);

    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || "Failed to delete match");
    }
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No matches played yet.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Opponent</TableHead>
          <TableHead>Set 1</TableHead>
          <TableHead>Set 2</TableHead>
          <TableHead>Set 3</TableHead>
          <TableHead>Result</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {matches.map((match) => {
          const won = match.winnerId === currentPlayerId;
          const set1Score = match.isPlayer1
            ? `${match.set1P1}-${match.set1P2}`
            : `${match.set1P2}-${match.set1P1}`;
          const set2Score = match.isPlayer1
            ? `${match.set2P1}-${match.set2P2}`
            : `${match.set2P2}-${match.set2P1}`;
          const set3Score =
            match.set3P1 !== null && match.set3P2 !== null
              ? match.isPlayer1
                ? `${match.set3P1}-${match.set3P2}`
                : `${match.set3P2}-${match.set3P1}`
              : "-";

          return (
            <TableRow key={match.id}>
              <TableCell className="font-medium">
                {match.opponent.name}
              </TableCell>
              <TableCell>{set1Score}</TableCell>
              <TableCell>{set2Score}</TableCell>
              <TableCell>{set3Score}</TableCell>
              <TableCell>
                <span
                  className={
                    won
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {won ? "W" : "L"}
                </span>
              </TableCell>
              <TableCell>
                {new Date(match.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      disabled={deletingId === match.id}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive cursor-pointer"
                      onClick={() => handleDelete(match.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
