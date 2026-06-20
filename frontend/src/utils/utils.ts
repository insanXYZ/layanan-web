import { DateTime } from "luxon";

export function Atoi(s: string) {
  const atoi = parseInt(s);
  if (Number.isNaN(atoi)) {
    throw new Error("is not valid number.");
  }

  return atoi;
}

export function GetDay(start: string, end: string): number {
  const startDate = DateTime.fromISO(start).toJSDate();
  const endDate = DateTime.fromISO(end).toJSDate();

  console.log(startDate);
  console.log(endDate);

  const diffInMs = endDate.getTime() - startDate.getTime();

  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  return Math.ceil(Math.abs(diffInDays));
}
