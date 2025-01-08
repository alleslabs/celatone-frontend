import { Divider, Flex, Text } from "@chakra-ui/react";

import { JsonModalButton } from "../JsonModalButton";
import { useGetAddressType } from "lib/app-provider";
import { CopyLink } from "lib/components/CopyLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import type { PoolData, Ratio } from "lib/types";
import { PoolType } from "lib/types";
import { formatRatio } from "lib/utils";

interface PoolInfoProps {
  pool: PoolData;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export const PoolInfo = ({ pool }: PoolInfoProps) => {
  const getAddressType = useGetAddressType();
  const futurePoolGovernorType = getAddressType(
    pool.futurePoolGovernor ?? undefined
  );

  return (
    <Flex
      mt={6}
      px={4}
      py={3}
      wrap="wrap"
      background="gray.900"
      borderRadius="8px"
      columnGap={12}
      rowGap={6}
    >
      <LabelText label="Pool ID">
        <CopyLink
          type="pool_id"
          value={pool.id.toString()}
          w="50px"
          amptrackSection="pool_info"
          showCopyOnHover
        />
      </LabelText>
      <LabelText label="Created Height">
        <ExplorerLink
          isReadOnly={!pool.createdHeight}
          type="block_height"
          value={(pool.createdHeight ?? "N/A").toString()}
          ampCopierSection="pool_info"
          showCopyOnHover
        />
      </LabelText>
      <LabelText label="Pool Created by">
        <ExplorerLink
          isReadOnly={!pool.creator}
          type={getAddressType(pool.creator)}
          value={pool.creator ?? "N/A"}
          w="140px"
          ampCopierSection="pool_info"
          showCopyOnHover
          textFormat="truncate"
        />
      </LabelText>
      <Divider h="46px" orientation="vertical" />
      {(pool.type === PoolType.BALANCER ||
        pool.type === PoolType.STABLESWAP) && (
        <LabelText
          label="Swap Fee"
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
          label="Exit Fee"
          tooltipText="The fee charged when withdrawing from a pool, defined by the pool creator, and paid by the withdrawer in the form of LP tokens"
        >
          <Text variant="body2">
            {formatRatio(Number(pool.exitFee) as Ratio<number>)}
          </Text>
        </LabelText>
      )}
      {(pool.type === PoolType.BALANCER ||
        pool.type === PoolType.STABLESWAP) && (
        <LabelText label="Future Governor">
          {futurePoolGovernorType !== "invalid_address" ? (
            <ExplorerLink
              type={futurePoolGovernorType}
              value={pool.futurePoolGovernor}
              w="140px"
              showCopyOnHover
              textFormat="truncate"
            />
          ) : (
            <Text
              as="p"
              variant="body2"
              color={
                pool.futurePoolGovernor.length ? "text.main" : "text.disabled"
              }
            >
              {pool.futurePoolGovernor.length ? pool.futurePoolGovernor : "N/A"}
            </Text>
          )}
        </LabelText>
      )}
      {pool.tickSpacing !== null && (
        <LabelText
          label="Tick Spacing"
          tooltipText="The distance between two ticks."
        >
          <Text variant="body2">{pool.tickSpacing}</Text>
        </LabelText>
      )}
      {pool.spreadFactor !== null && (
        <LabelText
          label="Spread Factor"
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
        <LabelText label="Scaling Factors">
          <JsonModalButton
            jsonString={JSON.stringify({
              scaling_factor_controller: pool.scalingFactorController,
              scaling_factors: pool.scalingFactors,
            })}
            modalHeader="Scaling Factors"
          />
        </LabelText>
      )}
      {pool.type === PoolType.COSMWASM && (
        <LabelText label="Relevant Contract">
          {pool.contractAddress ? (
            <Text variant="body2">
              <ExplorerLink
                type="contract_address"
                value={pool.contractAddress.toString()}
                showCopyOnHover
              />
            </Text>
          ) : (
            <Text variant="body2" color="text.disabled">
              N/A
            </Text>
          )}
        </LabelText>
      )}
    </Flex>
  );
};
