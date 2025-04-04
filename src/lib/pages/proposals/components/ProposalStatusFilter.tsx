import type { InputProps } from "@chakra-ui/react";
import { Flex, FormControl, useOutsideClick } from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import type { RefObject } from "react";
import { forwardRef, useMemo, useRef, useState } from "react";

import { AmpEvent, trackUseFilter } from "lib/amplitude";
import { useTierConfig } from "lib/app-provider";
import {
  DropdownContainer,
  FilterChip,
  FilterDropdownItem,
  FilterInput,
} from "lib/components/filter";
import { StatusChip } from "lib/components/table";
import { ProposalStatus } from "lib/types";
import { toggleItem } from "lib/utils";

export interface ProposalStatusFilterProps extends InputProps {
  result: ProposalStatus[];
  minW?: string;
  label?: string;
  placeholder?: string;
  setResult: (option: ProposalStatus[]) => void;
  isMulti: boolean;
}

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
      isMulti,
    }: ProposalStatusFilterProps,
    ref
  ) => {
    const [keyword, setKeyword] = useState("");
    const [isDropdown, setIsDropdown] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);
    const { isFullTier } = useTierConfig();

    const OPTIONS = isFullTier
      ? Object.values(ProposalStatus)
      : Object.values(ProposalStatus).filter(
          (status) =>
            status !== ProposalStatus.DEPOSIT_FAILED &&
            status !== ProposalStatus.CANCELLED
        );

    const dropdownValue = useMemo(
      () =>
        keyword
          ? matchSorter(OPTIONS, keyword, {
              threshold: matchSorter.rankings.CONTAINS,
            })
          : OPTIONS,
      [keyword, OPTIONS]
    );

    const isOptionSelected = (option: ProposalStatus) =>
      result.some((selectedOption) => selectedOption === option);

    const selectOption = (option: ProposalStatus) => {
      setKeyword("");

      if (result.includes(option)) {
        trackUseFilter(AmpEvent.USE_FILTER_PROPOSALS_STATUS, result, "remove");
      } else {
        trackUseFilter(AmpEvent.USE_FILTER_PROPOSALS_STATUS, result, "add");
      }

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
      <FormControl ref={boxRef} minW={minW} maxW="full" h={8}>
        <FilterInput
          keyword={keyword}
          placeholder={placeholder}
          result={result}
          label={label}
          inputRef={inputRef}
          mainRef={ref}
          isDropdown={isDropdown}
          setKeyword={setKeyword}
          setIsDropdown={setIsDropdown}
          chipContainerComponent={
            <Flex alignItems="center" pl={2} gap={2}>
              {result.map((option: ProposalStatus) => (
                <FilterChip
                  key={option}
                  chipComponent={<StatusChip status={option} hasCloseBtn />}
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
