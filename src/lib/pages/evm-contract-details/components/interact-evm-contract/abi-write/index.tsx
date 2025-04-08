import type { JsonFragment } from "ethers";
import type { HexAddr20 } from "lib/types";

import { Accordion, Button, Flex } from "@chakra-ui/react";
import { trackUseExpandAll } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";
import InputWithIcon from "lib/components/InputWithIcon";
import { EmptyState } from "lib/components/state";
import { isUndefined } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";

import { WriteBox } from "./WriteBox";

interface AbiWriteProps {
  contractAddress: HexAddr20;
  abiWrite: JsonFragment[];
  selectedFn?: string;
}

export const AbiWrite = ({
  contractAddress,
  abiWrite,
  selectedFn,
}: AbiWriteProps) => {
  // ------------------------------------------//
  // -----------------REFERENCE----------------//
  // ------------------------------------------//
  const accordionRef = useRef<HTMLDivElement>(null);

  // ------------------------------------------//
  // -------------------STATES-----------------//
  // ------------------------------------------//
  const [keyword, setKeyword] = useState("");
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);

  const filteredAbiWrite = useMemo(
    () =>
      abiWrite.filter((abiSection) =>
        abiSection.name?.toLowerCase().includes(keyword.toLowerCase())
      ),
    [abiWrite, keyword]
  );

  // ------------------------------------------//
  // -------------------EFFECTS----------------//
  // ------------------------------------------//
  useEffect(() => {
    if (!isUndefined(selectedFn) && accordionRef.current) {
      try {
        const selectedFnIndex = abiWrite.findIndex(
          (abiSection) => abiSection.name === selectedFn
        );
        setExpandedIndexes((prev) =>
          prev.includes(selectedFnIndex) ? prev : prev.concat(selectedFnIndex)
        );
        const el = document.querySelector(
          `.abi_write_${abiWrite[selectedFnIndex].name}`
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
  }, [abiWrite, selectedFn, accordionRef.current]);

  return (
    <>
      <Flex gap={6} mb={6}>
        <InputWithIcon
          amptrackSection="write-message-search"
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
              prev.length ? [] : Array.from(Array(abiWrite.length).keys())
            );
          }}
        >
          {expandedIndexes.length ? "Collapse all" : "Expand all"}
        </Button>
      </Flex>
      {filteredAbiWrite.length ? (
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
          {filteredAbiWrite.map((abiSection, idx) => (
            <WriteBox
              key={abiSection.name}
              abiSection={abiSection}
              contractAddress={contractAddress}
              opened={expandedIndexes.includes(idx)}
            />
          ))}
        </Accordion>
      ) : (
        <EmptyState imageVariant="empty" message="No write function found." />
      )}
    </>
  );
};
