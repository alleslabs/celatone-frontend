import { Flex, Heading } from "@chakra-ui/react";

import { ModuleSourceCode } from "lib/components/module";
import type { MoveVerifyInfoResponse } from "lib/services/types";
import type {
  IndexedModule,
  ModulePublishInfo,
  MoveVerifyStatus,
  Nullish,
  Option,
} from "lib/types";

import { ModuleInfoBody } from "./ModuleInfoBody";

export interface ModuleInfoProps {
  indexedModule: IndexedModule;
  modulePublishInfo: Option<ModulePublishInfo>;
  verificationData: Nullish<MoveVerifyInfoResponse>;
  moveVerifyStatus: MoveVerifyStatus;
}

export const ModuleInfo = ({
  verificationData,
  moveVerifyStatus,
  ...props
}: ModuleInfoProps) => (
  <Flex flexDirection="column" gap={4}>
    <Heading as="h6" variant="h6" fontWeight={600}>
      Module Information
    </Heading>
    <ModuleInfoBody {...props} />
    <ModuleSourceCode
      sourceCode={verificationData?.source}
      moveVerifyStatus={moveVerifyStatus}
    />
  </Flex>
);
