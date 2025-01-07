/* eslint-disable sonarjs/cognitive-complexity */
import { TableContainer } from "@chakra-ui/react";
import { Fragment } from "react";

import { ValidatorOrder } from "../../types";
import { useInitia, useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { MobileTableContainer } from "lib/components/table";
import { useAssetInfos } from "lib/services/assetService";
import { useStakingParamsLcd } from "lib/services/staking";
import type { ValidatorsResponse } from "lib/services/types";
import type { Option } from "lib/types";
import { getStakingAssetInfo } from "lib/utils";

import { ValidatorsPercentDivider } from "./ValidatorsPercentDivider";
import { ValidatorsTableHeader } from "./ValidatorsTableHeader";
import { ValidatorsTableMobileCard } from "./ValidatorsTableMobileCard";
import { ValidatorsTableRow } from "./ValidatorsTableRow";

interface ValidatorsTableProps {
  data: Option<ValidatorsResponse>;
  isActive: boolean;
  isDesc: boolean;
  isLoading: boolean;
  isSearching?: boolean;
  order: ValidatorOrder;
  scrollComponentId: string;
  setIsDesc: (value: boolean) => void;
  setOrder: (value: ValidatorOrder) => void;
  showUptime?: boolean;
}

export const ValidatorsTable = ({
  data,
  isActive,
  isDesc,
  isLoading,
  isSearching = false,
  order,
  scrollComponentId,
  setIsDesc,
  setOrder,
  showUptime = true,
}: ValidatorsTableProps) => {
  const isMobile = useMobile();
  const isInitia = useInitia();

  const { data: assetInfos } = useAssetInfos({ withPrices: false });
  const { data: stakingParams, isFetching: isStakingParamsLoading } =
    useStakingParamsLcd(!isInitia);

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
              validator={validator}
              isActive={isActive}
              assetInfo={assetInfo}
              minCommissionRate={data.metadata.minCommissionRate}
              showUptime={showUptime}
              totalVotingPower={data.metadata.totalVotingPower}
            />
          ))}
        </MobileTableContainer>
      ) : (
        <TableContainer>
          <ValidatorsTableHeader
            isActive={isActive}
            isDesc={isDesc}
            setIsDesc={setIsDesc}
            setOrder={setOrder}
            order={order}
            scrollComponentId={scrollComponentId}
            showUptime={showUptime}
            templateColumns={templateColumns}
          />
          {data.items.map((validator) => (
            <Fragment key={validator.validatorAddress}>
              <ValidatorsTableRow
                validator={validator}
                isActive={isActive}
                assetInfo={assetInfo}
                minCommissionRate={data.metadata.minCommissionRate}
                showUptime={showUptime}
                templateColumns={templateColumns}
                totalVotingPower={data.metadata.totalVotingPower}
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
