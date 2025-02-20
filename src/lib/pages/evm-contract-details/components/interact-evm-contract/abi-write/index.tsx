import { Accordion, Button, Flex } from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";

import { EmptyState } from "lib/components/state";

import { JsonFragment } from "ethers";
import { HexAddr20 } from "lib/types";
import { isUndefined } from "lodash";
import { WriteBox } from "./WriteBox";
import InputWithIcon from "lib/components/InputWithIcon";
import { CustomIcon } from "lib/components/icon";
import { trackUseExpandAll } from "lib/amplitude";

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
          placeholder="Search by method name"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          size="md"
          amptrackSection="write-message-search"
        />
        <Button
          variant="ghost-gray"
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
              prev.length ? [] : Array.from(Array(abiWrite.length).keys())
            );
          }}
        >
          {expandedIndexes.length ? "Collapse All" : "Expand All"}
        </Button>
      </Flex>
      {filteredAbiWrite.length ? (
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
          {filteredAbiWrite.map((abiSection, idx) => (
            <WriteBox
              key={abiSection.name}
              contractAddress={contractAddress}
              abiSection={abiSection}
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
