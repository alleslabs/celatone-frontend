import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";
import { useCallback } from "react";

import { ValidatorOrder } from "../../types";
import { CustomIcon } from "lib/components/icon";
import { TableHeader } from "lib/components/table";

interface ValidatorsTableHeaderProps {
  templateColumns: GridProps["templateColumns"];
  scrollComponentId: string;
  isActive: boolean;
  order: ValidatorOrder;
  setOrder: (value: ValidatorOrder) => void;
  isDesc: boolean;
  setIsDesc: (value: boolean) => void;
}

const SortIcon = ({
  column,
  order,
  isDesc,
}: {
  column: ValidatorOrder;
  order: ValidatorOrder;
  isDesc: boolean;
}) => {
  if (column !== order) return null;
  return (
    <CustomIcon
      name={isDesc ? "arrow-down" : "arrow-up"}
      my={0}
      boxSize="14px"
      color="gray.600"
    />
  );
};

export const ValidatorsTableHeader = ({
  templateColumns,
  scrollComponentId,
  isActive,
  order,
  setOrder,
  isDesc,
  setIsDesc,
}: ValidatorsTableHeaderProps) => {
  const handleOrderChange = useCallback(
    (column: ValidatorOrder) => () => {
      if (order === column) setIsDesc(!isDesc);
      else {
        setOrder(column);
        setIsDesc(
          column !== ValidatorOrder.Moniker &&
            column !== ValidatorOrder.Commission
        );
      }
    },
    [isDesc, order, setIsDesc, setOrder]
  );

  return (
    <Grid templateColumns={templateColumns} id={scrollComponentId}>
      {isActive && (
        <TableHeader
          textAlign="center"
          cursor="pointer"
          onClick={handleOrderChange(ValidatorOrder.VotingPower)}
        >
          Rank
        </TableHeader>
      )}
      <TableHeader
        cursor="pointer"
        onClick={handleOrderChange(ValidatorOrder.Moniker)}
      >
        Validator
        <SortIcon
          column={ValidatorOrder.Moniker}
          order={order}
          isDesc={isDesc}
        />
      </TableHeader>
      <TableHeader
        cursor="pointer"
        onClick={handleOrderChange(ValidatorOrder.VotingPower)}
      >
        Voting Power
        <SortIcon
          column={ValidatorOrder.VotingPower}
          order={order}
          isDesc={isDesc}
        />
      </TableHeader>
      <TableHeader
        cursor="pointer"
        onClick={handleOrderChange(ValidatorOrder.Uptime)}
      >
        Uptime (100B)
        <SortIcon
          column={ValidatorOrder.Uptime}
          order={order}
          isDesc={isDesc}
        />
      </TableHeader>
      <TableHeader
        cursor="pointer"
        onClick={handleOrderChange(ValidatorOrder.Commission)}
      >
        Commission
        <SortIcon
          column={ValidatorOrder.Commission}
          order={order}
          isDesc={isDesc}
        />
      </TableHeader>
    </Grid>
  );
};
