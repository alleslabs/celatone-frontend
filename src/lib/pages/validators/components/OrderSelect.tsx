import type { SelectInputOption } from "lib/components/forms";

import { Flex, Text } from "@chakra-ui/react";
import { trackUseSort } from "lib/amplitude";
import { SelectInput } from "lib/components/forms";

import { ValidatorOrder } from "../types";

interface OrderOptionValue {
  isDesc: boolean;
  order: ValidatorOrder;
}

type OrderOption = SelectInputOption<OrderOptionValue>;

const ORDER_OPTIONS: OrderOption[] = [
  {
    label: "Validator name (A to Z)",
    value: { isDesc: false, order: ValidatorOrder.Moniker },
  },
  {
    label: "Validator name (Z to A)",
    value: { isDesc: true, order: ValidatorOrder.Moniker },
  },
  {
    label: "Voting power (High to Low)",
    value: { isDesc: true, order: ValidatorOrder.VotingPower },
  },
  {
    label: "Voting power (Low to High)",
    value: { isDesc: false, order: ValidatorOrder.VotingPower },
  },
  {
    label: "Uptime (High to Low)",
    value: { isDesc: true, order: ValidatorOrder.Uptime },
  },
  {
    label: "Uptime (Low to High)",
    value: { isDesc: false, order: ValidatorOrder.Uptime },
  },
  {
    label: "Commission (High to Low)",
    value: { isDesc: true, order: ValidatorOrder.Commission },
  },
  {
    label: "Commission (Low to High)",
    value: { isDesc: false, order: ValidatorOrder.Commission },
  },
];

interface OrderSelectProps {
  allowUptime: boolean;
  isDesc: boolean;
  order: ValidatorOrder;
  setIsDesc: (value: boolean) => void;
  setOrder: (value: ValidatorOrder) => void;
}

export const OrderSelect = ({
  allowUptime,
  isDesc,
  order,
  setIsDesc,
  setOrder,
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
