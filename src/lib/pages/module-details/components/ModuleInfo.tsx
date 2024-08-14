import { Flex, Heading, Text } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
import { ModuleSourceCode } from "lib/components/module";
import type { MoveVerifyInfoResponse } from "lib/services/types";
import type {
  IndexedModule,
  ModulePublishInfo,
  Nullish,
  Option,
} from "lib/types";

import { ModuleInfoBody } from "./ModuleInfoBody";

export interface ModuleInfoProps {
  indexedModule: IndexedModule;
  modulePublishInfo: Option<ModulePublishInfo>;
  verificationData: Nullish<MoveVerifyInfoResponse>;
}

export const ModuleInfo = ({ verificationData, ...props }: ModuleInfoProps) => (
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
    <ModuleInfoBody {...props} />
    <ModuleSourceCode sourceCode={verificationData?.source} />
  </Flex>
);
