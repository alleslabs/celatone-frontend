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
        <TokenImageWithAmount token={gasInfo.txFee} />
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
            border="1px solid"
            backgroundColor={expand ? "gray.900" : "transparent"}
            borderRadius="8px"
            borderColor="gray.800"
            variants={{
              expanded: {
                opacity: 1,
                height: "auto",
                marginBottom: "16px",
              },
              collapsed: { opacity: 0, height: 0, marginBottom: 0 },
            }}
            overflow="hidden"
            initial="collapsed"
            animate={expand ? "expanded" : "collapsed"}
            transition={{
              duration: "0.25",
              ease: "easeInOut",
            }}
          >
            <Flex direction="column" gap={6} m={4}>
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
    </>
  );
};
