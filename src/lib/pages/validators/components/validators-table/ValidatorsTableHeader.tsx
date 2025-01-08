import type { GridProps } from "@chakra-ui/react";
import { chakra, Grid } from "@chakra-ui/react";
import { useCallback } from "react";

import { ValidatorOrder } from "../../types";
import { trackUseSort } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";
import { TableHeader } from "lib/components/table";
import { TooltipInfo } from "lib/components/Tooltip";

const SortIcon = ({
  column,
  isDesc,
  order,
}: {
  column: ValidatorOrder;
  isDesc: boolean;
  order: ValidatorOrder;
}) => {
  if (column !== order) return null;
  return (
    <CustomIcon
      my={0}
      name={isDesc ? "arrow-down" : "arrow-up"}
      boxSize="14px"
      color="gray.600"
    />
  );
};

const StyledTableHeader = chakra(TableHeader, {
  baseStyle: {
    _hover: { bgColor: "gray.800", borderRadius: "4px" },
    alignItems: "center",
    cursor: "pointer",
    display: "flex",
    gap: 1,
    py: 4,
    transition: "all 0.25s ease-in-out",
  },
});

interface ValidatorsTableHeaderProps {
  isActive: boolean;
  isDesc: boolean;
  order: ValidatorOrder;
  scrollComponentId: string;
  setIsDesc: (value: boolean) => void;
  setOrder: (value: ValidatorOrder) => void;
  showUptime: boolean;
  templateColumns: GridProps["templateColumns"];
}

export const ValidatorsTableHeader = ({
  isActive,
  isDesc,
  order,
  scrollComponentId,
  setIsDesc,
  setOrder,
  showUptime,
  templateColumns,
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
          isDesc={isDesc}
          column={ValidatorOrder.Moniker}
          order={order}
        />
      </StyledTableHeader>
      <StyledTableHeader
        onClick={handleOrderChange(ValidatorOrder.VotingPower)}
      >
        Voting Power
        <SortIcon
          isDesc={isDesc}
          column={ValidatorOrder.VotingPower}
          order={order}
        />
      </StyledTableHeader>
      {showUptime && (
        <StyledTableHeader onClick={handleOrderChange(ValidatorOrder.Uptime)}>
          Uptime
          <TooltipInfo label="Calculated from recent 100 blocks" />
          <SortIcon
            isDesc={isDesc}
            column={ValidatorOrder.Uptime}
            order={order}
          />
        </StyledTableHeader>
      )}
      <StyledTableHeader onClick={handleOrderChange(ValidatorOrder.Commission)}>
        Commission
        <SortIcon
          isDesc={isDesc}
          column={ValidatorOrder.Commission}
          order={order}
        />
      </StyledTableHeader>
    </Grid>
  );
};
