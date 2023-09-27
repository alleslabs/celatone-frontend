import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Text,
} from "@chakra-ui/react";

import { CountBadge, FunctionCard } from "lib/components/module";
import type { ExposedFunction, Option } from "lib/types";

import { NoImageEmptyState } from "./EmptyState";

interface FunctionAccordionProps {
  filteredFns: ExposedFunction[];
  isEmpty: boolean;
  triggerText: string;
  selectedFn: Option<ExposedFunction>;
  setSelectedFn: (fn: ExposedFunction) => void;
}

export const FunctionAccordion = ({
  filteredFns,
  isEmpty,
  triggerText,
  selectedFn,
  setSelectedFn,
}: FunctionAccordionProps) => {
  return (
    <AccordionItem bg="background.main" py={1}>
      <h6>
        <AccordionButton>
          <Flex align="center" justify="space-between" gap={2}>
            <Text variant="body2" color="text.dark">
              {triggerText}
            </Text>
            <CountBadge count={filteredFns.length} variant="common" />
          </Flex>
          <AccordionIcon color="gray.600" ml="auto" />
        </AccordionButton>
      </h6>
      <AccordionPanel py={3} px={0}>
        <Flex flexDirection="column" gap={1}>
          {filteredFns.length ? (
            filteredFns.map((fn) => (
              <FunctionCard
                key={fn.name}
                variant={selectedFn?.name === fn.name ? "selected" : "common"}
                exposedFn={fn}
                onFunctionSelect={setSelectedFn}
              />
            ))
          ) : (
            <NoImageEmptyState
              desc={isEmpty ? "No function" : "No matching function found"}
            />
          )}
        </Flex>
      </AccordionPanel>
    </AccordionItem>
  );
};
