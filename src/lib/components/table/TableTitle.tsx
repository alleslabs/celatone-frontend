import type { BoxProps } from "@chakra-ui/react";
import { Badge, Box, Flex, Heading, Text } from "@chakra-ui/react";

interface TableTitleProps extends BoxProps {
  count?: number;
  helperText?: string;
  isSmall?: boolean;
  showCount?: boolean;
  title: string;
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
    {helperText?.length && (
      <Text variant="body2" fontWeight={600} textColor="text.dark">
        {helperText}
      </Text>
    )}
  </Box>
);
