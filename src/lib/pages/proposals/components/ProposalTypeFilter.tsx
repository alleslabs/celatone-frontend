import type { InputProps } from "@chakra-ui/react";
import {
  Divider,
  Flex,
  FormControl,
  Tag,
  useOutsideClick,
} from "@chakra-ui/react";
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
import { CustomIcon } from "lib/components/icon";
import { useProposalTypes } from "lib/services/proposal";
import type { ProposalType } from "lib/types";
import { ProposalTypeCosmos } from "lib/types";

export interface ProposalTypeFilterProps extends InputProps {
  label?: string;
  minW?: string;
  placeholder?: string;
  result: ProposalType[];
  setResult: Dispatch<SetStateAction<ProposalType[]>>;
}

const COSMOSOPTIONS = Object.values(ProposalTypeCosmos);

export const ProposalTypeFilter = forwardRef<
  HTMLInputElement,
  ProposalTypeFilterProps
>(
  (
    {
      label,
      minW = "50%",
      placeholder,
      result,
      setResult,
    }: ProposalTypeFilterProps,
    ref
  ) => {
    const { data: proposalTypes } = useProposalTypes();
    const [keyword, setKeyword] = useState("");
    const [isDropdown, setIsDropdown] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);

    useOutsideClick({
      handler: () => setIsDropdown(false),
      ref: boxRef,
    });

    const dropdownValue = useMemo(() => {
      if (!proposalTypes) return [];
      return keyword
        ? matchSorter(proposalTypes, keyword, {
            threshold: matchSorter.rankings.CONTAINS,
          })
        : proposalTypes;
    }, [keyword, proposalTypes]);

    if (!proposalTypes) return null;

    const isOptionSelected = (option: ProposalType) =>
      result.some((selectedOption) => selectedOption === option);

    const selectOption = (option: ProposalType) => {
      if (inputRef.current) {
        setKeyword("");
      }
      if (result.includes(option)) {
        trackUseFilter(AmpEvent.USE_FILTER_PROPOSALS_TYPE, result, "remove");
        setResult((prevState) => prevState.filter((value) => value !== option));
      } else {
        trackUseFilter(AmpEvent.USE_FILTER_PROPOSALS_TYPE, result, "add");
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
      <FormControl h={8} minW={minW} w="full" ref={boxRef}>
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
                    <Tag>
                      {option}
                      <CustomIcon mr={0} name="close" boxSize={3} />
                    </Tag>
                  }
                  onSelect={() => selectOption(option)}
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
