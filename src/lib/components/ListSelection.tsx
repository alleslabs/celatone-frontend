import type { InputProps } from "@chakra-ui/react";
import type { LVPair } from "lib/types";
import type { CSSProperties, RefObject } from "react";

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
import { formatSlugName, mergeRefs } from "lib/utils";
import { matchSorter } from "match-sorter";
import { forwardRef, useRef, useState } from "react";

import { CustomIcon } from "./icon";
import { CreateNewListModal } from "./modal/list";

export interface ListSelectionProps extends InputProps {
  placeholder?: string;
  result: LVPair[];
  setResult: (options: LVPair[]) => void;
  helperText?: string;
  labelBgColor?: string;
}

const listItemProps: CSSProperties = {
  borderRadius: "8px",
  margin: "4px 0px",
  padding: "8px",
  cursor: "pointer",
};

export const ListSelection = forwardRef<HTMLInputElement, ListSelectionProps>(
  (
    {
      result,
      setResult,
      placeholder,
      helperText,
      labelBgColor = "gray.900",
      ...rest
    }: ListSelectionProps,
    ref
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
      ref: boxRef as RefObject<HTMLDivElement>,
      handler: () => setDisplayOptions(false),
    });

    return (
      <Box w="full" ref={boxRef}>
        <FormControl>
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
                {[...result].map((option) => (
                  <Flex
                    key={option.value}
                    display="inline-block"
                    onClick={() => selectOption(option)}
                  >
                    <Tag
                      cursor="pointer"
                      gap={1}
                      mr={1}
                      variant="primary-light"
                      whiteSpace="nowrap"
                    >
                      {option.label}
                      <CustomIcon boxSize={3} name="close" />
                    </Tag>
                  </Flex>
                ))}
              </Flex>
            )}
            <Input
              style={{ border: "0" }}
              minW="200px"
              placeholder={result.length ? undefined : placeholder}
              size="lg"
              w="100%"
              onChange={(e) => filterOptions(e.currentTarget.value)}
              onFocus={() => {
                if (!inputValue) {
                  setPartialResult(options);
                }
                setDisplayOptions(true);
              }}
              ref={mergeRefs([inputRef, ref])}
              {...rest}
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
              transform="scale(0.75) translateY(-24px)"
            >
              Listed on
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
              {/* option selection section */}
              {partialResult.map((option) => (
                <ListItem
                  key={option.value}
                  style={listItemProps}
                  _hover={{ bg: "gray.700" }}
                  transition="all 0.25s ease-in-out"
                  onClick={() => selectOptionFromList(option)}
                >
                  <Flex alignItems="center" justifyContent="space-between">
                    <Text variant="body2">{option.label}</Text>
                    {isOptionSelected(option) && (
                      <CustomIcon
                        boxSize={3}
                        color="gray.600"
                        data-label={option.label}
                        mr={2}
                        name="check"
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
                      style={listItemProps}
                      _hover={{ bg: "gray.700" }}
                      data-testid="create-option"
                      transition="all 0.25s ease-in-out"
                      w="full"
                      onClick={() => setEnableOutside(false)}
                    >
                      <Flex alignItems="center" gap={2}>
                        <CustomIcon name="plus" color="text.dark" boxSize={3} />
                        <Text variant="body2">Create new list </Text>
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
