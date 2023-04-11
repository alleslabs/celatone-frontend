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

export const secondsToDays = (sec: string) => {
  const days = Number(sec) / 86400;
  return `${Math.floor(days)} day`.concat(days > 1 ? "s" : "");
};
