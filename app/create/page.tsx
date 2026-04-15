"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Download,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ANSWER_BG_CLASS,
  ANSWER_LETTERS,
  ANSWER_SHAPES,
  ShapeIcon,
} from "@/components/ui/shape-icon";
import { useEditorStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const DOT_COLORS = [
  "bg-answer-1",
  "bg-answer-2",
  "bg-answer-3",
  "bg-answer-4",
];

const TIME_OPTIONS = [10, 20, 30, 60];

export default function CreatePage() {
  const {
    title,
    description,
    questions,
    setTitle,
    setDescription,
    addQuestion,
    removeQuestion,
    updateQuestion,
    toggleOption,
    updateOption,
    reset,
    build,
  } = useEditorStore();

  const canExport =
    title.trim().length > 0 &&
    questions.length > 0 &&
    questions.every(
      (q) =>
        q.statement.trim().length > 0 &&
        q.options.filter((o) => o.enabled && o.text.trim().length > 0).length >=
          2 &&
        q.options.some(
          (o) => o.enabled && o.text.trim().length > 0 && o.points > 0,
        ),
    );

  const handleExport = () => {
    const quiz = build();
    const blob = new Blob([JSON.stringify(quiz, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${quiz.title.toLowerCase().replace(/\s+/g, "-") || "quiz"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-12">
      <header className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1 font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back
        </Link>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={reset} size="lg">
            Clear
          </Button>
          <Button
            size="lg"
            disabled={!canExport}
            onClick={handleExport}
            className="gap-2 rounded-full bg-primary font-display font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
          >
            <Download className="size-4" />
            Export
          </Button>
        </div>
      </header>

      <div>
        <h1 className="font-display text-5xl font-bold">Create quiz</h1>
        <p className="mt-2 text-muted-foreground">
          Build questions, mark correct answers, export as JSON.
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-card/40 p-6 backdrop-blur-xl">
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="title"
            className="font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground"
          >
            Title
          </Label>
          <Input
            id="title"
            placeholder="Quiz title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-12 font-display text-xl font-bold"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="description"
            className="font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground"
          >
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="What's this quiz about?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <AnimatePresence initial={false}>
          {questions.map((q, qIdx) => (
            <motion.div
              key={q.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-card/40 backdrop-blur-xl"
            >
              <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    <span
                      className={cn(
                        "size-2.5 rounded-full",
                        DOT_COLORS[qIdx % 4],
                      )}
                    />
                    Question {qIdx + 1}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeQuestion(q.id)}
                    disabled={questions.length === 1}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>

                <Textarea
                  placeholder="Question text"
                  value={q.statement}
                  onChange={(e) =>
                    updateQuestion(q.id, { statement: e.target.value })
                  }
                  rows={2}
                  className="font-display text-lg"
                />

                <div className="flex flex-col gap-2">
                  <Label className="font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Time limit
                  </Label>
                  <div className="flex gap-2">
                    {TIME_OPTIONS.map((s) => {
                      const active = q.timeLimit === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => updateQuestion(q.id, { timeLimit: s })}
                          className={cn(
                            "flex h-10 flex-1 items-center justify-center rounded-lg border font-display text-sm font-bold tabular-nums transition-all",
                            active
                              ? "border-primary bg-primary/20 text-primary"
                              : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/25 hover:text-foreground",
                          )}
                        >
                          {s}s
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Options · tap shape to mark correct
                  </Label>
                  {q.options.map((o, oIdx) => {
                    const isCorrect = o.points > 0;
                    const shape = ANSWER_SHAPES[oIdx % 4];
                    const letter = ANSWER_LETTERS[oIdx % 4];
                    const enabledCount = q.options.filter(
                      (opt) => opt.enabled,
                    ).length;
                    const canDisable = o.enabled && enabledCount > 2;
                    const toggleDisabled = o.enabled && !canDisable;
                    return (
                      <div key={oIdx} className="flex items-center gap-2">
                        <div
                          className={cn(
                            "flex flex-1 items-center gap-2 transition-all",
                            !o.enabled && "opacity-35 grayscale",
                          )}
                        >
                          <button
                            type="button"
                            disabled={!o.enabled}
                            onClick={() =>
                              updateOption(q.id, oIdx, {
                                points: isCorrect ? 0 : 100,
                              })
                            }
                            aria-label={
                              isCorrect
                                ? "Marked correct"
                                : "Mark as correct answer"
                            }
                            className={cn(
                              "group relative flex size-11 shrink-0 items-center justify-center rounded-lg transition-all",
                              isCorrect
                                ? cn(ANSWER_BG_CLASS[oIdx % 4], "shadow-lg")
                                : "bg-white/5 text-muted-foreground hover:bg-white/10",
                              !o.enabled && "cursor-not-allowed",
                            )}
                          >
                            <ShapeIcon shape={shape} className="size-5" />
                            {isCorrect && (
                              <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full border-2 border-card bg-emerald-500 text-white">
                                <Check className="size-3" strokeWidth={4} />
                              </span>
                            )}
                          </button>
                          <div className="relative flex-1">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-display text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                              {letter}
                            </span>
                            <Input
                              placeholder={`Option ${oIdx + 1}`}
                              value={o.text}
                              disabled={!o.enabled}
                              onChange={(e) =>
                                updateOption(q.id, oIdx, {
                                  text: e.target.value,
                                })
                              }
                              className="h-11 pl-9"
                            />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => toggleOption(q.id, oIdx)}
                          disabled={toggleDisabled}
                          aria-label={
                            o.enabled ? "Disable option" : "Enable option"
                          }
                          title={
                            toggleDisabled
                              ? "Need at least 2 options"
                              : o.enabled
                                ? "Disable option"
                                : "Enable option"
                          }
                          className={cn(
                            !o.enabled &&
                              "text-primary hover:bg-primary/10 hover:text-primary",
                            toggleDisabled &&
                              "opacity-30 disabled:pointer-events-none",
                          )}
                        >
                          {o.enabled ? (
                            <Trash2 className="size-4" />
                          ) : (
                            <RotateCcw className="size-4" />
                          )}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <Button
          variant="outline"
          size="lg"
          onClick={addQuestion}
          className="h-14 gap-2 rounded-2xl border-dashed border-white/20 bg-transparent font-display font-bold uppercase tracking-widest hover:bg-white/5"
        >
          <Plus className="size-4" /> Add question
        </Button>
      </div>
    </main>
  );
}
