import type { Nullable } from "lib/types";

import { Box, Button, Flex, Spinner, Text } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { jsonLineCount, jsonPrettify, jsonValidate } from "lib/utils";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

import { CustomIcon } from "../icon";

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
              boxSize={3}
              color="error.light"
              name="alert-triangle-solid"
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
              boxSize={3}
              color="success.main"
              name="check-circle-solid"
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
        _hover={{
          borderColor: "gray.600",
        }}
        borderColor="gray.700"
        borderRadius="8px"
        borderWidth="thin"
        height="100%"
        minH={32}
        p="16px 12px"
        position="relative"
        transition="all 0.25s ease-in-out"
      >
        <JsonEditor
          isValid={isValidJson}
          setValue={handleChange}
          showLines={showLines}
          value={text}
        />
        {topic && (
          <Text
            background="background.main"
            color="text.dark"
            fontSize="12px"
            position="absolute"
            top="-10px"
            w="fit-content"
          >
            {topic}
          </Text>
        )}
        {!isMobile && (
          <Button
            background="background.main"
            float="right"
            fontSize="12px"
            isDisabled={!isValidJson}
            p="4px 10px"
            position="absolute"
            right="10px"
            top="10px"
            variant="outline-white"
            onClick={() => setText(jsonPrettify(text))}
          >
            Format JSON
          </Button>
        )}
      </Box>
      <Flex
        alignItems="center"
        fontSize="12px"
        gap={2}
        minHeight="16px"
        my={response ? "16px" : undefined}
        textColor={color}
      >
        {response}
      </Flex>
    </Flex>
  );
};

export default JsonInput;
