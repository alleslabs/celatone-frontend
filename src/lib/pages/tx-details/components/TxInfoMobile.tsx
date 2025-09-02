import type { FlexProps } from "@chakra-ui/react";
import type { TxData } from "lib/services/types";
import type { Option, Ratio } from "lib/types";

import { chakra, Flex, Text } from "@chakra-ui/react";
import { useEvmConfig } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import { useAssetInfos } from "lib/services/assetService";
import { useMovePoolInfos } from "lib/services/move/poolService";
import {
  computeCosmosFee,
  formatInteger,
  formatPrettyPercent,
  formatTokenWithValue,
} from "lib/utils";

interface TxInfoMobileProps extends FlexProps {
  gasRefundRatio: Option<Ratio<number>>;
  txData: TxData;
}

const Container = chakra(Flex, {
  baseStyle: {
    background: "gray.900",
    borderRadius: 2,
    flexDir: "column",
    gap: 6,
    marginY: 6,
    padding: 3,
  },
});

export const TxInfoMobile = ({
  gasRefundRatio,
  txData,
  ...flexProps
}: TxInfoMobileProps) => {
  const evm = useEvmConfig({ shouldRedirect: false });
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
            ampCopierSection="tx_page_block_height"
            showCopyOnHover
            type="block_height"
            value={txData.height}
          />
        </LabelText>
      </Flex>
      <Flex>
        <LabelText flex={1} label="Transaction fee">
          {feeToken ? (
            formatTokenWithValue({ isEvm: evm.enabled, token: feeToken })
          ) : (
            <Text color="text.dark" variant="body2">
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
          <Text color="text.dark" variant="body2">
            No memo
          </Text>
        )}
      </LabelText>
    </Container>
  );
};
