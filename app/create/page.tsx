"use client";

import Link from "next/link";
import { useEditorStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Check, Download, X } from "lucide-react";

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
    addOption,
    removeOption,
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
        q.options.filter((o) => o.text.trim().length > 0).length >= 2 &&
        q.options.some((o) => o.text.trim().length > 0 && o.points > 0),
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
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back
        </Link>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={reset} size="lg">
            Clear
          </Button>
          <Button
            size="lg"
            disabled={!canExport}
            onClick={handleExport}
            className="gap-2"
          >
            <Download className="size-4" />
            Export JSON
          </Button>
        </div>
      </header>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Quiz title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-12 text-lg"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Description</Label>
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
        {questions.map((q, qIdx) => (
          <Card key={q.id}>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">Question {qIdx + 1}</CardTitle>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => removeQuestion(q.id)}
                disabled={questions.length === 1}
              >
                <Trash2 className="size-4" />
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Textarea
                placeholder="Question text"
                value={q.statement}
                onChange={(e) =>
                  updateQuestion(q.id, { statement: e.target.value })
                }
                rows={2}
              />

              <div className="flex items-center gap-3">
                <Label
                  htmlFor={`time-${q.id}`}
                  className="text-sm text-muted-foreground"
                >
                  Time limit (s)
                </Label>
                <Input
                  id={`time-${q.id}`}
                  type="number"
                  min={5}
                  max={120}
                  value={q.timeLimit}
                  onChange={(e) =>
                    updateQuestion(q.id, {
                      timeLimit: Math.max(
                        5,
                        Math.min(120, Number(e.target.value) || 20),
                      ),
                    })
                  }
                  className="h-9 w-24"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-muted-foreground">
                    Options (tap check to mark correct)
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addOption(q.id)}
                    disabled={q.options.length >= 4}
                    className="gap-1"
                  >
                    <Plus className="size-3" /> Add
                  </Button>
                </div>
                {q.options.map((o, oIdx) => {
                  const isCorrect = o.points > 0;
                  return (
                    <div
                      key={oIdx}
                      className="flex items-center gap-2"
                    >
                      <Button
                        variant={isCorrect ? "default" : "outline"}
                        size="icon"
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
                      >
                        {isCorrect ? (
                          <Check className="size-4" />
                        ) : (
                          <X className="size-4 opacity-40" />
                        )}
                      </Button>
                      <Input
                        placeholder={`Option ${oIdx + 1}`}
                        value={o.text}
                        onChange={(e) =>
                          updateOption(q.id, oIdx, { text: e.target.value })
                        }
                        className="h-10 flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeOption(q.id, oIdx)}
                        disabled={q.options.length <= 2}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          variant="outline"
          size="lg"
          onClick={addQuestion}
          className="gap-2"
        >
          <Plus className="size-4" /> Add question
        </Button>
      </div>
    </main>
  );
}
