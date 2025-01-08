import type { InputProps, LayoutProps } from "@chakra-ui/react";
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
import { forwardRef, useMemo, useRef, useState } from "react";

import { useInitia, useMoveConfig, useWasmConfig } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import {
  DEFAULT_BASE_TX_FILTERS,
  DEFAULT_INITIA_TX_FILTERS,
  DEFAULT_MOVE_TX_FILTERS,
  DEFAULT_WASM_TX_FILTERS,
} from "lib/data";
import { displayActionValue, mergeRefs } from "lib/utils";

import { DropdownChevron } from "./DropdownChevron";

export interface TxFilterSelectionProps extends InputProps {
  boxHeight?: LayoutProps["height"];
  boxWidth?: LayoutProps["width"];
  helperText?: string;
  label?: string;
  labelBgColor?: string;
  placeholder?: string;
  result: string[];
  setResult: (option: string, bool: boolean) => void;
  size?: object | string;
  tagSize?: object | string;
}

const listItemProps: CSSProperties = {
  borderRadius: "8px",
  cursor: "pointer",
  margin: "4px 0px",
  padding: "8px",
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
      boxHeight = "56px",
      boxWidth = "full",
      helperText,
      label = "Filter by Action",
      labelBgColor = "background.main",
      placeholder,
      result,
      setResult,
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
      handler: () => setDisplayOptions(false),
      ref: boxRef,
    });

    return (
      <Box h={boxHeight} w={boxWidth} ref={boxRef}>
        <FormControl h={boxHeight} w={boxWidth}>
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
                {[...result].reverse().map((option) => (
                  <Flex
                    key={option}
                    display="inline-block"
                    onClick={() => selectOption(option)}
                  >
                    <Tag
                      mr={1}
                      size={tagSize}
                      variant="primary-light"
                      whiteSpace="nowrap"
                      cursor="pointer"
                    >
                      {displayActionValue(option)}
                      <CustomIcon mr={2} name="close" boxSize={2} />
                    </Tag>
                  </Flex>
                ))}
              </Flex>
            )}

            <Input
              style={{ border: 0, maxHeight: "54px" }}
              maxLength={36}
              minW="200px"
              size={size}
              w="100%"
              autoComplete="off"
              onChange={(e) => setKeyword(e.currentTarget.value)}
              onClick={() => setDisplayOptions(true)}
              onFocus={() => {
                setDisplayOptions(true);
              }}
              placeholder={result.length ? "" : placeholder}
              ref={mergeRefs([inputRef, ref])}
              {...rest}
            />
            <DropdownChevron
              isOpen={displayOptions}
              onClick={() => setDisplayOptions((prev) => !prev)}
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
              transform="scale(0.75) translateY(-24px) translateX(0px)"
            >
              {label}
            </FormLabel>
          </Flex>
          <FormHelperText ml={3} mt={1} color="text.dark" fontSize="12px">
            {helperText}
          </FormHelperText>

          {displayOptions && (
            <List
              bg="gray.900"
              mt={0}
              px={2}
              py={1}
              w="full"
              zIndex="2"
              borderRadius="8px"
              position="absolute"
              top="60px"
            >
              {/* option selection section */}
              {partialResults.map((option) => (
                <ListItem
                  key={option}
                  style={listItemProps}
                  _hover={{ bg: "gray.800" }}
                  onClick={() => selectOption(option)}
                  transition="all 0.25s ease-in-out"
                >
                  <Flex alignItems="center" justifyContent="space-between">
                    <Text>{displayActionValue(option)}</Text>
                    {isOptionSelected(option) && (
                      <CustomIcon
                        data-label={option}
                        name="check"
                        color="gray.600"
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
