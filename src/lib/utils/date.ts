import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

import type { Option } from "lib/types";

export const formatUTC = (timestamp: string | Dayjs) =>
  dayjs(timestamp).utc(true).format("MMM DD, YYYY, h:mm:ss A [(UTC)]");

export const dateFromNow = (timestamp: string | Dayjs) =>
  dayjs(timestamp).utc(true).fromNow();

export const parseDate = (date: string) => dayjs(date).utc(true);

export const parseDateOpt = (dateOpt: Option<string>): Option<Dayjs> =>
  dateOpt ? parseDate(dateOpt) : undefined;

export const parseDateDefault = (dateOpt: Option<string>): Dayjs =>
  dateOpt ? parseDate(dateOpt) : dayjs(0);
