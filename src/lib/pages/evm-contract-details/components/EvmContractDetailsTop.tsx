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
    <Flex
      gap={4}
      flexDirection={{ base: "column", md: "row" }}
      justifyContent="space-between"
    >
      <Stack gap={4}>
        <Flex align="center" gap={2}>
          <CustomIcon
            name="contract-address"
            boxSize={5}
            color="primary.main"
          />
          <Heading as="h5" variant="h5" wordBreak="break-word">
            Contract Details
          </Heading>
        </Flex>
        <Flex columnGap={2} flexDirection={{ base: "column", md: "row" }}>
          <Text variant="body2" color="text.dark" fontWeight={500}>
            Contract Address:
          </Text>
          <CopyLink
            type="contract_address"
            value={contractAddress}
            amptrackSection="contract_top"
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
