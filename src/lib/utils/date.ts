import big from "big.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";

import type { Option } from "lib/types";

dayjs.extend(relativeTime);
dayjs.extend(utc);

export const getDefaultDate = (): Date => dayjs.utc(0).toDate();

export const getCurrentDate = (): Date => dayjs.utc().toDate();

export const parseDate = (date: string): Date => dayjs.utc(date).toDate();

export const parseDateOpt = (dateOpt: Option<string>): Option<Date> =>
  dateOpt ? parseDate(dateOpt) : undefined;

// TODO: remove default fn
export const parseDateDefault = (dateOpt: Option<string>): Date =>
  dateOpt ? parseDate(dateOpt) : getDefaultDate();

export const formatUTC = (date: Date) =>
  dayjs.utc(date).format("MMM DD, YYYY, h:mm:ss A [(UTC)]");

export const dateFromNow = (date: Date) => dayjs.utc(date).fromNow();

export const formatSeconds = (sec: Option<string>) => {
  if (sec === undefined || Number.isNaN(parseInt(sec, 10))) return "N/A";
  const formatSec = big(sec.replace("s", ""));

  // TODO: use `pluralize` here
  switch (true) {
    case formatSec.gte(86400): {
      const days = formatSec.div(86400).round(0, 0).toNumber();
      return `${days} day`.concat(days > 1 ? "s" : "");
    }
    case formatSec.gte(3600): {
      const hours = formatSec.div(3600).round(0, 0).toNumber();
      return `${hours} hour`.concat(hours > 1 ? "s" : "");
    }
    case formatSec.gte(60): {
      const mins = formatSec.div(60).round(0, 0).toNumber();
      return `${mins} minute`.concat(mins > 1 ? "s" : "");
    }
    case formatSec.lt(0):
      return "N/A";
    default:
      return `${formatSec.toFixed()} second`.concat(formatSec.gt(1) ? "s" : "");
  }
};

// TODO - Add unit test
export const formatDuration = (duration: string | number) => {
  if (typeof duration === "number" || Number.isInteger(duration))
    return formatSeconds(big(duration).div(1e9).toFixed());

  let value = big(duration.slice(0, -1));
  switch (true) {
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
