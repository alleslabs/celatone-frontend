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
  Text,
  useOutsideClick,
} from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import { observer } from "mobx-react-lite";
import type { CSSProperties } from "react";
import { useState, useRef, forwardRef } from "react";

import { CustomIcon } from "lib/components/icon";
import { displayActionValue, mergeRefs } from "lib/utils";

export interface TxFilterSelectionProps extends InputProps {
  placeholder?: string;
  result: string[];
  setResult: (option: string, bool: boolean) => void;
  helperText?: string;
  labelBgColor?: string;
  label?: string;
  boxWidth?: LayoutProps["width"];
  boxHeight?: LayoutProps["height"];
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

// TODO - Refactor this along with TagSelection
export const TxFilterSelection = observer(
  forwardRef<HTMLInputElement, TxFilterSelectionProps>(
    (
      {
        result,
        setResult,
        placeholder,
        helperText,
        labelBgColor = "background.main",
        label = "Filter by Actions",
        boxWidth = "full",
        boxHeight = "56px",
        ...rest
      }: TxFilterSelectionProps,
      ref
    ) => {
      const options = [
        "isUpload",
        "isInstantiate",
        "isExecute",
        "isSend",
        "isIbc",
        "isMigrate",
        "isClearAdmin",
        "isUpdateAdmin",
      ];

      const [partialResult, setPartialResult] = useState<string[]>([]);
      const [displayOptions, setDisplayOptions] = useState(false);
      const inputRef = useRef<HTMLInputElement>(null);
      const boxRef = useRef<HTMLDivElement>(null);

      const filterOptions = (value: string) => {
        setDisplayOptions(true);
        setPartialResult(value ? matchSorter(options, value) : options);
      };

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
        ref: boxRef,
        handler: () => setDisplayOptions(false),
      });

      return (
        <Box ref={boxRef} w={boxWidth} h={boxHeight}>
          <FormControl w={boxWidth} h={boxHeight}>
            <Flex
              alignItems="center"
              color="text.main"
              background="none"
              borderRadius="8px"
              border="1px solid"
              borderColor="pebble.700"
              maxW="100%"
              overflowX="scroll"
            >
              {result.length > 0 && (
                <Flex alignItems="center" pl="2">
                  {[...result].reverse().map((option) => (
                    <Flex
                      display="inline-block"
                      onClick={() => selectOption(option)}
                      key={option}
                    >
                      <Tag
                        style={tagItemProps}
                        size="md"
                        bgColor="violet.light"
                        color="pebble.900"
                      >
                        {displayActionValue(option)}
                        <CustomIcon
                          name="close"
                          boxSize="3"
                          color="pebble.900"
                        />
                      </Tag>
                    </Flex>
                  ))}
                </Flex>
              )}

              <Input
                autoComplete="off"
                w="100%"
                minW="200px"
                size="lg"
                placeholder={result.length ? "" : placeholder}
                onChange={(e) => filterOptions(e.currentTarget.value)}
                onFocus={() => {
                  setPartialResult(options);
                  setDisplayOptions(true);
                }}
                ref={mergeRefs([inputRef, ref])}
                maxLength={36}
                style={{ border: 0, maxHeight: "54px" }}
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
                bg="pebble.900"
                px="2"
                py="1"
                mt={0}
                position="absolute"
                zIndex="2"
                w="full"
                top="60px"
              >
                {/* option selection section */}
                {partialResult.map((option) => (
                  <ListItem
                    key={option}
                    style={listItemProps}
                    _hover={{ bg: "pebble.800" }}
                    transition="all .25s ease-in-out"
                    onClick={() => selectOption(option)}
                  >
                    <Flex alignItems="center" justifyContent="space-between">
                      <Text>{displayActionValue(option)}</Text>

                      {isOptionSelected(option) && (
                        <CustomIcon name="check" data-label={option} />
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
  )
);
