import { TableContainer } from "@chakra-ui/react";

import type { ValidatorOrder } from "../../types";
import { useMobile } from "lib/app-provider";
import { MobileTableContainer } from "lib/components/table";
import type { ValidatorsResponse } from "lib/services/validator";
import type { Option } from "lib/types";

import { ValidatorsTableBody } from "./ValidatorsTableBody";
import { ValidatorsTableHeader } from "./ValidatorsTableHeader";

interface ValidatorsTableProps {
  data: Option<ValidatorsResponse>;
  isLoading: boolean;
  isActive: boolean;
  order: ValidatorOrder;
  setOrder: (value: ValidatorOrder) => void;
  isDesc: boolean;
  setIsDesc: (value: boolean) => void;
  scrollComponentId: string;
}

export const ValidatorsTable = ({
  data,
  isLoading,
  isActive,
  order,
  setOrder,
  isDesc,
  setIsDesc,
  scrollComponentId,
}: ValidatorsTableProps) => {
  const isMobile = useMobile();
  const templateColumns = `${isActive ? "64px " : ""}3fr 2fr 110px 110px`;
  return (
    <>
      {isMobile ? (
        <MobileTableContainer>
          <ValidatorsTableBody
            templateColumns={templateColumns}
            data={data}
            isLoading={isLoading}
            isActive={isActive}
            order={order}
            isDesc={isDesc}
          />
        </MobileTableContainer>
      ) : (
        <TableContainer>
          <ValidatorsTableHeader
            templateColumns={templateColumns}
            scrollComponentId={scrollComponentId}
            isActive={isActive}
            order={order}
            setOrder={setOrder}
            isDesc={isDesc}
            setIsDesc={setIsDesc}
          />
          <ValidatorsTableBody
            templateColumns={templateColumns}
            data={data}
            isLoading={isLoading}
            isActive={isActive}
            order={order}
            isDesc={isDesc}
          />
        </TableContainer>
      )}
    </>
  );
};
