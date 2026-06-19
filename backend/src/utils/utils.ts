export function Atoi(s: string) {
  const atoi = parseInt(s);
  if (Number.isNaN(atoi)) {
    throw new Error("is not valid number.");
  }

  return atoi;
}

export function GetDayFromDate(start: Date, end: Date): number {
  const diffInMs = end.getTime() - start.getTime();

  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  return Math.ceil(Math.abs(diffInDays));
}
