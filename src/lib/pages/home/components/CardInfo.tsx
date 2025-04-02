import type { SystemStyleObject } from "@chakra-ui/react";
import type { Option } from "lib/types";

import { Box, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";
import { TooltipInfo } from "lib/components/Tooltip";

const cardProps: SystemStyleObject = {
  width: "100%",
  minH: "100%",
  padding: "16px",
  borderRadius: "8px",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer",
};

interface CardInfoProps {
  title: string;
  tooltip: string;
  value: Option<string>;
  isLoading: boolean;
  navigate: () => void;
}

export const CardInfo = ({
  title,
  tooltip,
  value,
  isLoading,
  navigate,
}: CardInfoProps) => (
  <Flex
    _hover={{ bg: "gray.700" }}
    bg="gray.800"
    cursor="pointer"
    sx={cardProps}
    transition="all 0.25s ease-in-out"
    onClick={navigate}
  >
    <Box>
      <Flex alignItems="center" gap={1} mb={2}>
        <Text color="text.dark" variant="body2">
          {title}
        </Text>
        <TooltipInfo label={tooltip} />
      </Flex>
      {isLoading ? (
        <Spinner size="md" />
      ) : (
        <Heading as="h5" variant="h5">
          {value ?? "N/A"}
        </Heading>
      )}
    </Box>
    <CustomIcon boxSize={5} color="gray.600" name="chevron-right" />
  </Flex>
);
