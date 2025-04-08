import type { EvmVerifyInfo, HexAddr20, Option } from "lib/types";
import type { ChangeEvent } from "react";

import { Box, Flex, Heading, Stack, Switch, Text } from "@chakra-ui/react";
import { useInternalNavigate, useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TypeSwitch } from "lib/components/TypeSwitch";
import { isUndefined } from "lodash";
import { useCallback, useEffect, useState } from "react";

import type { InteractTabsIndex } from "../../types";

import { TabIndex } from "../../types";
import { getInteractTabsIndex } from "../../utils";
import { AbiRead } from "./abi-read";
import { AbiWrite } from "./abi-write";
import { categorizeAbi } from "./utils";

export const EVM_CONTRACT_INTERACT_PATH_NAME =
  "/evm-contracts/[contractAddress]/[tab]";

enum InteractType {
  Read = "read",
  Write = "write",
}

interface InteractEvmContractProps {
  contractAddress: HexAddr20;
  evmVerifyInfo: Option<EvmVerifyInfo>;
  proxyTargetEvmVerifyInfo: Option<EvmVerifyInfo>;
  selectedType: InteractTabsIndex;
  selectedFn?: string;
}

export const InteractEvmContract = ({
  contractAddress,
  evmVerifyInfo,
  proxyTargetEvmVerifyInfo,
  selectedType,
  selectedFn,
}: InteractEvmContractProps) => {
  const isMobile = useMobile();
  const navigate = useInternalNavigate();

  const interactType =
    isMobile || selectedType.startsWith("read")
      ? InteractType.Read
      : InteractType.Write;
  const isAsProxy =
    !evmVerifyInfo?.isVerified ||
    (!!proxyTargetEvmVerifyInfo?.isVerified && selectedType.endsWith("proxy"));

  const [initialSelectedFn, setInitialSelectedFn] = useState<Option<string>>();

  const { read: abiRead, write: abiWrite } = categorizeAbi(
    evmVerifyInfo?.abi ?? []
  );
  const { read: abiReadProxy, write: abiWriteProxy } = categorizeAbi(
    proxyTargetEvmVerifyInfo?.abi ?? []
  );

  // ------------------------------------------//
  // ----------------CALLBACKS-----------------//
  // ------------------------------------------//
  const handleSetInteractType = useCallback(
    (newType: InteractType) =>
      navigate({
        pathname: EVM_CONTRACT_INTERACT_PATH_NAME,
        query: {
          contractAddress,
          tab: TabIndex.ReadWrite,
          selectedType: getInteractTabsIndex(
            newType === InteractType.Read,
            isAsProxy
          ),
        },
        options: {
          shallow: true,
        },
      }),
    [contractAddress, isAsProxy, navigate]
  );

  const handleSetIsAsProxy = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      navigate({
        pathname: EVM_CONTRACT_INTERACT_PATH_NAME,
        query: {
          contractAddress,
          tab: TabIndex.ReadWrite,
          selectedType: getInteractTabsIndex(
            interactType === InteractType.Read,
            e.target.checked
          ),
        },
        options: {
          shallow: true,
        },
      }),
    [contractAddress, interactType, navigate]
  );

  useEffect(() => {
    setInitialSelectedFn(selectedFn);
  }, [selectedFn]);

  return (
    <Box>
      <Flex gap={2} align="center" mb={8}>
        <Heading variant="h6">Contract interactions</Heading>
        {!isMobile && (
          <TypeSwitch
            currentTab={interactType}
            tabs={Object.values(InteractType)}
            onTabChange={handleSetInteractType}
          />
        )}
      </Flex>
      {!!proxyTargetEvmVerifyInfo?.isVerified && (
        <Stack gap={1} mb={8}>
          <Flex align="center" gap={2}>
            <Switch
              isChecked={isAsProxy}
              isDisabled={!evmVerifyInfo?.isVerified}
              onChange={handleSetIsAsProxy}
            />
            <Text variant="body2">Read/Write as Proxy Contract</Text>
          </Flex>
          <Flex gap={2}>
            <Text color="text.dark" variant="body2">
              Implementation Address:
            </Text>
            <ExplorerLink
              showCopyOnHover
              textFormat={isMobile ? "truncate" : "normal"}
              type="evm_contract_address"
              value={proxyTargetEvmVerifyInfo.address}
            />
          </Flex>
        </Stack>
      )}
      <Box
        sx={{
          "& .read": {
            display:
              interactType === InteractType.Read && !isAsProxy
                ? "block"
                : "none",
          },
          "& .write": {
            display:
              interactType === InteractType.Write && !isAsProxy
                ? "block"
                : "none",
          },
          ...(!isUndefined(proxyTargetEvmVerifyInfo) && {
            "& .read-proxy": {
              display:
                interactType === InteractType.Read && isAsProxy
                  ? "block"
                  : "none",
            },
            "& .write-proxy": {
              display:
                interactType === InteractType.Write && isAsProxy
                  ? "block"
                  : "none",
            },
          }),
        }}
      >
        <div className="read">
          <AbiRead
            abiRead={abiRead}
            contractAddress={contractAddress}
            selectedFn={initialSelectedFn}
          />
        </div>
        <div className="write">
          <AbiWrite
            abiWrite={abiWrite}
            contractAddress={contractAddress}
            selectedFn={initialSelectedFn}
          />
        </div>
        {!isUndefined(proxyTargetEvmVerifyInfo) && (
          <>
            <div className="read-proxy">
              <AbiRead
                abiRead={abiReadProxy}
                contractAddress={contractAddress}
                selectedFn={initialSelectedFn}
              />
            </div>
            <div className="write-proxy">
              <AbiWrite
                abiWrite={abiWriteProxy}
                contractAddress={contractAddress}
                selectedFn={initialSelectedFn}
              />
            </div>
          </>
        )}
      </Box>
    </Box>
  );
};
