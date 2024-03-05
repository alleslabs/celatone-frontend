import type { InputProps } from "@chakra-ui/react";
import { Flex, FormControl, useOutsideClick } from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import type { Dispatch, SetStateAction } from "react";
import { forwardRef, useMemo, useRef, useState } from "react";

import { AmpEvent, trackUseFilter } from "lib/amplitude";
import {
  DropdownContainer,
  FilterChip,
  FilterDropdownItem,
  FilterInput,
} from "lib/components/filter";
import { StatusChip } from "lib/components/table";
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
    const [keyword, setKeyword] = useState("");
    const [isDropdown, setIsDropdown] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);

    const dropdownValue = useMemo(
      () =>
        keyword
          ? matchSorter(OPTIONS, keyword, {
              threshold: matchSorter.rankings.CONTAINS,
            })
          : OPTIONS,
      [keyword]
    );

    const isOptionSelected = (option: ProposalStatus) =>
      result.some((selectedOption) => selectedOption === option);

    const selectOption = (option: ProposalStatus) => {
      if (inputRef.current) {
        setKeyword("");
      }
      if (result.includes(option)) {
        trackUseFilter(AmpEvent.USE_FILTER_PROPOSALS_STATUS, result, "remove");
        setResult((prevState) => prevState.filter((value) => value !== option));
      } else {
        trackUseFilter(AmpEvent.USE_FILTER_PROPOSALS_STATUS, result, "add");
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
