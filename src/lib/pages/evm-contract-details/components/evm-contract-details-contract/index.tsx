import { Flex, Stack } from "@chakra-ui/react";
import { NotVerifiedDetails } from "lib/components/evm-verify-section";
import { TypeSwitch } from "lib/components/TypeSwitch";
import { EvmVerifyInfo } from "lib/services/types";
import { HexAddr20, Option } from "lib/types";
import { useState } from "react";
import { EvmContractDetailsContractTabs } from "../../types";
import { ContractAbi } from "./ContractAbi";
import { ContractByteCode, ContractByteCodeProps } from "./ContractByteCode";
import { ContractCompiler } from "./ContractCompiler";
import { ContractCode } from "./ContractCode";

interface EvmContractDetailsContractProps extends ContractByteCodeProps {
  contractAddress: HexAddr20;
  evmVerifyInfo: Option<EvmVerifyInfo>;
}

export const EvmContractDetailsContract = ({
  contractAddress,
  byteCode,
  deployedByteCode,
  evmVerifyInfo,
}: EvmContractDetailsContractProps) => {
  const [currentTab, setCurrentTab] = useState(
    evmVerifyInfo
      ? EvmContractDetailsContractTabs.Code
      : EvmContractDetailsContractTabs.ByteCode
  );

  return (
    <Stack gap={8}>
      {/* // TODO: Support all status */}
      <NotVerifiedDetails contractAddress={contractAddress} />
      {evmVerifyInfo && (
        <>
          <Flex>
            <TypeSwitch
              tabs={Object.values(EvmContractDetailsContractTabs)}
              onTabChange={setCurrentTab}
              currentTab={currentTab}
            />
          </Flex>
          {currentTab === EvmContractDetailsContractTabs.Code && (
            <ContractCode
              sourceFiles={evmVerifyInfo.sourceFiles}
              contractPath={evmVerifyInfo.contractPath}
              constructorArguments={evmVerifyInfo.constructorArguments}
              abi={evmVerifyInfo.abi}
            />
          )}
          {currentTab === EvmContractDetailsContractTabs.Compiler && (
            <ContractCompiler compilerSettings={evmVerifyInfo.settings} />
          )}
          {currentTab === EvmContractDetailsContractTabs.Abi && (
            <ContractAbi abi={evmVerifyInfo.abi} />
          )}
        </>
      )}
      {currentTab === EvmContractDetailsContractTabs.ByteCode && (
        <ContractByteCode
          byteCode={byteCode}
          deployedByteCode={deployedByteCode}
        />
      )}
    </Stack>
  );
};
