import type { InputProps } from "@chakra-ui/react";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Box,
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
import type { CSSProperties } from "react";
import { useState, useRef, forwardRef } from "react";
import { MdCheck, MdClose, MdAdd } from "react-icons/md";

import { useUserKey } from "lib/hooks";
import { useContractStore } from "lib/providers/store";
import type { LVPair } from "lib/types";
import { formatSlugName, mergeRefs } from "lib/utils";

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
      labelBgColor = "pebble.900",
      ...rest
    }: ListSelectionProps,
    ref
    // eslint-disable-next-line sonarjs/cognitive-complexity
  ) => {
    const userKey = useUserKey();
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

    const canCreateOption = !isContractListExist(userKey, inputValue);

    useOutsideClick({
      enabled: enableOutside,
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
            borderColor="pebble.700"
            background="none"
            borderRadius="8px"
            maxW="100%"
            overflowX="scroll"
          >
            {result.length > 0 && (
              <Flex alignItems="center" pl="2">
                {[...result].map((option) => (
                  <Flex
                    display="inline-block"
                    onClick={() => selectOption(option)}
                    key={option.value}
                  >
                    <Tag
                      cursor="pointer"
                      whiteSpace="nowrap"
                      size="md"
                      bgColor="violet.light"
                      color="pebble.900"
                      alignItems="center"
                      display="flex"
                      textTransform="none"
                      gap={1}
                      mr={2}
                      borderRadius="full"
                    >
                      {option.label}
                      <Icon as={MdClose} boxSize="4" color="pebble.900" />
                    </Tag>
                  </Flex>
                ))}
              </Flex>
            )}
            <Input
              w="100%"
              minW="200px"
              size="lg"
              placeholder={result.length ? undefined : placeholder}
              onChange={(e) => filterOptions(e.currentTarget.value)}
              onFocus={() => {
                if (!inputValue) {
                  setPartialResult(options);
                }
                setDisplayOptions(true);
              }}
              ref={mergeRefs([inputRef, ref])}
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
              transform="scale(0.75) translateY(-24px)"
            >
              Listed on
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
              {/* option selection section */}
              {partialResult.map((option) => (
                <ListItem
                  key={option.value}
                  style={listItemProps}
                  _hover={{ bg: "pebble.700" }}
                  transition="all .25s ease-in-out"
                  onClick={() => selectOptionFromList(option)}
                >
                  <Flex alignItems="center" justifyContent="space-between">
                    <Text variant="body2">{option.label}</Text>
                    {isOptionSelected(option) && (
                      <Icon
                        as={MdCheck}
                        color="text.dark"
                        data-label={option.label}
                        mr={2}
                      />
                    )}
                  </Flex>
                </ListItem>
              ))}
              {/* creation section */}
              {canCreateOption && (
                <CreateNewListModal
                  trigger={
                    <ListItem
                      w="full"
                      style={listItemProps}
                      _hover={{ bg: "pebble.700" }}
                      transition="all .25s ease-in-out"
                      data-testid="create-option"
                      onClick={() => setEnableOutside(false)}
                    >
                      <Flex alignItems="center" gap={2}>
                        <Icon as={MdAdd} color="text.dark" />
                        <Text variant="body2">Create New List </Text>
                      </Flex>
                    </ListItem>
                  }
                  onCreate={createOption}
                  onClose={() => setEnableOutside(true)}
                  inputValue={inputValue}
                />
              )}
            </List>
          )}
        </FormControl>
      </Box>
    );
  }
);
