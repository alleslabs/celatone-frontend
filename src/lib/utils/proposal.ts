import dayjs from "dayjs";

export const isExpedited = (votingStartTime: string, votingEndTime: string) =>
  dayjs(votingEndTime).diff(votingStartTime, "hour") === 24;
