import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-12 px-6 py-16">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-6xl font-black tracking-tight sm:text-7xl">
          Kahuhu
        </h1>
        <p className="max-w-lg text-lg text-muted-foreground">
          A realtime quiz game you host from your browser. Make a quiz, share a
          room code, and race to answer.
        </p>
      </div>

      <div className="grid w-full max-w-xl grid-cols-1 gap-4 sm:grid-cols-3">
        <Link href="/create" className="contents">
          <Button size="lg" className="h-24 w-full text-base font-semibold">
            Create quiz
          </Button>
        </Link>
        <Link href="/host" className="contents">
          <Button
            size="lg"
            variant="secondary"
            className="h-24 w-full text-base font-semibold"
          >
            Host a room
          </Button>
        </Link>
        <Link href="/join" className="contents">
          <Button
            size="lg"
            variant="outline"
            className="h-24 w-full text-base font-semibold"
          >
            Join a room
          </Button>
        </Link>
      </div>
    </main>
  );
}
