import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertDescription,
  Box,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import type { Monaco } from "@monaco-editor/react";
import MonacoEditor from "@monaco-editor/react";

import { AppLink } from "../AppLink";
import { CopyButton } from "../copy";
import { CustomIcon } from "../icon";
import { MoveVerifyBadge } from "../MoveVerifyBadge";
import type { MoveVerifyInfoResponse } from "lib/services/types";
import { MoveVerifyStatus } from "lib/types";
import type { Nullish } from "lib/types";
import { formatUTC } from "lib/utils";

import { moveLanguageConfig, moveTokenProvider } from "./moveSyntax";

const loadMoveSyntax = (monaco: Monaco) => {
  monaco.languages.register({ id: "move" });
  monaco.languages.onLanguage("move", () => {
    monaco.languages.setMonarchTokensProvider("move", moveTokenProvider);
    monaco.languages.setLanguageConfiguration("move", moveLanguageConfig);
  });
};

interface ModuleSourceCodeProps {
  moveVerifyStatus: MoveVerifyStatus;
  verificationData: Nullish<MoveVerifyInfoResponse>;
}

export const ModuleSourceCode = ({
  moveVerifyStatus,
  verificationData,
}: ModuleSourceCodeProps) => {
  if (!verificationData) return null;

  return (
    <Accordion w="full" allowToggle>
      <AccordionItem>
        <AccordionButton p={4}>
          <Flex w="full" direction="column">
            <Flex justifyContent="space-between">
              <Flex alignItems="start" flexDirection="column">
                <Flex align="center" gap={1}>
                  <MoveVerifyBadge status={moveVerifyStatus} />
                  <Heading as="h6" textAlign="left" variant="h7">
                    Verified Module Source Code
                  </Heading>
                </Flex>
                <Text
                  textAlign="start"
                  variant="body2"
                  color="text.dark"
                  fontWeight={600}
                >
                  This module is verifed at{" "}
                  {formatUTC(verificationData.verifiedAt)}
                </Text>
              </Flex>
              <Flex alignItems="center" gap={2}>
                <CopyButton
                  value={verificationData.source}
                  variant="outline-primary"
                  w={{ base: "full", md: "auto" }}
                />
                <AccordionIcon ml="auto" boxSize={6} color="gray.600" />
              </Flex>
            </Flex>
            {moveVerifyStatus === MoveVerifyStatus.Outdated && (
              <Alert
                alignItems="flex-start"
                gap={2}
                mt={2}
                p={2}
                variant="warning"
              >
                <CustomIcon name="alert-triangle-solid" boxSize={4} />
                <AlertDescription>
                  <Text textAlign="left" variant="body2" color="warning.main">
                    The displayed source code is an <b>older version</b> since
                    the module was republished after verification. If you are
                    the owner, you can{" "}
                    <AppLink href="/modules/verify">
                      <Text
                        display="inline-flex"
                        gap={1}
                        size="sm"
                        _hover={{
                          color: "warning.light",
                          textDecorationColor: "warning.light",
                        }}
                        color="warning.main"
                        textDecoration="underline"
                        transition="all 0.25s ease-in-out"
                      >
                        resubmit for verification
                      </Text>
                    </AppLink>{" "}
                    with the new files.
                  </Text>
                </AlertDescription>
              </Alert>
            )}
          </Flex>
        </AccordionButton>
        <AccordionPanel pb={4} pt={0}>
          <Box
            p="16px 12px"
            border="1px solid"
            borderColor="gray.700"
            borderRadius="8px"
          >
            <MonacoEditor
              height={400}
              language="move"
              theme="vs-dark"
              value={verificationData.source}
              beforeMount={loadMoveSyntax}
              options={{ readOnly: true, scrollBeyondLastLine: false }}
            />
          </Box>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
