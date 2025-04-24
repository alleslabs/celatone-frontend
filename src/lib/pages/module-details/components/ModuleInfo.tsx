import type { MoveVerifyInfoResponse } from "lib/services/types";
import type {
  IndexedModule,
  ModulePublishInfo,
  MoveVerifyStatus,
  Nullish,
  Option,
} from "lib/types";

import { Flex, Heading } from "@chakra-ui/react";
import { ModuleSourceCode } from "lib/components/module";

import { ModuleInfoBody } from "./ModuleInfoBody";

export interface ModuleInfoProps {
  indexedModule: IndexedModule;
  modulePublishInfo: Option<ModulePublishInfo>;
  moveVerifyStatus: MoveVerifyStatus;
  verificationData: Nullish<MoveVerifyInfoResponse>;
}

export const ModuleInfo = ({
  moveVerifyStatus,
  verificationData,
  ...props
}: ModuleInfoProps) => (
  <Flex flexDirection="column" gap={4}>
    <Heading as="h6" fontWeight={600} variant="h6">
      Module information
    </Heading>
    <ModuleInfoBody {...props} />
    <ModuleSourceCode
      moveVerifyStatus={moveVerifyStatus}
      verificationData={verificationData}
    />
  </Flex>
);
