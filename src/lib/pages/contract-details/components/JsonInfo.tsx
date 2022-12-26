import { Flex, Heading, Icon } from "@chakra-ui/react";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

import JsonReadOnly from "lib/components/json/JsonReadOnly";

interface JsonInfoProps {
  header: string;
  jsonString: string;
}

export const JsonInfo = ({ header, jsonString }: JsonInfoProps) => {
  const [expand, setExpand] = useState(false);

  return (
    <Flex direction="column">
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
        height={expand ? "320px" : 0}
        canCopy
        canViewFull={expand}
      />
    </Flex>
  );
};
