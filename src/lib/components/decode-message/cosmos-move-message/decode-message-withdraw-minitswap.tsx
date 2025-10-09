import type { DecodedMessage } from "@initia/tx-decoder";

import { Flex, Text } from "@chakra-ui/react";
import { Coin } from "@initia/initia.js";
import { useAssetInfos } from "lib/services/assetService";
import { coinToTokenWithValue, formatUTC, parseUnixToDate } from "lib/utils";
import { useState } from "react";

import type { TxMsgData } from "../../tx-message";

import { DexPoolLink } from "../../DexPoolLink";
import { ExplorerLink } from "../../ExplorerLink";
import { TokenImageWithAmount } from "../../token";
import { CoinsComponent } from "../../tx-message/msg-receipts/CoinsComponent";
import { DecodeMessageBody } from "../decode-message-body";
import { DecodeMessageExecute } from "../decode-message-execute";
import { DecodeMessageHeader } from "../decode-message-header";
import { DecodeMessageRow } from "../decode-message-row";

interface DecodeMessageWithdrawMinitSwapProps extends TxMsgData {
  decodedMessage: DecodedMessage & {
    action: "withdraw_minitswap";
  };
}

export const DecodeMessageWithdrawMinitSwap = ({
  compact,
  decodedMessage,
  log,
  msgBody,
  msgCount,
}: DecodeMessageWithdrawMinitSwapProps) => {
  const isSingleMsg = msgCount === 1;
  const [expand, setExpand] = useState(!!isSingleMsg);
  const { data, isIbc, isOp } = decodedMessage;

  const { data: assetInfos } = useAssetInfos({ withPrices: false });
  const tokenWithdrawn = coinToTokenWithValue(
    data.denomWithdrawn,
    data.amountWithdrawn,
    assetInfos
  );
  const coinWithdrawn = new Coin(data.denomWithdrawn, data.amountWithdrawn);
  const releaseTimestamp = parseUnixToDate(data.releaseTimestamp);

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
        <TokenImageWithAmount token={tokenWithdrawn} />
        <Text color="text.dark">from</Text>
        <DexPoolLink liquidityDenom={data.denomWithdrawn} />
      </DecodeMessageHeader>
      <DecodeMessageBody compact={compact} isExpand={expand} log={log}>
        <DecodeMessageRow title="Liquidity withdrawer">
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
          <DexPoolLink liquidityDenom={data.denomWithdrawn} />
        </DecodeMessageRow>
        <DecodeMessageRow title="Withdrawn assets">
          <CoinsComponent coins={[coinWithdrawn]} />
        </DecodeMessageRow>
        <DecodeMessageRow title="Release timestamp">
          {formatUTC(releaseTimestamp)}
        </DecodeMessageRow>
        <DecodeMessageExecute log={log} msgBody={msgBody} />
      </DecodeMessageBody>
    </Flex>
  );
};
