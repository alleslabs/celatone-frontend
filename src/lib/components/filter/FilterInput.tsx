import type { Nullable } from "lib/types";
import type { Dispatch, ForwardedRef, RefObject, SetStateAction } from "react";

import { Flex, FormLabel, Input } from "@chakra-ui/react";
import { mergeRefs } from "lib/utils";

import { DropdownChevron } from "../DropdownChevron";

interface FilterInputProps {
  chipContainerComponent: JSX.Element;
  inputRef: RefObject<Nullable<HTMLInputElement>>;
  isDropdown: boolean;
  keyword: string;
  label?: string;
  mainRef: ForwardedRef<HTMLInputElement>;
  placeholder?: string;
  result: string[];
  setIsDropdown: Dispatch<SetStateAction<boolean>>;
  setKeyword: Dispatch<SetStateAction<string>>;
}
export const FilterInput = ({
  chipContainerComponent,
  inputRef,
  isDropdown,
  keyword,
  label,
  mainRef,
  placeholder,
  result,
  setIsDropdown,
  setKeyword,
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
