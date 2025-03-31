import { Flex, FormLabel, Input } from "@chakra-ui/react";
import type { Dispatch, ForwardedRef, RefObject, SetStateAction } from "react";

import type { Nullable } from "lib/types";
import { mergeRefs } from "lib/utils";
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
      w="full"
      color="text.main"
      background="none"
      borderRadius="8px"
      border="1px solid"
      borderColor="gray.700"
      overflowX="scroll"
      alignItems="center"
    >
      {chipContainerComponent}
      <Input
        value={keyword}
        w="full"
        autoComplete="off"
        size="lg"
        minW="150px"
        placeholder={result.length > 0 ? "" : placeholder}
        ref={mergeRefs([inputRef, mainRef])}
        maxLength={36}
        style={{ border: 0, maxHeight: "54px" }}
        onFocus={() => setIsDropdown(true)}
        onChange={(e) => setKeyword(e.currentTarget.value)}
        onClick={() => setIsDropdown(true)}
      />
      <DropdownChevron
        isOpen={isDropdown}
        // input max height 54px + border top and bottom 2px
        height="56px"
        onClick={() => setIsDropdown((prev) => !prev)}
      />
    </Flex>

    <FormLabel
      position="absolute"
      top={0}
      left={0}
      fontWeight={400}
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
