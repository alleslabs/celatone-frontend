import type { ValidatorsResponse } from "lib/services/types";
import type { Option } from "lib/types";

import { useValidatorsRest } from "lib/services/validator";
import { useEffect, useMemo } from "react";

import type { ValidatorCounts, ValidatorOrder } from "../types";

import { compareValidator, indexValidatorsRest } from "../utils";
import { ValidatorsTable } from "./validators-table";

interface ValidatorsBodyLiteProps {
  isActive: boolean;
  setCounts: (counts: Option<ValidatorCounts>) => void;
  order: ValidatorOrder;
  setOrder: (newOrder: ValidatorOrder) => void;
  isDesc: boolean;
  setIsDesc: (newIsDesc: boolean) => void;
  search: string;
  scrollComponentId: string;
}

export const ValidatorsBodyLite = ({
  isActive,
  setCounts,
  order,
  setOrder,
  isDesc,
  setIsDesc,
  search,
  scrollComponentId,
}: ValidatorsBodyLiteProps) => {
  const { data, isFetching: isLoading } = useValidatorsRest();
  const indexedData = useMemo(() => indexValidatorsRest(data), [data]);
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
      total: filteredList.length,
      metadata: {
        ...indexedData.metadata,
        minCommissionRate: isActive
          ? indexedData.minActiveCommissionRate
          : indexedData.minInactiveCommissionRate,
      },
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
      isLoading={isLoading}
      isSearching={!!search}
      order={order}
      scrollComponentId={scrollComponentId}
      setIsDesc={setIsDesc}
      setOrder={setOrder}
      showUptime={false}
    />
  );
};
