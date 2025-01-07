import type { InputProps } from "@chakra-ui/react";
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
import { matchSorter } from "match-sorter";
import type { CSSProperties } from "react";
import { forwardRef, useRef, useState } from "react";

import { useContractStore } from "lib/providers/store";
import type { LVPair } from "lib/types";
import { formatSlugName, mergeRefs } from "lib/utils";

import { CustomIcon } from "./icon";
import { CreateNewListModal } from "./modal/list";

export interface ListSelectionProps extends InputProps {
  helperText?: string;
  labelBgColor?: string;
  placeholder?: string;
  result: LVPair[];
  setResult: (options: LVPair[]) => void;
}

const listItemProps: CSSProperties = {
  borderRadius: "8px",
  cursor: "pointer",
  margin: "4px 0px",
  padding: "8px",
};

export const ListSelection = forwardRef<HTMLInputElement, ListSelectionProps>(
  (
    {
      helperText,
      labelBgColor = "gray.900",
      placeholder,
      result,
      setResult,
      ...rest
    }: ListSelectionProps,
    ref
    // eslint-disable-next-line sonarjs/cognitive-complexity
  ) => {
    const { getContractLists, isContractListExist } = useContractStore();
    const options = getContractLists().map((item) => ({
      label: item.name,
      value: item.slug,
    }));

    const [partialResult, setPartialResult] = useState<LVPair[]>([]);
    const [displayOptions, setDisplayOptions] = useState(false);
    const [inputValue, setInputValue] = useState<string>("");
    const [enableOutside, setEnableOutside] = useState(true);
    const inputRef = useRef<HTMLInputElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);

    const filterOptions = (value: string) => {
      setDisplayOptions(true);
      setPartialResult(
        value
          ? matchSorter(options, value, { keys: ["label", "value"] })
          : options
      );
      setInputValue(value);
    };

    const isOptionSelected = (option: LVPair) =>
      result.some((selectedOption) => selectedOption.value === option.value);

    const selectOption = (option: LVPair) => {
      if (isOptionSelected(option)) {
        setResult(
          result.filter(
            (existingOption) => existingOption.value !== option.value
          )
        );
      } else {
        setResult([...result, option]);
      }
    };

    const createOption = (listName: string) => {
      // TODO: Way better solution
      selectOption({
        label: listName.trim(),
        value: formatSlugName(listName),
      });
      setDisplayOptions(false);
      setInputValue("");
      if (inputRef && inputRef.current !== null) {
        inputRef.current.value = "";
      }
    };

    const selectOptionFromList = (option: LVPair) => {
      selectOption(option);
      setDisplayOptions(false);
      setInputValue("");
      if (inputRef && inputRef.current !== null) {
        inputRef.current.value = "";
      }
    };

    const canCreateOption = !isContractListExist(inputValue);

    useOutsideClick({
      enabled: enableOutside,
      handler: () => setDisplayOptions(false),
      ref: boxRef,
    });
    return (
      <Box w="full" ref={boxRef}>
        <FormControl>
          <Flex
            alignItems="center"
            maxW="100%"
            background="none"
            border="1px solid"
            borderColor="gray.700"
            borderRadius="8px"
            color="text.main"
            overflowX="scroll"
          >
            {result.length > 0 && (
              <Flex alignItems="center" pl={2}>
                {[...result].map((option) => (
                  <Flex
                    key={option.value}
                    display="inline-block"
                    onClick={() => selectOption(option)}
                  >
                    <Tag
                      gap={1}
                      mr={1}
                      variant="primary-light"
                      whiteSpace="nowrap"
                      cursor="pointer"
                    >
                      {option.label}
                      <CustomIcon name="close" boxSize={3} />
                    </Tag>
                  </Flex>
                ))}
              </Flex>
            )}
            <Input
              style={{ border: "0" }}
              minW="200px"
              size="lg"
              w="100%"
              onChange={(e) => filterOptions(e.currentTarget.value)}
              onFocus={() => {
                if (!inputValue) {
                  setPartialResult(options);
                }
                setDisplayOptions(true);
              }}
              placeholder={result.length ? undefined : placeholder}
              ref={mergeRefs([inputRef, ref])}
              {...rest}
            />
            <FormLabel
              left={0}
              lineHeight="1.2"
              my={2}
              px={1}
              bgColor={labelBgColor}
              color="text.dark"
              fontWeight={400}
              pointerEvents="none"
              position="absolute"
              top={0}
              transform="scale(0.75) translateY(-24px)"
            >
              Listed on
            </FormLabel>
          </Flex>
          <FormHelperText ml={3} mt={1} color="text.dark" fontSize="12px">
            {helperText}
          </FormHelperText>

          {displayOptions && (
            <List
              bg="gray.800"
              maxH="195px"
              mt={0}
              px={2}
              py={1}
              w="full"
              zIndex="2"
              borderRadius="8px"
              overflow="scroll"
              position="absolute"
              top="60px"
            >
              {/* option selection section */}
              {partialResult.map((option) => (
                <ListItem
                  key={option.value}
                  style={listItemProps}
                  _hover={{ bg: "gray.700" }}
                  onClick={() => selectOptionFromList(option)}
                  transition="all 0.25s ease-in-out"
                >
                  <Flex alignItems="center" justifyContent="space-between">
                    <Text variant="body2">{option.label}</Text>
                    {isOptionSelected(option) && (
                      <CustomIcon
                        data-label={option.label}
                        mr={2}
                        name="check"
                        boxSize={3}
                        color="gray.600"
                      />
                    )}
                  </Flex>
                </ListItem>
              ))}
              {/* creation section */}
              {canCreateOption && (
                <CreateNewListModal
                  inputValue={inputValue}
                  trigger={
                    <ListItem
                      data-testid="create-option"
                      style={listItemProps}
                      w="full"
                      _hover={{ bg: "gray.700" }}
                      onClick={() => setEnableOutside(false)}
                      transition="all 0.25s ease-in-out"
                    >
                      <Flex alignItems="center" gap={2}>
                        <CustomIcon name="plus" boxSize={3} color="text.dark" />
                        <Text variant="body2">Create New List </Text>
                      </Flex>
                    </ListItem>
                  }
                  onClose={() => setEnableOutside(true)}
                  onCreate={createOption}
                />
              )}
            </List>
          )}
        </FormControl>
      </Box>
    );
  }
);
