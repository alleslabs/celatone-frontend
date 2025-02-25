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

import type { MoveVerifyInfoResponse } from "lib/services/types";
import { MoveVerifyStatus } from "lib/types";
import type { Nullish } from "lib/types";
import { formatUTC } from "lib/utils";
import { AppLink } from "../AppLink";
import { CopyButton } from "../copy";
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
  if (!verificationData) return null;

  return (
    <Accordion allowToggle w="full">
      <AccordionItem>
        <AccordionButton p={4}>
          <Flex direction="column" w="full">
            <Flex justifyContent="space-between">
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
                <AccordionIcon color="gray.600" ml="auto" boxSize={6} />
              </Flex>
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
          <Box
            p="16px 12px"
            border="1px solid"
            borderColor="gray.700"
            borderRadius="8px"
          >
            <Editor value={verificationData.source} />
          </Box>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
