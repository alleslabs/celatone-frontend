import { Spinner } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import plur from "plur";
import { useEffect, useState } from "react";

import { getCurrentDate } from "lib/utils";

const formatNumber = (num: number) =>
  num.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });

interface CountdownProps {
  endTime: Date;
}

export const Countdown = ({ endTime }: CountdownProps) => {
  const router = useRouter();
  const [time, setTime] = useState<JSX.Element>(
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
      const timestamp = (
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
      if (diffTime === 0) router.reload();
      setTime(timestamp);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [endTime, router]);

  return time;
};
