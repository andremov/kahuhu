"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function JoinPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  const canJoin = code.trim().length >= 4 && name.trim().length > 0;

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canJoin) return;
    const params = new URLSearchParams({ role: "player", name: name.trim() });
    router.push(`/room/${code.trim().toUpperCase()}?${params.toString()}`);
  };

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-8 px-6 py-12">
      <header>
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back
        </Link>
        <h1 className="mt-4 text-4xl font-black">Join a room</h1>
      </header>

      <form onSubmit={handleJoin} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="code">Room code</Label>
          <Input
            id="code"
            placeholder="XXXXXX"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="h-16 text-center text-3xl font-bold tracking-[0.3em] uppercase"
            maxLength={8}
            autoComplete="off"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Your name</Label>
          <Input
            id="name"
            placeholder="e.g. Alex"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12"
            autoComplete="off"
          />
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={!canJoin}
          className="h-14 text-base"
        >
          Join
        </Button>
      </form>
    </main>
  );
}
