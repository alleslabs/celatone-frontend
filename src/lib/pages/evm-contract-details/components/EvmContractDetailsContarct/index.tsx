import { Flex, Stack } from "@chakra-ui/react";
import { NotVerifiedDetails } from "lib/components/evm-verify-section";
import { HexAddr20 } from "lib/types";
import { EvmContractDetailsContractTabs } from "../../types";
import { useEffect, useState } from "react";
import { TypeSwitch } from "lib/components/TypeSwitch";
import { ContractByteCode, ContractByteCodeProps } from "./ContractByteCode";
import { ContractAbi } from "./ContractAbi";
import { useEvmVerifyInfo } from "lib/services/verification/evm";
import { Loading } from "lib/components/Loading";
import { ContractCompiler } from "./ContractCompiler";

interface EvmContractDetailsContractProps extends ContractByteCodeProps {
  contractAddress: HexAddr20;
}

export const EvmContractDetailsContract = ({
  contractAddress,
  code,
  deployedCode,
}: EvmContractDetailsContractProps) => {
  const { data, isLoading } = useEvmVerifyInfo(contractAddress);

  const [currentTab, setCurrentTab] = useState(
    EvmContractDetailsContractTabs.Code
  );

  useEffect(() => {
    if (isLoading || data) return;
    setCurrentTab(EvmContractDetailsContractTabs.ByteCode);
  }, [isLoading, data]);

  if (isLoading) return <Loading />;

  return (
    <Stack gap={8}>
      {/* // TODO: Support all status */}
      <NotVerifiedDetails contractAddress={contractAddress} />
      {data && (
        <>
          <Flex>
            <TypeSwitch
              tabs={Object.values(EvmContractDetailsContractTabs)}
              onTabChange={setCurrentTab}
              currentTab={currentTab}
            />
          </Flex>
          {currentTab === EvmContractDetailsContractTabs.Compiler && (
            <ContractCompiler compilerSettings={data.settings} />
          )}
          {currentTab === EvmContractDetailsContractTabs.Abi && (
            <ContractAbi abi={data.abi} />
          )}
        </>
      )}
      {currentTab === EvmContractDetailsContractTabs.ByteCode && (
        <ContractByteCode code={code} deployedCode={deployedCode} />
      )}
    </Stack>
  );
};
