import { Divider, Flex, Text } from "@chakra-ui/react";

import { JsonModalButton } from "../JsonModalButton";
import { useGetAddressType } from "lib/app-provider";
import { CopyLink } from "lib/components/CopyLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import type { PoolDetail } from "lib/types";
import { formatRatio } from "lib/utils";

interface PoolInfoProps {
  pool: PoolDetail;
}

export const PoolInfo = ({ pool }: PoolInfoProps) => {
  const getAddressType = useGetAddressType();
  const futurePoolGovernorType = getAddressType(pool.futurePoolGovernor);
  return (
    <Flex
      background="pebble.900"
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
      <LabelText
        label="Swap Fee"
        tooltipText="The fee charged for making a swap in a pool, defined by the pool creator, and paid by traders in the form of a percentage the input swap asset amount"
      >
        <Text variant="body2">{formatRatio(pool.swapFee)}</Text>
      </LabelText>
      <LabelText
        label="Exit Fee"
        tooltipText="The fee charged when withdrawing from a pool, defined by the pool creator, and paid by the withdrawer in the form of LP tokens"
      >
        <Text variant="body2">{formatRatio(pool.exitFee)}</Text>
      </LabelText>
      <LabelText label="Future Governor">
        {futurePoolGovernorType !== "invalid_address" ? (
          <ExplorerLink
            type={futurePoolGovernorType}
            value={pool.futurePoolGovernor ?? "N/A"}
            isReadOnly={!pool.futurePoolGovernor}
            showCopyOnHover
            textFormat="truncate"
            w="140px"
          />
        ) : (
          <Text
            as="p"
            color={pool.futurePoolGovernor ? "text.main" : "text.disabled"}
            variant="body2"
          >
            {pool.futurePoolGovernor ?? "N/A"}
          </Text>
        )}
      </LabelText>
      {/* TODO - Change value */}
      {pool.tickSpacing && (
        <LabelText label="Tick Spacing" tooltipText="">
          <Text variant="body2">100</Text>
        </LabelText>
      )}
      {/* TODO - Change value */}
      {pool.spreadFactor && (
        <LabelText label="Spread Factor" tooltipText="">
          <Text variant="body2">{formatRatio(pool.exitFee)}</Text>
        </LabelText>
      )}
      {pool.smoothWeightChangeParams && (
        <LabelText label="Smooth weight change params">
          <JsonModalButton
            modalHeader="Smooth weight change params"
            jsonString={JSON.stringify(pool.smoothWeightChangeParams)}
          />
        </LabelText>
      )}
      {pool.scalingFactors && (
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
    </Flex>
  );
};
