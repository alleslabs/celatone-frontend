import { Flex, Heading } from "@chakra-ui/react";
import { useMemo, useState } from "react";

import { TextReadOnly } from "lib/components/json/TextReadOnly";
import type { HexAddr20, Nullable } from "lib/types";
import { EvmMethodName } from "lib/types";
import { getEvmMethod } from "lib/utils";

import { EvmDataFormatSwitch, EvmDataFormatTabs } from "./EvmDataFormatSwitch";

interface EvmInputDataProps {
  txInput: string;
  txTo: Nullable<HexAddr20>;
}

export const EvmInputData = ({ txInput, txTo }: EvmInputDataProps) => {
  const evmMethod = getEvmMethod(txInput, txTo);
  const showFormatOption =
    evmMethod !== EvmMethodName.Transfer && evmMethod !== EvmMethodName.Create;
  const [tab, setTab] = useState<EvmDataFormatTabs>(
    showFormatOption ? EvmDataFormatTabs.Formatted : EvmDataFormatTabs.Raw
  );

  const parsedInputData = useMemo(() => {
    switch (tab) {
      case EvmDataFormatTabs.Formatted: {
        const chunkSize = 64;
        const formattedData: string[] = [];

        const methodId = txInput.slice(0, 10);
        const remainingData = txInput.slice(10);

        formattedData.push(`MethodID: ${methodId}`);

        for (let i = 0; i < remainingData.length; i += chunkSize) {
          const chunk = remainingData.slice(i, i + chunkSize);
          const formattedChunk = `[${i / chunkSize}]:  ${chunk}`;
          formattedData.push(formattedChunk);
        }

        return formattedData.join("\n");
      }
      case EvmDataFormatTabs.UTF8:
        return Buffer.from(txInput.slice(2), "hex").toString("binary");
      case EvmDataFormatTabs.Raw:
      default:
        return txInput;
    }
  }, [txInput, tab]);

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
