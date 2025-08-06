import type { DecodedMessage } from "@initia/tx-decoder";

import { Flex, Text } from "@chakra-ui/react";
import { Coin } from "@initia/initia.js";
import { useAssetInfos } from "lib/services/assetService";
import { coinToTokenWithValue } from "lib/utils";
import { useState } from "react";

import type { TxMsgData } from "../tx-message";

import { ExplorerLink } from "../ExplorerLink";
import { TokenImageWithAmount } from "../token";
import { CoinsComponent } from "../tx-message/msg-receipts/CoinsComponent";
import { DecodeMessageBody } from "./decode-message-body";
import { DecodeMessageHeader } from "./decode-message-header";
import { DecodeMessageRow } from "./decode-message-row";

interface DecodeMessageWithdrawLiquidityProps extends TxMsgData {
  decodedMessage: DecodedMessage & {
    action: "withdraw_liquidity";
  };
}

export const DecodeMessageWithdrawLiquidity = ({
  compact,
  decodedMessage,
  log,
  msgBody,
  msgCount,
}: DecodeMessageWithdrawLiquidityProps) => {
  const isSingleMsg = msgCount === 1;
  const [expand, setExpand] = useState(!!isSingleMsg);
  const { data, isIbc, isOp } = decodedMessage;

  const { data: assetInfos } = useAssetInfos({ withPrices: false });
  const tokenA = coinToTokenWithValue(data.denomA, data.amountA, assetInfos);
  const coinA = new Coin(data.denomA, data.amountA);
  const tokenB = coinToTokenWithValue(data.denomB, data.amountB, assetInfos);
  const coinB = new Coin(data.denomB, data.amountB);

  return (
    <Flex direction="column" maxW="inherit">
      <DecodeMessageHeader
        compact={compact}
        gap={2}
        isExpand={expand}
        isIbc={isIbc}
        isOpinit={isOp}
        isSingleMsg={!!isSingleMsg}
        label="Withdraw"
        msgCount={msgCount}
        type={msgBody["@type"]}
        onClick={() => setExpand(!expand)}
      >
        <TokenImageWithAmount token={tokenA} />
        <Text color="text.dark">+</Text>
        <TokenImageWithAmount token={tokenB} />
        <Text color="text.dark">to</Text>
        {/* TODO: add LP token */}
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
          -{/* TODO: add LP token */}
        </DecodeMessageRow>
        <DecodeMessageRow title="LP amount">-</DecodeMessageRow>
        <DecodeMessageRow title="Withdrawn assets">
          <CoinsComponent coins={[coinA, coinB]} />
        </DecodeMessageRow>
      </DecodeMessageBody>
    </Flex>
  );
};
