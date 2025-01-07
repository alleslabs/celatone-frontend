import { Box, Button, Flex, Spinner, Text } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

import { CustomIcon } from "../icon";
import { useMobile } from "lib/app-provider";
import type { Nullable } from "lib/types";
import { jsonLineCount, jsonPrettify, jsonValidate } from "lib/utils";

const JsonEditor = dynamic(() => import("./JsonEditor"), {
  ssr: false,
});

interface JsonInputProps {
  maxLines?: number;
  minLines?: number;
  setText: (value: string) => void;
  text?: string;
  topic?: string;
  validateFn?: (value: string) => Nullable<string>;
}

interface JsonState {
  errMsg?: string;
  state: "empty" | "error" | "loading" | "success";
}

const getResponse = (jsonState: JsonState) => {
  switch (jsonState.state) {
    case "error":
      return {
        color: "error.main",
        response: (
          <>
            <CustomIcon
              name="alert-triangle-solid"
              boxSize={3}
              color="error.light"
            />
            {jsonState.errMsg}
          </>
        ),
      };
    case "loading":
      return {
        color: "text.dark",
        response: (
          <>
            <Spinner size="xs" /> Checking JSON Format...
          </>
        ),
      };
    case "success":
      return {
        color: "text.main",
        response: (
          <>
            <CustomIcon
              name="check-circle-solid"
              boxSize={3}
              color="success.main"
            />
            Valid JSON Format
          </>
        ),
      };
    case "empty":
    default:
      return {
        color: "text.main",
        response: null,
      };
  }
};

const JsonInput = ({
  maxLines = 100,
  minLines = 16,
  setText,
  text = "",
  topic,
  validateFn = jsonValidate,
}: JsonInputProps) => {
  const isMobile = useMobile();
  const [jsonState, setJsonState] = useState<JsonState>({ state: "empty" });
  const handleChange = (value: string) => {
    setJsonState({ state: "loading" });
    setText(value);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const error = validateFn(text);

      if (text.trim().length === 0) setJsonState({ state: "empty" });
      else if (error) setJsonState({ errMsg: error, state: "error" });
      else setJsonState({ state: "success" });
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [text, validateFn]);

  const { color, response } = getResponse(jsonState);
  const isValidJson = validateFn(text) === null;

  const showLines = useMemo(() => {
    const lines = jsonLineCount(text);

    // Limit the number of lines from minLines (default is 16) to 100
    return Math.min(Math.max(lines, minLines), maxLines);
  }, [text, minLines, maxLines]);

  return (
    <Flex direction="column" flexGrow={1}>
      <Box
        borderWidth="thin"
        height="100%"
        minH={32}
        p="16px 12px"
        _hover={{
          borderColor: "gray.600",
        }}
        borderColor="gray.700"
        borderRadius="8px"
        position="relative"
        transition="all 0.25s ease-in-out"
      >
        <JsonEditor
          isValid={isValidJson}
          setValue={handleChange}
          value={text}
          showLines={showLines}
        />
        {topic && (
          <Text
            w="fit-content"
            background="background.main"
            color="text.dark"
            fontSize="12px"
            position="absolute"
            top="-10px"
          >
            {topic}
          </Text>
        )}
        {!isMobile && (
          <Button
            isDisabled={!isValidJson}
            p="4px 10px"
            right="10px"
            variant="outline-white"
            background="background.main"
            float="right"
            fontSize="12px"
            onClick={() => setText(jsonPrettify(text))}
            position="absolute"
            top="10px"
          >
            Format JSON
          </Button>
        )}
      </Box>
      <Flex
        alignItems="center"
        gap={2}
        minHeight="16px"
        my={response ? "16px" : undefined}
        fontSize="12px"
        textColor={color}
      >
        {response}
      </Flex>
    </Flex>
  );
};

export default JsonInput;
