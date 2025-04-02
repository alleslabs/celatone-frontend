import type { InputProps, LayoutProps } from "@chakra-ui/react";
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
import { useInitia, useMoveConfig, useWasmConfig } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import {
  DEFAULT_BASE_TX_FILTERS,
  DEFAULT_INITIA_TX_FILTERS,
  DEFAULT_MOVE_TX_FILTERS,
  DEFAULT_WASM_TX_FILTERS,
} from "lib/data";
import { displayActionValue, mergeRefs } from "lib/utils";
import { matchSorter } from "match-sorter";
import { forwardRef, useMemo, useRef, useState } from "react";

import { DropdownChevron } from "./DropdownChevron";

export interface TxFilterSelectionProps extends InputProps {
  placeholder?: string;
  result: string[];
  setResult: (option: string, bool: boolean) => void;
  helperText?: string;
  labelBgColor?: string;
  label?: string;
  boxWidth?: LayoutProps["width"];
  boxHeight?: LayoutProps["height"];
  size?: string | object;
  tagSize?: string | object;
}

const listItemProps: CSSProperties = {
  borderRadius: "8px",
  margin: "4px 0px",
  padding: "8px",
  cursor: "pointer",
};

const BASE_OPTIONS = Object.keys(DEFAULT_BASE_TX_FILTERS);
const WASM_OPTIONS = Object.keys(DEFAULT_WASM_TX_FILTERS);
const MOVE_OPTIONS = Object.keys(DEFAULT_MOVE_TX_FILTERS);
const INITIA_OPTIONS = Object.keys(DEFAULT_INITIA_TX_FILTERS);

// TODO - Refactor this along with TagSelection
export const TxFilterSelection = forwardRef<
  HTMLInputElement,
  TxFilterSelectionProps
>(
  (
    {
      result,
      setResult,
      placeholder,
      helperText,
      labelBgColor = "background.main",
      label = "Filter by Action",
      boxWidth = "full",
      boxHeight = "56px",
      size = "lg",
      tagSize = "md",
      ...rest
    }: TxFilterSelectionProps,
    ref
  ) => {
    const [keyword, setKeyword] = useState("");
    const [displayOptions, setDisplayOptions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);

    const wasm = useWasmConfig({ shouldRedirect: false });
    const move = useMoveConfig({ shouldRedirect: false });

    const isInitia = useInitia();

    const options = useMemo(
      () => [
        ...BASE_OPTIONS,
        ...(wasm.enabled ? WASM_OPTIONS : []),
        ...(move.enabled ? MOVE_OPTIONS : []),
        ...(isInitia ? INITIA_OPTIONS : []),
      ],
      [wasm.enabled, move.enabled, isInitia]
    );

    const partialResults = useMemo(
      () =>
        keyword
          ? matchSorter(options, keyword, {
              threshold: matchSorter.rankings.CONTAINS,
            })
          : options,
      [options, keyword]
    );

    const isOptionSelected = (option: string) =>
      result.some((selectedOption) => selectedOption === option);

    const selectOption = (option: string) => {
      if (inputRef.current) {
        inputRef.current.value = "";
      }

      if (isOptionSelected(option)) {
        setResult(option, false);
      } else {
        setResult(option, true);
      }
    };

    useOutsideClick({
      ref: boxRef as RefObject<HTMLDivElement>,
      handler: () => setDisplayOptions(false),
    });

    return (
      <Box h={boxHeight} w={boxWidth} ref={boxRef}>
        <FormControl h={boxHeight} w={boxWidth}>
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
                {[...result].reverse().map((option) => (
                  <Flex
                    key={option}
                    display="inline-block"
                    onClick={() => selectOption(option)}
                  >
                    <Tag
                      cursor="pointer"
                      mr={1}
                      size={tagSize}
                      variant="primary-light"
                      whiteSpace="nowrap"
                    >
                      {displayActionValue(option)}
                      <CustomIcon boxSize={2} mr={2} name="close" />
                    </Tag>
                  </Flex>
                ))}
              </Flex>
            )}

            <Input
              style={{ border: 0, maxHeight: "54px" }}
              autoComplete="off"
              maxLength={36}
              minW="200px"
              placeholder={result.length ? "" : placeholder}
              size={size}
              w="100%"
              onChange={(e) => setKeyword(e.currentTarget.value)}
              onClick={() => setDisplayOptions(true)}
              onFocus={() => {
                setDisplayOptions(true);
              }}
              ref={mergeRefs([inputRef, ref])}
              {...rest}
            />
            <DropdownChevron
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
              bg="gray.900"
              borderRadius="8px"
              mt={0}
              position="absolute"
              px={2}
              py={1}
              top="60px"
              w="full"
              zIndex="2"
            >
              {/* option selection section */}
              {partialResults.map((option) => (
                <ListItem
                  key={option}
                  style={listItemProps}
                  _hover={{ bg: "gray.800" }}
                  transition="all 0.25s ease-in-out"
                  onClick={() => selectOption(option)}
                >
                  <Flex alignItems="center" justifyContent="space-between">
                    <Text>{displayActionValue(option)}</Text>
                    {isOptionSelected(option) && (
                      <CustomIcon
                        color="gray.600"
                        data-label={option}
                        name="check"
                      />
                    )}
                  </Flex>
                </ListItem>
              ))}
            </List>
          )}
        </FormControl>
      </Box>
    );
  }
);
