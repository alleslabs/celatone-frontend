import type { MoveVerifyInfoResponse } from "lib/services/types";
import type { Nullish } from "lib/types";

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
import { MoveVerifyStatus } from "lib/types";
import { formatUTC } from "lib/utils";
import { useState } from "react";

import { AppLink } from "../AppLink";
import { Editor } from "../editor/Editor";
import { CustomIcon } from "../icon";
import { MoveVerifyBadge } from "../MoveVerifyBadge";
import { ModuleFileSwitch, ModuleFileTabs } from "./ModuleFileSwitch";

interface ModuleSourceCodeProps {
  moveVerifyStatus: MoveVerifyStatus;
  verificationData: Nullish<MoveVerifyInfoResponse>;
}

export const ModuleSourceCode = ({
  moveVerifyStatus,
  verificationData,
}: ModuleSourceCodeProps) => {
  const [currentTab, setCurrentTab] = useState(ModuleFileTabs.SOURCE_CODE);

  if (!verificationData) return null;
  return (
    <Accordion allowToggle defaultIndex={[0]} w="full">
      <AccordionItem>
        <AccordionButton p={4}>
          <Flex direction="column" w="full">
            <Flex alignItems="center" justifyContent="space-between" w="full">
              <Flex alignItems="start" flexDirection="column">
                <Flex align="center" gap={1}>
                  <MoveVerifyBadge status={moveVerifyStatus} />
                  <Heading as="h6" textAlign="left" variant="h7">
                    Verified module source code
                  </Heading>
                </Flex>
                <Text
                  color="text.dark"
                  fontWeight={600}
                  textAlign="start"
                  variant="body2"
                >
                  Verified at {formatUTC(verificationData.verifiedAt)}
                </Text>
              </Flex>
              <AccordionIcon boxSize={6} color="gray.600" ml="auto" />
            </Flex>
            {moveVerifyStatus === MoveVerifyStatus.Outdated && (
              <Alert
                alignItems="flex-start"
                gap={2}
                mt={2}
                p={2}
                variant="warning"
              >
                <CustomIcon boxSize={4} name="alert-triangle-solid" />
                <AlertDescription>
                  <Text color="warning.main" textAlign="left" variant="body2">
                    The displayed source code is an <b>older version</b> since
                    the module was republished after verification. If you are
                    the owner, you can{" "}
                    <AppLink href="/modules/verify">
                      <Text
                        _hover={{
                          color: "warning.light",
                          textDecorationColor: "warning.light",
                        }}
                        color="warning.main"
                        display="inline-flex"
                        gap={1}
                        size="sm"
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
          <Flex flexDirection="column" gap={4}>
            <ModuleFileSwitch
              currentTab={currentTab}
              onTabChange={setCurrentTab}
            />
            <Box
              border="1px solid"
              borderColor="gray.700"
              borderRadius="8px"
              p="16px 12px"
            >
              <Editor
                value={
                  currentTab === ModuleFileTabs.SOURCE_CODE
                    ? verificationData.source
                    : verificationData.toml
                }
              />
            </Box>
            <Flex flexWrap="wrap" gap={4} rowGap={1}>
              <Text color="text.dark" fontWeight={600} mr={2} variant="body2">
                Advanced settings
              </Text>
              {[
                {
                  label: "Language version",
                  value: verificationData.languageVersion,
                },
                {
                  label: "Compiler version",
                  value: verificationData.compilerVersion,
                },
                {
                  label: "Bytecode version",
                  value: verificationData.bytecodeVersion,
                },
              ].map(({ label, value }) => (
                <Flex key={label} gap={1}>
                  <Text color="text.dark" variant="body2">
                    {label}:
                  </Text>
                  <Text variant="body2">{value}</Text>
                </Flex>
              ))}
            </Flex>
          </Flex>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
