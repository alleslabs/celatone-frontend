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
  count,
  helperText,
  isSmall = false,
  mb = 6,
  showCount = true,
  title,
  ...props
}: TableTitleProps) => (
  <Box mb={mb} {...props}>
    <Flex alignItems="center" gap={2} h="29px">
      {isSmall ? (
        <Text color="text.dark" fontWeight={700} variant="body2">
          {title}
        </Text>
      ) : (
        <Heading as="h6" fontWeight={700} variant="h6">
          {title}
        </Heading>
      )}
      {showCount && (
        <Badge textColor={count ? "text.main" : "text.disabled"}>
          {count ?? "N/A"}
        </Badge>
      )}
    </Flex>
    {helperText?.length && (
      <Text fontWeight={600} textColor="text.dark" variant="body2">
        {helperText}
      </Text>
    )}
  </Box>
);
