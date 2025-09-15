import type { DecodedMessage } from "@initia/tx-decoder";

import { Flex, Text } from "@chakra-ui/react";
import { Coin } from "@initia/initia.js";
import { useAssetInfos } from "lib/services/assetService";
import { coinToTokenWithValue, formatTokenWithValue } from "lib/utils";
import { useMemo, useState } from "react";

import type { TxMsgData } from "../tx-message";

import { DexPoolLink } from "../DexPoolLink";
import { ExplorerLink } from "../ExplorerLink";
import { TokenImageWithAmount } from "../token";
import { CoinsComponent } from "../tx-message/msg-receipts/CoinsComponent";
import { DecodeMessageBody } from "./decode-message-body";
import { DecodeMessageExecute } from "./decode-message-execute";
import { DecodeMessageHeader } from "./decode-message-header";
import { DecodeMessageRow } from "./decode-message-row";

interface DecodeMessageDepositStableSwapProps extends TxMsgData {
  decodedMessage: DecodedMessage & {
    action: "provide_stableswap";
  };
}

export const DecodeMessageDepositStableSwap = ({
  compact,
  decodedMessage,
  log,
  msgBody,
  msgCount,
}: DecodeMessageDepositStableSwapProps) => {
  const isSingleMsg = msgCount === 1;
  const [expand, setExpand] = useState(!!isSingleMsg);
  const { data, isIbc, isOp } = decodedMessage;

  const { data: assetInfos } = useAssetInfos({ withPrices: false });

  const tokens = useMemo(
    () =>
      data.coinDenoms.map((denom, index) =>
        coinToTokenWithValue(denom, data.coinAmounts[index], assetInfos)
      ),
    [data.coinDenoms, data.coinAmounts, assetInfos]
  );

  const coins = useMemo(() => {
    return data.coinDenoms.map(
      (denom, index) => new Coin(denom, data.coinAmounts[index])
    );
  }, [data.coinDenoms, data.coinAmounts]);

  const lpToken = coinToTokenWithValue(
    data.liquidityDenom,
    data.liquidity,
    assetInfos
  );

  return (
    <Flex direction="column" maxW="inherit">
      <DecodeMessageHeader
        compact={compact}
        gap={2}
        isExpand={expand}
        isIbc={isIbc}
        isOpinit={isOp}
        isSingleMsg={!!isSingleMsg}
        label="Provide"
        msgCount={msgCount}
        type={msgBody["@type"]}
        onClick={() => setExpand(!expand)}
      >
        {tokens.map((token, idx) => (
          <Flex key={token.denom} align="center" as="span">
            <TokenImageWithAmount token={token} />
            {idx < tokens.length - 1 && (
              <Text as="span" color="text.dark" mx={1}>
                +
              </Text>
            )}
          </Flex>
        ))}
        <Text color="text.dark">from</Text>
        <DexPoolLink liquidityDenom={data.liquidityDenom} />
      </DecodeMessageHeader>
      <DecodeMessageBody compact={compact} isExpand={expand} log={log}>
        <DecodeMessageRow title="Address">
          <ExplorerLink
            maxWidth="full"
            showCopyOnHover
            textFormat="normal"
            type="user_address"
            value={data.from}
            wordBreak="break-word"
          />
        </DecodeMessageRow>
        <DecodeMessageRow title="Pool">
          <DexPoolLink liquidityDenom={data.liquidityDenom} />
        </DecodeMessageRow>
        <DecodeMessageRow title="LP amount">
          {formatTokenWithValue({
            decimalPoints: undefined,
            token: lpToken,
          })}
        </DecodeMessageRow>
        <DecodeMessageRow title="Withdrawn assets">
          <CoinsComponent coins={coins} />
        </DecodeMessageRow>
        <DecodeMessageExecute log={log} msgBody={msgBody} />
      </DecodeMessageBody>
    </Flex>
  );
};
