import { Flex, FormLabel, Input } from "@chakra-ui/react";
import type { Dispatch, ForwardedRef, RefObject, SetStateAction } from "react";

import { CustomIcon } from "lib/components/icon";
import type { ProposalStatus, ProposalType } from "lib/types";
import { mergeRefs } from "lib/utils";

type Result = ProposalType | ProposalStatus;

interface FilterInputProps {
  result: Result[];
  isDropdown: boolean;
  chipContainerComponent: JSX.Element;
  inputRef: RefObject<HTMLInputElement>;
  ref: ForwardedRef<HTMLInputElement>;
  setIsDropdown: Dispatch<SetStateAction<boolean>>;
  placeholder?: string;
  label?: string;
  filterDropdown: (value: string) => void;
}
export const FilterInput = ({
  placeholder,
  result,
  isDropdown,
  label,
  inputRef,
  ref,
  filterDropdown,
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
    >
      {chipContainerComponent}
      <Input
        w="full"
        autoComplete="off"
        size="lg"
        minW="150px"
        placeholder={result.length ? "" : placeholder}
        ref={mergeRefs([inputRef, ref])}
        maxLength={36}
        style={{ border: 0, maxHeight: "54px" }}
        onFocus={(e) => filterDropdown(e.currentTarget.value)}
        onChange={(e) => filterDropdown(e.currentTarget.value)}
        onClick={() => setIsDropdown(true)}
      />
      <CustomIcon
        name={isDropdown ? "chevron-up" : "chevron-down"}
        position="absolute"
        mr="0.5px"
        px={3}
        boxSize="40px"
        right="0px"
        minH="full"
        color="pebble.600"
        backgroundColor="background.main"
        onClick={() => setIsDropdown(!isDropdown)}
      />
    </Flex>

    <FormLabel
      position="absolute"
      top={0}
      left={0}
      fontWeight="500"
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
