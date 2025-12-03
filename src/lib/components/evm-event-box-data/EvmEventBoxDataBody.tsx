import { Box, Flex, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { SelectInput } from "lib/components/forms";
import { useState } from "react";

export const EvmEventBoxDataBody = ({ text }: { text: string }) => {
  const normalizedText = text.startsWith("0x") ? text.slice(2) : text;
  const countZero = normalizedText.match(/^0+/)?.[0].length || 0;

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
    try {
      switch (value) {
        case "address":
          return `0x${normalizedText.slice(-40)}`;
        case "number": {
          if (!normalizedText) {
            return "0";
          }
          const bi = BigInt(`0x${normalizedText}`);
          return bi.toString(10);
        }
        case "text": {
          const bytes = (normalizedText.match(/.{1,2}/g) ?? []).map((b) =>
            parseInt(b, 16)
          );
          return new TextDecoder().decode(new Uint8Array(bytes));
        }
        default:
          return text;
      }
    } catch {
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
          isSearchable={false}
          menuPortalTarget={
            typeof window !== "undefined" ? document.body : undefined
          }
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
