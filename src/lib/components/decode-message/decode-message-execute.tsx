import type { Log } from "@cosmjs/stargate/build/logs";
import type { MessageResponse, Option } from "lib/types";

import { Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import JsonReadOnly from "lib/components/json/JsonReadOnly";
import { extractTxDetails } from "lib/utils";

import { DecodeMessageRow } from "./decode-message-row";

interface DecodeMessageExecuteProps {
  log: Option<Log>;
  msgBody: MessageResponse;
}

export const DecodeMessageExecute = ({
  log,
  msgBody,
}: DecodeMessageExecuteProps) => {
  const { "@type": type, ...body } = msgBody;

  if (type !== "/initia.move.v1.MsgExecute") return null;

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
        <Text>{details.function_name}</Text>
      </DecodeMessageRow>
      <DecodeMessageRow title="Type args">
        <JsonReadOnly
          canCopy
          fullWidth
          isExpandable
          text={JSON.stringify(details.type_args, null, 2)}
        />
      </DecodeMessageRow>
      <DecodeMessageRow title="Args">
        <JsonReadOnly
          canCopy
          fullWidth
          isExpandable
          text={JSON.stringify(details.args, null, 2)}
        />
      </DecodeMessageRow>
    </>
  );
};
