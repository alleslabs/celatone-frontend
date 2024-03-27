import { Flex, Text } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { isUndefined } from "lodash";
import { useMemo } from "react";

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

  return (
    <Flex direction="column" gap={1} minW={{ base: "full", md: "280px" }}>
      <Text variant="body3" color="text.dark" pl={{ base: 1, md: 3 }}>
        Show only
      </Text>
      <Select
        size="lg"
        options={activeOptions}
        value={activeOptions.find(({ value }) => value === isActive)}
        onChange={(selectedOption) =>
          selectedOption && setIsActive(selectedOption.value)
        }
        chakraStyles={{
          valueContainer: (provided) => ({
            ...provided,
            pl: 3,
            pr: 0,
          }),
          dropdownIndicator: (provided) => ({
            ...provided,
            px: 2,
          }),
          option: (provided) => ({
            ...provided,
            color: "text.main",
            fontSize: "16px",
            _hover: {
              bg: "gray.700",
            },
            _selected: {
              bg: "gray.800",
            },
          }),
        }}
        isSearchable={false}
      />
    </Flex>
  );
};
