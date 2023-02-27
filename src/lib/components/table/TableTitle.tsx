import { Badge, Box, Flex, Heading, Text } from "@chakra-ui/react";

interface TableTitleProps {
  title: string;
  count: number;
  helperText?: string;
  mb?: number | string;
}

export const TableTitle = ({
  title,
  count,
  helperText,
  mb = "6",
}: TableTitleProps) => (
  <Box mb={mb}>
    <Flex gap={2} h="29px" alignItems="center">
      <Heading as="h6" variant="h6">
        {title}
      </Heading>
      <Badge
        variant="gray"
        color="text.main"
        textColor={count ? "gray.100" : "gray.500"}
      >
        {count}
      </Badge>
    </Flex>
    <Text variant="body2" textColor="gray.400">
      {helperText}
    </Text>
  </Box>
);
