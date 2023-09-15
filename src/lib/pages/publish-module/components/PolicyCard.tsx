import type { FlexProps } from "@chakra-ui/react";
import { Box, Flex, Text } from "@chakra-ui/react";

import type { UpgradePolicy } from "lib/types";

import { Leaflet } from "./leaflet";

interface RadioCardProps extends FlexProps {
  checked: boolean;
}

const RadioCard = ({ checked, children, ...props }: RadioCardProps) => (
  <Flex
    w="full"
    p="12px 16px"
    gap={4}
    border="2px solid"
    borderRadius="12px"
    borderColor={checked ? "text.main" : "gray.700"}
    bgColor={checked ? "gray.700" : "gray.900"}
    alignItems="center"
    cursor="pointer"
    {...props}
  >
    <Flex
      w="18px"
      h="18px"
      flexShrink={0}
      borderRadius="50%"
      border="2px solid"
      borderColor={checked ? "text.main" : "text.dark"}
      align="center"
      justify="center"
    >
      {checked && (
        <Box w="9px" h="9px" bgColor="text.main" borderRadius="50%" />
      )}
    </Flex>
    {children}
  </Flex>
);

interface PolicyCardProps {
  value: UpgradePolicy;
  selected: UpgradePolicy;
  description: string;
  hasCondition?: boolean;
  onSelect: () => void;
}

export const PolicyCard = ({
  value,
  selected,
  description,
  hasCondition = false,
  onSelect,
}: PolicyCardProps) => {
  const isChecked = value === selected;
  return (
    <RadioCard onClick={onSelect} checked={isChecked}>
      <Flex flexDirection="column">
        <Text
          variant="body1"
          textTransform="lowercase"
          sx={{ "&:first-letter": { textTransform: "uppercase" } }}
        >
          {value}
        </Text>
        <Text variant="body2" textColor="text.dark" fontWeight={600}>
          {description}
          {hasCondition && <Leaflet />}
        </Text>
      </Flex>
    </RadioCard>
  );
};
