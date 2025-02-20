import { Heading, HStack, Stack, Text } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { EvmVerifyInfo, HexAddr20, Option } from "lib/types";

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
      <HStack spacing={2} alignItems="center">
        <Text variant="body2" color="text.dark">
          Implementation Address:
        </Text>
        <ExplorerLink
          type="evm_contract_address"
          value={proxyTargetAddressHex}
          textFormat={isMobile ? "truncate" : "normal"}
          showCopyOnHover
        />
        {proxyTargetEvmVerifyInfo?.isVerified && (
          <CustomIcon
            name="verification-solid"
            boxSize={4}
            color="secondary.main"
          />
        )}
      </HStack>
    </Stack>
  );
};
