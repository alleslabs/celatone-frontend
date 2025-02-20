import type { HexAddr20, Option } from "lib/types";
import type { EvmVerifyInfo } from "lib/types";
import { Flex, HStack } from "@chakra-ui/react";
import type { TextProps } from "@chakra-ui/react";
import { Divider, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { formatUTC, getLicenseTypeLabel } from "lib/utils";
import { useMobile } from "lib/app-provider";

const baseTextStyle: TextProps = {
  color: "text.dark",
  variant: "body2",
  whiteSpace: "nowrap",
};

interface EvmVerifyRequestInfoProps {
  contractAddress: HexAddr20;
  evmVerifyInfo: Option<EvmVerifyInfo>;
}

export const EvmVerifyRequestInfo = ({
  contractAddress,
  evmVerifyInfo,
}: EvmVerifyRequestInfoProps) => {
  const isMobile = useMobile();

  // Verification not submitted
  if (!evmVerifyInfo)
    return (
      <>
        <HStack>
          <Text {...baseTextStyle}>Contract Address:</Text>
          <ExplorerLink
            type="evm_contract_address"
            value={contractAddress}
            openNewTab
            showCopyOnHover
            textFormat={isMobile ? "truncate" : "normal"}
          />
        </HStack>
        <Divider borderColor="gray.700" />
        <Text color="text.main" variant="body2">
          No verification was submitted.
        </Text>
      </>
    );

  return (
    <>
      <Flex direction="column" gap={{ base: 2, sm: 1 }}>
        <HStack>
          <Text {...baseTextStyle}>Contract Address:</Text>
          <ExplorerLink
            type="evm_contract_address"
            value={contractAddress}
            openNewTab
            showCopyOnHover
            textFormat={isMobile ? "truncate" : "normal"}
          />
        </HStack>
        <HStack>
          <Text {...baseTextStyle}>License Type:</Text>
          <Text color="text.main" variant="body2">
            {getLicenseTypeLabel(evmVerifyInfo.license)}
          </Text>
        </HStack>
      </Flex>
      <Divider borderColor="gray.700" />
      <Flex direction="column" gap={{ base: 2, sm: 1 }}>
        <HStack>
          <Text {...baseTextStyle}>Language:</Text>
          <Text color="text.main" variant="body2">
            {evmVerifyInfo.language}
          </Text>
        </HStack>
        <HStack>
          <Text {...baseTextStyle}>Compiler Version:</Text>
          <Text color="text.main" variant="body2">
            {evmVerifyInfo.compilerVersion}
          </Text>
        </HStack>
        <HStack>
          <Text {...baseTextStyle}>Submitted on:</Text>
          <Text color="text.main" variant="body2">
            {formatUTC(evmVerifyInfo.submittedTimestamp)}
          </Text>
        </HStack>
      </Flex>
    </>
  );
};
