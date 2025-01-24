import { Accordion } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import { EmptyState } from "lib/components/state";

import { JsonFragment } from "ethers";
import { HexAddr20 } from "lib/types";
import { ReadBox } from "./ReadBox";
import { isUndefined } from "lodash";

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
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);

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
      {abiRead.length ? (
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
        <EmptyState imageVariant="empty" message="No write function found." />
      )}
    </>
  );
};
