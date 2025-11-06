import type { DecodedMessage } from "@initia/tx-decoder";
import type { TxMsgData } from "lib/components/tx-message";

import { Flex, Text } from "@chakra-ui/react";
import { useGetAddressType } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import JsonReadOnly from "lib/components/json/JsonReadOnly";
import { CoinsComponent } from "lib/components/tx-message/msg-receipts/CoinsComponent";
import { memo, useState } from "react";

import { DecodeMessageBody } from "../decode-message-body";
import { DecodeMessageHeader } from "../decode-message-header";
import { DecodeMessageRow } from "../decode-message-row";

interface DecodeMessageInstantiateContractProps extends TxMsgData {
  decodedMessage: DecodedMessage & {
    action: "instantiate_contract";
  };
}

export const DecodeMessageInstantiateContract = memo(
  ({
    compact,
    decodedMessage,
    log,
    msgBody,
    msgCount,
  }: DecodeMessageInstantiateContractProps) => {
    const isSingleMsg = msgCount === 1;
    const [expand, setExpand] = useState(!!isSingleMsg);
    const getAddressType = useGetAddressType();
    const { data, isIbc, isOp } = decodedMessage;
    const { admin, codeId, contractAddress, funds, initMsg, label, sender } =
      data;

    return (
      <Flex direction="column" maxW="inherit">
        <DecodeMessageHeader
          compact={compact}
          gap={2}
          isExpand={expand}
          isIbc={isIbc}
          isOpinit={isOp}
          isSingleMsg={!!isSingleMsg}
          label="Instantiate contract"
          msgCount={msgCount}
          type={msgBody["@type"]}
          onClick={() => setExpand(!expand)}
        >
          {!compact && (
            <>
              {contractAddress && (
                <ExplorerLink
                  leftIcon={
                    <CustomIcon
                      boxSize={4}
                      color="primary.main"
                      name="contract-address"
                    />
                  }
                  showCopyOnHover
                  textFormat="normal"
                  textVariant={compact ? "body2" : "body1"}
                  type="contract_address"
                  value={contractAddress}
                />
              )}
              <Flex align="center" gap={2}>
                <Text color="text.dark">by</Text>
                <ExplorerLink
                  showCopyOnHover
                  textVariant={compact ? "body2" : "body1"}
                  type={getAddressType(sender)}
                  value={sender}
                />
              </Flex>
            </>
          )}
        </DecodeMessageHeader>
        <DecodeMessageBody compact={compact} isExpand={expand} log={log}>
          <DecodeMessageRow title="Sender">
            <ExplorerLink
              maxWidth="full"
              showCopyOnHover
              textFormat="normal"
              type={getAddressType(sender)}
              value={sender}
              wordBreak="break-word"
            />
          </DecodeMessageRow>
          {contractAddress && (
            <DecodeMessageRow title="Contract Address">
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
                value={contractAddress}
                wordBreak="break-word"
              />
            </DecodeMessageRow>
          )}
          <DecodeMessageRow title="Code ID">
            <Text>{codeId}</Text>
          </DecodeMessageRow>
          <DecodeMessageRow title="Label">
            <Text maxWidth="full" wordBreak="break-word">
              {label}
            </Text>
          </DecodeMessageRow>
          {admin && (
            <DecodeMessageRow title="Admin">
              <ExplorerLink
                maxWidth="full"
                showCopyOnHover
                textFormat="normal"
                type={getAddressType(admin)}
                value={admin}
                wordBreak="break-word"
              />
            </DecodeMessageRow>
          )}
          {funds.length > 0 && (
            <DecodeMessageRow title="Funds">
              <CoinsComponent coins={funds} />
            </DecodeMessageRow>
          )}
          <DecodeMessageRow title="Init Message">
            <JsonReadOnly
              canCopy
              fullWidth
              isExpandable
              text={JSON.stringify(initMsg, null, 2)}
            />
          </DecodeMessageRow>
        </DecodeMessageBody>
      </Flex>
    );
  }
);
