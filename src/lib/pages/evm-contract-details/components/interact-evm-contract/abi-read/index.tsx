import type { JsonFragment } from "ethers";
import type { HexAddr20 } from "lib/types";

import { Accordion, Button, Flex } from "@chakra-ui/react";
import { trackUseExpandAll } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";
import InputWithIcon from "lib/components/InputWithIcon";
import { EmptyState } from "lib/components/state";
import { isUndefined } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";

import { ReadBox } from "./ReadBox";

interface AbiReadProps {
  abiRead: JsonFragment[];
  contractAddress: HexAddr20;
  selectedFn?: string;
}

export const AbiRead = ({
  abiRead,
  contractAddress,
  selectedFn,
}: AbiReadProps) => {
  // ------------------------------------------//
  // -----------------REFERENCE----------------//
  // ------------------------------------------//
  const accordionRef = useRef<HTMLDivElement>(null);

  // ------------------------------------------//
  // -------------------STATES-----------------//
  // ------------------------------------------//
  const [keyword, setKeyword] = useState("");
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);

  const filteredAbiRead = useMemo(
    () =>
      abiRead.filter((abiSection) =>
        abiSection.name?.toLowerCase().includes(keyword.toLowerCase())
      ),
    [abiRead, keyword]
  );

  // ------------------------------------------//
  // -------------------EFFECTS----------------//
  // ------------------------------------------//
  useEffect(() => {
    if (!isUndefined(selectedFn) && accordionRef.current) {
      try {
        const selectedFnIndex = abiRead.findIndex(
          (abiSection) => abiSection.name === selectedFn
        );
        setExpandedIndexes((prev) =>
          prev.includes(selectedFnIndex) ? prev : prev.concat(selectedFnIndex)
        );
        const el = document.querySelector(
          `.abi_read_${abiRead[selectedFnIndex].name}`
        );
        // TODO: This is a workaround, refactor to a proper solution later
        const timeoutId = setTimeout(() => el?.scrollIntoView(), 200);
        return () => clearInterval(timeoutId);
      } catch {
        //
      }
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abiRead, selectedFn, accordionRef.current]);

  return (
    <>
      <Flex gap={6} mb={6}>
        <InputWithIcon
          amptrackSection="read-message-search"
          placeholder="Search by method name"
          size="md"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Button
          minH="40px"
          rightIcon={
            <CustomIcon
              boxSize={3}
              name={expandedIndexes.length ? "chevron-up" : "chevron-down"}
              right={0}
            />
          }
          variant="ghost-gray"
          onClick={() => {
            trackUseExpandAll(expandedIndexes.length ? "collapse" : "expand");
            setExpandedIndexes((prev) =>
              prev.length ? [] : Array.from(Array(abiRead.length).keys())
            );
          }}
        >
          {expandedIndexes.length ? "Collapse all" : "Expand all"}
        </Button>
      </Flex>
      {filteredAbiRead.length ? (
        <Accordion
          allowMultiple
          display="flex"
          flexDir="column"
          index={expandedIndexes}
          rowGap={4}
          sx={{ ".chakra-accordion__icon": { color: "gray.600" } }}
          onChange={(indexes: number[]) => setExpandedIndexes(indexes)}
          ref={accordionRef}
        >
          {filteredAbiRead.map((abiSection, idx) => (
            <ReadBox
              key={abiSection.name}
              abiSection={abiSection}
              contractAddress={contractAddress}
              opened={expandedIndexes.includes(idx)}
            />
          ))}
        </Accordion>
      ) : (
        <EmptyState imageVariant="empty" message="No read function found." />
      )}
    </>
  );
};
