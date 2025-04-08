import type { Nullable } from "lib/types";
import type { Dispatch, ForwardedRef, RefObject, SetStateAction } from "react";

import { Flex, FormLabel, Input } from "@chakra-ui/react";
import { mergeRefs } from "lib/utils";
import { JSX } from "react";

import { DropdownChevron } from "../DropdownChevron";

interface FilterInputProps {
  keyword: string;
  result: string[];
  isDropdown: boolean;
  chipContainerComponent: JSX.Element;
  inputRef: RefObject<Nullable<HTMLInputElement>>;
  mainRef: ForwardedRef<HTMLInputElement>;
  placeholder?: string;
  label?: string;
  setIsDropdown: Dispatch<SetStateAction<boolean>>;
  setKeyword: Dispatch<SetStateAction<string>>;
}
export const FilterInput = ({
  keyword,
  placeholder,
  result,
  isDropdown,
  label,
  inputRef,
  mainRef,
  setIsDropdown,
  setKeyword,
  chipContainerComponent,
}: FilterInputProps) => (
  <>
    <Flex
      alignItems="center"
      background="none"
      border="1px solid"
      borderColor="gray.700"
      borderRadius="8px"
      color="text.main"
      overflowX="scroll"
      w="full"
    >
      {chipContainerComponent}
      <Input
        style={{ border: 0, maxHeight: "54px" }}
        autoComplete="off"
        maxLength={36}
        minW="150px"
        placeholder={result.length > 0 ? "" : placeholder}
        size="lg"
        value={keyword}
        w="full"
        onChange={(e) => setKeyword(e.currentTarget.value)}
        onClick={() => setIsDropdown(true)}
        onFocus={() => setIsDropdown(true)}
        ref={mergeRefs([inputRef, mainRef])}
      />
      <DropdownChevron
        // input max height 54px + border top and bottom 2px
        height="56px"
        isOpen={isDropdown}
        onClick={() => setIsDropdown((prev) => !prev)}
      />
    </Flex>

    <FormLabel
      bgColor="background.main"
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
  </>
);
