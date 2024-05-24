import { Flex, Heading, Text } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
import { ModuleSourceCode } from "lib/components/module";
import type { ModuleVerificationInternal } from "lib/services/types";
import type {
  HexAddr,
  Nullable,
  Option,
  Proposal,
  UpgradePolicy,
} from "lib/types";

import { ModuleInfoBody } from "./ModuleInfoBody";

export interface ModuleInfoProps {
  vmAddress: HexAddr;
  upgradePolicy: UpgradePolicy;
  transaction: Nullable<string>;
  proposal: Nullable<Pick<Proposal, "id" | "title">>;
  isRepublished: boolean;
  blockHeight: number;
  blockTimestamp: Date;
  verificationData: Option<Nullable<ModuleVerificationInternal>>;
}

export const ModuleInfo = ({
  vmAddress,
  upgradePolicy,
  transaction,
  proposal,
  isRepublished,
  blockHeight,
  blockTimestamp,
  verificationData,
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
    <ModuleInfoBody
      vmAddress={vmAddress}
      upgradePolicy={upgradePolicy}
      transaction={transaction}
      proposal={proposal}
      isRepublished={isRepublished}
      blockHeight={blockHeight}
      blockTimestamp={blockTimestamp}
    />
    <ModuleSourceCode sourceCode={verificationData?.source} />
  </Flex>
);
