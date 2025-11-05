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

interface DecodeMessageExecuteContractProps extends TxMsgData {
  decodedMessage: DecodedMessage & {
    action: "execute_contract";
  };
}

export const DecodeMessageExecuteContract = memo(
  ({
    compact,
    decodedMessage,
    log,
    msgBody,
    msgCount,
  }: DecodeMessageExecuteContractProps) => {
    const isSingleMsg = msgCount === 1;
    const [expand, setExpand] = useState(!!isSingleMsg);
    const getAddressType = useGetAddressType();
    const { data, isIbc, isOp } = decodedMessage;
    const { contract, function: functionName, funds, msg, sender } = data;

    const label = functionName ? functionName : "Execute contract";

    return (
      <Flex direction="column" maxW="inherit">
        <DecodeMessageHeader
          compact={compact}
          gap={2}
          isExpand={expand}
          isIbc={isIbc}
          isOpinit={isOp}
          isSingleMsg={!!isSingleMsg}
          label={label}
          msgCount={msgCount}
          type={msgBody["@type"]}
          onClick={() => setExpand(!expand)}
        >
          {!compact && (
            <>
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
                value={contract}
              />
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
          <DecodeMessageRow title="Contract">
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
              value={contract}
              wordBreak="break-word"
            />
          </DecodeMessageRow>
          {functionName && (
            <DecodeMessageRow title="Function name">
              <ExplorerLink
                copyValue={functionName}
                maxWidth="full"
                queryParams={{
                  contract,
                  msg: functionName,
                  selectedType: "execute",
                }}
                showCopyOnHover
                textFormat="normal"
                textLabel={functionName}
                type="function_name_wasm"
                value={undefined}
                wordBreak="break-word"
              />
            </DecodeMessageRow>
          )}
          {funds.length > 0 && (
            <DecodeMessageRow title="Funds">
              <CoinsComponent coins={funds} />
            </DecodeMessageRow>
          )}
          <DecodeMessageRow title="Execute Message">
            <JsonReadOnly
              canCopy
              fullWidth
              isExpandable
              text={JSON.stringify(msg, null, 2)}
            />
          </DecodeMessageRow>
        </DecodeMessageBody>
      </Flex>
    );
  }
);
