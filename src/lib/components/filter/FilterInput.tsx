import { Flex, FormLabel, Input } from "@chakra-ui/react";
import type { ForwardedRef, RefObject } from "react";

import { CustomIcon } from "lib/components/icon";
import type { ProposalStatus, ProposalType } from "lib/types";
import { mergeRefs } from "lib/utils";

type Result = ProposalType | ProposalStatus;

interface FilterInputProps {
  placeholder?: string;
  label?: string;
  result: Result[];
  inputRef: RefObject<HTMLInputElement>;
  ref: ForwardedRef<HTMLInputElement>;
  filterDropdown: (value: string) => void;
  setDropdownValue: () => void;
  setIsDropdown: () => void;
  chipContainerComponent: JSX.Element;
}
export const FilterInput = ({
  placeholder,
  result,
  label,
  inputRef,
  ref,
  filterDropdown,
  setDropdownValue,
  setIsDropdown,
  chipContainerComponent,
}: FilterInputProps) => (
  <>
    <Flex
      w="full"
      color="text.main"
      background="none"
      borderRadius="8px"
      border="1px solid"
      borderColor="pebble.700"
      overflowX="scroll"
      alignItems="center"
      onClick={() => {
        setDropdownValue();
        setIsDropdown();
      }}
    >
      {chipContainerComponent}
      <Input
        w="full"
        autoComplete="off"
        size="lg"
        minW="150px"
        placeholder={result.length ? "" : placeholder}
        onChange={(e) => filterDropdown(e.currentTarget.value)}
        ref={mergeRefs([inputRef, ref])}
        maxLength={36}
        style={{ border: 0, maxHeight: "54px" }}
      />
      <CustomIcon
        name="chevron-down"
        position="absolute"
        mr="0.5px"
        px={3}
        boxSize="40px"
        right="0px"
        minH="full"
        backgroundColor="background.main"
      />
    </Flex>

    <FormLabel
      position="absolute"
      top={0}
      left={0}
      fontWeight="400"
      color="text.dark"
      bgColor="background.main"
      pointerEvents="none"
      px={1}
      my={2}
      lineHeight="1.2"
      transform="scale(0.75) translateY(-24px) translateX(0px)"
    >
      {label}
    </FormLabel>
  </>
);
