import { Flex, Text } from "@chakra-ui/react";
import { useState } from "react";

import { CustomIcon } from "../icon";
import JsonReadOnly from "./JsonReadOnly";

interface JsonInfoProps {
  header: string;
  jsonString: string;
  defaultExpand?: boolean;
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
        _hover={{ backgroundColor: "gray.800" }}
        align="center"
        background="gray.900"
        borderRadius="8px"
        cursor="pointer"
        justify="space-between"
        p="12px 16px"
        transition="all 0.25s ease-in-out"
        onClick={() => setExpand((prev) => !prev)}
      >
        <Text fontWeight={600} variant="body1" wordBreak="break-word">
          {header}
        </Text>
        <CustomIcon
          color="gray.600"
          name={expand ? "chevron-up" : "chevron-down"}
          transition="all 0.25s ease-in-out"
        />
      </Flex>
      <div
        style={expand ? { display: "block" } : { display: "none", height: 0 }}
      >
        <JsonReadOnly canCopy isExpandable text={jsonString} />
      </div>
    </>
  );
};
