import { Box, Button, Divider, Flex, SimpleGrid } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";
import { LabelText } from "lib/components/LabelText";
import { MotionBox } from "lib/components/MotionBox";
import { TokenImageWithAmount } from "lib/components/token";
import {
  formatInteger,
  formatPrettyPercent,
  formatTokenWithValue,
} from "lib/utils";
import { useState } from "react";

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
            hasTrailingZeros={false}
            token={gasInfo.txFee}
          />
        </LabelText>
        <LabelText label="Gas price">
          {formatTokenWithValue({
            isEvm: true,
            token: gasInfo.gasPrice,
          })}
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
            animate={expand ? "expanded" : "collapsed"}
            backgroundColor={expand ? "gray.900" : "transparent"}
            border="1px solid"
            borderColor="gray.800"
            borderRadius="8px"
            initial="collapsed"
            overflow="hidden"
            transition={{
              duration: "0.25",
              ease: "easeInOut",
            }}
            variants={{
              collapsed: { height: 0, marginBottom: 0, opacity: 0 },
              expanded: {
                height: "auto",
                marginBottom: "16px",
                opacity: 1,
              },
            }}
          >
            <Flex direction="column" gap={6} m={4}>
              <LabelText label="Base fee">
                {formatTokenWithValue({
                  isEvm: true,
                  token: gasInfo.baseFee,
                })}
              </LabelText>
              <LabelText label="Max priority">
                {formatTokenWithValue({
                  isEvm: true,
                  token: gasInfo.maxPriorityFee,
                })}
              </LabelText>
              <LabelText label="Max possible gas fee">
                {formatTokenWithValue({
                  isEvm: true,
                  token: gasInfo.maxFee,
                })}
              </LabelText>
            </Flex>
          </MotionBox>
          <Button
            rightIcon={
              <CustomIcon
                boxSize={3}
                name={expand ? "chevron-up" : "chevron-down"}
              />
            }
            size="sm"
            variant="ghost-primary"
            w="fit-content"
            onClick={() => setExpand(!expand)}
          >
            {expand ? "Hide gas info" : "See more gas info"}
          </Button>
        </Box>
      )}
    </>
  );
};
