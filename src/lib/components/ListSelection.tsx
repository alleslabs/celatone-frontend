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
            borderColor="gray.700"
            background="none"
            borderRadius="8px"
            maxW="100%"
            overflowX="scroll"
          >
            {result.length > 0 && (
              <Flex alignItems="center" pl={2}>
                {[...result].map((option) => (
                  <Flex
                    display="inline-block"
                    onClick={() => selectOption(option)}
                    key={option.value}
                  >
                    <Tag
                      cursor="pointer"
                      whiteSpace="nowrap"
                      variant="primary-light"
                      gap={1}
                      mr={1}
                    >
                      {option.label}
                      <CustomIcon name="close" boxSize={3} />
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
              fontWeight={400}
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
              bg="gray.800"
              px={2}
              py={1}
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
                  _hover={{ bg: "gray.700" }}
                  transition="all 0.25s ease-in-out"
                  onClick={() => selectOptionFromList(option)}
                >
                  <Flex alignItems="center" justifyContent="space-between">
                    <Text variant="body2">{option.label}</Text>
                    {isOptionSelected(option) && (
                      <CustomIcon
                        data-label={option.label}
                        mr={2}
                        name="check"
                        color="gray.600"
                        boxSize={3}
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
                      _hover={{ bg: "gray.700" }}
                      transition="all 0.25s ease-in-out"
                      data-testid="create-option"
                      onClick={() => setEnableOutside(false)}
                    >
                      <Flex alignItems="center" gap={2}>
                        <CustomIcon name="plus" color="text.dark" boxSize={3} />
                        <Text variant="body2">Create new list </Text>
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
