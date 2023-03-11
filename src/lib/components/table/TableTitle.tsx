import type { BoxProps } from "@chakra-ui/react";
import { Badge, Box, Flex, Heading, Text } from "@chakra-ui/react";

interface TableTitleProps extends BoxProps {
  title: string;
  count: number;
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
      <Badge
        variant="gray"
        color="text.main"
        textColor={count ? "text.main" : "pebble.500"}
      >
        {count}
      </Badge>
    </Flex>
    <Text variant="body2" textColor="text.dark">
      {helperText}
    </Text>
  </Box>
);
