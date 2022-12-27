import { Flex, Heading, Icon } from "@chakra-ui/react";
import type { CSSProperties } from "react";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

import JsonReadOnly from "lib/components/json/JsonReadOnly";

interface JsonInfoProps {
  header: string;
  jsonString: string;
  showViewFullButton?: boolean;
  jsonAreaHeight?: CSSProperties["height"];
}

export const JsonInfo = ({
  header,
  jsonString,
  showViewFullButton,
  jsonAreaHeight = "300px",
}: JsonInfoProps) => {
  const [expand, setExpand] = useState(false);

  return (
    <>
      <Flex
        justify="space-between"
        align="center"
        p="12px 16px"
        borderRadius="8px"
        _hover={{ backgroundColor: "gray.900" }}
        transition="all .3s"
        cursor="pointer"
        onClick={() => setExpand((prev) => !prev)}
      >
        <Heading as="h6" variant="h6">
          {header}
        </Heading>
        <Icon
          as={FiChevronDown}
          color="text.dark"
          boxSize={5}
          transform={expand ? "rotate(180deg)" : "rotate(0)"}
          transition="all .3s"
        />
      </Flex>
      <JsonReadOnly
        text={jsonString}
        height={expand ? jsonAreaHeight : 0}
        canCopy
        canViewFull={showViewFullButton && expand}
      />
    </>
  );
};
