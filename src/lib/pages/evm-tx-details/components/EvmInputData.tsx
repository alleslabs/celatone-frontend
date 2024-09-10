import { Flex, Heading } from "@chakra-ui/react";
import { useMemo, useState } from "react";

import { TextReadOnly } from "lib/components/json/TextReadOnly";
import { hexToString } from "lib/utils";

import { EvmDataFormatSwitch, EvmDataFormatTabs } from "./EvmDataFormatSwitch";

interface EvmInputDataProps {
  inputData: string;
}

export const EvmInputData = ({ inputData }: EvmInputDataProps) => {
  const [tab, setTab] = useState<EvmDataFormatTabs>(
    EvmDataFormatTabs.Formatted
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
        return hexToString(inputData.slice(2));
      case EvmDataFormatTabs.Raw:
      default:
        return inputData;
    }
  }, [inputData, tab]);

  return (
    <>
      <Flex gap={4} align="center">
        <Heading as="h6" variant="h6">
          Input Data
        </Heading>
        <EvmDataFormatSwitch currentTab={tab} onTabChange={setTab} />
      </Flex>
      <TextReadOnly text={parsedInputData} canCopy />
    </>
  );
};
