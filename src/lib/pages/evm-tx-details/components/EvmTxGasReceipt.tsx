import { Box, Button, Flex } from "@chakra-ui/react";
import { useState } from "react";

import type { GasInfo } from "../data";
import { CustomIcon } from "lib/components/icon";
import { LabelText } from "lib/components/LabelText";
import { MotionBox } from "lib/components/MotionBox";
import { formatInteger, formatTokenWithValue } from "lib/utils";

interface EvmTxGasReceiptProps {
  gasInfo: GasInfo;
}

export const EvmTxGasReceipt = ({ gasInfo }: EvmTxGasReceiptProps) => {
  const [expand, setExpand] = useState(false);

  return (
    <Flex direction="column" gap={6}>
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
        <Box>
          <MotionBox
            display="flex"
            flexDirection="column"
            border="1px solid"
            backgroundColor={expand ? "gray.900" : "transparent"}
            borderRadius="8px"
            gap={6}
            minHeight="0"
            overflow="hidden"
            animate={{
              height: expand ? "auto" : 0,
              padding: expand ? "var(--chakra-space-4)" : 0,
              borderColor: expand
                ? "var(--chakra-colors-gray-700)"
                : "transparent",
              marginBottom: expand ? "var(--chakra-space-6)" : 0,
            }}
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
          </MotionBox>
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
        </Box>
      )}
    </Flex>
  );
};
