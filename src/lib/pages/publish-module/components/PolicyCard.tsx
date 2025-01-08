import type { FlexProps } from "@chakra-ui/react";
import { Flex, Grid, Text } from "@chakra-ui/react";
import { capitalize } from "lodash";
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from "react-icons/md";

import { AmpEvent, track } from "lib/amplitude";
import type { UpgradePolicy } from "lib/types";

import { Leaflet } from "./leaflet";

interface RadioCardProps extends FlexProps {
  checked: boolean;
}

const RadioCard = ({ checked, children, ...props }: RadioCardProps) => (
  <Grid
    alignItems="center"
    p="12px 16px"
    bgColor={checked ? "gray.700" : "gray.900"}
    border="2px solid"
    borderColor={checked ? "text.main" : "gray.700"}
    borderRadius="12px"
    cursor="pointer"
    templateColumns="32px 1fr"
    {...props}
  >
    {checked ? (
      <MdRadioButtonChecked fontSize="20px" />
    ) : (
      <MdRadioButtonUnchecked fontSize="20px" />
    )}
    {children}
  </Grid>
);

interface PolicyCardProps {
  description: string;
  hasCondition?: boolean;
  onSelect: () => void;
  selected: UpgradePolicy;
  value: UpgradePolicy;
}

export const PolicyCard = ({
  description,
  hasCondition = false,
  onSelect,
  selected,
  value,
}: PolicyCardProps) => {
  const isChecked = value === selected;
  return (
    <RadioCard
      checked={isChecked}
      onClick={() => {
        track(AmpEvent.USE_PUBLISH_POLICY_SELECTION, { upgradePolicy: value });
        onSelect();
      }}
    >
      <Flex flexDirection="column">
        <Text variant="body1">{capitalize(value)}</Text>
        <Text variant="body2" fontWeight={600} textColor="text.dark">
          {description}
          {hasCondition && <Leaflet />}
        </Text>
      </Flex>
    </RadioCard>
  );
};
