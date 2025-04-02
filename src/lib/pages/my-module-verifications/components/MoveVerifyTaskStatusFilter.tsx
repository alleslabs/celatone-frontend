import type { InputProps } from "@chakra-ui/react";
import type { RefObject } from "react";

import { Flex, FormControl, useOutsideClick } from "@chakra-ui/react";
import {
  DropdownContainer,
  FilterChip,
  FilterDropdownItem,
  FilterInput,
} from "lib/components/filter";
import { MyModuleVerificationDetailsStatusBadge } from "lib/pages/my-module-verification-details/components";
import { MoveVerifyTaskStatus } from "lib/services/types";
import { toggleItem } from "lib/utils";
import { matchSorter } from "match-sorter";
import { forwardRef, useMemo, useRef, useState } from "react";

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
      ref: boxRef as RefObject<HTMLDivElement>,
      handler: () => setIsDropdown(false),
    });

    return (
      <FormControl h={8} maxW="full" minW={minW} ref={boxRef}>
        <FilterInput
          chipContainerComponent={
            <Flex alignItems="center" gap={2} pl={2}>
              {result.map((option) => (
                <FilterChip
                  key={option}
                  chipComponent={
                    <MyModuleVerificationDetailsStatusBadge
                      hasCloseBtn
                      isActiveOnVerifying={false}
                      status={option}
                    />
                  }
                  onSelect={() => setResult(toggleItem(result, option))}
                />
              ))}
            </Flex>
          }
          inputRef={inputRef}
          isDropdown={isDropdown}
          keyword={keyword}
          label={label}
          mainRef={ref}
          placeholder={placeholder}
          result={result}
          setIsDropdown={setIsDropdown}
          setKeyword={setKeyword}
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
