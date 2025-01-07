import { Flex, Text } from "@chakra-ui/react";
import { useState } from "react";

import { CustomIcon } from "../icon";

import JsonReadOnly from "./JsonReadOnly";

interface JsonInfoProps {
  defaultExpand?: boolean;
  header: string;
  jsonString: string;
}

export const JsonInfo = ({
  defaultExpand = false,
  header,
  jsonString,
}: JsonInfoProps) => {
  const [expand, setExpand] = useState(defaultExpand);

  return (
    <>
      <Flex
        align="center"
        justify="space-between"
        p="12px 16px"
        _hover={{ backgroundColor: "gray.800" }}
        background="gray.900"
        borderRadius="8px"
        cursor="pointer"
        onClick={() => setExpand((prev) => !prev)}
        transition="all 0.25s ease-in-out"
      >
        <Text variant="body1" fontWeight={600} wordBreak="break-word">
          {header}
        </Text>
        <CustomIcon
          name={expand ? "chevron-up" : "chevron-down"}
          color="gray.600"
          transition="all 0.25s ease-in-out"
        />
      </Flex>
      <div
        style={expand ? { display: "block" } : { display: "none", height: 0 }}
      >
        <JsonReadOnly isExpandable text={jsonString} canCopy />
      </div>
    </>
  );
};
