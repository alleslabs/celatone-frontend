import type { InputProps } from "@chakra-ui/react";
import type { RefObject } from "react";

import { Flex, FormControl, useOutsideClick } from "@chakra-ui/react";
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
import { matchSorter } from "match-sorter";
import { forwardRef, useMemo, useRef, useState } from "react";

export interface ProposalStatusFilterProps extends InputProps {
  isMulti: boolean;
  label?: string;
  minW?: string;
  placeholder?: string;
  result: ProposalStatus[];
  setResult: (option: ProposalStatus[]) => void;
}

export const ProposalStatusFilter = forwardRef<
  HTMLInputElement,
  ProposalStatusFilterProps
>(
  (
    {
      isMulti,
      label,
      minW = "50%",
      placeholder,
      result,
      setResult,
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
      handler: () => setIsDropdown(false),
      ref: boxRef as RefObject<HTMLDivElement>,
    });

    return (
      <FormControl h={8} maxW="full" minW={minW} ref={boxRef}>
        <FilterInput
          chipContainerComponent={
            <Flex alignItems="center" gap={2} pl={2}>
              {result.map((option: ProposalStatus) => (
                <FilterChip
                  key={option}
                  chipComponent={<StatusChip hasCloseBtn status={option} />}
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
