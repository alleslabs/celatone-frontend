import type { LayoutProps } from "@chakra-ui/react";
import { Text, Box } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useMemo } from "react";

import { jsonValidate } from "lib/utils";

const JsonEditor = dynamic(() => import("lib/components/json/JsonEditor"), {
  ssr: false,
});

interface JsonReadOnlyProps {
  topic?: string;
  text: string;
  height?: LayoutProps["height"];
}

const JsonReadOnly = ({ topic, text, height }: JsonReadOnlyProps) => {
  const isJsonValid = useMemo(() => {
    return jsonValidate(text) === null || text.length === 0;
  }, [text]);

  return (
    <Box
      mt="8px"
      mb="16px"
      pl="10px"
      pt="16px"
      borderWidth="thin"
      borderColor={!isJsonValid ? "error.main" : "divider.main"}
      borderRadius="4px"
      position="relative"
      transition="all .2s"
      _hover={{
        borderColor: isJsonValid && "gray.600",
      }}
    >
      <JsonEditor value={text} readOnly isValid={isJsonValid} height={height} />
      {!!topic && (
        <Text
          top="-10px"
          background="background.main"
          textColor={!isJsonValid ? "error.main" : "gray.500"}
          fontSize="12px"
          position="absolute"
        >
          {topic}
        </Text>
      )}
    </Box>
  );
};

export default JsonReadOnly;
