import { Flex, Text } from "@chakra-ui/react";
import { useState } from "react";

import JsonReadOnly from "./JsonReadOnly";
import { CustomIcon } from "../icon";

interface JsonInfoProps {
  header: string;
  jsonString: string;
  defaultExpand?: boolean;
}

export const JsonInfo = ({
  header,
  jsonString,
  defaultExpand = false,
}: JsonInfoProps) => {
  const [expand, setExpand] = useState(defaultExpand);

  return (
    <>
      <Flex
        justify="space-between"
        align="center"
        p="12px 16px"
        borderRadius="8px"
        background="gray.900"
        _hover={{ backgroundColor: "gray.800" }}
        transition="all 0.25s ease-in-out"
        cursor="pointer"
        onClick={() => setExpand((prev) => !prev)}
      >
        <Text variant="body1" fontWeight={600} wordBreak="break-word">
          {header}
        </Text>
        <CustomIcon
          transition="all 0.25s ease-in-out"
          name={expand ? "chevron-up" : "chevron-down"}
          color="gray.600"
        />
      </Flex>
      <div
        style={expand ? { display: "block" } : { height: 0, display: "none" }}
      >
        <JsonReadOnly text={jsonString} canCopy isExpandable />
      </div>
    </>
  );
};
