import { Flex, Text } from "@chakra-ui/react";
import plur from "plur";

import { useGetAddressType } from "lib/app-provider";
import { DividerWithArrow } from "lib/components/DividerWithArrow";
import { TxReceiptRender } from "lib/components/tx";
import type { TxReceipt } from "lib/types";

import { EventBox } from "./EventBox";
import { generateReceipts } from "./msg-receipts";
import type { TxMsgData } from ".";

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
      gap={4}
      pl={8}
      height={isExpand ? "full" : 0}
      overflow="hidden"
      transition="all 0.25s ease-in-out"
    >
      <TxReceiptRender
        variant="tx-page"
        receipts={receipts}
        gap={{ base: 4, md: 3 }}
        pt={4}
      />
      {txMsgData.log && (
        <>
          <DividerWithArrow />
          <Text variant="body2" fontWeight={500} color="text.dark">
            {plur("Event log", txMsgData.log.events.length)}
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
        </>
      )}
    </Flex>
  );
};
