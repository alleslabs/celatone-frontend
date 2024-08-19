import { Flex, Heading } from "@chakra-ui/react";

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
    <Heading as="h6" variant="h6" fontWeight={600}>
      Module Information
    </Heading>
    <ModuleInfoBody {...props} />
    <ModuleSourceCode sourceCode={verificationData?.source} />
  </Flex>
);
