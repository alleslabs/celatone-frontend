import type { EvmVerifyInfo, HexAddr20, Option } from "lib/types";

import { Heading, HStack, Stack, Text } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";

interface OverviewProxyTargetInfoProps {
  proxyTargetAddressHex: HexAddr20;
  proxyTargetEvmVerifyInfo: Option<EvmVerifyInfo>;
}

export const OverviewProxyTargetInfo = ({
  proxyTargetAddressHex,
  proxyTargetEvmVerifyInfo,
}: OverviewProxyTargetInfoProps) => {
  const isMobile = useMobile();

  return (
    <Stack spacing={1}>
      <Heading as="h6" variant="h6">
        Proxy target contract
      </Heading>
      <HStack alignItems="center" spacing={2}>
        <Text color="text.dark" variant="body2">
          Implementation Address:
        </Text>
        <ExplorerLink
          showCopyOnHover
          textFormat={isMobile ? "truncate" : "normal"}
          type="evm_contract_address"
          value={proxyTargetAddressHex}
        />
        {proxyTargetEvmVerifyInfo?.isVerified && (
          <CustomIcon
            boxSize={4}
            color="secondary.main"
            name="verification-solid"
          />
        )}
      </HStack>
    </Stack>
  );
};
