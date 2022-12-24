import dayjs from "dayjs";

export const date = (timestamp: string) => {
  const localDate = timestamp.concat("Z");
  return dayjs(localDate).utc().format("MMM DD, YYYY, h:mm:ss A [(UTC)]");
};

export const dateFromNow = (timestamp: string) => {
  const localDate = timestamp.concat("Z");
  return dayjs(localDate).fromNow();
};
