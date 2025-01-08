import type { FlexProps } from "@chakra-ui/react";
import { chakra, Flex, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import { useAssetInfos } from "lib/services/assetService";
import { useMovePoolInfos } from "lib/services/move/poolService";
import type { TxData } from "lib/services/types";
import {
  coinToTokenWithValue,
  formatInteger,
  formatTokenWithValue,
} from "lib/utils";

interface TxInfoMobileProps extends FlexProps {
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

export const TxInfoMobile = ({ txData, ...flexProps }: TxInfoMobileProps) => {
  const { data: assetInfos } = useAssetInfos({
    withPrices: true,
  });
  const { data: movePoolInfos } = useMovePoolInfos({
    withPrices: true,
  });

  const feeCoin = txData.tx.authInfo.fee?.amount[0];
  const feeToken = feeCoin
    ? coinToTokenWithValue(
        feeCoin.denom,
        feeCoin.amount,
        assetInfos,
        movePoolInfos
      )
    : undefined;
  return (
    <Container {...flexProps}>
      <Flex>
        <LabelText flex={1} label="Network">
          {txData.chainId}
        </LabelText>
        <LabelText flex={1} label="Block">
          <ExplorerLink
            type="block_height"
            value={txData.height}
            ampCopierSection="tx_page_block_height"
            showCopyOnHover
          />
        </LabelText>
      </Flex>
      <Flex>
        <LabelText flex={1} label="Transaction Fee">
          {feeToken ? (
            formatTokenWithValue(feeToken)
          ) : (
            <Text variant="body2" color="text.dark">
              No Fee
            </Text>
          )}
        </LabelText>
        <LabelText flex={1} label="Gas Used/Wanted">
          {`${formatInteger(txData.gasUsed)}/${formatInteger(
            txData.gasWanted
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
