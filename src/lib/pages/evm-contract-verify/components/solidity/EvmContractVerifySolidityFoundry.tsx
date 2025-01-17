import { Stack, Text } from "@chakra-ui/react";
import { useCelatoneApp } from "lib/app-provider";
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
  const {
    chainConfig: { rpc },
  } = useCelatoneApp();

  const contractAddress = useWatch({ control, name: "contractAddress" });

  // TODO: get verifier url from chain config
  const verifierUrl = "https://eth-sepolia.blockscout.com/api/";

  const cmd = useMemo(() => {
    return `forge verify-contract \\
--rpc-url ${rpc} \\
--verifier custom \\
--verifier-url ${verifierUrl} \\
${contractAddress} \\
[contractFile]:[contractName]`;
  }, [rpc, contractAddress]);

  return (
    <Stack gap={4}>
      <Text>Foundry</Text>
      <TextReadOnly text={cmd} canCopy />
    </Stack>
  );
};
