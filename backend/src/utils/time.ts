import { DateTime } from "luxon";

export const FormatTimeToId = (
  time: string,
  withTime: boolean = false,
): string => {
  const format = `dd LLLL yyyy`;

  return DateTime.fromISO(time)
    .setLocale("id")
    .toFormat(withTime ? format + " HH:mm" : format);
};
