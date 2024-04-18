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
    templateColumns="32px 1fr"
    p="12px 16px"
    border="2px solid"
    borderRadius="12px"
    borderColor={checked ? "text.main" : "gray.700"}
    bgColor={checked ? "gray.700" : "gray.900"}
    alignItems="center"
    cursor="pointer"
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
    <RadioCard
      onClick={() => {
        track(AmpEvent.USE_PUBLISH_POLICY_SELECTION, { upgradePolicy: value });
        onSelect();
      }}
      checked={isChecked}
    >
      <Flex flexDirection="column">
        <Text variant="body1">{capitalize(value)}</Text>
        <Text variant="body2" textColor="text.dark" fontWeight={600}>
          {description}
          {hasCondition && <Leaflet />}
        </Text>
      </Flex>
    </RadioCard>
  );
};
