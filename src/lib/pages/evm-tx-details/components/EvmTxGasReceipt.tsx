import { Box, Button, Divider, Flex, SimpleGrid } from "@chakra-ui/react";
import { useState } from "react";

import { CustomIcon } from "lib/components/icon";
import { LabelText } from "lib/components/LabelText";
import { MotionBox } from "lib/components/MotionBox";
import { TokenImageWithAmount } from "lib/components/token";
import {
  formatInteger,
  formatPrettyPercent,
  formatTokenWithValue,
} from "lib/utils";
import type { GasInfo } from "../data";

interface EvmTxGasReceiptProps {
  gasInfo: GasInfo;
}

export const EvmTxGasReceipt = ({ gasInfo }: EvmTxGasReceiptProps) => {
  const [expand, setExpand] = useState(false);

  return (
    <>
      <Divider />
      <SimpleGrid columns={{ base: 2, md: 1 }} gap={4}>
        <LabelText flex={1} label="Transaction fee">
          <TokenImageWithAmount
            token={gasInfo.txFee}
            hasTrailingZeros={false}
          />
        </LabelText>
        <LabelText label="Gas price">
          {formatTokenWithValue(gasInfo.gasPrice, undefined, false)}
        </LabelText>
        <LabelText label="Usage by tx & gas limit">
          {`${formatInteger(gasInfo.gasUsed)}/${formatInteger(gasInfo.gasLimit)}`}
        </LabelText>
        <LabelText label="Gas refund percentage">
          {`${formatPrettyPercent(gasInfo.gasRefundRatio, 2, true)}`}
        </LabelText>
      </SimpleGrid>
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
              <LabelText label="Base fee">
                {formatTokenWithValue(gasInfo.baseFee, undefined, false)}
              </LabelText>
              <LabelText label="Max priority">
                {formatTokenWithValue(gasInfo.maxPriorityFee, undefined, false)}
              </LabelText>
              <LabelText label="Max possible gas fee">
                {formatTokenWithValue(gasInfo.maxFee, undefined, false)}
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
