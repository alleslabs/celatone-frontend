import type { SystemStyleObject } from "@chakra-ui/react";
import { Box, Flex, Heading, Spinner, Text } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
import { TooltipInfo } from "lib/components/Tooltip";
import type { Option } from "lib/types";

const cardProps: SystemStyleObject = {
  width: "100%",
  padding: "16px",
  borderRadius: "8px",
  justifyContent: "space-between",
  alignItems: "center",
  height: "100%",
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
    sx={cardProps}
    _hover={{ bg: "gray.700" }}
    transition="all 0.25s ease-in-out"
    bg="gray.800"
    onClick={navigate}
    cursor="pointer"
  >
    <Box>
      <Flex alignItems="center" gap={1} mb={2}>
        <Text variant="body2" color="text.dark">
          {title}
        </Text>
        <TooltipInfo label={tooltip} iconVariant="solid" />
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
