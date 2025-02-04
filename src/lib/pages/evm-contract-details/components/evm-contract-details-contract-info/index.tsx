import { Flex, Stack } from "@chakra-ui/react";
import { EvmVerifySection } from "lib/components/evm-verify-section";
import { TypeSwitch } from "lib/components/TypeSwitch";
import { EvmVerifyInfo } from "lib/services/types";
import { HexAddr20, Option } from "lib/types";
import { useState } from "react";
import { EvmContractDetailsContractInfoTabs } from "../../types";
import { ContractAbi } from "./ContractAbi";
import { ContractByteCode, ContractByteCodeProps } from "./ContractByteCode";
import { ContractCompiler } from "./ContractCompiler";
import { ContractCode } from "./ContractCode";

interface EvmContractDetailsContractInfoProps extends ContractByteCodeProps {
  contractAddress: HexAddr20;
  evmVerifyInfo: Option<EvmVerifyInfo>;
}

export const EvmContractDetailsContractInfo = ({
  contractAddress,
  byteCode,
  deployedByteCode,
  evmVerifyInfo,
}: EvmContractDetailsContractInfoProps) => {
  const isVerified = evmVerifyInfo?.isVerified;
  const [currentTab, setCurrentTab] = useState(
    isVerified
      ? EvmContractDetailsContractInfoTabs.Code
      : EvmContractDetailsContractInfoTabs.ByteCode
  );

  return (
    <Stack gap={8}>
      <EvmVerifySection
        contractAddress={contractAddress}
        evmVerifyInfo={evmVerifyInfo}
      />
      {isVerified ? (
        <>
          <Flex>
            <TypeSwitch
              tabs={Object.values(EvmContractDetailsContractInfoTabs)}
              onTabChange={setCurrentTab}
              currentTab={currentTab}
            />
          </Flex>
          {currentTab === EvmContractDetailsContractInfoTabs.Code && (
            <ContractCode
              sourceFiles={evmVerifyInfo.sourceFiles}
              contractPath={evmVerifyInfo.contractPath ?? ""}
              constructorArguments={evmVerifyInfo.constructorArguments}
              abi={evmVerifyInfo.abi}
              libraries={evmVerifyInfo.libraries}
            />
          )}
          {currentTab === EvmContractDetailsContractInfoTabs.Compiler && (
            <ContractCompiler compilerSettings={evmVerifyInfo.settings} />
          )}
          {currentTab === EvmContractDetailsContractInfoTabs.Abi && (
            <ContractAbi abi={evmVerifyInfo.abi ?? []} />
          )}
          {currentTab === EvmContractDetailsContractInfoTabs.ByteCode && (
            <ContractByteCode
              byteCode={byteCode}
              deployedByteCode={deployedByteCode}
            />
          )}
        </>
      ) : (
        <ContractByteCode
          byteCode={byteCode}
          deployedByteCode={deployedByteCode}
        />
      )}
    </Stack>
  );
};
