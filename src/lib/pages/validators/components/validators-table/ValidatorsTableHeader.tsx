import type { GridProps } from "@chakra-ui/react";

import { chakra, Grid } from "@chakra-ui/react";
import { trackUseSort } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";
import { TableHeader } from "lib/components/table";
import { TooltipInfo } from "lib/components/Tooltip";
import { useCallback } from "react";

import { ValidatorOrder } from "../../types";

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
      boxSize="14px"
      color="gray.600"
      my={0}
      name={isDesc ? "arrow-down" : "arrow-up"}
    />
  );
};

const StyledTableHeader = chakra(TableHeader, {
  baseStyle: {
    display: "flex",
    gap: 1,
    alignItems: "center",
    py: 4,
    cursor: "pointer",
    transition: "all 0.25s ease-in-out",
    _hover: { bgColor: "gray.800", borderRadius: "4px" },
  },
});

interface ValidatorsTableHeaderProps {
  templateColumns: GridProps["templateColumns"];
  scrollComponentId: string;
  isActive: boolean;
  order: ValidatorOrder;
  setOrder: (value: ValidatorOrder) => void;
  isDesc: boolean;
  setIsDesc: (value: boolean) => void;
  showUptime: boolean;
}

export const ValidatorsTableHeader = ({
  templateColumns,
  scrollComponentId,
  isActive,
  order,
  setOrder,
  isDesc,
  setIsDesc,
  showUptime,
}: ValidatorsTableHeaderProps) => {
  const handleOrderChange = useCallback(
    (column: ValidatorOrder) => () => {
      if (order === column) {
        const newIsDesc = !isDesc;
        trackUseSort(column, newIsDesc ? "descending" : "ascending");
        setIsDesc(newIsDesc);
      } else {
        const newIsDesc =
          column !== ValidatorOrder.Moniker &&
          column !== ValidatorOrder.Commission;
        trackUseSort(column, newIsDesc ? "descending" : "ascending");
        setOrder(column);
        setIsDesc(newIsDesc);
      }
    },
    [isDesc, order, setIsDesc, setOrder]
  );

  return (
    <Grid id={scrollComponentId} templateColumns={templateColumns}>
      {isActive && (
        <StyledTableHeader
          textAlign="center"
          onClick={handleOrderChange(ValidatorOrder.VotingPower)}
        >
          Rank
        </StyledTableHeader>
      )}
      <StyledTableHeader onClick={handleOrderChange(ValidatorOrder.Moniker)}>
        Validator
        <SortIcon
          column={ValidatorOrder.Moniker}
          isDesc={isDesc}
          order={order}
        />
      </StyledTableHeader>
      <StyledTableHeader
        onClick={handleOrderChange(ValidatorOrder.VotingPower)}
      >
        Voting Power
        <SortIcon
          column={ValidatorOrder.VotingPower}
          isDesc={isDesc}
          order={order}
        />
      </StyledTableHeader>
      {showUptime && (
        <StyledTableHeader onClick={handleOrderChange(ValidatorOrder.Uptime)}>
          Uptime
          <TooltipInfo label="Calculated from recent 100 blocks" />
          <SortIcon
            column={ValidatorOrder.Uptime}
            isDesc={isDesc}
            order={order}
          />
        </StyledTableHeader>
      )}
      <StyledTableHeader onClick={handleOrderChange(ValidatorOrder.Commission)}>
        Commission
        <SortIcon
          column={ValidatorOrder.Commission}
          isDesc={isDesc}
          order={order}
        />
      </StyledTableHeader>
    </Grid>
  );
};
