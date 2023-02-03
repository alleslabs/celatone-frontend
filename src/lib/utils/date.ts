import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";

import type { Option } from "lib/types";

dayjs.extend(relativeTime);
dayjs.extend(utc);

export const getDefaultDate = (): Date => dayjs(0).toDate();

export const getCurrentDate = (): Date => dayjs().toDate();

export const parseDate = (date: string): Date => dayjs(date).utc(true).toDate();

export const parseDateOpt = (dateOpt: Option<string>): Option<Date> =>
  dateOpt ? parseDate(dateOpt) : undefined;

export const parseDateDefault = (dateOpt: Option<string>): Date =>
  dateOpt ? parseDate(dateOpt) : getDefaultDate();

export const formatUTC = (date: Date) =>
  dayjs(date).utc().format("MMM DD, YYYY, h:mm:ss A [(UTC)]");

export const dateFromNow = (date: Date) => dayjs(date).fromNow();
