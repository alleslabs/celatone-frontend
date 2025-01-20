import { Stack, Text } from "@chakra-ui/react";
import { useEvmConfig } from "lib/app-provider";
import { TextReadOnly } from "lib/components/json/TextReadOnly";
import { useMemo } from "react";

import { Control, useWatch } from "react-hook-form";
import { EvmContractVerifyForm } from "../../types";

interface EvmContractVerifySolidityFoundryProps {
  control: Control<EvmContractVerifyForm>;
}

export const EvmContractVerifySolidityFoundry = ({
  control,
}: EvmContractVerifySolidityFoundryProps) => {
  const evm = useEvmConfig({ shouldRedirect: false });
  const jsonRpc = evm.enabled ? evm.jsonRpc : "<invalid_network>";

  const contractAddress = useWatch({ control, name: "contractAddress" });

  // TODO: get verifier url from chain config
  const verifierUrl = "https://eth-sepolia.blockscout.com/api/";

  const cmd = useMemo(() => {
    return `forge verify-contract \\
  --rpc-url ${jsonRpc} \\
  --verifier custom \\
  --verifier-url ${verifierUrl} \\
  --constructor-args <constructor-args> \\
  ${contractAddress || "<contract-address>"} \\
  [contractFile]:[contractName]`;
  }, [jsonRpc, contractAddress]);

  return (
    <Stack gap={4}>
      <Text>Foundry</Text>
      <TextReadOnly text={cmd} canCopy />
    </Stack>
  );
};
