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

import { useState } from "react";
import type { MoveVerifyInfoResponse } from "lib/services/types";
import { MoveVerifyStatus } from "lib/types";
import type { Nullish } from "lib/types";
import { formatUTC } from "lib/utils";
import { ModuleFileTabs, ModuleFileSwitch } from "./ModuleFileSwitch";
import { AppLink } from "../AppLink";
import { Editor } from "../editor/Editor";
import { CustomIcon } from "../icon";
import { MoveVerifyBadge } from "../MoveVerifyBadge";

interface ModuleSourceCodeProps {
  verificationData: Nullish<MoveVerifyInfoResponse>;
  moveVerifyStatus: MoveVerifyStatus;
}

export const ModuleSourceCode = ({
  verificationData,
  moveVerifyStatus,
}: ModuleSourceCodeProps) => {
  const [currentTab, setCurrentTab] = useState(ModuleFileTabs.SOURCE_CODE);

  if (!verificationData) return null;
  return (
    <Accordion allowToggle defaultIndex={[0]} w="full">
      <AccordionItem>
        <AccordionButton p={4}>
          <Flex direction="column" w="full">
            <Flex justifyContent="space-between" w="full" alignItems="center">
              <Flex flexDirection="column" alignItems="start">
                <Flex align="center" gap={1}>
                  <MoveVerifyBadge status={moveVerifyStatus} />
                  <Heading as="h6" variant="h7" textAlign="left">
                    Verified Module Source Code
                  </Heading>
                </Flex>
                <Text
                  fontWeight={600}
                  variant="body2"
                  color="text.dark"
                  textAlign="start"
                >
                  Verifed at {formatUTC(verificationData.verifiedAt)}
                </Text>
              </Flex>
              <AccordionIcon color="gray.600" ml="auto" boxSize={6} />
            </Flex>
            {moveVerifyStatus === MoveVerifyStatus.Outdated && (
              <Alert
                p={2}
                variant="warning"
                gap={2}
                mt={2}
                alignItems="flex-start"
              >
                <CustomIcon name="alert-triangle-solid" boxSize={4} />
                <AlertDescription>
                  <Text variant="body2" color="warning.main" textAlign="left">
                    The displayed source code is an <b>older version</b> since
                    the module was republished after verification. If you are
                    the owner, you can{" "}
                    <AppLink href="/modules/verify">
                      <Text
                        display="inline-flex"
                        gap={1}
                        size="sm"
                        color="warning.main"
                        textDecoration="underline"
                        transition="all 0.25s ease-in-out"
                        _hover={{
                          color: "warning.light",
                          textDecorationColor: "warning.light",
                        }}
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
        <AccordionPanel pt={0} pb={4}>
          <Flex flexDirection="column" gap={4}>
            <ModuleFileSwitch
              currentTab={currentTab}
              onTabChange={setCurrentTab}
            />
            <Box
              p="16px 12px"
              border="1px solid"
              borderColor="gray.700"
              borderRadius="8px"
            >
              <Editor
                value={
                  currentTab === ModuleFileTabs.SOURCE_CODE
                    ? verificationData.source
                    : verificationData.toml
                }
              />
            </Box>
            <Flex gap={4} flexWrap="wrap">
              <Text variant="body2" fontWeight={600} mr={2} color="text.dark">
                Advanced Settings
              </Text>
              {[
                {
                  label: "Language Version",
                  value: verificationData.languageVersion,
                },
                {
                  label: "Compiler Version",
                  value: verificationData.compilerVersion,
                },
                {
                  label: "Bytecode Version",
                  value: verificationData.bytecodeVersion,
                },
              ].map(({ label, value }) => (
                <Flex gap={1} key={label}>
                  <Text variant="body2" color="text.dark">
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
