import type { ExposedFunction, Option } from "lib/types";

import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Text,
} from "@chakra-ui/react";
import { AmpEvent, track, trackUseExpand } from "lib/amplitude";
import { CountBadge, FunctionCard } from "lib/components/module";

import { NoImageEmptyState } from "./EmptyState";

interface FunctionAccordionProps {
  filteredFns: ExposedFunction[];
  isEmpty: boolean;
  triggerText: string;
  selectedFn: Option<ExposedFunction>;
  setSelectedFn: (fn: ExposedFunction) => void;
  amptrackTab: string;
}

export const FunctionAccordion = ({
  amptrackTab,
  filteredFns,
  isEmpty,
  selectedFn,
  setSelectedFn,
  triggerText,
}: FunctionAccordionProps) => (
  <AccordionItem bg="background.main" py={1}>
    {({ isExpanded }) => (
      <>
        <h6>
          <AccordionButton
            onClick={() => {
              trackUseExpand({
                action: isExpanded ? "collapse" : "expand",
                component: "module_interaction_function_accordion",
                info: { Tab: amptrackTab },
                section: triggerText,
              });
            }}
          >
            <Flex align="center" gap={2} justify="space-between">
              <Text color="text.dark" variant="body2">
                {triggerText}
              </Text>
              <CountBadge count={filteredFns.length} variant="common" />
            </Flex>
            <AccordionIcon color="gray.600" ml="auto" />
          </AccordionButton>
        </h6>
        <AccordionPanel px={0} py={3}>
          {filteredFns.length ? (
            <Flex flexDirection="column" gap={1}>
              {filteredFns.map((fn) => (
                <FunctionCard
                  key={fn.name}
                  exposedFn={fn}
                  variant={selectedFn?.name === fn.name ? "selected" : "common"}
                  onFunctionSelect={() => {
                    track(AmpEvent.USE_FUNCTION_SELECTION, {
                      functionType: fn.is_view ? "view" : "Execute",
                    });
                    setSelectedFn(fn);
                  }}
                />
              ))}
            </Flex>
          ) : (
            <NoImageEmptyState
              desc={isEmpty ? "No function" : "No matching function found"}
            />
          )}
        </AccordionPanel>
      </>
    )}
  </AccordionItem>
);
