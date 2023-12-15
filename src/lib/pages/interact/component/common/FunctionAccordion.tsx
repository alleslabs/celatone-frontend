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
  filteredFns: ExposedFunction[];
  isEmpty: boolean;
  triggerText: string;
  selectedFn: Option<ExposedFunction>;
  setSelectedFn: (fn: ExposedFunction) => void;
  amptrackTab: string;
}

export const FunctionAccordion = ({
  filteredFns,
  isEmpty,
  triggerText,
  selectedFn,
  setSelectedFn,
  amptrackTab,
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
          {filteredFns.length ? (
            <Flex flexDirection="column" gap={1}>
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
