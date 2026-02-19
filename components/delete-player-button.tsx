"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deletePlayer } from "@/lib/actions";

interface DeletePlayerButtonProps {
  playerId: number;
  playerName: string;
}

export function DeletePlayerButton({ playerId, playerName }: DeletePlayerButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (
      !confirm(
        `Are you sure you want to delete ${playerName}? All their matches will be removed.`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    const result = await deletePlayer(playerId);
    setIsDeleting(false);

    if (result.success) {
      router.push("/");
    } else {
      alert(result.error || "Failed to delete player");
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-muted-foreground hover:text-destructive"
    >
      <Trash2 className="h-4 w-4 mr-1.5" />
      {isDeleting ? "Deleting..." : "Delete player"}
    </Button>
  );
}
