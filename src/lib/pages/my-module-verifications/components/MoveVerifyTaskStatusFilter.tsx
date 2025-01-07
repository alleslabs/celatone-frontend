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
  isMulti: boolean;
  label?: string;
  minW?: string;
  placeholder?: string;
  result: MoveVerifyTaskStatus[];
  setResult: (option: MoveVerifyTaskStatus[]) => void;
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
      isMulti,
      label,
      minW = "50%",
      placeholder,
      result,
      setResult,
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
      handler: () => setIsDropdown(false),
      ref: boxRef,
    });

    return (
      <FormControl h={8} maxW="full" minW={minW} ref={boxRef}>
        <FilterInput
          keyword={keyword}
          inputRef={inputRef}
          label={label}
          result={result}
          chipContainerComponent={
            <Flex alignItems="center" gap={2} pl={2}>
              {result.map((option) => (
                <FilterChip
                  key={option}
                  chipComponent={
                    <MyModuleVerificationDetailsStatusBadge
                      isActiveOnVerifying={false}
                      status={option}
                      hasCloseBtn
                    />
                  }
                  onSelect={() => setResult(toggleItem(result, option))}
                />
              ))}
            </Flex>
          }
          isDropdown={isDropdown}
          placeholder={placeholder}
          setIsDropdown={setIsDropdown}
          setKeyword={setKeyword}
          ref={ref}
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
                    isActiveOnVerifying={false}
                    status={option.value}
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
