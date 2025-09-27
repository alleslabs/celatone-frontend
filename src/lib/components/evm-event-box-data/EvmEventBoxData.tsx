import type { LogDescription } from "ethers";
import type { TxReceiptJsonRpcLog } from "lib/services/types";
import type { Option } from "lib/types";

import { Box, Stack } from "@chakra-ui/react";
import { TextReadOnly } from "lib/components/json/TextReadOnly";

import { EvmEventBoxTabs } from "../../types";
import { EvmBoxDecoded } from "../EvmBoxDecoded";
import { EvmEventBoxDataBody } from "./EvmEventBoxDataBody";

interface EvmEventBoxDataProps
  extends Pick<TxReceiptJsonRpcLog, "data" | "topics"> {
  parsedLog: Option<LogDescription>;
  tab: EvmEventBoxTabs;
}

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
              <EvmBoxDecoded
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
