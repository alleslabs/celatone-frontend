import type { InputProps, LayoutProps } from "@chakra-ui/react";
import type { CSSProperties, KeyboardEvent, RefObject } from "react";

import {
  Box,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  List,
  ListItem,
  Tag,
  Text,
  useOutsideClick,
} from "@chakra-ui/react";
import { useContractStore } from "lib/providers/store";
import { mergeRefs } from "lib/utils";
import { matchSorter } from "match-sorter";
import { observer } from "mobx-react-lite";
import { forwardRef, useEffect, useRef, useState } from "react";

import { DropdownChevron } from "./DropdownChevron";
import { CustomIcon } from "./icon";

export interface TagSelectionProps extends InputProps {
  badgeBgColor?: string;
  boxWidth?: LayoutProps["width"];
  creatable?: boolean;
  helperText?: string;
  label?: string;
  labelBgColor?: string;
  placeholder?: string;
  result: string[];
  setResult: (options: string[]) => void;
}

const listItemProps: CSSProperties = {
  borderRadius: "8px",
  cursor: "pointer",
  margin: "4px 0px",
  padding: "8px",
};

export const TagSelection = observer(
  forwardRef<HTMLInputElement, TagSelectionProps>(
    (
      {
        boxWidth = "full",
        creatable = true,
        helperText,
        label = "Tags",
        labelBgColor = "background.main",
        placeholder,
        result,
        setResult,
        ...rest
      }: TagSelectionProps,
      ref
      // TODO: refactor to reduce complexity
    ) => {
      const { getAllTags } = useContractStore();
      const options = getAllTags();

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
        handler: () => setDisplayOptions(false),
        ref: boxRef as RefObject<HTMLDivElement>,
      });

      return (
        <Box w={boxWidth} ref={boxRef}>
          <FormControl w={boxWidth}>
            <Flex
              alignItems="center"
              background="none"
              border="1px solid"
              borderColor="gray.700"
              borderRadius="8px"
              color="text.main"
              maxW="100%"
              overflowX="scroll"
            >
              {result.length > 0 && (
                <Flex alignItems="center" pl={2}>
                  {result.map((option) => (
                    <Flex
                      key={option}
                      display="inline-block"
                      onClick={() => selectOption(option)}
                    >
                      <Tag cursor="pointer" gap={1} mr={1}>
                        {option}
                        <CustomIcon boxSize={3} name="close" />
                      </Tag>
                    </Flex>
                  ))}
                </Flex>
              )}

              <Input
                autoComplete="off"
                maxLength={15}
                minW="200px"
                placeholder={result.length ? "" : placeholder}
                size="lg"
                w="100%"
                onChange={(e) => filterOptions(e.currentTarget.value)}
                onFocus={() => {
                  setPartialResult(optionsCopy);
                  setDisplayOptions(true);
                }}
                onKeyDown={handleKeydown}
                ref={mergeRefs([inputRef, ref])}
                {...rest}
                style={{ border: 0, maxHeight: "54px" }}
              />
              <DropdownChevron
                bg={labelBgColor}
                // input max height 54px + border top and bottom 2px
                height="56px"
                isOpen={displayOptions}
                onClick={() => setDisplayOptions((prev) => !prev)}
              />
              <FormLabel
                bgColor={labelBgColor}
                color="text.dark"
                fontWeight={400}
                left={0}
                lineHeight="1.2"
                my={2}
                pointerEvents="none"
                position="absolute"
                px={1}
                top={0}
                transform="scale(0.75) translateY(-24px) translateX(0px)"
              >
                {label}
              </FormLabel>
            </Flex>
            <FormHelperText color="text.dark" fontSize="12px" ml={3} mt={1}>
              {helperText}
            </FormHelperText>

            {displayOptions && (
              <List
                bg="gray.800"
                borderRadius="8px"
                maxH="195px"
                mt={0}
                overflow="scroll"
                position="absolute"
                px={2}
                py={1}
                top="60px"
                w="full"
                zIndex="2"
              >
                {/* header */}
                <ListItem
                  borderBottomColor="gray.700"
                  borderBottomWidth={noResultAndUncreatable ? "0" : "1px"}
                  p={2}
                >
                  {noResultAndUncreatable ? (
                    <Text color="text.dark" variant="body3">
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
                    _hover={{ bg: "gray.700" }}
                    transition="all 0.25s ease-in-out"
                    onClick={() => selectOptionFromList(option)}
                  >
                    <Flex alignItems="center" justifyContent="space-between">
                      <Tag gap={1} mr={1}>
                        {option}
                      </Tag>
                      {isOptionSelected(option) && (
                        <CustomIcon
                          boxSize={3}
                          color="gray.600"
                          data-label={option}
                          mr={2}
                          name="check"
                        />
                      )}
                    </Flex>
                  </ListItem>
                ))}
                {/* creation section */}
                {canCreateOption && inputValue && (
                  <ListItem
                    style={listItemProps}
                    _hover={{ bg: "gray.700" }}
                    data-testid="create-option"
                    transition="all 0.25s ease-in-out"
                    onClick={() => createOption()}
                  >
                    <Flex alignItems="center" gap={2}>
                      <Text variant="body2">Create </Text>
                      <Tag gap={1} mr={1}>
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
