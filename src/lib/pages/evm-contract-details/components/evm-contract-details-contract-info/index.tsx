import type { EvmVerifyInfo, HexAddr20, Option } from "lib/types";

import { Flex, Stack } from "@chakra-ui/react";
import { EvmVerifySection } from "lib/components/evm-verify-section";
import { TypeSwitch } from "lib/components/TypeSwitch";
import { useState } from "react";

import type { ContractByteCodeProps } from "./ContractByteCode";

import { EvmContractDetailsContractInfoTabs } from "../../types";
import { ContractAbi } from "./ContractAbi";
import { ContractByteCode } from "./ContractByteCode";
import { ContractCode } from "./ContractCode";
import { ContractCompiler } from "./ContractCompiler";

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
      {!isVerified && (
        <EvmVerifySection
          contractAddress={contractAddress}
          evmVerifyInfo={evmVerifyInfo}
        />
      )}
      {isVerified ? (
        <>
          <Flex>
            <TypeSwitch
              currentTab={currentTab}
              tabs={Object.values(EvmContractDetailsContractInfoTabs)}
              onTabChange={setCurrentTab}
            />
          </Flex>
          {currentTab === EvmContractDetailsContractInfoTabs.Code && (
            <ContractCode
              abi={evmVerifyInfo.abi}
              constructorArguments={evmVerifyInfo.constructorArguments}
              contractPath={evmVerifyInfo.contractPath ?? ""}
              libraries={evmVerifyInfo.libraries}
              sourceFiles={evmVerifyInfo.sourceFiles}
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
