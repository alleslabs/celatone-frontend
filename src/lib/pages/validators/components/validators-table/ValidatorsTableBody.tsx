import type { GridProps } from "@chakra-ui/react";

import { ValidatorOrder } from "../../types";
import { useCelatoneApp, useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { useAssetInfos } from "lib/services/assetService";
import type { ValidatorsResponse } from "lib/services/validator";
import type { Option } from "lib/types";
import { coinToTokenWithValue } from "lib/utils";

import { ValidatorsPercentDivider } from "./ValidatorsPercentDivider";
import { ValidatorsTableMobileCard } from "./ValidatorsTableMobileCard";
import { ValidatorsTableRow } from "./ValidatorsTableRow";

interface ValidatorsTableBodyProps {
  templateColumns: GridProps["templateColumns"];
  data: Option<ValidatorsResponse>;
  isLoading: boolean;
  isActive: boolean;
  order: ValidatorOrder;
  isDesc: boolean;
}

export const ValidatorsTableBody = ({
  templateColumns,
  data,
  isLoading,
  isActive,
  order,
  isDesc,
}: ValidatorsTableBodyProps) => {
  const isMobile = useMobile();
  const {
    chainConfig: {
      extra: { singleStakingDenom },
    },
  } = useCelatoneApp();
  const { data: assetInfos } = useAssetInfos({ withPrices: false });

  if (isLoading) return <Loading />;
  if (!data) return <ErrorFetching dataName="validators" />;
  if (!data.total)
    return (
      <EmptyState
        imageVariant="empty"
        message="This network does not have any validators."
        withBorder
      />
    );

  const displayDividers = order === ValidatorOrder.VotingPower && isDesc;
  const denomToken = singleStakingDenom
    ? coinToTokenWithValue(singleStakingDenom, "0", assetInfos)
    : undefined;
  return isMobile ? (
    <>
      {data.items.map((validator) => (
        <ValidatorsTableMobileCard
          key={validator.validatorAddress}
          isActive={isActive}
          validator={validator}
          totalVotingPower={data.metadata.totalVotingPower}
          minCommissionRate={data.metadata.minCommissionRate}
          denomToken={denomToken}
        />
      ))}
    </>
  ) : (
    <>
      {data.items.map((validator) => (
        <>
          <ValidatorsTableRow
            key={validator.validatorAddress}
            templateColumns={templateColumns}
            isActive={isActive}
            validator={validator}
            totalVotingPower={data.metadata.totalVotingPower}
            minCommissionRate={data.metadata.minCommissionRate}
            denomToken={denomToken}
          />
          {displayDividers &&
            data.metadata.percent33Rank === validator.rank && (
              <ValidatorsPercentDivider rank={validator.rank} label="33%" />
            )}
          {displayDividers &&
            data.metadata.percent66Rank === validator.rank && (
              <ValidatorsPercentDivider rank={validator.rank} label="66%" />
            )}
        </>
      ))}
    </>
  );
};
