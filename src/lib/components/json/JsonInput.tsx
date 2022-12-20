import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import type { LayoutProps } from "@chakra-ui/react";
import { Text, Box, Button, Spinner, Flex } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

import { jsonPrettify, jsonValidate } from "lib/utils";

const JsonEditor = dynamic(() => import("./JsonEditor"), {
  ssr: false,
});

interface JsonInputProps {
  topic?: string;
  text: string;
  setText: (value: string) => void;
  height?: LayoutProps["height"];
}

interface JsonState {
  state: "empty" | "loading" | "success" | "error";
  errMsg?: string;
}

const getResponse = (jsonState: JsonState) => {
  switch (jsonState.state) {
    case "loading":
      return {
        color: "gray.500",
        response: (
          <>
            <Spinner size="xs" /> Checking JSON Format...
          </>
        ),
      };
    case "success":
      return {
        color: "white",
        response: (
          <>
            <CheckCircleIcon textColor="success.main" /> Valid JSON Format
          </>
        ),
      };
    case "error":
      return {
        color: "error.main",
        response: (
          <>
            <WarningIcon /> {jsonState.errMsg}
          </>
        ),
      };
    case "empty":
    default:
      return {
        color: "white",
        response: null,
      };
  }
};

const JsonInput = ({ topic, text, setText, height }: JsonInputProps) => {
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
  return (
    <>
      <Box
        mt="8px"
        pl="10px"
        pt="16px"
        borderWidth="thin"
        borderColor="divider.main"
        borderRadius="4px"
        position="relative"
        transition="all .2s"
        _hover={{
          borderColor: "gray.600",
        }}
      >
        <JsonEditor
          value={text}
          setValue={handleOnChange}
          isValid={isValidJson}
          height={height}
        />
        {topic && (
          <Text
            top="-10px"
            w="fit-content"
            background="background.main"
            textColor="gray.500"
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
          variant="outline-info"
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
