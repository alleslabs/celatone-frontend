import type { InputProps } from "@chakra-ui/react";
import { Flex, FormControl, useOutsideClick } from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import { forwardRef, useMemo, useRef, useState } from "react";

import {
  DropdownContainer,
  FilterChip,
  FilterDropdownItem,
  FilterInput,
} from "lib/components/filter";
import { MyModuleVerificationDetailsStatusBadge } from "lib/pages/my-module-verification-details/components";
import { MoveVerifyTaskStatus } from "lib/services/types";
import { toggleItem } from "lib/utils";

export interface MoveVerifyTaskStatusFilterProps extends InputProps {
  result: MoveVerifyTaskStatus[];
  minW?: string;
  label?: string;
  placeholder?: string;
  setResult: (option: MoveVerifyTaskStatus[]) => void;
  isMulti: boolean;
}

const OPTIONS = [
  { label: "completed", value: MoveVerifyTaskStatus.Finished },
  { label: "failed", value: MoveVerifyTaskStatus.NotFound },
  { label: "pending", value: MoveVerifyTaskStatus.Pending },
  { label: "verifying", value: MoveVerifyTaskStatus.Running },
];

export const MoveVerifyTaskStatusFilter = forwardRef<
  HTMLInputElement,
  MoveVerifyTaskStatusFilterProps
>(
  (
    {
      result,
      minW = "50%",
      setResult,
      placeholder,
      label,
      isMulti,
    }: MoveVerifyTaskStatusFilterProps,
    ref
  ) => {
    const [keyword, setKeyword] = useState("");
    const [isDropdown, setIsDropdown] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);

    const dropdownValue = useMemo(
      () =>
        keyword
          ? matchSorter(OPTIONS, keyword, {
              keys: ["label"],
              threshold: matchSorter.rankings.CONTAINS,
            })
          : OPTIONS,
      [keyword]
    );

    const isOptionSelected = (option: MoveVerifyTaskStatus) =>
      result.some((selectedOption) => selectedOption === option);

    const selectOption = (option: MoveVerifyTaskStatus) => {
      setKeyword("");

      if (!isMulti) {
        setIsDropdown(false);

        if (result[0] === option) setResult([]);
        else setResult([option]);
      } else {
        setResult(toggleItem(result, option));
      }
    };

    useOutsideClick({
      ref: boxRef,
      handler: () => setIsDropdown(false),
    });

    return (
      <FormControl ref={boxRef} minW={minW} maxW="full" h={8}>
        <FilterInput
          keyword={keyword}
          placeholder={placeholder}
          result={result}
          label={label}
          inputRef={inputRef}
          ref={ref}
          isDropdown={isDropdown}
          setKeyword={setKeyword}
          setIsDropdown={setIsDropdown}
          chipContainerComponent={
            <Flex alignItems="center" pl={2} gap={2}>
              {result.map((option) => (
                <FilterChip
                  key={option}
                  chipComponent={
                    <MyModuleVerificationDetailsStatusBadge
                      status={option}
                      hasCloseBtn
                      isActiveOnVerifying={false}
                    />
                  }
                  onSelect={() => setResult(toggleItem(result, option))}
                />
              ))}
            </Flex>
          }
        />

        {isDropdown && (
          <DropdownContainer>
            {!dropdownValue.length && <Flex p={2}>No filter matched</Flex>}

            {/* option selection section */}
            {dropdownValue.map((option) => (
              <FilterDropdownItem
                key={option.label}
                filterDropdownComponent={
                  <MyModuleVerificationDetailsStatusBadge
                    status={option.value}
                    isActiveOnVerifying={false}
                  />
                }
                isOptionSelected={isOptionSelected(option.value)}
                onSelect={() => selectOption(option.value)}
              />
            ))}
          </DropdownContainer>
        )}
      </FormControl>
    );
  }
);
