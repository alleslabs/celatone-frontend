import type { EvmContractVerifyForm } from "lib/types";
import type { Control } from "react-hook-form";

import { Stack, Text } from "@chakra-ui/react";
import { CELATONE_VERIFICATION_API } from "env";
import { useCelatoneApp, useEvmConfig } from "lib/app-provider";
import { TextReadOnly } from "lib/components/json/TextReadOnly";
import { convertCosmosChainIdToEvmChainId } from "lib/utils/evm";
import { useMemo } from "react";
import { useWatch } from "react-hook-form";

interface EvmContractVerifySolidityHardhatProps {
  control: Control<EvmContractVerifyForm>;
}

export const EvmContractVerifySolidityHardhat = ({
  control,
}: EvmContractVerifySolidityHardhatProps) => {
  const { currentChainId } = useCelatoneApp();
  const evm = useEvmConfig({ shouldRedirect: false });
  const jsonRpc = evm.enabled ? evm.jsonRpc : "<invalid_network>";

  const contractAddress = useWatch({ control, name: "contractAddress" });
  const evmChainId = convertCosmosChainIdToEvmChainId(currentChainId);

  const step1Cmd = useMemo(() => {
    const verifierUrl = `${CELATONE_VERIFICATION_API}/evm/verification/solidity/external/${currentChainId}`;

    return `const config: HardhatUserConfig = {
  solidity: "v0.8.28", // replace with your solidity version
  networks: {
    '${currentChainId}': {
      url: '${jsonRpc}',
    },
  },
  etherscan: {
    apiKey: {
      '${currentChainId}': 'empty'
    },
    customChains: [
      {
        network: "${currentChainId}",
        chainId: ${evmChainId},
        urls: {
          apiURL: "${verifierUrl}",
          browserURL: "",
        }
      }
    ]
  }
};`;
  }, [currentChainId, evmChainId, jsonRpc]);

  const step2Cmd = useMemo(() => {
    return `npx hardhat verify \\
  --network ${currentChainId} \\
  ${contractAddress || "<contract-address>"} \\
  <...constructorArgs>`;
  }, [currentChainId, contractAddress]);

  return (
    <Stack gap={12}>
      <Stack gap={4}>
        <Text>Step 1 - Update hardhat.config.ts</Text>
        <TextReadOnly canCopy text={step1Cmd} />
      </Stack>
      <Stack gap={4}>
        <Text>Step 2 - Run verification command</Text>
        <TextReadOnly canCopy text={step2Cmd} />
      </Stack>
    </Stack>
  );
};
