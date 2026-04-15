"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { safeParseQuiz } from "@/lib/quiz-schema";
import type { Quiz } from "@/lib/types";
import { Upload, FileJson, Check } from "lucide-react";
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
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-card/40 p-10 text-center transition-colors hover:bg-card/80",
          dragOver && "border-primary bg-primary/5",
          quiz && "border-emerald-500/50 bg-emerald-500/5",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={onChange}
        />
        {quiz ? (
          <>
            <Check className="size-8 text-emerald-400" />
            <div className="flex flex-col items-center gap-1">
              <p className="font-semibold">{quiz.title}</p>
              <p className="text-sm text-muted-foreground">
                {quiz.questions.length} question
                {quiz.questions.length === 1 ? "" : "s"}
                {quiz.description ? ` · ${quiz.description}` : ""}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Click to replace
              </p>
            </div>
          </>
        ) : (
          <>
            <Upload className="size-8 text-muted-foreground" />
            <div className="flex flex-col gap-1">
              <p className="font-semibold">Drop a quiz JSON here</p>
              <p className="text-sm text-muted-foreground">
                Or click to browse. Create one from the{" "}
                <FileJson className="inline size-3" /> Create Quiz page.
              </p>
            </div>
          </>
        )}
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
