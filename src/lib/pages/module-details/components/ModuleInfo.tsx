import { Flex, Heading, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { LabelText } from "lib/components/LabelText";
import { Loading } from "lib/components/Loading";
import { ModuleSourceCode } from "lib/components/module";
import {
  useVerifyModule,
  type IndexedModule,
} from "lib/services/moduleService";
import type { HexAddr, Option } from "lib/types";

interface ModuleInfoProps {
  moduleData: IndexedModule;
}

export const ModuleInfo = ({ moduleData }: ModuleInfoProps) => {
  const { data: verificationData } = useVerifyModule({
    address: moduleData?.address as Option<HexAddr>,
    moduleName: moduleData?.moduleName,
  });
  if (!moduleData) return <Loading />;
  return (
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
      <Flex
        p={4}
        borderRadius={8}
        border="1px solid"
        borderColor="gray.700"
        sx={{ "& > div": { flex: 1 } }}
      >
        <LabelText label="Upgrade Policy">{moduleData.upgradePolicy}</LabelText>
        {/* TODO get block height */}
        <LabelText
          label="Initial Published Block Height"
          helperText1="formatUTC(createdTime)"
          helperText2="dateFromNow(createdTime)"
        >
          <ExplorerLink
            type="block_height"
            value="1234567"
            showCopyOnHover
            fixedHeight
          />
        </LabelText>
        <LabelText label="Initial Published by" helperText1="(Account Address)">
          <ExplorerLink
            type="user_address"
            value={moduleData.address}
            showCopyOnHover
            fixedHeight
          />
        </LabelText>
        {/* TODO get  Transaction or proposal */}
        <LabelText label="Initial Published Transaction">
          <ExplorerLink
            type="tx_hash"
            value="7F8FD8...3A804"
            showCopyOnHover
            fixedHeight
          />
        </LabelText>
        <LabelText
          label="Initial Published Proposal ID"
          helperText1="TODO Published DAO Module"
        >
          <ExplorerLink
            value="1234"
            showCopyOnHover
            fixedHeight
            type="proposal_id"
          />
        </LabelText>
      </Flex>
      <ModuleSourceCode sourceCode={verificationData?.source} />
    </Flex>
  );
};
