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
import type { ExposedFunction, Option } from "lib/types";

import { NoImageEmptyState } from "./EmptyState";

interface FunctionAccordionProps {
  amptrackTab: string;
  filteredFns: ExposedFunction[];
  isEmpty: boolean;
  selectedFn: Option<ExposedFunction>;
  setSelectedFn: (fn: ExposedFunction) => void;
  triggerText: string;
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
              <Text variant="body2" color="text.dark">
                {triggerText}
              </Text>
              <CountBadge variant="common" count={filteredFns.length} />
            </Flex>
            <AccordionIcon ml="auto" color="gray.600" />
          </AccordionButton>
        </h6>
        <AccordionPanel px={0} py={3}>
          {filteredFns.length ? (
            <Flex gap={1} flexDirection="column">
              {filteredFns.map((fn) => (
                <FunctionCard
                  key={fn.name}
                  variant={selectedFn?.name === fn.name ? "selected" : "common"}
                  exposedFn={fn}
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
