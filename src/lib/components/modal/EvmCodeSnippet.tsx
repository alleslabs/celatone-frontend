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
import type { JsonFragment } from "ethers";
import { useMemo } from "react";
import AceEditor from "react-ace";

import { AmpEvent, track } from "lib/amplitude";
import { useCelatoneApp } from "lib/app-provider/contexts";
import { useEvmConfig } from "lib/app-provider/hooks";
import { CustomTab } from "lib/components/CustomTab";
import type { HexAddr20, JsonDataType, Nullable } from "lib/types";

import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-one_dark";
import "ace-builds/src-noconflict/theme-pastel_on_dark";
import { formatEvmFunctionInputsArgs } from "lib/utils";
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
        variant="outline-secondary"
        minW="128px"
        size="sm"
        gap={1}
        onClick={() => {
          track(AmpEvent.USE_CONTRACT_SNIPPET, {});
          onOpen();
        }}
      >
        <CustomIcon name="code" />
        Code Snippet
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="4xl">
        <ModalOverlay />
        <ModalContent w="840px">
          <ModalHeader>
            <CustomIcon name="code" boxSize={6} color="gray.600" />
            <Heading as="h5" variant="h5">
              Code Snippet
            </Heading>
          </ModalHeader>
          <ModalCloseButton color="gray.600" />
          <ModalBody px={4} maxH="640px" overflow="scroll">
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
                      p={4}
                      borderRadius="8px"
                      position="relative"
                    >
                      <AceEditor
                        readOnly
                        mode={item.mode}
                        theme={theme.jsonTheme}
                        fontSize="14px"
                        style={{
                          width: "100%",
                          background: "transparent",
                        }}
                        value={item.snippet}
                        setOptions={{
                          showGutter: false,
                          useWorker: false,
                          printMargin: false,
                          wrap: true,
                        }}
                      />
                      <Box position="absolute" top={4} right={4}>
                        <CopyButton
                          value={item.snippet}
                          amptrackSection="code_snippet"
                          amptrackSubSection={item.name}
                          amptrackInfo={type}
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
