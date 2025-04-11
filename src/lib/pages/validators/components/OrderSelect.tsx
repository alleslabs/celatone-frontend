import type { SelectInputOption } from "lib/components/forms";

import { Flex, Text } from "@chakra-ui/react";
import { trackUseSort } from "lib/amplitude";
import { SelectInput } from "lib/components/forms";

import { ValidatorOrder } from "../types";

interface OrderOptionValue {
  order: ValidatorOrder;
  isDesc: boolean;
}

type OrderOption = SelectInputOption<OrderOptionValue>;

const ORDER_OPTIONS: OrderOption[] = [
  {
    label: "Validator name (A to Z)",
    value: { order: ValidatorOrder.Moniker, isDesc: false },
  },
  {
    label: "Validator name (Z to A)",
    value: { order: ValidatorOrder.Moniker, isDesc: true },
  },
  {
    label: "Voting power (High to Low)",
    value: { order: ValidatorOrder.VotingPower, isDesc: true },
  },
  {
    label: "Voting power (Low to High)",
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
  allowUptime: boolean;
}

export const OrderSelect = ({
  order,
  setOrder,
  isDesc,
  setIsDesc,
  allowUptime,
}: OrderSelectProps) => (
  <Flex direction="column" gap={1} minW="full">
    <Text color="text.dark" pl={1} variant="body3">
      Sorted by
    </Text>
    <SelectInput<OrderOptionValue>
      menuPortalTarget={document.body}
      options={
        allowUptime
          ? ORDER_OPTIONS
          : ORDER_OPTIONS.filter(
              (val) => val.value.order !== ValidatorOrder.Uptime
            )
      }
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
    />
  </Flex>
);
