import { Flex, Text } from "@chakra-ui/react";

import { ValidatorOrder } from "../types";
import { trackUseSort } from "lib/amplitude";
import type { SelectInputOption } from "lib/components/forms";
import { SelectInput } from "lib/components/forms";

type OrderOption = SelectInputOption<OrderOptionValue>;

interface OrderOptionValue {
  isDesc: boolean;
  order: ValidatorOrder;
}

const ORDER_OPTIONS: OrderOption[] = [
  {
    label: "Validator Name (A to Z)",
    value: { isDesc: false, order: ValidatorOrder.Moniker },
  },
  {
    label: "Validator Name (Z to A)",
    value: { isDesc: true, order: ValidatorOrder.Moniker },
  },
  {
    label: "Voting Power (High to Low)",
    value: { isDesc: true, order: ValidatorOrder.VotingPower },
  },
  {
    label: "Voting Power (Low to High)",
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
  <Flex gap={1} minW="full" direction="column">
    <Text pl={1} variant="body3" color="text.dark">
      Sorted by
    </Text>
    <SelectInput<OrderOptionValue>
      value={ORDER_OPTIONS.find(
        ({ value }) => value.order === order && value.isDesc === isDesc
      )}
      menuPortalTarget={document.body}
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
      options={
        allowUptime
          ? ORDER_OPTIONS
          : ORDER_OPTIONS.filter(
              (val) => val.value.order !== ValidatorOrder.Uptime
            )
      }
    />
  </Flex>
);
