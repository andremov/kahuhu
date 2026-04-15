export function calculateScore(
  timeRemaining: number,
  totalTime: number,
  basePoints: number,
): number {
  const timeBonus = Math.min(1, timeRemaining / totalTime);
  return Math.round(basePoints * (0.5 + 0.5 * timeBonus));
}

export function makeRoomCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
