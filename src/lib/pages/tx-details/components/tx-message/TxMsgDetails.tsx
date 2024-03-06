import { Divider, Flex, Text } from "@chakra-ui/react";
import plur from "plur";

import { useGetAddressType } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { TxReceiptRender } from "lib/components/tx";
import type { TxReceipt } from "lib/types";

import type { TxMsgData } from ".";
import { EventBox } from "./EventBox";
import { generateReceipts } from "./msg-receipts";

interface TxMsgDetailsProps extends TxMsgData {
  isExpand: boolean;
}

export const TxMsgDetails = ({ isExpand, ...txMsgData }: TxMsgDetailsProps) => {
  const getAddressType = useGetAddressType();
  const receipts = generateReceipts(txMsgData, getAddressType).filter(
    Boolean
  ) as TxReceipt[];

  return (
    <Flex
      direction="column"
      gap={6}
      py={isExpand ? 4 : 0}
      pl={8}
      height={isExpand ? "full" : 0}
      overflow="hidden"
      transition="all 0.25s ease-in-out"
    >
      <TxReceiptRender
        variant="tx-page"
        receipts={receipts}
        gap={{ base: 4, md: 3 }}
      />
      {txMsgData.log && (
        <Flex direction="column" gap={4}>
          {/* TODO: refactor with LiquidityDivider */}
          <Flex gap={2} alignItems="center" py={3}>
            <Divider borderColor="accent.main" />
            <CustomIcon name="arrow-down" boxSize={4} color="accent.main" />
            <Divider borderColor="accent.main" />
          </Flex>
          <Text variant="body2" fontWeight={500} color="text.dark">
            {plur("Event Log", txMsgData.log.events.length)}
          </Text>
          <Flex direction="column" gap={3} w="full">
            {txMsgData.log.events.map((event, idx) => (
              <EventBox
                key={
                  idx.toString() + event.type + JSON.stringify(event.attributes)
                }
                event={event}
                msgIndex={idx}
              />
            ))}
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};
