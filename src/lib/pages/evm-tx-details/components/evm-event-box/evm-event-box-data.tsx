import type { LogDescription } from "ethers";
import type { TxReceiptJsonRpcLog } from "lib/services/types";
import type { Option } from "lib/types";

import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { SelectInput } from "lib/components/forms";
import { TextReadOnly } from "lib/components/json/TextReadOnly";
import { useState } from "react";

import { EvmEventBoxTabs } from "../../types";
import { EvmEventBoxDecoded } from "./evm-event-box-decoded";

interface EvmEventBoxDataProps
  extends Pick<TxReceiptJsonRpcLog, "data" | "topics"> {
  parsedLog: Option<LogDescription>;
  tab: EvmEventBoxTabs;
}

const EvmEventBoxDataBody = ({ text }: { text: string }) => {
  const countZero = text.match(/^0+/)?.[0].length || 0;
  const isAddress = countZero >= 24;
  const options = [
    {
      isDisabled: false,
      label: "Hex",
      value: "hex",
    },
    {
      isDisabled: false,
      label: "Text",
      value: "text",
    },
    {
      isDisabled: false,
      label: "Number",
      value: "number",
    },
    {
      isDisabled: !isAddress,
      label: "Address",
      value: "address",
    },
  ];

  const [value, setValue] = useState<string | undefined>(options[0].value);

  const handleDecodeText = () => {
    switch (value) {
      case "address":
        return "0x" + text.slice(-40);
      case "number":
        return parseInt(text, 16);
      case "text":
        return Buffer.from(text, "hex").toString("binary");
      default:
        return text;
    }
  };

  return (
    <Flex
      alignItems={{
        base: "flex-start",
        md: "center",
      }}
      gap={4}
      wordBreak="break-all"
    >
      <Box minWidth="110px">
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
      </Box>
      {value === "address" ? (
        <ExplorerLink
          openNewTab
          textFormat="normal"
          type="user_address"
          value={handleDecodeText().toString()}
        />
      ) : (
        <Text fontFamily="mono" variant="body2">
          {handleDecodeText()}
        </Text>
      )}
    </Flex>
  );
};

export const EvmEventBoxData = ({
  data,
  parsedLog,
  tab,
  topics,
}: EvmEventBoxDataProps) => {
  const formattedData = data.replace("0x", "").match(/.{1,64}/g) ?? [];

  return tab === EvmEventBoxTabs.Raw ||
    tab === EvmEventBoxTabs.Formatted ||
    data.trim() === "0x" ? (
    <Stack gap={1} w="full">
      {tab === EvmEventBoxTabs.Formatted ? (
        <Box
          _hover={{
            "& .copy-button-box": { display: "block" },
            borderColor: "gray.600",
          }}
          borderColor="gray.700"
          borderRadius="8px"
          borderWidth="thin"
          minH={{ base: "360px", md: "auto" }}
          position="relative"
          px={3}
          py={4}
          transition="all 0.25s ease-in-out"
        >
          <Stack gap={2}>
            {formattedData.map((d, index) => (
              <EvmEventBoxDataBody key={`${d}-${index}`} text={d} />
            ))}
          </Stack>
        </Box>
      ) : (
        <TextReadOnly canCopy text={data} />
      )}
    </Stack>
  ) : (
    <>
      {parsedLog && (
        <Stack
          bgColor="gray.800"
          borderRadius={8}
          columnGap={2}
          p={4}
          rowGap={4}
          w="full"
        >
          {parsedLog.fragment.inputs
            .slice(topics.length - 1)
            .map((input, index) => (
              <EvmEventBoxDecoded
                key={input.name}
                decode={parsedLog.args.slice(topics.length - 1)[index]}
                input={input}
              />
            ))}
        </Stack>
      )}
    </>
  );
};
