import type { FlexProps } from "@chakra-ui/react";
import { Text, chakra, Flex } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import type { AssetInfosOpt } from "lib/services/assetService";
import type { TxData } from "lib/services/txService";
import { formatBalanceWithDenom, formatInteger } from "lib/utils";

interface TxInfoProps extends FlexProps {
  txData: TxData;
  assetInfos: AssetInfosOpt;
}

const Container = chakra(Flex, {
  baseStyle: {
    flexDir: "column",
    gap: 6,
    w: "250px",
    minW: "180px",
  },
});

export const TxInfo = ({ txData, assetInfos, ...flexProps }: TxInfoProps) => {
  const feeCoin = txData.tx.auth_info.fee?.amount[0];
  const assetInfo = feeCoin ? assetInfos?.[feeCoin.denom] : undefined;
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
        {feeCoin ? (
          formatBalanceWithDenom({
            coin: feeCoin,
            symbol: assetInfo?.symbol,
            precision: assetInfo?.precision,
          })
        ) : (
          <Text variant="body2" color="text.dark">
            No Fee
          </Text>
        )}
      </LabelText>
      <LabelText label="Gas Used/Wanted">
        {`${formatInteger(txData.gas_used)}/${formatInteger(
          txData.gas_wanted
        )}`}
      </LabelText>
      <LabelText label="Memo">
        {txData.tx.body.memo || (
          <Text variant="body2" color="text.dark">
            No Memo
          </Text>
        )}
      </LabelText>
    </Container>
  );
};
