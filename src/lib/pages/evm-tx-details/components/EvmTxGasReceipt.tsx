import { Button, Flex } from "@chakra-ui/react";
import { useState } from "react";

import type { GasInfo } from "../data";
import { CustomIcon } from "lib/components/icon";
import { LabelText } from "lib/components/LabelText";
import { formatInteger, formatTokenWithValue } from "lib/utils";

interface EvmTxGasReceiptProps {
  gasInfo: GasInfo;
}

export const EvmTxGasReceipt = ({ gasInfo }: EvmTxGasReceiptProps) => {
  const [expand, setExpand] = useState(false);

  return (
    <>
      <LabelText label="Transaction Fee">
        {formatTokenWithValue(gasInfo.txFee)}
      </LabelText>
      <LabelText label="Gas Price">
        {formatTokenWithValue(gasInfo.gasPrice)}
      </LabelText>
      <LabelText label="Usage by Tx & Gas Limit">
        {`${formatInteger(gasInfo.gasUsed)}/${formatInteger(gasInfo.gasLimit)}`}
      </LabelText>
      {gasInfo.isEIP1559 && (
        <>
          {expand && (
            <Flex
              direction="column"
              border="1px solid"
              borderColor="gray.700"
              backgroundColor="gray.900"
              borderRadius="8px"
              p={4}
              gap={6}
            >
              <LabelText label="Base Fee">
                {formatTokenWithValue(gasInfo.baseFee)}
              </LabelText>
              <LabelText label="Max Priority">
                {formatTokenWithValue(gasInfo.maxPriorityFee)}
              </LabelText>
              <LabelText label="Max Possible Gas Fee">
                {formatTokenWithValue(gasInfo.maxFee)}
              </LabelText>
            </Flex>
          )}
          <Button
            variant="ghost-primary"
            w="fit-content"
            size="sm"
            rightIcon={
              <CustomIcon
                name={expand ? "chevron-up" : "chevron-down"}
                boxSize={3}
              />
            }
            onClick={() => setExpand(!expand)}
          >
            {expand ? "Hide gas info" : "See more gas info"}
          </Button>
        </>
      )}
    </>
  );
};
