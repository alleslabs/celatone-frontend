import type { InputProps } from "@chakra-ui/react";
import { Flex, FormControl, useOutsideClick } from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
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
  result: ProposalStatus | ProposalStatus[] | undefined;
  minW?: string;
  label?: string;
  placeholder?: string;
  setResult: (option: ProposalStatus | ProposalStatus[] | undefined) => void;
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

    const selectOption = (option: ProposalStatus | undefined) => {
      if (inputRef.current) {
        setKeyword("");
      }

      if (typeof result === "string" || !result || !option) {
        if (typeof result === "string") {
          trackUseFilter(AmpEvent.USE_FILTER_PROPOSALS_STATUS, result, "add");
          setResult(option);

          return;
        }

        trackUseFilter(AmpEvent.USE_FILTER_PROPOSALS_STATUS, "", "remove");
        setResult(option);

        return;
      }

      if (result.includes(option)) {
        trackUseFilter(AmpEvent.USE_FILTER_PROPOSALS_STATUS, result, "remove");
        setResult(result.filter((value) => value !== option));

        return;
      }

      trackUseFilter(AmpEvent.USE_FILTER_PROPOSALS_STATUS, result, "add");
      setResult([...result, option]);
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
              {typeof result === "string" ? (
                <FilterChip
                  chipComponent={<StatusChip status={result} hasCloseBtn />}
                  onSelect={() => selectOption(undefined)}
                />
              ) : (
                result?.map((option: ProposalStatus) => (
                  <FilterChip
                    key={option}
                    chipComponent={<StatusChip status={option} hasCloseBtn />}
                    onSelect={() => selectOption(option)}
                  />
                ))
              )}
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
                onSelect={() => selectOption(option)}
                result={result}
                option={option}
              />
            ))}
          </DropdownContainer>
        )}
      </FormControl>
    );
  }
);
