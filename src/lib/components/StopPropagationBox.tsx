import { Box } from "@chakra-ui/react";
import type { ReactNode } from "react";

export const StopPropagationBox = ({ children }: { children: ReactNode }) => (
  <Box cursor="initial" onClick={(e) => e.stopPropagation()}>
    {children}
  </Box>
);
