import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

import type { Option } from "lib/types";

export const parseDate = (date: string) => dayjs(date).utc(true);

export const parseDateOpt = (dateOpt: Option<string>): Option<Dayjs> =>
  dateOpt ? parseDate(dateOpt) : undefined;

export const parseDateDefault = (dateOpt: Option<string>): Dayjs =>
  dateOpt ? parseDate(dateOpt) : dayjs(0);

export const formatUTC = (date: Dayjs) =>
  date.format("MMM DD, YYYY, h:mm:ss A [(UTC)]");

export const dateFromNow = (date: Dayjs) => date.fromNow();
