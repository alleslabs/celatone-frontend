import { Flex, Stack } from "@chakra-ui/react";
import { NotVerifiedDetails } from "lib/components/evm-verify-section";
import { HexAddr20 } from "lib/types";
import { EvmContractDetailsContractTabs } from "../../types";
import { useState } from "react";
import { TypeSwitch } from "lib/components/TypeSwitch";
import { ContractByteCode, ContractByteCodeProps } from "./ContractByteCode";
import { ContractAbi } from "./ContractAbi";
import { useEvmVerifyInfo } from "lib/services/verification/evm";
import { ErrorFetching } from "lib/components/state";

interface EvmContractDetailsContractProps extends ContractByteCodeProps {
  contractAddress: HexAddr20;
}

export const EvmContractDetailsContract = ({
  contractAddress,
  code,
  deployedCode,
}: EvmContractDetailsContractProps) => {
  const { data } = useEvmVerifyInfo(contractAddress);

  const [currentTab, setCurrentTab] = useState(
    EvmContractDetailsContractTabs.Abi
  );

  if (!data) return <ErrorFetching dataName="evm contract information" />;

  return (
    <Stack gap={8}>
      {/* // TODO: Support all status */}
      <NotVerifiedDetails contractAddress={contractAddress} />
      <Flex>
        <TypeSwitch
          tabs={Object.values(EvmContractDetailsContractTabs)}
          onTabChange={setCurrentTab}
          currentTab={currentTab}
        />
      </Flex>
      {currentTab === EvmContractDetailsContractTabs.Abi && (
        <ContractAbi abi={data.abi} />
      )}
      {currentTab === EvmContractDetailsContractTabs.ByteCode && (
        <ContractByteCode code={code} deployedCode={deployedCode} />
      )}
    </Stack>
  );
};
