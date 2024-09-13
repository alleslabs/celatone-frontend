import { Flex, Heading } from "@chakra-ui/react";
import { useMemo, useState } from "react";

import { TextReadOnly } from "lib/components/json/TextReadOnly";
import { getEvmMethod } from "lib/utils";

import { EvmDataFormatSwitch, EvmDataFormatTabs } from "./EvmDataFormatSwitch";

interface EvmInputDataProps {
  inputData: string;
}

export const EvmInputData = ({ inputData }: EvmInputDataProps) => {
  const evmMethod = getEvmMethod(inputData);
  const showFormatOption = evmMethod !== "create";
  const [tab, setTab] = useState<EvmDataFormatTabs>(
    showFormatOption ? EvmDataFormatTabs.Formatted : EvmDataFormatTabs.Raw
  );

  const parsedInputData = useMemo(() => {
    switch (tab) {
      case EvmDataFormatTabs.Formatted: {
        const chunkSize = 64;
        const formattedData: string[] = [];

        const methodId = inputData.slice(0, 10);
        const remainingData = inputData.slice(10);

        formattedData.push(`MethodID: ${methodId}`);

        for (let i = 0; i < remainingData.length; i += chunkSize) {
          const chunk = remainingData.slice(i, i + chunkSize);
          const formattedChunk = `[${i / chunkSize}]:  ${chunk}`;
          formattedData.push(formattedChunk);
        }

        return formattedData.join("\n");
      }
      case EvmDataFormatTabs.UTF8:
        return Buffer.from(inputData.slice(2), "hex").toString("binary");
      case EvmDataFormatTabs.Raw:
      default:
        return inputData;
    }
  }, [inputData, tab]);

  return (
    <>
      <Flex
        gap={4}
        align={{ base: "flex-start", md: "center" }}
        direction={{ base: "column", md: "row" }}
      >
        <Heading as="h6" variant="h6">
          Input Data
        </Heading>
        {showFormatOption && (
          <EvmDataFormatSwitch currentTab={tab} onTabChange={setTab} />
        )}
      </Flex>
      <TextReadOnly text={parsedInputData} canCopy />
    </>
  );
};
