import type { TxReceipt } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { useGetAddressType } from "lib/app-provider";
import { DividerWithArrow } from "lib/components/DividerWithArrow";
import { TxReceiptRender } from "lib/components/tx";
import plur from "plur";

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
      gap={4}
      height={isExpand ? "full" : 0}
      overflow="hidden"
      pl={8}
      transition="all 0.25s ease-in-out"
    >
      <TxReceiptRender
        gap={{ base: 4, md: 3 }}
        pt={4}
        receipts={receipts}
        variant="tx-page"
      />
      {txMsgData.log && (
        <>
          <DividerWithArrow />
          <Text color="text.dark" fontWeight={500} variant="body2">
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
