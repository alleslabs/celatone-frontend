import { Box } from "@chakra-ui/react";
import type { ReactNode } from "react";

export const StopPropagationBox = ({ children }: { children: ReactNode }) => (
  <Box onClick={(e) => e.stopPropagation()} cursor="initial">
    {children}
  </Box>
);
