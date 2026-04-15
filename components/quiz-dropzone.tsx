"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { Check, FileJson, Upload } from "lucide-react";
import { safeParseQuiz } from "@/lib/quiz-schema";
import type { Quiz } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  onQuiz: (q: Quiz) => void;
  quiz: Quiz | null;
}

export default function QuizDropzone({ onQuiz, quiz }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const result = safeParseQuiz(json);
      if (!result.success) {
        setError("That JSON doesn't look like a valid Kahuhu quiz.");
        return;
      }
      onQuiz(result.data as Quiz);
    } catch {
      setError("Could not read that file as JSON.");
    }
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={cn(
          "group relative flex min-h-[280px] cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl border-2 border-dashed border-white/20 bg-card/40 p-10 text-center backdrop-blur-xl transition-all hover:border-primary/60 hover:bg-card/60",
          dragOver && "scale-[1.02] border-primary bg-primary/10",
          quiz && "border-answer-2/60 bg-answer-2/5",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={onChange}
        />
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle at center, oklch(0.82 0.17 200 / 0.15) 0%, transparent 65%)",
          }}
        />
        {quiz ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="flex size-16 items-center justify-center rounded-2xl bg-answer-2/20 text-answer-2">
              <Check className="size-8" strokeWidth={3} />
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="font-display text-2xl font-bold">{quiz.title}</p>
              <p className="text-sm text-muted-foreground">
                {quiz.questions.length} question
                {quiz.questions.length === 1 ? "" : "s"}
                {quiz.description ? ` · ${quiz.description}` : ""}
              </p>
              <p className="mt-2 font-display text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Click to replace
              </p>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="flex size-16 items-center justify-center rounded-2xl bg-white/5 text-primary">
              <Upload className="size-8" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="font-display text-2xl font-bold">
                Drop a quiz JSON here
              </p>
              <p className="text-sm text-muted-foreground">
                Or click to browse. Create one from the{" "}
                <FileJson className="inline size-3" /> Create page.
              </p>
            </div>
          </>
        )}
      </div>
      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : null}
    </div>
  );
}
