import type { Log } from "@cosmjs/stargate/build/logs";
import type { MsgBodyWithoutType } from "lib/utils";

import { Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import JsonReadOnly from "lib/components/json/JsonReadOnly";
import { type MessageResponse, type Option } from "lib/types";
import { extractTxDetails } from "lib/utils";
import { useState } from "react";

import { ArgsDisplayToggle } from "../ArgsDisplayToggle";
import { MoveExecuteArgsReceipt } from "../MoveExecuteArgsReceipt";
import { DecodeMessageRow } from "./decode-message-row";

interface DecodeMessageExecuteBodyProps {
  body: MsgBodyWithoutType;
  log: Option<Log>;
  type: "/initia.move.v1.MsgExecute" | "/initia.move.v1.MsgExecuteJSON";
}

const DecodeMessageExecuteBody = ({
  body,
  log,
  type,
}: DecodeMessageExecuteBodyProps) => {
  const isJsonExecute = type === "/initia.move.v1.MsgExecuteJSON";
  const [value, setValue] = useState<string | undefined>(
    isJsonExecute ? "raw" : "decoded"
  );
  const details = extractTxDetails(type, body, log);

  return (
    <>
      <DecodeMessageRow title="Module address">
        <ExplorerLink
          maxWidth="full"
          showCopyOnHover
          textFormat="normal"
          type="contract_address"
          value={details.module_address}
          wordBreak="break-word"
        />
      </DecodeMessageRow>
      <DecodeMessageRow title="Module name">
        <ExplorerLink
          maxWidth="full"
          showCopyOnHover
          textFormat="normal"
          textLabel={details.module_name}
          type="module_name"
          value={`${details.module_address}/${details.module_name}`}
          wordBreak="break-word"
        />
      </DecodeMessageRow>
      <DecodeMessageRow title="Function name">
        <ExplorerLink
          maxWidth="full"
          queryParams={{
            address: details.module_address,
            functionName: details.function_name,
            moduleName: details.module_name,
          }}
          showCopyOnHover
          textFormat="normal"
          textLabel={details.function_name}
          type="function_name"
          value={undefined}
          wordBreak="break-word"
        />
      </DecodeMessageRow>
      <DecodeMessageRow title="Type args">
        <JsonReadOnly
          canCopy
          fullWidth
          isExpandable
          text={JSON.stringify(details.type_args, null, 2)}
        />
      </DecodeMessageRow>
      <DecodeMessageRow
        title={
          isJsonExecute ? (
            <Text variant="body2">Args</Text>
          ) : (
            <ArgsDisplayToggle title="Args" value={value} onChange={setValue} />
          )
        }
      >
        <MoveExecuteArgsReceipt
          displayMode={value}
          functionName={details.function_name}
          moduleAddress={details.module_address}
          moduleName={details.module_name}
          rawArgs={Array.isArray(details.args) ? details.args : []}
        />
      </DecodeMessageRow>
    </>
  );
};

interface DecodeMessageExecuteProps {
  log: Option<Log>;
  msgBody: MessageResponse;
}

export const DecodeMessageExecute = ({
  log,
  msgBody,
}: DecodeMessageExecuteProps) => {
  const { "@type": type, ...body } = msgBody;

  if (
    type !== "/initia.move.v1.MsgExecute" &&
    type !== "/initia.move.v1.MsgExecuteJSON"
  )
    return null;

  return <DecodeMessageExecuteBody body={body} log={log} type={type} />;
};
