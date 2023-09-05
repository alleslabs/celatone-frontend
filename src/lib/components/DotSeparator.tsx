import type { BoxProps } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";

export const DotSeparator = ({
  bg = "secondary.darker",
}: {
  bg?: BoxProps["bg"];
}) => <Box bg={bg} borderRadius="50%" w={1} h={1} />;
