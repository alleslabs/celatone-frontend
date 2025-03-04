import { Box, Checkbox, Flex, Stack, Text } from "@chakra-ui/react";
import type { LogDescription } from "ethers";
import { useState } from "react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { SelectInput } from "lib/components/forms";
import { TextReadOnly } from "lib/components/json/TextReadOnly";
import type { TxReceiptJsonRpcLog } from "lib/services/types";
import type { Nullish } from "lib/types";
import { EvmEventBoxDecoded } from "./evm-event-box-decoded";
import { EvmEventBoxTabs } from "../../types";

interface EvmEventBoxDataProps
  extends Pick<TxReceiptJsonRpcLog, "data" | "topics"> {
  tab: EvmEventBoxTabs;
  parsedLog: Nullish<LogDescription>;
}

const EvmEventBoxDataBody = ({ text }: { text: string }) => {
  const count0x = text.match(/^0+/)?.[0].length || 0;
  const isAddress = count0x >= 24;
  const options = [
    {
      label: "Hex",
      value: "hex",
      isDisabled: false,
    },
    {
      label: "Text",
      value: "text",
      isDisabled: false,
    },
    {
      label: "Number",
      value: "number",
      isDisabled: false,
    },
    {
      label: "Address",
      value: "address",
      isDisabled: !isAddress,
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
      gap={4}
      alignItems={{
        base: "flex-start",
        md: "center",
      }}
      wordBreak="break-all"
    >
      <Box minWidth="110px">
        <SelectInput
          classNamePrefix="chakra-react-select"
          size="sm"
          options={options}
          placeholder=""
          value={options.find(
            ({ value: optionValue }) => optionValue === value
          )}
          onChange={(newValue) => setValue(newValue?.value)}
          menuPortalTarget={document.body}
        />
      </Box>
      {value === "address" ? (
        <ExplorerLink
          value={handleDecodeText().toString()}
          type="user_address"
          openNewTab
          textFormat="normal"
        />
      ) : (
        <Text variant="body2" fontFamily="mono">
          {handleDecodeText()}
        </Text>
      )}
    </Flex>
  );
};

export const EvmEventBoxData = ({
  data,
  topics,
  tab,
  parsedLog,
}: EvmEventBoxDataProps) => {
  const [isFormatted, setIsFormatted] = useState(false);

  return tab === EvmEventBoxTabs.Hex || data.trim() === "0x" ? (
    <Stack gap={1} w="full">
      {isFormatted ? (
        <Box
          minH={{ base: "360px", md: "auto" }}
          px={3}
          py={4}
          position="relative"
          borderWidth="thin"
          borderColor="gray.700"
          borderRadius="8px"
          transition="all 0.25s ease-in-out"
          _hover={{
            borderColor: "gray.600",
            "& .copy-button-box": { display: "block" },
          }}
        >
          <Stack gap={2}>
            {data
              .slice(2)
              .match(/.{1,64}/g)
              ?.map((d, index) => (
                <EvmEventBoxDataBody text={d} key={`${d}-${index}`} />
              ))}
          </Stack>
        </Box>
      ) : (
        <TextReadOnly text={data} canCopy />
      )}
      {data.trim() !== "0x" && (
        <Checkbox
          isChecked={isFormatted}
          onChange={(e) => setIsFormatted(e.target.checked)}
        >
          <Text variant="body3">Formatted</Text>
        </Checkbox>
      )}
    </Stack>
  ) : (
    <Stack gap={2} p={4} borderRadius={8} bgColor="gray.800" w="full">
      {parsedLog &&
        parsedLog.fragment.inputs
          .slice(topics.length - 1)
          .map((input, index) => (
            <EvmEventBoxDecoded
              key={input.name}
              input={input}
              decode={parsedLog.args.slice(topics.length - 1)[index]}
            />
          ))}
    </Stack>
  );
};
