import { Box, Flex, Heading, Switch, Text } from "@chakra-ui/react";
import { JsonFragment } from "ethers";
import { useInternalNavigate } from "lib/app-provider";
import { TypeSwitch } from "lib/components/TypeSwitch";
import { HexAddr20, Option } from "lib/types";
import { isUndefined } from "lodash";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { InteractTabsIndex, TabIndex } from "../../types";
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
  contractAbi: JsonFragment[];
  selectedType: InteractTabsIndex;
  selectedFn?: string;
  proxyTargetAbi?: JsonFragment[];
}

export const InteractEvmContract = ({
  contractAddress,
  contractAbi,
  selectedType,
  selectedFn,
  proxyTargetAbi,
}: InteractEvmContractProps) => {
  const navigate = useInternalNavigate();

  const interactType = selectedType.startsWith("read")
    ? InteractType.Read
    : InteractType.Write;
  const isAsProxy =
    !isUndefined(proxyTargetAbi) && selectedType.endsWith("proxy");

  const [initialSelectedFn, setInitialSelectedFn] = useState<Option<string>>();

  const { read: abiRead, write: abiWrite } = categorizeAbi(contractAbi);
  const { read: abiReadProxy, write: abiWriteProxy } = categorizeAbi(
    proxyTargetAbi ?? []
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
        <TypeSwitch
          tabs={Object.values(InteractType)}
          currentTab={interactType}
          onTabChange={handleSetInteractType}
        />
      </Flex>
      {!isUndefined(proxyTargetAbi) && (
        <Flex gap={2} align="center" mb={8}>
          <Switch isChecked={isAsProxy} onChange={handleSetIsAsProxy} />
          <Text variant="body2">Read/Write as Proxy Contract</Text>
        </Flex>
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
          ...(!isUndefined(proxyTargetAbi) && {
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
        {!isUndefined(proxyTargetAbi) && (
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
