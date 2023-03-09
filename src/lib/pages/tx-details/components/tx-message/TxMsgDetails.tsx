import { Flex } from "@chakra-ui/react";

import { useGetAddressType } from "lib/app-provider";
import { TxReceiptRender } from "lib/components/tx";
import { useAssetInfos } from "lib/services/assetService";
import type { TxReceipt } from "lib/types";

import type { TxMsgData } from ".";
import { EventBox } from "./EventBox";
import { generateReceipts } from "./msg-receipts";

interface TxMsgDetailsProps extends TxMsgData {
  isExpand: boolean;
}

export const TxMsgDetails = ({ isExpand, ...txMsgData }: TxMsgDetailsProps) => {
  const getAddressType = useGetAddressType();
  const assetInfos = useAssetInfos();
  const receipts = generateReceipts(txMsgData, getAddressType, assetInfos)
    .filter(Boolean)
    .concat(
      txMsgData.log
        ? {
            title: "Event Logs",
            html: (
              <Flex direction="column" gap={3} w="full">
                {txMsgData.log.events.map((event, idx) => (
                  <EventBox
                    key={
                      idx.toString() +
                      event.type +
                      JSON.stringify(event.attributes)
                    }
                    event={event}
                    msgIndex={idx}
                  />
                ))}
              </Flex>
            ),
          }
        : []
    ) as TxReceipt[];

  return (
    <Flex
      direction="column"
      gap={6}
      pt={4}
      height={isExpand ? "full" : 0}
      overflow="hidden"
      transition="all .25s ease-in-out"
    >
      <TxReceiptRender variant="tx-page" receipts={receipts} gap={3} />
    </Flex>
  );
};
