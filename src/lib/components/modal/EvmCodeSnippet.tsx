import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-one_dark";
import "ace-builds/src-noconflict/theme-pastel_on_dark";

import type { JsonFragment } from "ethers";
import type { HexAddr20, JsonDataType, Nullable } from "lib/types";

import {
  Box,
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useCelatoneApp } from "lib/app-provider/contexts";
import { useEvmConfig } from "lib/app-provider/hooks";
import { CustomTab } from "lib/components/CustomTab";
import { formatEvmFunctionInputsArgs } from "lib/utils";
import { useMemo } from "react";
import AceEditor from "react-ace";

import { CopyButton } from "../copy";
import { CustomIcon } from "../icon";

type CodeSnippetType = "read" | "write";

interface CodeSnippet {
  name: string;
  mode: string;
  snippet: string;
}

interface EvmCodeSnippetProps {
  type: CodeSnippetType;
  contractAddress: HexAddr20;
  abiSection: JsonFragment;
  inputs?: JsonDataType[];
}

const EvmCodeSnippet = ({
  contractAddress,
  abiSection,
  type,
  inputs,
}: EvmCodeSnippetProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { theme } = useCelatoneApp();
  const evm = useEvmConfig({ shouldRedirect: false });

  const codeSnippets: Nullable<Record<CodeSnippetType, CodeSnippet[]>> =
    useMemo(() => {
      if (!evm.enabled || !evm.jsonRpc || !abiSection.name) return null;

      const functionName = `"${abiSection.name}"`;
      const inputsString = formatEvmFunctionInputsArgs(inputs);

      return {
        read: [
          {
            name: "Ethers",
            mode: "javascript",
            snippet: `import { ethers, Interface } from "ethers";

const provider = new ethers.JsonRpcProvider("${evm.jsonRpc}");
const iface = new Interface([${JSON.stringify(abiSection)}]);

const main = async () => {
  const encodedData = iface.encodeFunctionData(${functionName}, ${inputsString});

  const rawResult = await provider.call({
    to: "${contractAddress}",
    data: encodedData,
  });

  const decodedResult = iface.decodeFunctionResult(${functionName}, rawResult);
  console.log(decodedResult);
};

main();`,
          },
        ],
        write: [
          {
            name: "Ethers",
            mode: "javascript",
            snippet: `import { ethers, Interface } from "ethers";

const provider = new ethers.JsonRpcProvider("${evm.jsonRpc}");
const privateKey = "your-private-key";
const wallet = new ethers.Wallet(privateKey, provider);

const ABI = [${JSON.stringify(abiSection)}];
const iface = new Interface(ABI);
const encodedData = iface.encodeFunctionData(${functionName}, ${inputsString});

const main = async () => {
  const tx = await wallet.sendTransaction({
    to: "${contractAddress}",
    data: encodedData,
  });

  console.log(tx);
};

main();`,
          },
        ],
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(evm), JSON.stringify(inputs), abiSection]);

  if (!codeSnippets) return null;

  return (
    <>
      <Button
        gap={1}
        minW="128px"
        size="sm"
        variant="outline-secondary"
        onClick={() => {
          track(AmpEvent.USE_CONTRACT_SNIPPET, {});
          onOpen();
        }}
      >
        <CustomIcon name="code" />
        Code snippet
      </Button>

      <Modal isCentered isOpen={isOpen} size="4xl" onClose={onClose}>
        <ModalOverlay />
        <ModalContent w="840px">
          <ModalHeader>
            <CustomIcon boxSize={6} color="gray.600" name="code" />
            <Heading as="h5" variant="h5">
              Code snippet
            </Heading>
          </ModalHeader>
          <ModalCloseButton color="gray.600" />
          <ModalBody maxH="640px" overflow="scroll" px={4}>
            <Tabs>
              <TabList borderBottom="1px solid" borderColor="gray.700">
                {codeSnippets[type].map((item) => (
                  <CustomTab key={`menu-${item.name}`}>{item.name}</CustomTab>
                ))}
              </TabList>
              <TabPanels>
                {codeSnippets[type].map((item) => (
                  <TabPanel key={item.name} px={2} py={4}>
                    <Box
                      bgColor="background.main"
                      borderRadius="8px"
                      p={4}
                      position="relative"
                    >
                      <AceEditor
                        style={{
                          width: "100%",
                          background: "transparent",
                        }}
                        fontSize="14px"
                        mode={item.mode}
                        readOnly
                        setOptions={{
                          showGutter: false,
                          useWorker: false,
                          printMargin: false,
                          wrap: true,
                        }}
                        theme={theme.jsonTheme}
                        value={item.snippet}
                      />
                      <Box position="absolute" right={4} top={4}>
                        <CopyButton
                          amptrackInfo={type}
                          amptrackSection="code_snippet"
                          amptrackSubSection={item.name}
                          value={item.snippet}
                        />
                      </Box>
                    </Box>
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EvmCodeSnippet;
