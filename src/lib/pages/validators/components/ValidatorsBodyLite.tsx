import { useEffect, useMemo } from "react";

import type { ValidatorCounts, ValidatorOrder } from "../types";
import { compareValidator, indexValidatorsLcd } from "../utils";
import type { ValidatorsResponse } from "lib/services/types";
import { useValidatorsLcd } from "lib/services/validator";
import type { Option } from "lib/types";

import { ValidatorsTable } from "./validators-table";

interface ValidatorsBodyLiteProps {
  isActive: boolean;
  isDesc: boolean;
  order: ValidatorOrder;
  scrollComponentId: string;
  search: string;
  setCounts: (counts: Option<ValidatorCounts>) => void;
  setIsDesc: (newIsDesc: boolean) => void;
  setOrder: (newOrder: ValidatorOrder) => void;
}

export const ValidatorsBodyLite = ({
  isActive,
  isDesc,
  order,
  scrollComponentId,
  search,
  setCounts,
  setIsDesc,
  setOrder,
}: ValidatorsBodyLiteProps) => {
  const { data, isFetching: isLoading } = useValidatorsLcd();
  const indexedData = useMemo(() => indexValidatorsLcd(data), [data]);
  const filteredData: Option<ValidatorsResponse> = useMemo(() => {
    if (!indexedData) return undefined;

    const selectedList = isActive ? indexedData.active : indexedData.inactive;
    const filteredList = selectedList
      .filter(
        (validator) =>
          validator.moniker.includes(search) ||
          validator.validatorAddress === search
      )
      .sort(compareValidator(order, isDesc));
    return {
      items: filteredList,
      metadata: {
        ...indexedData.metadata,
        minCommissionRate: isActive
          ? indexedData.minActiveCommissionRate
          : indexedData.minInactiveCommissionRate,
      },
      total: filteredList.length,
    };
  }, [indexedData, isActive, isDesc, order, search]);

  useEffect(() => {
    setCounts(
      indexedData
        ? {
            activeCount: indexedData.active.length,
            inactiveCount: indexedData.inactive.length,
          }
        : undefined
    );
  }, [indexedData, setCounts]);

  return (
    <ValidatorsTable
      data={filteredData}
      isActive={isActive}
      isDesc={isDesc}
      isSearching={!!search}
      setIsDesc={setIsDesc}
      setOrder={setOrder}
      isLoading={isLoading}
      order={order}
      scrollComponentId={scrollComponentId}
      showUptime={false}
    />
  );
};
