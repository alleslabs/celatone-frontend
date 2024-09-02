import { Box } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";
import { easeInOut, transform, useAnimationFrame } from "framer-motion";
import { useRef } from "react";

import { getCurrentDate } from "lib/utils";

const DURATION = 1500; // in milliseconds
const opacityMap = transform([0, 0.5, 1], [1, 0.25, 1]);

interface ActiveDotProps extends BoxProps {
  isActive?: boolean;
}

export const ActiveDot = ({ isActive = true, ...props }: ActiveDotProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useAnimationFrame(() => {
    if (!isActive) return;

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
      bgColor="secondary.main"
      {...props}
    />
  );
};
