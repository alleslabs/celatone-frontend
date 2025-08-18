import type { DecodedMessage } from "@initia/tx-decoder";

import { Flex, Text } from "@chakra-ui/react";
import { Coin } from "@initia/initia.js";
import { useAssetInfos } from "lib/services/assetService";
import { coinToTokenWithValue } from "lib/utils";
import { useState } from "react";

import type { TxMsgData } from "../tx-message";

import { DexPoolLink } from "../DexPoolLink";
import { ExplorerLink } from "../ExplorerLink";
import { TokenImageWithAmount } from "../token";
import { CoinsComponent } from "../tx-message/msg-receipts/CoinsComponent";
import { DecodeMessageBody } from "./decode-message-body";
import { DecodeMessageHeader } from "./decode-message-header";
import { DecodeMessageRow } from "./decode-message-row";

interface DecodeMessageDepositMinitSwapProps extends TxMsgData {
  decodedMessage: DecodedMessage & {
    action: "deposit_minitswap";
  };
}

export const DecodeMessageDepositMinitSwap = ({
  compact,
  decodedMessage,
  log,
  msgBody,
  msgCount,
}: DecodeMessageDepositMinitSwapProps) => {
  const isSingleMsg = msgCount === 1;
  const [expand, setExpand] = useState(!!isSingleMsg);
  const { data, isIbc, isOp } = decodedMessage;

  const { data: assetInfos } = useAssetInfos({ withPrices: false });
  const tokenDeposit = coinToTokenWithValue(
    data.denomDeposited,
    data.amountDeposited,
    assetInfos
  );
  const coinDeposit = new Coin(data.denomDeposited, data.amountDeposited);

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
        <TokenImageWithAmount token={tokenDeposit} />
        <Text color="text.dark">to</Text>
        <DexPoolLink liquidityDenom={data.denomReceived} />
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
          <DexPoolLink liquidityDenom={data.denomReceived} />
        </DecodeMessageRow>
        <DecodeMessageRow title="Deposited assets">
          <CoinsComponent coins={[coinDeposit]} />
        </DecodeMessageRow>
      </DecodeMessageBody>
    </Flex>
  );
};
