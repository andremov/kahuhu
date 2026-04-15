"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LogIn, MonitorPlay, Sparkles } from "lucide-react";

const CARDS = [
  {
    href: "/create",
    icon: Sparkles,
    title: "Create",
    subtitle: "Build a quiz and export it as JSON.",
    accent: "from-primary/30 to-primary/5",
    iconClass: "text-primary",
  },
  {
    href: "/host",
    icon: MonitorPlay,
    title: "Host",
    subtitle: "Drop a quiz JSON and start a room.",
    accent: "from-accent/30 to-accent/5",
    iconClass: "text-accent",
  },
  {
    href: "/join",
    icon: LogIn,
    title: "Join",
    subtitle: "Enter a 6-letter code to play.",
    accent: "from-answer-3/30 to-answer-3/5",
    iconClass: "text-answer-3",
  },
] as const;

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-16 px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center gap-5 text-center"
      >
        <h1 className="font-display text-7xl font-bold tracking-tight sm:text-8xl md:text-9xl">
          <span className="kahuhu-glow bg-gradient-to-r from-primary via-accent to-answer-3 bg-clip-text text-transparent">
            Kahuhu
          </span>
        </h1>
        <p className="max-w-lg font-display text-lg text-muted-foreground sm:text-xl">
          A realtime quiz game show. Make a quiz, share a room code, race to
          answer.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
        }}
        className="grid w-full max-w-4xl grid-cols-1 gap-5 sm:grid-cols-3"
      >
        {CARDS.map(({ href, icon: Icon, title, subtitle, accent, iconClass }) => (
          <motion.div
            key={href}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Link
              href={href}
              className="group relative block h-full overflow-hidden rounded-3xl border border-white/10 bg-card/60 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-2xl hover:shadow-primary/20"
            >
              <div
                className={`absolute inset-0 -z-10 bg-gradient-to-br ${accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />
              <div className="flex h-full flex-col items-start gap-4">
                <div
                  className={`flex size-14 items-center justify-center rounded-2xl bg-white/5 ${iconClass} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}
                >
                  <Icon className="size-7" strokeWidth={2.5} />
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="font-display text-3xl font-bold">{title}</h2>
                  <p className="text-sm text-muted-foreground">{subtitle}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
}
