import { Stack, Text } from "@chakra-ui/react";
import { useCelatoneApp, useEvmConfig } from "lib/app-provider";
import { TextReadOnly } from "lib/components/json/TextReadOnly";
import { useMemo } from "react";

import { Control, useWatch } from "react-hook-form";
import { CELATONE_VERIFICATION_API } from "env";
import { EvmContractVerifyForm } from "lib/services/types";

interface EvmContractVerifySolidityFoundryProps {
  control: Control<EvmContractVerifyForm>;
}

export const EvmContractVerifySolidityFoundry = ({
  control,
}: EvmContractVerifySolidityFoundryProps) => {
  const { currentChainId } = useCelatoneApp();
  const evm = useEvmConfig({ shouldRedirect: false });
  const jsonRpc = evm.enabled ? evm.jsonRpc : "<invalid_network>";

  const contractAddress = useWatch({ control, name: "contractAddress" });

  const cmd = useMemo(() => {
    const verifierUrl = `${CELATONE_VERIFICATION_API}/evm/verification/solidity/external/${currentChainId}`;

    return `forge verify-contract \\
  --rpc-url ${jsonRpc} \\
  --verifier custom \\
  --verifier-url ${verifierUrl} \\
  --constructor-args <constructor-args> \\
  ${contractAddress || "<contract-address>"} \\
  <contractFile>:<contractName>`;
  }, [currentChainId, jsonRpc, contractAddress]);

  return (
    <Stack gap={4}>
      <Text>Foundry</Text>
      <TextReadOnly text={cmd} canCopy />
    </Stack>
  );
};
