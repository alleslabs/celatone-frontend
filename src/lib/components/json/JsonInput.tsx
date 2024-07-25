import { Box, Button, Flex, Spinner, Text } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

import { CustomIcon } from "../icon";
import type { Nullable } from "lib/types";
import { jsonLineCount, jsonPrettify, jsonValidate } from "lib/utils";

const JsonEditor = dynamic(() => import("./JsonEditor"), {
  ssr: false,
});

interface JsonInputProps {
  topic?: string;
  text?: string;
  minLines?: number;
  maxLines?: number;
  setText: (value: string) => void;
  validateFn?: (value: string) => Nullable<string>;
}

interface JsonState {
  state: "empty" | "loading" | "success" | "error";
  errMsg?: string;
}

const getResponse = (jsonState: JsonState) => {
  switch (jsonState.state) {
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
              color="success.main"
              boxSize={3}
            />
            Valid JSON Format
          </>
        ),
      };
    case "error":
      return {
        color: "error.main",
        response: (
          <>
            <CustomIcon
              name="alert-triangle-solid"
              color="error.light"
              boxSize={3}
            />
            {jsonState.errMsg}
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
  topic,
  text = "",
  minLines = 16,
  maxLines = 100,
  setText,
  validateFn = jsonValidate,
}: JsonInputProps) => {
  const [jsonState, setJsonState] = useState<JsonState>({ state: "empty" });

  const handleChange = (value: string) => {
    setJsonState({ state: "loading" });
    setText(value);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const error = validateFn(text);

      if (text.trim().length === 0) setJsonState({ state: "empty" });
      else if (error) setJsonState({ state: "error", errMsg: error });
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
        p="16px 12px"
        borderWidth="thin"
        borderColor="gray.700"
        borderRadius="8px"
        position="relative"
        minH={32}
        transition="all 0.25s ease-in-out"
        _hover={{
          borderColor: "gray.600",
        }}
        height="100%"
      >
        <JsonEditor
          value={text}
          setValue={handleChange}
          isValid={isValidJson}
          showLines={showLines}
        />
        {topic && (
          <Text
            top="-10px"
            w="fit-content"
            background="background.main"
            color="text.dark"
            fontSize="12px"
            position="absolute"
          >
            {topic}
          </Text>
        )}
        <Button
          position="absolute"
          top="10px"
          right="10px"
          p="4px 10px"
          variant="outline-accent"
          fontSize="12px"
          background="background.main"
          float="right"
          isDisabled={!isValidJson}
          onClick={() => {
            setText(jsonPrettify(text));
          }}
        >
          Format JSON
        </Button>
      </Box>
      <Flex
        my={response ? "16px" : undefined}
        minHeight="16px"
        fontSize="12px"
        textColor={color}
        alignItems="center"
        gap={2}
      >
        {response}
      </Flex>
    </Flex>
  );
};

export default JsonInput;
