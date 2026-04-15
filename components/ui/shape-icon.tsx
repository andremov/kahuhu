import { cn } from "@/lib/utils";

export type AnswerShape = "triangle" | "diamond" | "circle" | "square";

export const ANSWER_SHAPES: AnswerShape[] = [
  "triangle",
  "diamond",
  "circle",
  "square",
];

export const ANSWER_LETTERS = ["A", "B", "C", "D"] as const;

interface ShapeIconProps {
  shape: AnswerShape;
  className?: string;
  filled?: boolean;
}

export function ShapeIcon({ shape, className, filled = true }: ShapeIconProps) {
  const stroke = filled ? "none" : "currentColor";
  const fill = filled ? "currentColor" : "none";
  const strokeWidth = filled ? 0 : 2;

  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-6", className)}
      aria-hidden="true"
    >
      {shape === "triangle" && (
        <path
          d="M12 3 L22 20 L2 20 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      )}
      {shape === "diamond" && (
        <path
          d="M12 2 L22 12 L12 22 L2 12 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      )}
      {shape === "circle" && (
        <circle
          cx="12"
          cy="12"
          r="10"
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      )}
      {shape === "square" && (
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="2"
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      )}
    </svg>
  );
}

export const ANSWER_BG_CLASS = [
  "bg-answer-1 text-answer-1-foreground",
  "bg-answer-2 text-answer-2-foreground",
  "bg-answer-3 text-answer-3-foreground",
  "bg-answer-4 text-answer-4-foreground",
] as const;

export const ANSWER_TEXT_CLASS = [
  "text-answer-1",
  "text-answer-2",
  "text-answer-3",
  "text-answer-4",
] as const;
