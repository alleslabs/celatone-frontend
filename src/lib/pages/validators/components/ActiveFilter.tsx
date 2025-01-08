import { Flex, Text } from "@chakra-ui/react";
import { isUndefined } from "lodash";
import { useMemo } from "react";

import { AmpEvent, trackUseFilter } from "lib/amplitude";
import { SelectInput } from "lib/components/forms";
import type { Option } from "lib/types";

interface ActiveFilterProps {
  isActive: boolean;
  setIsActive: (value: boolean) => void;
  activeCount: Option<number>;
  inactiveCount: Option<number>;
}

const getOptionLabel = (label: string, count: Option<number>) =>
  label + (!isUndefined(count) ? ` (${count})` : "");

export const ActiveFilter = ({
  isActive,
  setIsActive,
  activeCount,
  inactiveCount,
}: ActiveFilterProps) => {
  const activeOptions = useMemo(
    () => [
      { label: getOptionLabel("Active validators", activeCount), value: true },
      {
        label: getOptionLabel("Inactive validators", inactiveCount),
        value: false,
      },
    ],
    [activeCount, inactiveCount]
  );

  const handleOnChange = (newValue: boolean) => {
    trackUseFilter(
      AmpEvent.USE_FILTER_VALIDATORS_ACTIVE,
      [String(newValue)],
      String(newValue)
    );
    setIsActive(newValue);
  };

  return (
    <Flex direction="column" gap={1} minW={{ base: "full", md: "256px" }}>
      <Text variant="body3" color="text.dark" pl={{ base: 1, md: 3 }}>
        Show only
      </Text>
      <SelectInput
        options={activeOptions}
        menuPortalTarget={document.body}
        value={activeOptions.find(({ value }) => value === isActive)}
        onChange={(selectedOption) =>
          selectedOption && handleOnChange(selectedOption.value)
        }
      />
    </Flex>
  );
};
