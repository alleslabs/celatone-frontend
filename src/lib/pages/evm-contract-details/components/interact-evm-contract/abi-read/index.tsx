import { Accordion, Button, Flex } from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";

import { EmptyState } from "lib/components/state";

import { JsonFragment } from "ethers";
import { HexAddr20 } from "lib/types";
import { ReadBox } from "./ReadBox";
import { isUndefined } from "lodash";
import { CustomIcon } from "lib/components/icon";
import InputWithIcon from "lib/components/InputWithIcon";
import { trackUseExpandAll } from "lib/amplitude";

interface AbiReadProps {
  contractAddress: HexAddr20;
  abiRead: JsonFragment[];
  selectedFn?: string;
}

export const AbiRead = ({
  contractAddress,
  abiRead,
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
          placeholder="Search by method name"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          size="md"
          amptrackSection="read-message-search"
        />
        <Button
          variant="outline-gray"
          rightIcon={
            <CustomIcon
              name={expandedIndexes.length ? "chevron-up" : "chevron-down"}
              boxSize={3}
              right={0}
            />
          }
          minH="40px"
          onClick={() => {
            trackUseExpandAll(expandedIndexes.length ? "collapse" : "expand");
            setExpandedIndexes((prev) =>
              prev.length ? [] : Array.from(Array(abiRead.length).keys())
            );
          }}
        >
          {expandedIndexes.length ? "Collapse All" : "Expand All"}
        </Button>
      </Flex>
      {filteredAbiRead.length ? (
        <Accordion
          ref={accordionRef}
          allowMultiple
          rowGap={4}
          display="flex"
          flexDir="column"
          index={expandedIndexes}
          onChange={(indexes: number[]) => setExpandedIndexes(indexes)}
          sx={{ ".chakra-accordion__icon": { color: "gray.600" } }}
        >
          {abiRead.map((abiSection, idx) => (
            <ReadBox
              key={abiSection.name}
              contractAddress={contractAddress}
              abiSection={abiSection}
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
