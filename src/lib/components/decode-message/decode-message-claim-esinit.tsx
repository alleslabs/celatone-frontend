import type { DecodedMessage } from "@initia/tx-decoder";

import { Flex, Text } from "@chakra-ui/react";
import { Coin } from "@initia/initia.js";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TokenImageWithAmount } from "lib/components/token";
import { useAssetInfos } from "lib/services/assetService";
import { coinToTokenWithValue } from "lib/utils";
import { useState } from "react";

import type { TxMsgData } from "../tx-message";

import { ChainBadge } from "../ChainBadge";
import { CoinsComponent } from "../tx-message/msg-receipts/CoinsComponent";
import { DecodeMessageBody } from "./decode-message-body";
import { DecodeMessageExecute } from "./decode-message-execute";
import { DecodeMessageHeader } from "./decode-message-header";
import { DecodeMessageRow } from "./decode-message-row";

interface DecodeMessageClaimEsinitProps extends TxMsgData {
  decodedMessage: DecodedMessage & {
    action: "vip_claim_esinit";
  };
}

export const DecodeMessageClaimEsinit = ({
  compact,
  decodedMessage,
  log,
  msgBody,
  msgCount,
}: DecodeMessageClaimEsinitProps) => {
  const isSingleMsg = msgCount === 1;
  const [expand, setExpand] = useState(!!isSingleMsg);
  const { data, isIbc, isOp } = decodedMessage;

  const { data: assetInfos } = useAssetInfos({ withPrices: false });
  const token = coinToTokenWithValue(data.denom, data.amount, assetInfos);
  const coin = new Coin(data.denom, data.amount);

  return (
    <Flex direction="column" maxW="inherit">
      <DecodeMessageHeader
        compact={compact}
        gap={2}
        isExpand={expand}
        isIbc={isIbc}
        isOpinit={isOp}
        isSingleMsg={!!isSingleMsg}
        label="VIP Claim"
        msgCount={msgCount}
        type={msgBody["@type"]}
        onClick={() => setExpand(!expand)}
      >
        <TokenImageWithAmount token={token} />
        <Text color="text.dark" variant="body2">
          from
        </Text>
        <ChainBadge chainId={data.chainId} />
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
        <DecodeMessageRow title="Rollup">
          <ChainBadge chainId={data.chainId} />
        </DecodeMessageRow>
        <DecodeMessageRow title="Amount">
          <CoinsComponent coins={[coin]} />
        </DecodeMessageRow>
        <DecodeMessageExecute log={log} msgBody={msgBody} />
      </DecodeMessageBody>
    </Flex>
  );
};
