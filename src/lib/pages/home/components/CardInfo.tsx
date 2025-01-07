import type { SystemStyleObject } from "@chakra-ui/react";
import { Box, Flex, Heading, Spinner, Text } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
import { TooltipInfo } from "lib/components/Tooltip";
import type { Option } from "lib/types";

const cardProps: SystemStyleObject = {
  alignItems: "center",
  borderRadius: "8px",
  cursor: "pointer",
  justifyContent: "space-between",
  minH: "100%",
  padding: "16px",
  width: "100%",
};

interface CardInfoProps {
  isLoading: boolean;
  navigate: () => void;
  title: string;
  tooltip: string;
  value: Option<string>;
}

export const CardInfo = ({
  isLoading,
  navigate,
  title,
  tooltip,
  value,
}: CardInfoProps) => (
  <Flex
    bg="gray.800"
    sx={cardProps}
    _hover={{ bg: "gray.700" }}
    cursor="pointer"
    onClick={navigate}
    transition="all 0.25s ease-in-out"
  >
    <Box>
      <Flex alignItems="center" gap={1} mb={2}>
        <Text variant="body2" color="text.dark">
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
    <CustomIcon name="chevron-right" boxSize={5} color="gray.600" />
  </Flex>
);
