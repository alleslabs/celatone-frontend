import type { InputProps } from "@chakra-ui/react";
import {
  FormControl,
  FormHelperText,
  Box,
  FormLabel,
  Tag,
  Flex,
  Input,
  List,
  ListItem,
  Icon,
  Text,
  useOutsideClick,
} from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import type { CSSProperties, KeyboardEvent } from "react";
import { useState, useRef, forwardRef } from "react";
import { MdCheckCircle, MdClose } from "react-icons/md";

import mergeRefs from "lib/utils/mergeRefs";

export interface TagSelectionProps extends InputProps {
  options: string[];
  placeholder?: string;
  result: string[];
  setResult: (options: string[]) => void;
  badgeBgColor?: string;
  helperText?: string;
  labelBgColor?: string;
}

const listItemProps: CSSProperties = {
  borderRadius: "4px",
  margin: "4px 0px",
  padding: "8px",
  cursor: "pointer",
};
const tagItemProps: CSSProperties = {
  borderRadius: "24px",
  cursor: "pointer",
  whiteSpace: "nowrap",
  alignItems: "center",
  display: "flex",
  textTransform: "none",
  gap: "4px",
  marginRight: "8px",
};

export const TagSelection = forwardRef<HTMLInputElement, TagSelectionProps>(
  (
    {
      options,
      result,
      setResult,
      placeholder,
      badgeBgColor = "info.dark",
      helperText,
      labelBgColor = "gray.800",
      ...rest
    }: TagSelectionProps,
    ref
    // TODO: refactor to reduce complexity
    // eslint-disable-next-line sonarjs/cognitive-complexity
  ) => {
    const [optionsCopy, setOptionsCopy] = useState<string[]>(options);
    const [partialResult, setPartialResult] = useState<string[]>([]);
    const [displayOptions, setDisplayOptions] = useState(false);
    const [inputValue, setInputValue] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);

    const filterOptions = (value: string) => {
      setDisplayOptions(true);
      setPartialResult(value ? matchSorter(optionsCopy, value) : optionsCopy);
      setInputValue(value);
    };

    const isOptionSelected = (option: string) =>
      result.some((selectedOption) => selectedOption === option);

    const selectOption = (option: string) => {
      if (isOptionSelected(option)) {
        setResult(result.filter((existingOption) => existingOption !== option));
      } else {
        setResult([option, ...result]);
      }
    };

    const createOption = () => {
      if (inputValue) {
        setOptionsCopy((prev) => [...prev, inputValue]);
        selectOption(inputValue);
        setDisplayOptions(false);
        if (inputRef && inputRef.current !== null) {
          inputRef.current.value = "";
        }
      }
    };

    const selectOptionFromList = (option: string) => {
      selectOption(option);
      setDisplayOptions(false);
      if (inputRef && inputRef.current !== null) {
        inputRef.current.value = "";
      }
    };

    const canCreateOption = !optionsCopy.find(
      (each) => each === inputValue?.toLowerCase()
    );

    const handleKeydown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && canCreateOption) {
        createOption();
      }
    };

    useOutsideClick({
      ref: boxRef,
      handler: () => setDisplayOptions(false),
    });

    return (
      <Box ref={boxRef} w="full">
        <FormControl>
          <Flex
            alignItems="center"
            color="text.main"
            border="1px solid"
            borderColor="divider.main"
            background="none"
            borderRadius="4px"
            maxW="100%"
            overflowX="scroll"
          >
            {result && result.length && (
              <Flex alignItems="center" pl="2">
                {[...result].reverse().map((option) => (
                  <Flex
                    display="inline-block"
                    onClick={() => selectOption(option)}
                    key={option}
                  >
                    <Tag style={tagItemProps} size="md" bgColor={badgeBgColor}>
                      {option}
                      <Icon as={MdClose} boxSize="4" color="text.dark" />
                    </Tag>
                  </Flex>
                ))}
              </Flex>
            )}

            <Input
              w="100%"
              minW="200px"
              size="lg"
              placeholder={result.length ? "" : placeholder}
              onChange={(e) => filterOptions(e.currentTarget.value)}
              onKeyDown={handleKeydown}
              onFocus={() => {
                setPartialResult(optionsCopy);
                setDisplayOptions(true);
              }}
              ref={mergeRefs([inputRef, ref])}
              maxLength={36}
              style={{ border: "0" }}
              {...rest}
            />
            <FormLabel
              position="absolute"
              top={0}
              left={0}
              fontWeight="400"
              color="text.dark"
              bgColor={labelBgColor}
              pointerEvents="none"
              px={1}
              my={2}
              lineHeight="1.2"
              transform="scale(0.75) translateY(-24px) translateX(8px)"
            >
              Tags
            </FormLabel>
          </Flex>
          <FormHelperText ml={3} mt={1} fontSize="12px" color="text.dark">
            {helperText}
          </FormHelperText>

          {displayOptions && (
            <List
              borderRadius="4px"
              bg="gray.900"
              px="2"
              py="1"
              mt={0}
              position="absolute"
              zIndex="2"
              w="full"
              top="60px"
              maxH="195px"
              overflow="scroll"
            >
              {/* header */}
              <ListItem p={2} borderBottomWidth="1" borderColor="gray.300">
                <Text variant="body3">Select tag or create a new one</Text>
              </ListItem>
              {/* option selection section */}
              {partialResult.map((option) => (
                <ListItem
                  key={option}
                  style={listItemProps}
                  _hover={{ bg: "gray.800" }}
                  onClick={() => selectOptionFromList(option)}
                >
                  <Flex alignItems="center" justifyContent="space-between">
                    <Tag style={tagItemProps} size="sm" bgColor={badgeBgColor}>
                      {option}
                    </Tag>
                    {isOptionSelected(option) && (
                      <Icon
                        as={MdCheckCircle}
                        color="success.main"
                        data-label={option}
                        mr={2}
                      />
                    )}
                  </Flex>
                </ListItem>
              ))}
              {/* creation section */}
              {canCreateOption && inputValue && (
                <ListItem
                  style={listItemProps}
                  _hover={{ bg: "gray.800" }}
                  data-testid="create-option"
                  onClick={() => createOption()}
                >
                  <Flex alignItems="center" gap={2}>
                    <Text variant="body2">Create </Text>
                    <Tag style={tagItemProps} size="sm" bgColor={badgeBgColor}>
                      {inputValue}
                    </Tag>
                  </Flex>
                </ListItem>
              )}
            </List>
          )}
        </FormControl>
      </Box>
    );
  }
);
