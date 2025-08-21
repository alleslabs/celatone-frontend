import { Box, Flex, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { SelectInput } from "lib/components/forms";
import { useState } from "react";

export const EvmEventBoxDataBody = ({ text }: { text: string }) => {
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
