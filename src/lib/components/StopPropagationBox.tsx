import type { ReactNode } from "react";

import { Box } from "@chakra-ui/react";

export const StopPropagationBox = ({ children }: { children: ReactNode }) => (
  <Box cursor="initial" onClick={(e) => e.stopPropagation()}>
    {children}
  </Box>
);
