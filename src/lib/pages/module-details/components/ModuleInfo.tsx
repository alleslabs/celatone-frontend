import { Flex, Heading, Text } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
import { ModuleSourceCode } from "lib/components/module";
import type { ModuleVerificationInternal } from "lib/services/types";
import type { ModuleData, Nullable, Option } from "lib/types";

import { ModuleInfoBody } from "./ModuleInfoBody";

export interface ModuleInfoProps {
  verificationData: Option<Nullable<ModuleVerificationInternal>>;
  moduleData: Partial<ModuleData>;
}

export const ModuleInfo = ({
  verificationData,
  moduleData,
}: ModuleInfoProps) => (
  <Flex flexDirection="column" gap={4}>
    <Flex justifyContent="space-between" alignItems="center" w="full">
      <Heading as="h6" variant="h6" fontWeight={600}>
        Module Information
      </Heading>
      {verificationData?.source && (
        <Flex alignItems="center" gap={1}>
          <CustomIcon name="check-circle-solid" color="success.main" />
          <Text variant="body2" color="text.dark">
            This module&#39;s verification is supported by its provided source
            code.
          </Text>
        </Flex>
      )}
    </Flex>
    <ModuleInfoBody moduleData={moduleData} />
    <ModuleSourceCode sourceCode={verificationData?.source} />
  </Flex>
);
