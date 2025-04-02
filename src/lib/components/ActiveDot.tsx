import type { BoxProps } from "@chakra-ui/react";

import { Box } from "@chakra-ui/react";
import { easeInOut, transform, useAnimationFrame } from "framer-motion";
import { getCurrentDate } from "lib/utils";
import { useRef } from "react";

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
      bgColor="secondary.main"
      borderRadius="50%"
      boxSize={3}
      ref={ref}
      {...props}
    />
  );
};
