import type { FlexProps } from "@chakra-ui/react";
import { chakra, Flex, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { useAssetInfos } from "lib/services/assetService";
import { useMovePoolInfos } from "lib/services/move/poolService";
import type { TxData } from "lib/services/types";
import { Option, Ratio } from "lib/types";
import {
  computeCosmosFee,
  formatInteger,
  formatPrettyPercent,
  formatTokenWithValue,
} from "lib/utils";

interface TxInfoProps extends FlexProps {
  txData: TxData;
  gasRefundRatio: Option<Ratio<number>>;
}

const Container = chakra(Flex, {
  baseStyle: {
    flexDir: "column",
    gap: 6,
    w: "250px",
    minW: "180px",
  },
});

export const TxInfo = ({
  txData,
  gasRefundRatio,
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
      <LabelText label="Block Height">
        <ExplorerLink
          value={txData.height}
          type="block_height"
          showCopyOnHover
          ampCopierSection="tx_page_block_height"
        />
      </LabelText>
      <LabelText label="Transaction Fee">
        {feeToken ? (
          formatTokenWithValue(feeToken)
        ) : (
          <Text variant="body2" color="text.dark">
            No Fee
          </Text>
        )}
      </LabelText>
      <LabelText label="Gas Used/Wanted">
        {`${formatInteger(txData.gasUsed)}/${formatInteger(txData.gasWanted)}`}
      </LabelText>
      {gasRefundRatio && (
        <LabelText label="Gas Refund Percentage">
          {`${formatPrettyPercent(gasRefundRatio, 2, true)}`}
        </LabelText>
      )}
      <LabelText label="Memo">
        {txData.tx.body.memo || (
          <Text variant="body2" color="text.dark">
            No Memo
          </Text>
        )}
      </LabelText>
      <UserDocsLink
        cta="Read more about Txs"
        href="general/transactions/detail-page"
        mt={0}
      />
    </Container>
  );
};
