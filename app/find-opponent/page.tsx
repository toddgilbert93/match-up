import { getLadder } from "@/lib/actions";
import { FindOpponentWheel } from "@/components/find-opponent-wheel";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function FindOpponentPage() {
  const ladder = await getLadder();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="outline">← Back to Ladder</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Find an opponent</CardTitle>
        </CardHeader>
        <CardContent>
          <FindOpponentWheel entries={ladder} />
        </CardContent>
      </Card>
    </div>
  );
}
