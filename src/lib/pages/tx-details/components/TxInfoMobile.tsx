import type { FlexProps } from "@chakra-ui/react";
import { Text, chakra, Flex } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import type { AssetInfosOpt } from "lib/services/assetService";
import type { TxData } from "lib/services/txService";
import { formatBalanceWithDenom, formatInteger } from "lib/utils";

interface TxInfoMobileProps extends FlexProps {
  txData: TxData;
  assetInfos: AssetInfosOpt;
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
  assetInfos,
  ...flexProps
}: TxInfoMobileProps) => {
  const feeCoin = txData.tx.auth_info.fee?.amount.at(0);
  const assetInfo = feeCoin ? assetInfos?.[feeCoin.denom] : undefined;
  return (
    <Container {...flexProps}>
      <Flex>
        <LabelText flex="1" label="Network">
          {txData.chainId}
        </LabelText>
        <LabelText flex="1" label="Block Height">
          <ExplorerLink
            value={txData.height}
            type="block_height"
            showCopyOnHover
            ampCopierSection="tx_page_block_height"
          />
        </LabelText>
      </Flex>
      <Flex>
        <LabelText flex="1" label="Transaction Fee">
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
        <LabelText flex="1" label="Gas Used/Wanted">
          {`${formatInteger(txData.gas_used)}/${formatInteger(
            txData.gas_wanted
          )}`}
        </LabelText>
      </Flex>
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
