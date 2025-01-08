import { Flex, FormLabel, Input } from "@chakra-ui/react";
import type { Dispatch, ForwardedRef, RefObject, SetStateAction } from "react";

import { DropdownChevron } from "../DropdownChevron";
import { mergeRefs } from "lib/utils";

interface FilterInputProps {
  chipContainerComponent: JSX.Element;
  inputRef: RefObject<HTMLInputElement>;
  isDropdown: boolean;
  keyword: string;
  label?: string;
  placeholder?: string;
  ref: ForwardedRef<HTMLInputElement>;
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
  placeholder,
  ref,
  result,
  setIsDropdown,
  setKeyword,
}: FilterInputProps) => (
  <>
    <Flex
      alignItems="center"
      w="full"
      background="none"
      border="1px solid"
      borderColor="gray.700"
      borderRadius="8px"
      color="text.main"
      overflowX="scroll"
    >
      {chipContainerComponent}
      <Input
        style={{ border: 0, maxHeight: "54px" }}
        maxLength={36}
        minW="150px"
        size="lg"
        value={keyword}
        w="full"
        autoComplete="off"
        onChange={(e) => setKeyword(e.currentTarget.value)}
        onClick={() => setIsDropdown(true)}
        onFocus={() => setIsDropdown(true)}
        placeholder={result.length > 0 ? "" : placeholder}
        ref={mergeRefs([inputRef, ref])}
      />
      <DropdownChevron
        // input max height 54px + border top and bottom 2px
        height="56px"
        isOpen={isDropdown}
        onClick={() => setIsDropdown((prev) => !prev)}
      />
    </Flex>

    <FormLabel
      left={0}
      lineHeight="1.2"
      my={2}
      px={1}
      bgColor="background.main"
      color="text.dark"
      fontWeight={400}
      pointerEvents="none"
      position="absolute"
      top={0}
      transform="scale(0.75) translateY(-24px) translateX(0px)"
    >
      {label}
    </FormLabel>
  </>
);
