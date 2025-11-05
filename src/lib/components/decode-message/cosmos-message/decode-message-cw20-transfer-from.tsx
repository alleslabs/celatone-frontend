import type { DecodedMessage } from "@initia/tx-decoder";
import type { TxMsgData } from "lib/components/tx-message";

import { Flex, Text } from "@chakra-ui/react";
import { useGetAddressType } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { TokenImageWithAmount } from "lib/components/token";
import { CoinsComponent } from "lib/components/tx-message/msg-receipts/CoinsComponent";
import { useAssetInfos } from "lib/services/assetService";
import { coinToTokenWithValue } from "lib/utils";
import { memo, useState } from "react";

import { DecodeMessageBody } from "../decode-message-body";
import { DecodeMessageHeader } from "../decode-message-header";
import { DecodeMessageRow } from "../decode-message-row";

interface DecodeMessageCw20TransferFromProps extends TxMsgData {
  decodedMessage: DecodedMessage & {
    action: "cw20_transfer_from";
  };
}

export const DecodeMessageCw20TransferFrom = memo(
  ({
    compact,
    decodedMessage,
    log,
    msgBody,
    msgCount,
  }: DecodeMessageCw20TransferFromProps) => {
    const isSingleMsg = msgCount === 1;
    const [expand, setExpand] = useState(!!isSingleMsg);
    const getAddressType = useGetAddressType();
    const { data, isIbc, isOp } = decodedMessage;
    const { data: assetInfos } = useAssetInfos({ withPrices: false });

    const token = coinToTokenWithValue(data.contract, data.amount, assetInfos);

    return (
      <Flex direction="column" maxW="inherit">
        <DecodeMessageHeader
          compact={compact}
          gap={2}
          isExpand={expand}
          isIbc={isIbc}
          isOpinit={isOp}
          isSingleMsg={!!isSingleMsg}
          label="CW20 transfer from"
          msgCount={msgCount}
          type={msgBody["@type"]}
          onClick={() => setExpand(!expand)}
        >
          <TokenImageWithAmount token={token} />
          {!compact && (
            <>
              <Flex align="center" gap={2}>
                <Text color="text.dark">by</Text>
                <ExplorerLink
                  showCopyOnHover
                  textVariant={compact ? "body2" : "body1"}
                  type={getAddressType(data.from)}
                  value={data.from}
                />
              </Flex>
              <Flex align="center" gap={2}>
                <Text color="text.dark">from</Text>
                <ExplorerLink
                  showCopyOnHover
                  textVariant={compact ? "body2" : "body1"}
                  type={getAddressType(data.owner)}
                  value={data.owner}
                />
              </Flex>
              <Flex align="center" gap={2}>
                <Text color="text.dark">to</Text>
                <ExplorerLink
                  showCopyOnHover
                  textVariant={compact ? "body2" : "body1"}
                  type={getAddressType(data.to)}
                  value={data.to}
                />
              </Flex>
            </>
          )}
        </DecodeMessageHeader>
        <DecodeMessageBody compact={compact} isExpand={expand} log={log}>
          <DecodeMessageRow title="Spender">
            <ExplorerLink
              maxWidth="full"
              showCopyOnHover
              textFormat="normal"
              type={getAddressType(data.from)}
              value={data.from}
              wordBreak="break-word"
            />
          </DecodeMessageRow>
          <DecodeMessageRow title="Owner">
            <ExplorerLink
              maxWidth="full"
              showCopyOnHover
              textFormat="normal"
              type={getAddressType(data.owner)}
              value={data.owner}
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
            <CoinsComponent
              coins={[{ amount: data.amount, denom: data.contract }]}
            />
          </DecodeMessageRow>
          <DecodeMessageRow title="CW20 Contract">
            <ExplorerLink
              leftIcon={
                <CustomIcon
                  boxSize={4}
                  color="primary.main"
                  name="contract-address"
                />
              }
              maxWidth="full"
              showCopyOnHover
              textFormat="normal"
              type="contract_address"
              value={data.contract}
              wordBreak="break-word"
            />
          </DecodeMessageRow>
        </DecodeMessageBody>
      </Flex>
    );
  }
);
