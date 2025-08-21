import { Flex, Stack, Text } from "@chakra-ui/react";
import { TextReadOnly } from "lib/components/json/TextReadOnly";
import { TypeSwitch } from "lib/components/TypeSwitch";
import { EvmEventBoxTabs, type EvmVerifyInfo, type Nullable } from "lib/types";
import { decodeEvmFunctionData } from "lib/utils";
import { useEffect, useState } from "react";

import { EvmEventBoxDataBody } from "./evm-event-box-data";
import { EvmBoxDecoded } from "./EvmBoxDecoded";

interface EvmInputDataProps {
  evmVerifyInfo: Nullable<EvmVerifyInfo>;
  txInput: string;
  variant?: "gray" | "transparent";
}

export const EvmInputData = ({
  evmVerifyInfo,
  txInput,
  variant = "transparent",
}: EvmInputDataProps) => {
  const [currentTab, setCurrentTab] = useState(EvmEventBoxTabs.Decoded);
  const methodId = txInput.slice(0, 10);
  const formattedData = txInput.slice(10).match(/.{1,64}/g) ?? [];
  const data = decodeEvmFunctionData(evmVerifyInfo?.abi ?? [], txInput);
  const is0x = txInput.trim() === "0x";

  useEffect(() => {
    if (evmVerifyInfo?.isVerified) {
      setCurrentTab(EvmEventBoxTabs.Decoded);
    } else {
      setCurrentTab(EvmEventBoxTabs.Formatted);
    }
  }, [evmVerifyInfo]);

  return (
    <Stack
      sx={
        variant === "gray"
          ? {
              bgColor: "gray.900",
              borderRadius: 8,
              px: 4,
              py: 2,
            }
          : {}
      }
    >
      <Flex align="center" justifyContent="space-between" w="full">
        <Text
          color="text.dark"
          fontWeight={variant === "gray" ? "bold" : "normal"}
          variant="body2"
        >
          Input data
        </Text>
        {!is0x && (
          <TypeSwitch
            currentTab={currentTab}
            disabledScrollToTop
            tabs={Object.values(EvmEventBoxTabs).filter((value) =>
              evmVerifyInfo?.isVerified
                ? value !== EvmEventBoxTabs.Formatted
                : value !== EvmEventBoxTabs.Decoded
            )}
            onTabChange={setCurrentTab}
          />
        )}
      </Flex>
      {currentTab === EvmEventBoxTabs.Raw || is0x ? (
        <TextReadOnly canCopy text={txInput} />
      ) : (
        <Stack
          _hover={{
            "& .copy-button-box": { display: "block" },
            borderColor: "gray.600",
          }}
          borderColor="gray.700"
          borderRadius="8px"
          borderWidth="thin"
          gap={2}
          minH={{ base: "360px", md: "auto" }}
          position="relative"
          px={3}
          py={4}
          transition="all 0.25s ease-in-out"
        >
          {currentTab === EvmEventBoxTabs.Decoded &&
            evmVerifyInfo?.isVerified &&
            data && (
              <Text fontFamily="monospace" variant="body2">
                Functions: {data.signature}
              </Text>
            )}
          <Text fontFamily="monospace" variant="body2">
            MethodID: {methodId}
          </Text>
          {currentTab === EvmEventBoxTabs.Formatted || is0x ? (
            <>
              {formattedData.map((d, index) => (
                <Flex key={`${d}-${index}`} align="center" gap={4}>
                  <Text fontFamily="monospace" variant="body2">
                    [{index}]
                  </Text>
                  <EvmEventBoxDataBody text={d} />
                </Flex>
              ))}
            </>
          ) : (
            <>
              {!!data?.fragment.inputs.length && (
                <Stack
                  bgColor={variant === "gray" ? "gray.800" : "gray.900"}
                  borderRadius={8}
                  columnGap={2}
                  p={4}
                  rowGap={4}
                  w="full"
                >
                  {data.fragment.inputs.map((input, index) => (
                    <EvmBoxDecoded
                      key={input.name}
                      decode={data.args[index]}
                      index={index}
                      input={input}
                    />
                  ))}
                </Stack>
              )}
            </>
          )}
        </Stack>
      )}
    </Stack>
  );
};
