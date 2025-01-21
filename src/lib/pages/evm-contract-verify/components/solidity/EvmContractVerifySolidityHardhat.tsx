import { Stack, Text } from "@chakra-ui/react";
import { useCelatoneApp, useEvmConfig } from "lib/app-provider";
import { TextReadOnly } from "lib/components/json/TextReadOnly";
import { useMemo } from "react";

import { Control, useWatch } from "react-hook-form";
import { EvmContractVerifyForm } from "../../types";
import { convertCosmosChainIdToEvmChainId } from "lib/utils/evm";

interface EvmContractVerifySolidityHardhatProps {
  control: Control<EvmContractVerifyForm>;
}

export const EvmContractVerifySolidityHardhat = ({
  control,
}: EvmContractVerifySolidityHardhatProps) => {
  const {
    chainConfig: { chainId },
  } = useCelatoneApp();
  const evm = useEvmConfig({ shouldRedirect: false });
  const jsonRpc = evm.enabled ? evm.jsonRpc : "<invalid_network>";

  const contractAddress = useWatch({ control, name: "contractAddress" });
  const evmChainId = convertCosmosChainIdToEvmChainId(chainId);

  // TODO: get verifier url from chain config
  const verifierUrl = "https://eth-sepolia.blockscout.com/api/";

  const step1Cmd = useMemo(() => {
    return `const config: HardhatUserConfig = {
  solidity: "v0.8.28", // replace with your solidity version
  networks: {
    '${chainId}': {
      url: '${jsonRpc}'
    },
  },
  etherscan: {
    apiKey: {
      '${chainId}': 'empty'
    },
    customChains: [
      {
        network: "${chainId}",
        chainId: ${evmChainId},
        urls: {
          apiURL: "${verifierUrl}",
        }
      }
    ]
  }
};`;
  }, [chainId, evmChainId, jsonRpc]);

  const step2Cmd = useMemo(() => {
    return `npx hardhat verify \\
  --network ${chainId} \\
  ${contractAddress || "<contract-address>"} \\
  <...constructorArgs>`;
  }, [chainId, contractAddress]);

  return (
    <Stack gap={12}>
      <Stack gap={4}>
        <Text>Step 1 - Update hardhat.config.ts</Text>
        <TextReadOnly text={step1Cmd} canCopy />
      </Stack>
      <Stack gap={4}>
        <Text>Step 2 - Run verification command</Text>
        <TextReadOnly text={step2Cmd} canCopy />
      </Stack>
    </Stack>
  );
};
