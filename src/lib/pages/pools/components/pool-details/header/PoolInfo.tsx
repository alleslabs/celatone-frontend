import { Divider, Flex, Text } from "@chakra-ui/react";

import { JsonModalButton } from "../JsonModalButton";
import { useGetAddressType } from "lib/app-provider";
import { CopyLink } from "lib/components/CopyLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import type { PoolDetail, Ratio } from "lib/types";
import { PoolType } from "lib/types";
import { formatRatio } from "lib/utils";

interface PoolInfoProps {
  pool: PoolDetail;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export const PoolInfo = ({ pool }: PoolInfoProps) => {
  const getAddressType = useGetAddressType();
  const futurePoolGovernorType = getAddressType(
    pool.futurePoolGovernor ?? undefined
  );

  return (
    <Flex
      background="gray.900"
      borderRadius="8px"
      px={4}
      py={3}
      columnGap={12}
      rowGap={6}
      mt={6}
      wrap="wrap"
    >
      <LabelText label="Pool ID">
        <CopyLink
          value={pool.id.toString()}
          type="pool_id"
          showCopyOnHover
          w="50px"
          amptrackSection="pool_info"
        />
      </LabelText>
      <LabelText label="Created Height">
        <ExplorerLink
          type="block_height"
          value={(pool.blockHeight ?? "N/A").toString()}
          showCopyOnHover
          isReadOnly={!pool.blockHeight}
          ampCopierSection="pool_info"
        />
      </LabelText>
      <LabelText label="Pool Created by">
        <ExplorerLink
          value={pool.creator ?? "N/A"}
          type={getAddressType(pool.creator)}
          isReadOnly={!pool.creator}
          showCopyOnHover
          textFormat="truncate"
          w="140px"
          ampCopierSection="pool_info"
        />
      </LabelText>
      <Divider orientation="vertical" h="46px" />
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
              showCopyOnHover
              textFormat="truncate"
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
            modalHeader="Smooth weight change params"
            jsonString={JSON.stringify(pool.smoothWeightChangeParams)}
          />
        </LabelText>
      )}
      {pool.scalingFactors !== null && (
        <LabelText label="Scaling Factors">
          <JsonModalButton
            modalHeader="Scaling Factors"
            jsonString={JSON.stringify({
              scaling_factors: pool.scalingFactors,
              scaling_factor_controller: pool.scalingFactorController,
            })}
          />
        </LabelText>
      )}
      {pool.type === PoolType.COSMWASM && (
        <LabelText label="Relevant Contract">
          {pool.contractAddress ? (
            <Text variant="body2">
              <ExplorerLink
                value={pool.contractAddress.toString()}
                type="contract_address"
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
