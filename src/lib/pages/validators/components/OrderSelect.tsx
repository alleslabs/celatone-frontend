import { Flex, Text } from "@chakra-ui/react";
import { Select } from "chakra-react-select";

import { ValidatorOrder } from "../types";
import { trackUseSort } from "lib/amplitude";

const ORDER_OPTIONS = [
  {
    label: "Validator Name (A to Z)",
    value: { order: ValidatorOrder.Moniker, isDesc: false },
  },
  {
    label: "Validator Name (Z to A)",
    value: { order: ValidatorOrder.Moniker, isDesc: true },
  },
  {
    label: "Voting Power (High to Low)",
    value: { order: ValidatorOrder.VotingPower, isDesc: true },
  },
  {
    label: "Voting Power (Low to High)",
    value: { order: ValidatorOrder.VotingPower, isDesc: false },
  },
  {
    label: "Uptime (High to Low)",
    value: { order: ValidatorOrder.Uptime, isDesc: true },
  },
  {
    label: "Uptime (Low to High)",
    value: { order: ValidatorOrder.Uptime, isDesc: false },
  },
  {
    label: "Commission (High to Low)",
    value: { order: ValidatorOrder.Commission, isDesc: true },
  },
  {
    label: "Commission (Low to High)",
    value: { order: ValidatorOrder.Commission, isDesc: false },
  },
];

interface OrderSelectProps {
  order: ValidatorOrder;
  setOrder: (value: ValidatorOrder) => void;
  isDesc: boolean;
  setIsDesc: (value: boolean) => void;
}

export const OrderSelect = ({
  order,
  setOrder,
  isDesc,
  setIsDesc,
}: OrderSelectProps) => (
  <Flex direction="column" gap={1} minW="full">
    <Text variant="body3" color="text.dark" pl={1}>
      Sorted by
    </Text>
    <Select
      size="lg"
      options={ORDER_OPTIONS}
      value={ORDER_OPTIONS.find(
        ({ value }) => value.order === order && value.isDesc === isDesc
      )}
      onChange={(selectedOption) => {
        if (selectedOption) {
          trackUseSort(
            selectedOption.value.order,
            selectedOption.value.isDesc ? "descending" : "ascending"
          );
          setOrder(selectedOption.value.order);
          setIsDesc(selectedOption.value.isDesc);
        }
      }}
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
