import type { InputProps } from "@chakra-ui/react";
import {
  FormControl,
  Flex,
  useOutsideClick,
  Divider,
  Tag,
} from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import type { Dispatch, SetStateAction } from "react";
import { useState, useRef, forwardRef } from "react";

import { FilterChip } from "lib/components/filter/FilterChip";
import { DropdownContainer } from "lib/components/filter/FilterComponents";
import { FilterDropdownItem } from "lib/components/filter/FilterDropdownItem";
import { FilterInput } from "lib/components/filter/FilterInput";
import { CustomIcon } from "lib/components/icon";
import { AmpEvent, AmpTrackUseFilter } from "lib/services/amplitude";
import { useProposalTypes } from "lib/services/proposalService";
import type { ProposalType } from "lib/types";
import { ProposalTypeCosmos } from "lib/types";

export interface ProposalTypeFilterProps extends InputProps {
  result: ProposalType[];
  minW?: string;
  label?: string;
  placeholder?: string;
  setResult: Dispatch<SetStateAction<ProposalType[]>>;
}

const COSMOSOPTIONS = Object.values(ProposalTypeCosmos);

export const ProposalTypeFilter = forwardRef<
  HTMLInputElement,
  ProposalTypeFilterProps
>(
  (
    {
      result,
      minW = "50%",
      setResult,
      placeholder,
      label,
    }: ProposalTypeFilterProps,
    ref
  ) => {
    const { data: proposalTypes } = useProposalTypes();
    const [dropdownValue, setDropdownValue] = useState<ProposalType[]>([]);
    const [isDropdown, setIsDropdown] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);

    useOutsideClick({
      ref: boxRef,
      handler: () => setIsDropdown(false),
    });

    if (!proposalTypes) return null;

    const filterDropdown = (value: string) => {
      setIsDropdown(true);
      setDropdownValue(
        value
          ? matchSorter(proposalTypes, value, {
              threshold: matchSorter.rankings.CONTAINS,
            })
          : proposalTypes
      );
    };

    const isOptionSelected = (option: ProposalType) =>
      result.some((selectedOption) => selectedOption === option);

    const selectOption = (option: ProposalType) => {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      if (result.includes(option)) {
        AmpTrackUseFilter(AmpEvent.USE_FILTER_PROPOSALS_TYPE, result, "remove");
        setResult((prevState) => prevState.filter((value) => value !== option));
      } else {
        AmpTrackUseFilter(AmpEvent.USE_FILTER_PROPOSALS_TYPE, result, "add");
        setResult((prevState) => [...prevState, option]);
      }
    };

    const [cosmosTypes, generalTypes] = dropdownValue.reduce(
      ([cosmosTypesPrev, generalTypesPrev], curr: ProposalType) =>
        COSMOSOPTIONS.includes(curr as ProposalTypeCosmos)
          ? [[...cosmosTypesPrev, curr], generalTypesPrev]
          : [cosmosTypesPrev, [...generalTypesPrev, curr]],
      [[] as ProposalType[], [] as ProposalType[]]
    );

    return (
      <FormControl w="full" h={8} ref={boxRef} minW={minW}>
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
              {result.map((option) => (
                <FilterChip
                  key={option}
                  chipComponent={
                    <Tag>
                      {option}
                      <CustomIcon name="close" boxSize="3" mr={0} />
                    </Tag>
                  }
                  onSelect={() => selectOption(option)}
                />
              ))}
            </Flex>
          }
        />
        {isDropdown && (
          <DropdownContainer maxH="450px">
            {!dropdownValue.length && <Flex p={2}>No filter matched</Flex>}
            {cosmosTypes.map((cosmosType) => (
              <FilterDropdownItem
                key={cosmosType}
                filterDropdownComponent={cosmosType}
                isOptionSelected={isOptionSelected(cosmosType)}
                onSelect={() => selectOption(cosmosType)}
              />
            ))}
            {cosmosTypes.length && <Divider borderColor="gray.700" />}

            {generalTypes.map((generalType) => (
              <FilterDropdownItem
                key={generalType}
                filterDropdownComponent={generalType}
                isOptionSelected={isOptionSelected(generalType)}
                onSelect={() => selectOption(generalType)}
              />
            ))}
          </DropdownContainer>
        )}
      </FormControl>
    );
  }
);
