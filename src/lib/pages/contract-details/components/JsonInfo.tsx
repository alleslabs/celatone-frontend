import { Flex, Heading } from "@chakra-ui/react";
import type { CSSProperties } from "react";
import { useState } from "react";

import { CustomIcon } from "lib/components/icon";
import JsonReadOnly from "lib/components/json/JsonReadOnly";

interface JsonInfoProps {
  header: string;
  jsonString: string;
  showViewFullButton?: boolean;
  jsonAreaHeight?: CSSProperties["height"];
  defaultExpand?: boolean;
}

export const JsonInfo = ({
  header,
  jsonString,
  showViewFullButton,
  jsonAreaHeight = "300px",
  defaultExpand = false,
}: JsonInfoProps) => {
  const [expand, setExpand] = useState(defaultExpand);
  /**
   * @todos revist height and expand mechanism later
   */
  return (
    <>
      <Flex
        justify="space-between"
        align="center"
        p="12px 16px"
        borderRadius="8px"
        background="pebble.900"
        _hover={{ backgroundColor: "pebble.800" }}
        transition="all .25s ease-in-out"
        cursor="pointer"
        onClick={() => setExpand((prev) => !prev)}
      >
        <Heading as="h6" variant="h6">
          {header}
        </Heading>
        <CustomIcon
          transition="all .25s ease-in-out"
          name={expand ? "chevron-up" : "chevron-down"}
        />
      </Flex>
      <JsonReadOnly
        text={jsonString}
        height={expand ? jsonAreaHeight : 0}
        canCopy
        canViewFull={showViewFullButton && expand}
        disableResizing
      />
    </>
  );
};
