import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Text,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";

import { CopyButton } from "../copy";
import { CURR_THEME } from "env";
import type { Option } from "lib/types";

const AceEditor = dynamic(() => import("react-ace"), {
  ssr: false,
});

interface ModuleSourceCodeProps {
  sourceCode: Option<string>;
}
export const ModuleSourceCode = ({ sourceCode }: ModuleSourceCodeProps) => {
  if (!sourceCode) return null;
  return (
    <Accordion allowToggle w="full" defaultIndex={[0]}>
      <AccordionItem>
        <AccordionButton p={4}>
          <Flex justifyContent="space-between" w="full">
            <Flex flexDirection="column" alignItems="start">
              <Text fontWeight={600} variant="body1" color="text.main">
                Module Source Code
              </Text>
              <Text fontWeight={600} variant="body2" color="text.dark">
                The source code is uploaded by the deployer and pulled from
                Initia API
              </Text>
            </Flex>
            <Flex alignItems="center" gap={2}>
              <CopyButton
                value={sourceCode}
                variant="outline-primary"
                w={{ base: "full", md: "auto" }}
              />
              <AccordionIcon color="gray.600" ml="auto" boxSize={6} />
            </Flex>
          </Flex>
        </AccordionButton>
        <AccordionPanel pt={0} pb={4}>
          <Box
            p="16px 12px"
            border="1px solid"
            borderColor="gray.700"
            borderRadius="8px"
          >
            <AceEditor
              readOnly
              mode="rust"
              theme={CURR_THEME.jsonTheme}
              fontSize="14px"
              style={{
                color: CURR_THEME.colors.text.main,
                width: "100%",
                background: "transparent",
              }}
              value={sourceCode}
              setOptions={{
                showGutter: false,
                useWorker: false,
                printMargin: false,
                wrap: true,
              }}
            />
          </Box>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
