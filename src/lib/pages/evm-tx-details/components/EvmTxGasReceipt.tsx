import { Box, Button, Divider, Flex } from "@chakra-ui/react";
import { useState } from "react";

import type { GasInfo } from "../data";
import { CustomIcon } from "lib/components/icon";
import { LabelText } from "lib/components/LabelText";
import { MotionBox } from "lib/components/MotionBox";
import { TokenImageWithAmount } from "lib/components/token";
import { formatInteger, formatTokenWithValue } from "lib/utils";

interface EvmTxGasReceiptProps {
  gasInfo: GasInfo;
}

export const EvmTxGasReceipt = ({ gasInfo }: EvmTxGasReceiptProps) => {
  const [expand, setExpand] = useState(false);

  return (
    <>
      <Divider />
      <LabelText flex={1} label="Transaction Fee">
        <TokenImageWithAmount hasTrailingZeros={false} token={gasInfo.txFee} />
      </LabelText>
      <LabelText label="Gas Price">
        {formatTokenWithValue(gasInfo.gasPrice, undefined, false)}
      </LabelText>
      <LabelText label="Usage by Tx & Gas Limit">
        {`${formatInteger(gasInfo.gasUsed)}/${formatInteger(gasInfo.gasLimit)}`}
      </LabelText>
      {gasInfo.isEIP1559 && (
        <Box>
          <MotionBox
            animate={expand ? "expanded" : "collapsed"}
            initial="collapsed"
            variants={{
              collapsed: { height: 0, marginBottom: 0, opacity: 0 },
              expanded: {
                height: "auto",
                marginBottom: "16px",
                opacity: 1,
              },
            }}
            backgroundColor={expand ? "gray.900" : "transparent"}
            border="1px solid"
            borderColor="gray.800"
            borderRadius="8px"
            overflow="hidden"
            transition={{
              duration: "0.25",
              ease: "easeInOut",
            }}
          >
            <Flex gap={6} m={4} direction="column">
              <LabelText label="Base Fee">
                {formatTokenWithValue(gasInfo.baseFee, undefined, false)}
              </LabelText>
              <LabelText label="Max Priority">
                {formatTokenWithValue(gasInfo.maxPriorityFee, undefined, false)}
              </LabelText>
              <LabelText label="Max Possible Gas Fee">
                {formatTokenWithValue(gasInfo.maxFee, undefined, false)}
              </LabelText>
            </Flex>
          </MotionBox>
          <Button
            size="sm"
            variant="ghost-primary"
            w="fit-content"
            onClick={() => setExpand(!expand)}
            rightIcon={
              <CustomIcon
                name={expand ? "chevron-up" : "chevron-down"}
                boxSize={3}
              />
            }
          >
            {expand ? "Hide gas info" : "See more gas info"}
          </Button>
        </Box>
      )}
    </>
  );
};
