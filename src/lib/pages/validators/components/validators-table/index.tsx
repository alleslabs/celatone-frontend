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
  const denomToken = stakingParams?.bondDenom
    ? coinToTokenWithValue(stakingParams.bondDenom, "0", assetInfos)
    : undefined;

  const templateColumns = `${isActive ? "64px " : ""}3fr 2fr ${showUptime ? "110px" : ""} 110px`;

  // NOTE: Divided by 1e6 in case of initia case
  const totalVotingPower = stakingParams?.bondDenom
    ? data.metadata.totalVotingPower
    : data.metadata.totalVotingPower.div(1e6);

  const validators = data.items.map((validator) => ({
    ...validator,
    votingPower: stakingParams?.bondDenom
      ? validator.votingPower
      : validator.votingPower.div(1e6),
  }));

  return (
    <>
      {isMobile ? (
        <MobileTableContainer>
          {validators.map((validator) => (
            <ValidatorsTableMobileCard
              key={validator.validatorAddress}
              isActive={isActive}
              validator={validator}
              totalVotingPower={totalVotingPower}
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
          {validators.map((validator) => (
            <Fragment key={validator.validatorAddress}>
              <ValidatorsTableRow
                templateColumns={templateColumns}
                isActive={isActive}
                validator={validator}
                totalVotingPower={totalVotingPower}
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
