import { Spinner } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import plur from "plur";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { getCurrentDate } from "lib/utils";

const formatNumber = (num: number) =>
  num.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });

interface CountdownProps {
  endTime: Date;
  isString: boolean;
}

export const Countdown = ({ endTime, isString }: CountdownProps) => {
  const router = useRouter();
  const [time, setTime] = useState<ReactNode>(
    <Spinner as="span" boxSize={2} mx={2} />
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      const diffTime = Math.max(
        0,
        dayjs(endTime).diff(getCurrentDate(), "seconds")
      );
      const duration = dayjs.duration(diffTime, "seconds");

      const days = duration.days();
      const timestamp = isString ? (
        `${
          days > 0 ? `${days.toString()} ${plur("day", days)} ` : ""
        }${duration.hours()}:${formatNumber(duration.minutes())}:${formatNumber(duration.seconds())}`
      ) : (
        <>
          {days > 0 && (
            <>
              <span style={{ fontWeight: 700 }}>{days}</span>
              <span> {plur("day", days)} </span>
            </>
          )}
          <span style={{ fontWeight: 700 }}>
            {duration.hours()}:{formatNumber(duration.minutes())}:
            {formatNumber(duration.seconds())}
          </span>
        </>
      );
      setTime(timestamp);

      if (diffTime === 0) clearInterval(intervalId);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [endTime, isString, router]);

  return time;
};
