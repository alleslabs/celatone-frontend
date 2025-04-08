import type { PoolData, Ratio } from "lib/types";

import { Divider, Flex, Text } from "@chakra-ui/react";
import { useGetAddressType } from "lib/app-provider";
import { CopyLink } from "lib/components/CopyLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import { PoolType } from "lib/types";
import { formatRatio } from "lib/utils";

import { JsonModalButton } from "../JsonModalButton";

interface PoolInfoProps {
  pool: PoolData;
}

export const PoolInfo = ({ pool }: PoolInfoProps) => {
  const getAddressType = useGetAddressType();
  const futurePoolGovernorType = getAddressType(
    pool.futurePoolGovernor ?? undefined
  );

  return (
    <Flex
      background="gray.900"
      borderRadius="8px"
      columnGap={12}
      mt={6}
      px={4}
      py={3}
      rowGap={6}
      wrap="wrap"
    >
      <LabelText label="Pool ID">
        <CopyLink
          amptrackSection="pool_info"
          showCopyOnHover
          type="pool_id"
          value={pool.id.toString()}
          w="50px"
        />
      </LabelText>
      <LabelText label="Created height">
        <ExplorerLink
          ampCopierSection="pool_info"
          isReadOnly={!pool.createdHeight}
          showCopyOnHover
          type="block_height"
          value={(pool.createdHeight ?? "N/A").toString()}
        />
      </LabelText>
      <LabelText label="Pool created by">
        <ExplorerLink
          ampCopierSection="pool_info"
          isReadOnly={!pool.creator}
          showCopyOnHover
          textFormat="truncate"
          type={getAddressType(pool.creator)}
          value={pool.creator ?? "N/A"}
          w="140px"
        />
      </LabelText>
      <Divider h="46px" orientation="vertical" />
      {(pool.type === PoolType.BALANCER ||
        pool.type === PoolType.STABLESWAP) && (
        <LabelText
          label="Swap fee"
          tooltipText="The fee charged for making a swap in a pool, defined by the pool creator, and paid by traders in the form of a percentage the input swap asset amount"
        >
          <Text variant="body2">
            {formatRatio(Number(pool.swapFee) as Ratio<number>)}
          </Text>
        </LabelText>
      )}
      {(pool.type === PoolType.BALANCER ||
        pool.type === PoolType.STABLESWAP) && (
        <LabelText
          label="Exit fee"
          tooltipText="The fee charged when withdrawing from a pool, defined by the pool creator, and paid by the withdrawer in the form of LP tokens"
        >
          <Text variant="body2">
            {formatRatio(Number(pool.exitFee) as Ratio<number>)}
          </Text>
        </LabelText>
      )}
      {(pool.type === PoolType.BALANCER ||
        pool.type === PoolType.STABLESWAP) && (
        <LabelText label="Future governor">
          {futurePoolGovernorType !== "invalid_address" ? (
            <ExplorerLink
              showCopyOnHover
              textFormat="truncate"
              type={futurePoolGovernorType}
              value={pool.futurePoolGovernor}
              w="140px"
            />
          ) : (
            <Text
              as="p"
              color={
                pool.futurePoolGovernor.length ? "text.main" : "text.disabled"
              }
              variant="body2"
            >
              {pool.futurePoolGovernor.length ? pool.futurePoolGovernor : "N/A"}
            </Text>
          )}
        </LabelText>
      )}
      {pool.tickSpacing !== null && (
        <LabelText
          label="Tick spacing"
          tooltipText="The distance between two ticks."
        >
          <Text variant="body2">{pool.tickSpacing}</Text>
        </LabelText>
      )}
      {pool.spreadFactor !== null && (
        <LabelText
          label="Spread factor"
          tooltipText="Swap fee to be paid by swapper."
        >
          <Text variant="body2">
            {formatRatio(Number(pool.spreadFactor) as Ratio<number>)}
          </Text>
        </LabelText>
      )}
      {pool.smoothWeightChangeParams !== null && (
        <LabelText label="Smooth weight change params">
          <JsonModalButton
            jsonString={JSON.stringify(pool.smoothWeightChangeParams)}
            modalHeader="Smooth weight change params"
          />
        </LabelText>
      )}
      {pool.scalingFactors !== null && (
        <LabelText label="Scaling factors">
          <JsonModalButton
            jsonString={JSON.stringify({
              scaling_factors: pool.scalingFactors,
              scaling_factor_controller: pool.scalingFactorController,
            })}
            modalHeader="Scaling factors"
            modalHeader="Scaling Factors"
          />
        </LabelText>
      )}
      {pool.type === PoolType.COSMWASM && (
        <LabelText label="Relevant contract">
          {pool.contractAddress ? (
            <Text variant="body2">
              <ExplorerLink
                showCopyOnHover
                type="contract_address"
                value={pool.contractAddress.toString()}
              />
            </Text>
          ) : (
            <Text color="text.disabled" variant="body2">
              N/A
            </Text>
          )}
        </LabelText>
      )}
    </Flex>
  );
};
