import type { BoxProps } from "@chakra-ui/react";

import { MotionBox } from "lib/components/MotionBox";

export const ActiveDot = (props: BoxProps) => (
  <MotionBox
    boxSize={3}
    borderRadius="50%"
    bgColor="accent.main"
    animate={{ opacity: [1, 0.25, 1] }}
    // @ts-expect-error no problem in operation, although type error appears.
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    {...props}
  />
);
