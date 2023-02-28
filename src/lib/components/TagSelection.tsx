import type { InputProps, LayoutProps } from "@chakra-ui/react";
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
import { observer } from "mobx-react-lite";
import type { CSSProperties, KeyboardEvent } from "react";
import { useEffect, useState, useRef, forwardRef } from "react";
import { MdCheckCircle, MdClose } from "react-icons/md";

import { useUserKey } from "lib/hooks";
import { useContractStore } from "lib/providers/store";
import { mergeRefs } from "lib/utils";

export interface TagSelectionProps extends InputProps {
  placeholder?: string;
  result: string[];
  setResult: (options: string[]) => void;
  badgeBgColor?: string;
  helperText?: string;
  labelBgColor?: string;
  label?: string;
  boxWidth?: LayoutProps["width"];
  creatable?: boolean;
}

const listItemProps: CSSProperties = {
  borderRadius: "8px",
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

export const TagSelection = observer(
  forwardRef<HTMLInputElement, TagSelectionProps>(
    (
      {
        result,
        setResult,
        placeholder,
        badgeBgColor = "honeydew.darker",
        helperText,
        labelBgColor = "background.main",
        label = "Tags",
        boxWidth = "full",
        creatable = true,
        ...rest
      }: TagSelectionProps,
      ref
      // TODO: refactor to reduce complexity
      // eslint-disable-next-line sonarjs/cognitive-complexity
    ) => {
      const userKey = useUserKey();
      const { getAllTags } = useContractStore();
      const options = getAllTags(userKey);

      const [optionsCopy, setOptionsCopy] = useState<string[]>(options);
      const [partialResult, setPartialResult] = useState<string[]>([]);
      const [displayOptions, setDisplayOptions] = useState(false);
      const [inputValue, setInputValue] = useState<string>("");
      const inputRef = useRef<HTMLInputElement>(null);
      const boxRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
        if (!creatable) setOptionsCopy(options);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [creatable, JSON.stringify(options)]);

      const filterOptions = (value: string) => {
        setDisplayOptions(true);
        setPartialResult(value ? matchSorter(optionsCopy, value) : optionsCopy);
        setInputValue(value);
      };

      const isOptionSelected = (option: string) =>
        result.some((selectedOption) => selectedOption === option);

      const selectOption = (option: string) => {
        if (isOptionSelected(option)) {
          setResult(
            result.filter((existingOption) => existingOption !== option)
          );
        } else {
          setResult([...result, option]);
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

      const canCreateOption =
        !optionsCopy.find((each) => each === inputValue?.toLowerCase()) &&
        creatable;

      const noResultAndUncreatable = !partialResult.length && !creatable;

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
        <Box ref={boxRef} w={boxWidth}>
          <FormControl w={boxWidth}>
            <Flex
              alignItems="center"
              color="text.main"
              background="none"
              borderRadius="8px"
              maxW="100%"
              border="1px solid"
              borderColor="pebble.700"
              overflowX="scroll"
            >
              {result.length > 0 && (
                <Flex alignItems="center" pl="2">
                  {result.map((option) => (
                    <Flex
                      display="inline-block"
                      onClick={() => selectOption(option)}
                      key={option}
                    >
                      <Tag
                        style={tagItemProps}
                        size="md"
                        bgColor={badgeBgColor}
                      >
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
                maxLength={15}
                autoComplete="off"
                {...rest}
                style={{ border: 0, maxHeight: "54px" }}
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
                transform="scale(0.75) translateY(-24px) translateX(0px)"
              >
                {label}
              </FormLabel>
            </Flex>
            <FormHelperText ml={3} mt={1} fontSize="12px" color="text.dark">
              {helperText}
            </FormHelperText>

            {displayOptions && (
              <List
                borderRadius="8px"
                bg="pebble.800"
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
                <ListItem
                  p={2}
                  borderBottomColor="pebble.700"
                  borderBottomWidth={noResultAndUncreatable ? "0" : "1px"}
                >
                  {noResultAndUncreatable ? (
                    <Text variant="body3" color="text.dark">
                      No tags found
                    </Text>
                  ) : (
                    <Text variant="body3">
                      Select tag {creatable && "or create a new one"}
                    </Text>
                  )}
                </ListItem>
                {/* option selection section */}
                {partialResult.map((option) => (
                  <ListItem
                    key={option}
                    style={listItemProps}
                    _hover={{ bg: "pebble.700" }}
                    transition="all .25s ease-in-out"
                    onClick={() => selectOptionFromList(option)}
                  >
                    <Flex alignItems="center" justifyContent="space-between">
                      <Tag
                        style={tagItemProps}
                        size="sm"
                        bgColor={badgeBgColor}
                      >
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
                    _hover={{ bg: "pebble.700" }}
                    transition="all .25s ease-in-out"
                    data-testid="create-option"
                    onClick={() => createOption()}
                  >
                    <Flex alignItems="center" gap={2}>
                      <Text variant="body2">Create </Text>
                      <Tag
                        style={tagItemProps}
                        size="sm"
                        bgColor={badgeBgColor}
                      >
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
  )
);
