import dayjs from "dayjs";

import type { Option } from "lib/types";

export const formatUTC = (timestamp: string | Date) => {
  const localDate =
    typeof timestamp === "string" ? timestamp.concat("Z") : timestamp;
  return dayjs(localDate).utc().format("MMM DD, YYYY, h:mm:ss A [(UTC)]");
};

export const dateFromNow = (timestamp: string | Date) => {
  const localDate =
    typeof timestamp === "string" ? timestamp.concat("Z") : timestamp;
  return dayjs(localDate).fromNow();
};

export const parseDate = (date: string) => new Date(`${date}Z`);

export const parseDateOpt = (dateOpt: Option<string>): Option<Date> =>
  dateOpt ? parseDate(dateOpt) : undefined;

export const parseDateDefault = (dateOpt: Option<string>): Date =>
  dateOpt ? parseDate(dateOpt) : parseDate("0");
