import { Box, Flex } from "@chakra-ui/react";
import type { Event } from "@cosmjs/stargate";
import type { ReactNode } from "react";
import { useCallback, useState } from "react";

import { useGetAddressType } from "lib/app-provider";
import type { LinkType } from "lib/components/ExplorerLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import JsonReadOnly from "lib/components/json/JsonReadOnly";
import { TxReceiptRender } from "lib/components/tx";
import { AmpTrackExpand } from "lib/services/amplitude";
import type { TxReceipt } from "lib/types";
import { jsonPrettify, jsonValidate } from "lib/utils";

interface EventBoxProps {
  event: Event;
  msgIndex: number;
}

export const EventBox = ({ event, msgIndex }: EventBoxProps) => {
  const getAddressType = useGetAddressType();
  const [expand, setExpand] = useState(true);
  const [receiptHeight, setReceiptHeight] = useState(0);

  const measuredRef = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      setTimeout(() => {
        setReceiptHeight(node.clientHeight);
      }, 100);
    }
  }, []);

  const receipts = event.attributes.map<TxReceipt>(({ key, value }) => {
    const addrType = getAddressType(value);
    let valueComponent: ReactNode;

    switch (true) {
      case addrType !== "invalid_address":
        valueComponent = (
          <ExplorerLink
            type={addrType}
            value={value}
            showCopyOnHover
            textFormat="normal"
            maxWidth="full"
            ampCopierSection="tx_page_event_logs"
          />
        );
        break;
      case key === "code_id":
      case key === "proposal_id":
        valueComponent = (
          <ExplorerLink
            type={key as LinkType}
            value={value}
            showCopyOnHover
            textFormat="normal"
            maxWidth="full"
            ampCopierSection="tx_page_event_logs"
          />
        );
        break;
      case key === "_contract_address":
        valueComponent = (
          <ExplorerLink
            type="contract_address"
            value={value}
            showCopyOnHover
            textFormat="normal"
            maxWidth="full"
            ampCopierSection="tx_page_event_logs"
          />
        );
        break;
      case jsonValidate(value) === null:
        if (typeof JSON.parse(value) === "object")
          valueComponent = (
            <JsonReadOnly
              text={jsonPrettify(value)}
              canCopy
              fullWidth
              isExpandable
              amptrackSection="tx_page_event_logs"
            />
          );
        else valueComponent = value;
        break;
      default:
        valueComponent = value;
        break;
    }

    return {
      title: key,
      ...(typeof valueComponent === "string"
        ? { value }
        : // Value is included to avoid receipt row key duplicate
          { html: valueComponent, value }),
    };
  });

  return (
    <Flex
      position="relative"
      direction="column"
      borderRadius="8px"
      transition="all .25s ease-in-out"
      backgroundColor="gray.900"
      _hover={{ backgroundColor: "gray.800" }}
    >
      <Flex
        align="center"
        justify="space-between"
        cursor="pointer"
        onClick={() => {
          AmpTrackExpand(
            expand ? "collapse" : "expand",
            "event_box",
            "tx_page"
          );
          setExpand((prev) => !prev);
        }}
        p={4}
      >
        <Flex fontSize="14px" gap={2} fontWeight={500} align="center">
          <CustomIcon name="contract-list" boxSize={4} color="gray.600" m={0} />
          {`[${msgIndex}] ${event.type}`}
        </Flex>
        <CustomIcon
          name="chevron-down"
          color="gray.600"
          boxSize={4}
          transform={expand ? "rotate(180deg)" : "rotate(0)"}
          transition="all .25s ease-in-out"
          m={0}
        />
      </Flex>
      <Box
        overflow="hidden"
        h={expand ? `${receiptHeight}px` : 0}
        transition="all .25s ease-in-out"
      >
        <Flex direction="column" p={4} pt={0} ref={measuredRef}>
          <Box mb={4} h="1px" bgColor="gray.700" />
          <TxReceiptRender
            keyPrefix={msgIndex.toString() + event.type}
            variant="tx-page"
            receipts={receipts}
            gap={3}
          />
        </Flex>
      </Box>
    </Flex>
  );
};
