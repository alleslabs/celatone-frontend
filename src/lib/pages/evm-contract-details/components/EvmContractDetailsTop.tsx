import { Flex, Heading, Stack, Text } from "@chakra-ui/react";

import { useConvertHexAddress } from "lib/app-provider";
import { CopyLink } from "lib/components/CopyLink";
import { CustomIcon } from "lib/components/icon";
import { TotalValue } from "lib/components/TotalValue";
import type { HexAddr20 } from "lib/types";

interface EvmContractDetailsTopProps {
  contractAddress: HexAddr20;
}

export const EvmContractDetailsTop = ({
  contractAddress,
}: EvmContractDetailsTopProps) => {
  const { convertHexWalletAddress } = useConvertHexAddress();

  return (
    <Flex justifyContent="space-between">
      <Stack gap={4}>
        <Flex gap={2} align="center">
          <CustomIcon
            name="contract-address"
            boxSize={5}
            color="primary.main"
          />
          <Heading as="h5" variant="h5" wordBreak="break-word">
            Contract Details
          </Heading>
        </Flex>
        <Flex gap={2}>
          <Text variant="body2" fontWeight={500} color="text.dark">
            Contract Address:
          </Text>
          <CopyLink
            value={contractAddress}
            amptrackSection="contract_top"
            type="contract_address"
          />
        </Flex>
      </Stack>
      <TotalValue
        address={convertHexWalletAddress(contractAddress)}
        label="Total Value"
        isCompact
      />
    </Flex>
  );
};
