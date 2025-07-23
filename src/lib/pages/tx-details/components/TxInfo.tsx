import type { FlexProps } from "@chakra-ui/react";
import type { TxData } from "lib/services/types";
import type { Option, Ratio } from "lib/types";

import { chakra, Flex, Text } from "@chakra-ui/react";
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

interface TxInfoProps extends FlexProps {
  gasRefundRatio: Option<Ratio<number>>;
  txData: TxData;
}

const Container = chakra(Flex, {
  baseStyle: {
    flexDir: "column",
    gap: 6,
    minW: "180px",
    w: "250px",
  },
});

export const TxInfo = ({
  gasRefundRatio,
  txData,
  ...flexProps
}: TxInfoProps) => {
  const { data: assetInfos } = useAssetInfos({
    withPrices: true,
  });
  const { data: movePoolInfos } = useMovePoolInfos({
    withPrices: true,
  });

  const feeCoin = txData.tx.authInfo?.fee?.amount[0];
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
      <LabelText label="Network">{txData.chainId}</LabelText>
      <LabelText label="Block">
        <ExplorerLink
          ampCopierSection="tx_page_block_height"
          showCopyOnHover
          type="block_height"
          value={txData.height}
        />
      </LabelText>
      <LabelText label="Signer">
        <ExplorerLink
          showCopyOnHover
          type="user_address"
          value={txData.signer}
        />
      </LabelText>
      <LabelText label="Transaction fee">
        {feeToken ? (
          formatTokenWithValue(feeToken)
        ) : (
          <Text color="text.dark" variant="body2">
            No fee
          </Text>
        )}
      </LabelText>
      <LabelText label="Gas used/requested">
        {`${formatInteger(txData.gasUsed)}/${formatInteger(txData.gasWanted)}`}
      </LabelText>
      {gasRefundRatio && (
        <LabelText label="Gas refund percentage">
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
