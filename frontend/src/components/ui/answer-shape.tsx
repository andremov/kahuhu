import { Ban, Circle, Diamond, Square, Triangle } from 'lucide-react';

interface AnswerShapeProps {
  index: number;
  filled?: boolean;
  className?: string;
}

export function AnswerShape({ index, filled = true, className = '' }: AnswerShapeProps) {
  switch (index) {
    case 0:
      return <Triangle className={`${className} ${filled ? 'fill-white' : ''}`} />;
    case 1:
      return <Circle className={`${className} ${filled ? 'fill-white' : ''}`} />;
    case 2:
      return <Diamond className={`${className} ${filled ? 'fill-white' : ''}`} />;
    case 3:
      return <Square className={`${className} ${filled ? 'fill-white' : ''}`} />;
    default:
      return <Ban className={`${className} ${filled ? 'fill-white' : ''}`} />;
  }
}
