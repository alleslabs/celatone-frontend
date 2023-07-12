import { Text, Box, Button, Spinner, Flex } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useState, useEffect, useMemo } from "react";

import { CustomIcon } from "../icon";
import { jsonLineCount, jsonPrettify, jsonValidate } from "lib/utils";

const JsonEditor = dynamic(() => import("./JsonEditor"), {
  ssr: false,
});

interface JsonInputProps {
  topic?: string;
  text?: string;
  setText: (value: string) => void;
  minLines?: number;
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
              name="alert-circle-solid"
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
  setText,
  minLines = 16,
}: JsonInputProps) => {
  const [jsonState, setJsonState] = useState<JsonState>({ state: "empty" });

  const handleOnChange = (value: string) => {
    setJsonState({ state: "loading" });
    setText(value);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const error = jsonValidate(text);

      if (text.trim().length === 0) setJsonState({ state: "empty" });
      else if (error) setJsonState({ state: "error", errMsg: error });
      else setJsonState({ state: "success" });
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [text]);

  const { color, response } = getResponse(jsonState);
  const isValidJson = jsonValidate(text) === null;

  const showLines = useMemo(() => {
    const lines = jsonLineCount(text);

    // Limit the number of lines from minLines (default is 16) to 100
    return Math.min(Math.max(lines, minLines), 100);
  }, [text, minLines]);

  return (
    <>
      <Box
        p="16px 12px"
        borderWidth="thin"
        borderColor="gray.700"
        borderRadius="8px"
        position="relative"
        minH={32}
        transition="all .25s ease-in-out"
        _hover={{
          borderColor: "gray.600",
        }}
      >
        <JsonEditor
          value={text}
          setValue={handleOnChange}
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
    </>
  );
};

export default JsonInput;
