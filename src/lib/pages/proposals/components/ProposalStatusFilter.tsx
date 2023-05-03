import type { InputProps } from "@chakra-ui/react";
import { FormControl, Flex, useOutsideClick } from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import type { Dispatch, SetStateAction } from "react";
import { useState, useRef, forwardRef } from "react";

import { FilterChip } from "lib/components/filter/FilterChip";
import { DropdownContainer } from "lib/components/filter/FilterComponents";
import { FilterDropdownItem } from "lib/components/filter/FilterDropdownItem";
import { FilterInput } from "lib/components/filter/FilterInput";
import { StatusChip } from "lib/components/table/proposals/StatusChip";
import { ProposalStatus } from "lib/types";

export interface ProposalStatusFilterProps extends InputProps {
  result: ProposalStatus[];
  minW?: string;
  label?: string;
  placeholder?: string;
  setResult: Dispatch<SetStateAction<ProposalStatus[]>>;
}

const OPTIONS = Object.values(ProposalStatus);

export const ProposalStatusFilter = forwardRef<
  HTMLInputElement,
  ProposalStatusFilterProps
>(
  (
    {
      result,
      minW = "50%",
      setResult,
      placeholder,
      label,
    }: ProposalStatusFilterProps,
    ref
  ) => {
    const [dropdownValue, setDropdownValue] = useState<ProposalStatus[]>([]);
    const [isDropdown, setIsDropdown] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);

    const filterDropdown = (value: string) => {
      setIsDropdown(true);
      setDropdownValue(
        value
          ? matchSorter(OPTIONS, value, {
              threshold: matchSorter.rankings.CONTAINS,
            })
          : OPTIONS
      );
    };

    const isOptionSelected = (option: ProposalStatus) =>
      result.some((selectedOption) => selectedOption === option);

    const selectOption = (option: ProposalStatus) => {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      if (result.includes(option)) {
        setResult((prevState) => prevState.filter((value) => value !== option));
      } else {
        setResult((prevState) => [...prevState, option]);
      }
    };

    useOutsideClick({
      ref: boxRef,
      handler: () => setIsDropdown(false),
    });

    return (
      <FormControl ref={boxRef} minW={minW} maxW="full" h={8}>
        <FilterInput
          placeholder={placeholder}
          result={result}
          label={label}
          inputRef={inputRef}
          ref={ref}
          isDropdown={isDropdown}
          filterDropdown={filterDropdown}
          setIsDropdown={setIsDropdown}
          chipContainerComponent={
            <Flex alignItems="center" pl={2} gap={2}>
              {result.map((option: ProposalStatus) => (
                <FilterChip
                  key={option}
                  chipComponent={<StatusChip status={option} hasCloseBtn />}
                  onSelect={() => selectOption(option)}
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
                key={option}
                filterDropdownComponent={<StatusChip status={option} />}
                isOptionSelected={isOptionSelected(option)}
                onSelect={() => selectOption(option)}
              />
            ))}
          </DropdownContainer>
        )}
      </FormControl>
    );
  }
);
