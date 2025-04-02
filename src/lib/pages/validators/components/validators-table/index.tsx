import type { ValidatorsResponse } from "lib/services/types";
import type { Option } from "lib/types";

import { TableContainer } from "@chakra-ui/react";
import { useInitia, useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { MobileTableContainer } from "lib/components/table";
import { useAssetInfos } from "lib/services/assetService";
import { useStakingParamsRest } from "lib/services/staking";
import { getStakingAssetInfo } from "lib/utils";
import { Fragment } from "react";

import { ValidatorOrder } from "../../types";
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
  isSearching?: boolean;
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
  isSearching = false,
}: ValidatorsTableProps) => {
  const isMobile = useMobile();
  const isInitia = useInitia();

  const { data: assetInfos } = useAssetInfos({ withPrices: false });
  const { data: stakingParams, isFetching: isStakingParamsLoading } =
    useStakingParamsRest(!isInitia);

  if (isLoading || isStakingParamsLoading) return <Loading />;
  if (!data) return <ErrorFetching dataName="validators" />;
  if (!data.total)
    return (
      <EmptyState
        imageVariant={isSearching ? "not-found" : "empty"}
        message={
          isSearching
            ? `No matches found. Please double-check your input and select correct network.`
            : `This network does not have any ${isActive ? "active" : "inactive"} validators.`
        }
        withBorder
      />
    );

  const displayDividers = order === ValidatorOrder.VotingPower && isDesc;
  const assetInfo = getStakingAssetInfo(stakingParams?.bondDenom, assetInfos);

  const templateColumns = `${isActive ? "64px " : ""}3fr 2fr ${showUptime ? "110px" : ""} 110px`;
  return (
    <>
      {isMobile ? (
        <MobileTableContainer>
          {data.items.map((validator) => (
            <ValidatorsTableMobileCard
              key={validator.validatorAddress}
              assetInfo={assetInfo}
              isActive={isActive}
              minCommissionRate={data.metadata.minCommissionRate}
              showUptime={showUptime}
              totalVotingPower={data.metadata.totalVotingPower}
              validator={validator}
            />
          ))}
        </MobileTableContainer>
      ) : (
        <TableContainer>
          <ValidatorsTableHeader
            isActive={isActive}
            isDesc={isDesc}
            order={order}
            scrollComponentId={scrollComponentId}
            setIsDesc={setIsDesc}
            setOrder={setOrder}
            showUptime={showUptime}
            templateColumns={templateColumns}
          />
          {data.items.map((validator) => (
            <Fragment key={validator.validatorAddress}>
              <ValidatorsTableRow
                assetInfo={assetInfo}
                isActive={isActive}
                minCommissionRate={data.metadata.minCommissionRate}
                showUptime={showUptime}
                templateColumns={templateColumns}
                totalVotingPower={data.metadata.totalVotingPower}
                validator={validator}
              />
              {displayDividers &&
                (validator.rank === data.metadata.percent33Rank ||
                  validator.rank === data.metadata.percent66Rank) && (
                  <ValidatorsPercentDivider
                    label={
                      validator.rank === data.metadata.percent66Rank
                        ? "66%"
                        : "33%"
                    }
                    rank={validator.rank}
                  />
                )}
            </Fragment>
          ))}
        </TableContainer>
      )}
    </>
  );
};
