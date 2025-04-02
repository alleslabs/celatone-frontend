import type { FlexProps } from "@chakra-ui/react";
import { chakra, Flex, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import { useAssetInfos } from "lib/services/assetService";
import { useMovePoolInfos } from "lib/services/move/poolService";
import type { TxData } from "lib/services/types";
import type { Option, Ratio } from "lib/types";
import {
  computeCosmosFee,
  formatInteger,
  formatPrettyPercent,
  formatTokenWithValue,
} from "lib/utils";

interface TxInfoMobileProps extends FlexProps {
  txData: TxData;
  gasRefundRatio: Option<Ratio<number>>;
}

const Container = chakra(Flex, {
  baseStyle: {
    flexDir: "column",
    background: "gray.900",
    borderRadius: 2,
    padding: 3,
    gap: 6,
    marginY: 6,
  },
});

export const TxInfoMobile = ({
  txData,
  gasRefundRatio,
  ...flexProps
}: TxInfoMobileProps) => {
  const { data: assetInfos } = useAssetInfos({
    withPrices: true,
  });
  const { data: movePoolInfos } = useMovePoolInfos({
    withPrices: true,
  });

  const feeCoin = txData.tx.authInfo.fee?.amount[0];
  const feeToken = computeCosmosFee(
    feeCoin,
    txData.gasUsed,
    txData.gasWanted,
    gasRefundRatio,
    assetInfos,
    movePoolInfos
  );
  return (
    <Container {...flexProps}>
      <Flex>
        <LabelText flex={1} label="Network">
          {txData.chainId}
        </LabelText>
        <LabelText flex={1} label="Block">
          <ExplorerLink
            value={txData.height}
            type="block_height"
            showCopyOnHover
            ampCopierSection="tx_page_block_height"
          />
        </LabelText>
      </Flex>
      <Flex>
        <LabelText flex={1} label="Transaction fee">
          {feeToken ? (
            formatTokenWithValue(feeToken)
          ) : (
            <Text variant="body2" color="text.dark">
              No fee
            </Text>
          )}
        </LabelText>
        <LabelText flex={1} label="Gas used/wanted">
          {`${formatInteger(txData.gasUsed)}/${formatInteger(
            txData.gasWanted
          )}`}
        </LabelText>
      </Flex>
      {gasRefundRatio && (
        <LabelText flex={1} label="Gas refund percentage">
          {`${formatPrettyPercent(gasRefundRatio, 2, true)}`}
        </LabelText>
      )}
      <LabelText label="Memo">
        {txData.tx.body.memo || (
          <Text variant="body2" color="text.dark">
            No memo
          </Text>
        )}
      </LabelText>
    </Container>
  );
};
