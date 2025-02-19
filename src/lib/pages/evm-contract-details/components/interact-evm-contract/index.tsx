import { Box, Flex, Heading, Stack, Switch, Text } from "@chakra-ui/react";
import { JsonFragment } from "ethers";
import { useInternalNavigate, useMobile } from "lib/app-provider";
import { TypeSwitch } from "lib/components/TypeSwitch";
import { EvmVerifyInfo, HexAddr20, Option } from "lib/types";
import { isUndefined } from "lodash";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { InteractTabsIndex, TabIndex } from "../../types";
import { getInteractTabsIndex } from "../../utils";
import { AbiRead } from "./abi-read";
import { AbiWrite } from "./abi-write";
import { categorizeAbi } from "./utils";
import { ExplorerLink } from "lib/components/ExplorerLink";

export const EVM_CONTRACT_INTERACT_PATH_NAME =
  "/evm-contracts/[contractAddress]/[tab]";

enum InteractType {
  Read = "read",
  Write = "write",
}

interface InteractEvmContractProps {
  contractAddress: HexAddr20;
  contractAbi: JsonFragment[];
  selectedType: InteractTabsIndex;
  selectedFn?: string;
  proxyTargetEvmVerifyInfo: Option<EvmVerifyInfo>;
}

export const InteractEvmContract = ({
  contractAddress,
  contractAbi,
  selectedType,
  selectedFn,
  proxyTargetEvmVerifyInfo,
}: InteractEvmContractProps) => {
  const isMobile = useMobile();
  const navigate = useInternalNavigate();

  const interactType =
    isMobile || selectedType.startsWith("read")
      ? InteractType.Read
      : InteractType.Write;
  const isAsProxy =
    !isUndefined(proxyTargetEvmVerifyInfo?.abi) &&
    selectedType.endsWith("proxy");

  const [initialSelectedFn, setInitialSelectedFn] = useState<Option<string>>();

  const { read: abiRead, write: abiWrite } = categorizeAbi(contractAbi);
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
        <Heading variant="h6">Contract Interactions</Heading>
        {!isMobile && (
          <TypeSwitch
            tabs={Object.values(InteractType)}
            currentTab={interactType}
            onTabChange={handleSetInteractType}
          />
        )}
      </Flex>
      {!isUndefined(proxyTargetEvmVerifyInfo) && (
        <Stack gap={1} mb={8}>
          <Flex gap={2} align="center">
            <Switch isChecked={isAsProxy} onChange={handleSetIsAsProxy} />
            <Text variant="body2">Read/Write as Proxy Contract</Text>
          </Flex>
          <Flex gap={2}>
            <Text variant="body2" color="text.dark">
              Implementation Address:
            </Text>
            <ExplorerLink
              type="evm_contract_address"
              value={proxyTargetEvmVerifyInfo.address}
              textFormat={isMobile ? "truncate" : "normal"}
              showCopyOnHover
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
            contractAddress={contractAddress}
            abiRead={abiRead}
            selectedFn={initialSelectedFn}
          />
        </div>
        <div className="write">
          <AbiWrite
            contractAddress={contractAddress}
            abiWrite={abiWrite}
            selectedFn={initialSelectedFn}
          />
        </div>
        {!isUndefined(proxyTargetEvmVerifyInfo) && (
          <>
            <div className="read-proxy">
              <AbiRead
                contractAddress={contractAddress}
                abiRead={abiReadProxy}
                selectedFn={initialSelectedFn}
              />
            </div>
            <div className="write-proxy">
              <AbiWrite
                contractAddress={contractAddress}
                abiWrite={abiWriteProxy}
                selectedFn={initialSelectedFn}
              />
            </div>
          </>
        )}
      </Box>
    </Box>
  );
};
