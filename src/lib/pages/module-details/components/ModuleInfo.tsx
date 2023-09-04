import { Flex, Heading, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { LabelText } from "lib/components/LabelText";

import { ModuleSourceCode } from "./ModuleSourceCode";

interface ModuleInfoProps {
  isVerified?: boolean;
}

export const ModuleInfo = ({ isVerified = false }: ModuleInfoProps) => {
  return (
    <Flex flexDirection="column" gap={4}>
      <Flex justifyContent="space-between" alignItems="center" w="full">
        <Heading as="h6" variant="h6" fontWeight={800}>
          Module Information
        </Heading>
        {isVerified && (
          <Flex alignItems="center" gap={1}>
            <CustomIcon name="check-circle-solid" color="success.main" />
            <Text variant="body2" color="text.dark">
              This module&#39;s verification is supported by its provided source
              code.
            </Text>
          </Flex>
        )}
      </Flex>
      {/* TODO data */}
      <Flex p={4} borderRadius={8} border="1px solid" borderColor="gray.700">
        <LabelText flex="1" label="Upgrade Policy">
          ARBITRARY
        </LabelText>
        <LabelText
          flex="1"
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
        <LabelText
          flex="1"
          label="Initial Published by"
          helperText1="(Account Address)"
        >
          <ExplorerLink
            type="user_address"
            value="cltn1...7tlju97"
            showCopyOnHover
            fixedHeight
          />
        </LabelText>
        <LabelText flex="1" label="Initial Published Transaction">
          <ExplorerLink
            type="tx_hash"
            value="7F8FD8...3A804"
            showCopyOnHover
            fixedHeight
          />
        </LabelText>
        <LabelText
          flex="1"
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
      <ModuleSourceCode />
    </Flex>
  );
};
