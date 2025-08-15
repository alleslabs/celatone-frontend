import type { Log } from "@cosmjs/stargate/build/logs";
import type { MsgBodyWithoutType } from "lib/utils";

import { Flex, Text } from "@chakra-ui/react";
import { fromBase64 } from "@cosmjs/encoding";
import { resolveBcsType } from "@initia/utils";
import { ExplorerLink } from "lib/components/ExplorerLink";
import JsonReadOnly from "lib/components/json/JsonReadOnly";
import { useModuleByAddressRest } from "lib/services/move/module";
import { type MessageResponse, type Option, zAddr } from "lib/types";
import { extractTxDetails } from "lib/utils";
import { useMemo, useState } from "react";

import { SelectInput } from "../forms";
import { DecodeMessageRow } from "./decode-message-row";

const options = [
  {
    label: "Decoded",
    value: "decoded",
  },
  {
    label: "Raw",
    value: "raw",
  },
];

interface DecodeMessageExecuteBodyProps {
  body: MsgBodyWithoutType;
  log: Option<Log>;
  type: "/initia.move.v1.MsgExecute";
}

const DecodeMessageExecuteBody = ({
  body,
  log,
  type,
}: DecodeMessageExecuteBodyProps) => {
  const [value, setValue] = useState<string | undefined>(options[0].value);
  const details = extractTxDetails(type, body, log);

  const { data } = useModuleByAddressRest({
    address: zAddr.parse(details.module_address),
    moduleName: details.module_name,
  });

  const fn = useMemo(
    () =>
      [...(data?.executeFunctions ?? []), ...(data?.viewFunctions ?? [])].find(
        (func) => func.name === details.function_name
      ),
    [data, details.function_name]
  );

  const params =
    fn?.params[0] === "signer" || fn?.params[0] === "&signer"
      ? fn.params.slice(1)
      : fn?.params;

  const text =
    value === "decoded" && params?.length
      ? params?.map((param, index) =>
          resolveBcsType(param).parse(fromBase64(details.args[index]))
        )
      : details.args;

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
      <DecodeMessageRow
        title={
          <Flex align="center" gap={2}>
            <Text color="text.dark" variant="body2">
              Args
            </Text>
            <SelectInput
              classNamePrefix="chakra-react-select"
              menuPortalTarget={document.body}
              options={options}
              placeholder=""
              size="sm"
              value={options.find(
                ({ value: optionValue }) => optionValue === value
              )}
              onChange={(newValue) => setValue(newValue?.value)}
            />
          </Flex>
        }
      >
        <JsonReadOnly
          canCopy
          fullWidth
          isExpandable
          text={JSON.stringify(text, null, 2)}
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

  if (type !== "/initia.move.v1.MsgExecute") return null;

  return <DecodeMessageExecuteBody body={body} log={log} type={type} />;
};
