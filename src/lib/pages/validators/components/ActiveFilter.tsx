import { Flex, Text } from "@chakra-ui/react";
import { isUndefined } from "lodash";
import { useMemo } from "react";

import { AmpEvent, trackUseFilter } from "lib/amplitude";
import { SelectInput } from "lib/components/forms";
import type { Option } from "lib/types";

interface ActiveFilterProps {
  activeCount: Option<number>;
  inactiveCount: Option<number>;
  isActive: boolean;
  setIsActive: (value: boolean) => void;
}

const getOptionLabel = (label: string, count: Option<number>) =>
  label + (!isUndefined(count) ? ` (${count})` : "");

export const ActiveFilter = ({
  activeCount,
  inactiveCount,
  isActive,
  setIsActive,
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
    <Flex gap={1} minW={{ base: "full", md: "256px" }} direction="column">
      <Text pl={{ base: 1, md: 3 }} variant="body3" color="text.dark">
        Show only
      </Text>
      <SelectInput
        value={activeOptions.find(({ value }) => value === isActive)}
        menuPortalTarget={document.body}
        onChange={(selectedOption) =>
          selectedOption && handleOnChange(selectedOption.value)
        }
        options={activeOptions}
      />
    </Flex>
  );
};
