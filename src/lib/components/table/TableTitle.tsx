import type { BoxProps } from "@chakra-ui/react";
import { Badge, Box, Flex, Heading, Text } from "@chakra-ui/react";

import type { Option } from "lib/types";

interface TableTitleProps extends BoxProps {
  title: string;
  count: Option<number>;
  helperText?: string;
}

export const TableTitle = ({
  title,
  count,
  helperText,
  mb = 6,
  ...props
}: TableTitleProps) => (
  <Box mb={mb} {...props}>
    <Flex gap={2} h="29px" alignItems="center">
      <Heading as="h6" variant="h6">
        {title}
      </Heading>
      <Badge textColor={count ? "text.main" : "text.disabled"}>
        {count ?? "N/A"}
      </Badge>
    </Flex>
    <Text variant="body2" textColor="text.dark">
      {helperText}
    </Text>
  </Box>
);
