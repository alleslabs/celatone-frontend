import { Flex, FormLabel, Input } from "@chakra-ui/react";
import { useEffect } from "react";
import type { Dispatch, ForwardedRef, RefObject, SetStateAction } from "react";

import { DropdownChevron } from "../DropdownChevron";
import { mergeRefs } from "lib/utils";

interface FilterInputProps {
  keyword: string;
  result: string | string[] | undefined;
  isDropdown: boolean;
  chipContainerComponent: JSX.Element;
  inputRef: RefObject<HTMLInputElement>;
  ref: ForwardedRef<HTMLInputElement>;
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
  ref,
  setIsDropdown,
  setKeyword,
  chipContainerComponent,
}: FilterInputProps) => {
  useEffect(() => {
    if (typeof result !== "string") return;

    setIsDropdown(false);
  }, [result, setIsDropdown]);

  const multiSelectPlaceholder = result && result.length > 0 ? "" : placeholder;
  const singleSelectPlaceholder = result ? "" : placeholder;
  const inputPlaceholder =
    typeof result === "string"
      ? singleSelectPlaceholder
      : multiSelectPlaceholder;

  return (
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
          placeholder={inputPlaceholder}
          ref={mergeRefs([inputRef, ref])}
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
};
