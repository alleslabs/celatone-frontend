import type { Duration } from "dayjs/plugin/duration";
import type { Option } from "lib/types";

import dayjs from "dayjs";
import pluginDuration from "dayjs/plugin/duration";
import pluginRelativeTime from "dayjs/plugin/relativeTime";
import pluginUtc from "dayjs/plugin/utc";
import { big } from "lib/types";
import plur from "plur";

import { isNumeric } from "./number";

dayjs.extend(pluginDuration);
dayjs.extend(pluginRelativeTime);
dayjs.extend(pluginUtc);

export const getDefaultDate = (): Date => dayjs.utc(0).toDate();

export const getCurrentDate = (): Date => dayjs.utc().toDate();

export const parseDate = (date: string): Date => dayjs.utc(date).toDate();

// convert nanoseconds to milliseconds to date
export const parseNanosecondsToDate = (date: string): Date =>
  dayjs.utc(Number(date) / 1_000_000).toDate();

export const parseDateOpt = (dateOpt: Option<string>): Option<Date> =>
  dateOpt ? parseDate(dateOpt) : undefined;

export const parseUnixToDate = (unix: number | string): Date =>
  dayjs.unix(Number(unix)).toDate();

export const parseUnixToDateOpt = (
  unix: Option<number | string>
): Option<Date> =>
  unix !== undefined && isNumeric(String(unix))
    ? dayjs.unix(Number(unix)).toDate()
    : undefined;

// TODO: remove default fn
export const parseDateDefault = (dateOpt: Option<string>): Date =>
  dateOpt ? parseDate(dateOpt) : getDefaultDate();

export const parseSecondsToDuration = (seconds: number) =>
  dayjs.duration(seconds * 1000);

export const formatUTC = (date: Date) =>
  dayjs.utc(date).format("MMM DD, YYYY, h:mm:ss A [(UTC)]");

export const formatHHmm = (date: Date) => dayjs.utc(date).format("HH:mm");

export const formatMMMDD = (date: Date) => dayjs.utc(date).format("MMM DD");

export const dateFromNow = (date: Date) => dayjs.utc(date).fromNow();

export const dateDiffDuration = (date1: Date, date2: Date) =>
  dayjs.duration(dayjs.utc(date1).diff(dayjs.utc(date2)));

export const formatSeconds = (sec: Option<string>) => {
  if (sec === undefined || Number.isNaN(parseInt(sec, 10))) return "N/A";
  const formatSec = big(sec.replace("s", ""));

  switch (true) {
    case formatSec.gte(86400): {
      const days = formatSec.div(86400).round(0, 0).toNumber();
      return `${days} ${plur("day", days)}`;
    }
    case formatSec.gte(3600): {
      const hours = formatSec.div(3600).round(0, 0).toNumber();
      return `${hours} ${plur("hour", hours)}`;
    }
    case formatSec.gte(60): {
      const mins = formatSec.div(60).round(0, 0).toNumber();
      return `${mins} ${plur("minute", mins)}`;
    }
    case formatSec.lt(0):
      return "N/A";
    default:
      return `${formatSec.toFixed()} ${plur("second", formatSec.toNumber())}`;
  }
};

export const formatDayJSDuration = (duration: Duration) => {
  const years = duration.years();
  const months = duration.months();
  const days = duration.days();
  const parts = [];
  if (years > 0) parts.push(`${years} ${plur("year", years)}`);
  if (months > 0) parts.push(`${months} ${plur("month", months)}`);
  if (days > 0) parts.push(`${days} ${plur("day", days)}`);
  return parts.length > 0 ? parts.join(" ") : "0 day";
};

export const formatDuration = (duration: number | string) => {
  if (typeof duration === "number" || isNumeric(duration))
    return formatSeconds(big(duration).div(1e9).toFixed());

  const sliceValue = duration.slice(0, -1);
  if (Number.isNaN(Number(sliceValue)) || !sliceValue.trim().length)
    return "N/A";
  let value = big(sliceValue);

  switch (true) {
    case duration.endsWith("d"):
      value = value.mul(86400);
      break;
    case duration.endsWith("h"):
      value = value.mul(3600);
      break;
    case duration.endsWith("m"):
      value = value.mul(60);
      break;
    case duration.endsWith("s"):
      break;
    default:
      return "N/A";
  }
  return formatSeconds(value.toFixed());
};
