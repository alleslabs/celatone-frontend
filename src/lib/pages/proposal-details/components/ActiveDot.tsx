import { Box } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";
import { easeInOut, transform, useAnimationFrame } from "framer-motion";
import { useRef } from "react";

import { getCurrentDate } from "lib/utils";

const DURATION = 1500; // in milliseconds
const opacityMap = transform([0, 0.5, 1], [1, 0.25, 1]);

export const ActiveDot = (props: BoxProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useAnimationFrame(() => {
    if (ref.current?.style) {
      const time = getCurrentDate().getTime();
      ref.current.style.opacity = `${opacityMap(easeInOut((time % DURATION) / DURATION))}`;
    }
  });

  return (
    <Box
      ref={ref}
      boxSize={3}
      borderRadius="50%"
      bgColor="accent.main"
      {...props}
    />
  );
};
