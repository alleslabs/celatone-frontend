import type { DecodedMessage } from "@initia/tx-decoder";

import { Badge, Flex, Text } from "@chakra-ui/react";
import { Coin } from "@initia/initia.js";
import { useCurrentChain, useGetAddressType } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TokenImageWithAmount } from "lib/components/token";
import { useAssetInfos } from "lib/services/assetService";
import { coinToTokenWithValue } from "lib/utils";
import { useState } from "react";

import type { TxMsgData } from "../../tx-message";

import { ChainBadge } from "../../ChainBadge";
import { CoinsComponent } from "../../tx-message/msg-receipts/CoinsComponent";
import { DecodeMessageBody } from "../decode-message-body";
import { DecodeMessageHeader } from "../decode-message-header";
import { DecodeMessageRow } from "../decode-message-row";

interface DecodeMessageOpFinalizeDepositProps extends TxMsgData {
  decodedMessage: DecodedMessage & {
    action: "op_finalize_deposit";
  };
}

export const DecodeMessageOpFinalizeDeposit = ({
  compact,
  decodedMessage,
  log,
  msgBody,
  msgCount,
}: DecodeMessageOpFinalizeDepositProps) => {
  const isSingleMsg = msgCount === 1;
  const { chainId } = useCurrentChain();
  const [expand, setExpand] = useState(!!isSingleMsg);
  const getAddressType = useGetAddressType();
  const { data, isIbc, isOp } = decodedMessage;
  const { data: assetInfos } = useAssetInfos({ withPrices: false });
  const token = coinToTokenWithValue(data.denom, data.amount, assetInfos);

  return (
    <Flex direction="column" maxW="inherit">
      <DecodeMessageHeader
        compact={compact}
        gap={2}
        isExpand={expand}
        isIbc={isIbc}
        isOpinit={isOp}
        isSingleMsg={!!isSingleMsg}
        label="Bridge"
        msgCount={msgCount}
        type={msgBody["@type"]}
        onClick={() => setExpand(!expand)}
      >
        <Badge colorScheme={data.success ? "success" : "error"} variant="solid">
          {data.success ? "Success" : "Failed"}
        </Badge>
        <TokenImageWithAmount token={token} />
        <Flex align="center" gap={2}>
          <Text color="text.dark">from</Text>
          <ExplorerLink
            showCopyOnHover
            type={getAddressType(data.from)}
            value={data.from}
          />
        </Flex>
      </DecodeMessageHeader>
      <DecodeMessageBody compact={compact} isExpand={expand} log={log}>
        <DecodeMessageRow title="Destination chain">
          <ChainBadge chainId={chainId} />
        </DecodeMessageRow>
        <DecodeMessageRow title="Sender">
          <ExplorerLink
            maxWidth="full"
            showCopyOnHover
            textFormat="normal"
            type={getAddressType(data.from)}
            value={data.from}
            wordBreak="break-word"
          />
        </DecodeMessageRow>
        <DecodeMessageRow title="Receiver">
          <ExplorerLink
            maxWidth="full"
            showCopyOnHover
            textFormat="normal"
            type={getAddressType(data.to)}
            value={data.to}
            wordBreak="break-word"
          />
        </DecodeMessageRow>
        <DecodeMessageRow title="Amount">
          <CoinsComponent coins={[new Coin(data.denom, data.amount)]} />
        </DecodeMessageRow>
        <DecodeMessageRow title="Base Denom">
          <Text>{data.baseDenom}</Text>
        </DecodeMessageRow>
        <DecodeMessageRow title="L1 Sequence">
          <Text>{data.l1Sequence}</Text>
        </DecodeMessageRow>
        <DecodeMessageRow title="Sequence">
          <Text>{data.sequence}</Text>
        </DecodeMessageRow>
        <DecodeMessageRow title="Height">
          <Text>{data.height}</Text>
        </DecodeMessageRow>
      </DecodeMessageBody>
    </Flex>
  );
};
