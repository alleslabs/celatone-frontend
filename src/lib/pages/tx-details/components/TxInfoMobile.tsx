import type { FlexProps } from "@chakra-ui/react";
import type { TxData } from "lib/services/types";
import type { Option, Ratio } from "lib/types";

import { chakra, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import { TokenImageWithAmount } from "lib/components/token";
import { useAssetInfos } from "lib/services/assetService";
import { useMovePoolInfos } from "lib/services/move/poolService";
import {
  computeCosmosFee,
  formatInteger,
  formatPrettyPercent,
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
      <Grid gap={6} templateColumns="repeat(2, 1fr)">
        <LabelText label="Network">{txData.chainId}</LabelText>
        <LabelText label="Block">
          <ExplorerLink
            ampCopierSection="tx_page_block_height"
            showCopyOnHover
            type="block_height"
            value={txData.height}
          />
        </LabelText>
        <GridItem colSpan={2}>
          <LabelText label="Signer">
            <ExplorerLink
              showCopyOnHover
              type="user_address"
              value={txData.signer}
            />
          </LabelText>
        </GridItem>
      </Grid>
      <Flex>
        <LabelText flex={1} label="Transaction fee">
          {feeToken ? (
            <TokenImageWithAmount boxSize={4} token={feeToken} />
          ) : (
            <Text color="text.dark" variant="body2">
              No fee
            </Text>
          )}
        </LabelText>
        <LabelText flex={1} label="Gas used/requested">
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
