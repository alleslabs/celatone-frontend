import { Spinner } from "@chakra-ui/react";
import dayjs from "dayjs";
import plur from "plur";
import { useMemo, useState } from "react";

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
  const [time, setTime] = useState<JSX.Element>(<Spinner boxSize={2} mx={2} />);

  useMemo(() => {
    const currentTime = getCurrentDate();
    const diffTime = dayjs(endTime).diff(currentTime, "seconds");
    let duration = dayjs.duration(diffTime, "seconds");

    const interval = 1000;
    setInterval(() => {
      duration = duration.subtract({ seconds: 1 });
      const days = duration.days();
      const timestamp = (
        <>
          {days && (
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
    }, interval);
  }, [endTime]);

  return time;
};
