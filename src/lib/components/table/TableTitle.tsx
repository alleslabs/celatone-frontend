import type { BoxProps } from "@chakra-ui/react";
import { Badge, Box, Flex, Heading, Text } from "@chakra-ui/react";

interface TableTitleProps extends BoxProps {
  title: string;
  count?: number;
  showCount?: boolean;
  helperText?: string;
  isSmall?: boolean;
}

export const TableTitle = ({
  title,
  count,
  showCount = true,
  helperText,
  mb = 6,
  isSmall = false,
  ...props
}: TableTitleProps) => (
  <Box mb={mb} {...props}>
    <Flex gap={2} h="29px" alignItems="center">
      {isSmall ? (
        <Text variant="body2" color="text.dark" fontWeight={700}>
          {title}
        </Text>
      ) : (
        <Heading as="h6" variant="h6">
          {title}
        </Heading>
      )}
      {showCount && (
        <Badge textColor={count ? "text.main" : "text.disabled"}>
          {count ?? "N/A"}
        </Badge>
      )}
    </Flex>
    <Text variant="body2" textColor="text.dark" fontWeight={600}>
      {helperText}
    </Text>
  </Box>
);
