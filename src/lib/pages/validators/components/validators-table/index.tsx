import { TableContainer } from "@chakra-ui/react";
import { Fragment } from "react";

import { ValidatorOrder } from "../../types";
import { useCelatoneApp, useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { MobileTableContainer } from "lib/components/table";
import { useAssetInfos } from "lib/services/assetService";
import type { ValidatorsResponse } from "lib/services/types";
import type { Option } from "lib/types";
import { coinToTokenWithValue } from "lib/utils";

import { ValidatorsPercentDivider } from "./ValidatorsPercentDivider";
import { ValidatorsTableHeader } from "./ValidatorsTableHeader";
import { ValidatorsTableMobileCard } from "./ValidatorsTableMobileCard";
import { ValidatorsTableRow } from "./ValidatorsTableRow";

interface ValidatorsTableProps {
  data: Option<ValidatorsResponse>;
  isLoading: boolean;
  isActive: boolean;
  order: ValidatorOrder;
  setOrder: (value: ValidatorOrder) => void;
  isDesc: boolean;
  setIsDesc: (value: boolean) => void;
  scrollComponentId: string;
  showUptime?: boolean;
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
  showUptime = true,
}: ValidatorsTableProps) => {
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
        message={`This network does not have any ${isActive ? "active" : "inactive"} validators.`}
        withBorder
      />
    );

  const displayDividers = order === ValidatorOrder.VotingPower && isDesc;
  const denomToken = singleStakingDenom
    ? coinToTokenWithValue(singleStakingDenom, "0", assetInfos)
    : undefined;

  const templateColumns = `${isActive ? "64px " : ""}3fr 2fr ${showUptime ? "110px" : ""} 110px`;
  return (
    <>
      {isMobile ? (
        <MobileTableContainer>
          {data.items.map((validator) => (
            <ValidatorsTableMobileCard
              key={validator.validatorAddress}
              isActive={isActive}
              validator={validator}
              totalVotingPower={data.metadata.totalVotingPower}
              minCommissionRate={data.metadata.minCommissionRate}
              denomToken={denomToken}
              showUptime={showUptime}
            />
          ))}
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
            showUptime={showUptime}
          />
          {data.items.map((validator) => (
            <Fragment key={validator.validatorAddress}>
              <ValidatorsTableRow
                templateColumns={templateColumns}
                isActive={isActive}
                validator={validator}
                totalVotingPower={data.metadata.totalVotingPower}
                minCommissionRate={data.metadata.minCommissionRate}
                denomToken={denomToken}
                showUptime={showUptime}
              />
              {displayDividers &&
                (validator.rank === data.metadata.percent33Rank ||
                  validator.rank === data.metadata.percent66Rank) && (
                  <ValidatorsPercentDivider
                    rank={validator.rank}
                    label={
                      validator.rank === data.metadata.percent66Rank
                        ? "66%"
                        : "33%"
                    }
                  />
                )}
            </Fragment>
          ))}
        </TableContainer>
      )}
    </>
  );
};
