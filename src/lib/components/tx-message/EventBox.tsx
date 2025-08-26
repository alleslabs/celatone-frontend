import type { Event } from "@cosmjs/stargate";
import type { LinkType } from "lib/components/ExplorerLink";
import type { TxReceipt } from "lib/types";
import type { ReactNode } from "react";

import { Box, Flex } from "@chakra-ui/react";
import { trackUseExpand } from "lib/amplitude";
import { useGetAddressType } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import JsonReadOnly from "lib/components/json/JsonReadOnly";
import { MotionBox } from "lib/components/MotionBox";
import { TxReceiptRender } from "lib/components/tx";
import { jsonPrettify, jsonValidate } from "lib/utils";
import { useState } from "react";

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
            ampCopierSection="tx_page_event_logs"
            maxWidth="full"
            showCopyOnHover
            textFormat="normal"
            type={addrType}
            value={value}
          />
        );
        break;
      case key === "code_id":
      case key === "proposal_id":
        valueComponent = (
          <ExplorerLink
            ampCopierSection="tx_page_event_logs"
            maxWidth="full"
            queryParams={{}}
            showCopyOnHover
            textFormat="normal"
            textLabel={undefined}
            type={key as LinkType}
            value={value}
          />
        );
        break;
      case key === "_contract_address":
        valueComponent = (
          <ExplorerLink
            ampCopierSection="tx_page_event_logs"
            maxWidth="full"
            showCopyOnHover
            textFormat="normal"
            type="contract_address"
            value={value}
          />
        );
        break;
      case jsonValidate(value) === null:
        if (typeof JSON.parse(value) === "object")
          valueComponent = (
            <JsonReadOnly
              amptrackSection="tx_page_event_logs"
              canCopy
              fullWidth
              isExpandable
              text={jsonPrettify(value)}
            />
          );
        else valueComponent = value;
        break;
      case key === "module_addr":
        valueComponent = <ExplorerLink type="contract_address" value={value} />;
        break;
      case key === "module_name": {
        const findModuleAddress = event.attributes.find(
          (attr) => attr.key === "module_addr"
        );

        if (findModuleAddress) {
          valueComponent = (
            <ExplorerLink
              textLabel={value}
              type="module_name"
              value={`${findModuleAddress.value}/${value}`}
            />
          );
        }

        break;
      }
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
        cursor="pointer"
        justify="space-between"
        p={4}
        onClick={() => {
          trackUseExpand({
            action: expand ? "collapse" : "expand",
            component: "event_box",
            section: "tx_page",
          });
          setExpand((prev) => !prev);
        }}
      >
        <Flex align="center" fontSize="14px" fontWeight={500} gap={2}>
          <CustomIcon boxSize={4} color="gray.600" m={0} name="list" />
          {`[${msgIndex}] ${event.type}`}
        </Flex>
        <CustomIcon
          boxSize={4}
          color="gray.600"
          m={0}
          name="chevron-down"
          transform={expand ? "rotate(180deg)" : "rotate(0)"}
          transition="all 0.25s ease-in-out"
        />
      </Flex>
      <MotionBox
        animate={expand ? "expanded" : "collapsed"}
        display="flex"
        flexDir="column"
        initial="collapsed"
        overflow="hidden"
        transition={{
          duration: "0.25",
          ease: "easeInOut",
        }}
        variants={{
          collapsed: { height: 0, opacity: 0 },
          expanded: { height: "auto", opacity: 1 },
        }}
      >
        <Box borderTop="1px solid var(--chakra-colors-gray-700)" mx={4} />
        <TxReceiptRender
          gap={3}
          keyPrefix={msgIndex.toString() + event.type}
          p={4}
          receipts={receipts}
          variant="tx-page"
        />
      </MotionBox>
    </Flex>
  );
};
