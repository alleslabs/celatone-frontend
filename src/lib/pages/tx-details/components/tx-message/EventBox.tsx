import { Box, Flex } from "@chakra-ui/react";
import type { Event } from "@cosmjs/stargate";
import type { ReactNode } from "react";
import { useState } from "react";

import { trackUseExpand } from "lib/amplitude";
import { useGetAddressType } from "lib/app-provider";
import type { LinkType } from "lib/components/ExplorerLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import JsonReadOnly from "lib/components/json/JsonReadOnly";
import { MotionBox } from "lib/components/MotionBox";
import { TxReceiptRender } from "lib/components/tx";
import type { TxReceipt } from "lib/types";
import { jsonPrettify, jsonValidate } from "lib/utils";

interface EventBoxProps {
  event: Event;
  msgIndex: number;
}

export const EventBox = ({ event, msgIndex }: EventBoxProps) => {
  const getAddressType = useGetAddressType();
  const [expand, setExpand] = useState(true);

  const receipts = event.attributes.map<TxReceipt>(({ key, value }) => {
    const addrType = getAddressType(value);
    let valueComponent: ReactNode;

    switch (true) {
      case addrType !== "invalid_address":
        valueComponent = (
          <ExplorerLink
            maxWidth="full"
            fixedHeight={false}
            type={addrType}
            value={value}
            ampCopierSection="tx_page_event_logs"
            showCopyOnHover
            textFormat="normal"
          />
        );
        break;
      case key === "code_id":
      case key === "proposal_id":
        valueComponent = (
          <ExplorerLink
            maxWidth="full"
            fixedHeight={false}
            type={key as LinkType}
            value={value}
            ampCopierSection="tx_page_event_logs"
            showCopyOnHover
            textFormat="normal"
          />
        );
        break;
      case key === "_contract_address":
        valueComponent = (
          <ExplorerLink
            maxWidth="full"
            fixedHeight={false}
            type="contract_address"
            value={value}
            ampCopierSection="tx_page_event_logs"
            showCopyOnHover
            textFormat="normal"
          />
        );
        break;
      case jsonValidate(value) === null:
        if (typeof JSON.parse(value) === "object")
          valueComponent = (
            <JsonReadOnly
              fullWidth
              isExpandable
              text={jsonPrettify(value)}
              amptrackSection="tx_page_event_logs"
              canCopy
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
      _hover={{ backgroundColor: "gray.800" }}
      backgroundColor="gray.900"
      borderRadius="8px"
      direction="column"
      position="relative"
    >
      <Flex
        align="center"
        justify="space-between"
        p={4}
        cursor="pointer"
        onClick={() => {
          trackUseExpand({
            action: expand ? "collapse" : "expand",
            component: "event_box",
            section: "tx_page",
          });
          setExpand((prev) => !prev);
        }}
      >
        <Flex align="center" gap={2} fontSize="14px" fontWeight={500}>
          <CustomIcon m={0} name="list" boxSize={4} color="gray.600" />
          {`[${msgIndex}] ${event.type}`}
        </Flex>
        <CustomIcon
          m={0}
          name="chevron-down"
          boxSize={4}
          color="gray.600"
          transform={expand ? "rotate(180deg)" : "rotate(0)"}
          transition="all 0.25s ease-in-out"
        />
      </Flex>
      <MotionBox
        animate={expand ? "expanded" : "collapsed"}
        display="flex"
        flexDir="column"
        initial="collapsed"
        variants={{
          collapsed: { height: 0, opacity: 0 },
          expanded: { height: "auto", opacity: 1 },
        }}
        overflow="hidden"
        transition={{
          duration: "0.25",
          ease: "easeInOut",
        }}
      >
        <Box mx={4} borderTop="1px solid var(--chakra-colors-gray-700)" />
        <TxReceiptRender
          keyPrefix={msgIndex.toString() + event.type}
          gap={3}
          p={4}
          receipts={receipts}
          variant="tx-page"
        />
      </MotionBox>
    </Flex>
  );
};
