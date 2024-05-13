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
    const [keyword, setKeyword] = useState("");
    const [isDropdown, setIsDropdown] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);

    useOutsideClick({
      ref: boxRef,
      handler: () => setIsDropdown(false),
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
      <FormControl w="full" h={8} ref={boxRef} minW={minW}>
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
                    <Tag>
                      {option}
                      <CustomIcon name="close" boxSize={3} mr={0} />
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
                result={result}
                option={cosmosType}
                setIsDropdown={setIsDropdown}
                setKeyword={setKeyword}
                setResult={(opt) => setResult(opt as ProposalType[])}
                isMulti
              />
            ))}
            {cosmosTypes.length && <Divider borderColor="gray.700" />}

            {generalTypes.map((generalType) => (
              <FilterDropdownItem
                key={generalType}
                filterDropdownComponent={generalType}
                result={result}
                option={generalType}
                setIsDropdown={setIsDropdown}
                setKeyword={setKeyword}
                setResult={(opt) => setResult(opt as ProposalType[])}
                isMulti
              />
            ))}
          </DropdownContainer>
        )}
      </FormControl>
    );
  }
);
