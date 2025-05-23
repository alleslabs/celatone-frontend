import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-sh";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-one_dark";
import "ace-builds/src-noconflict/theme-pastel_on_dark";

import type { ButtonProps } from "@chakra-ui/react";
import type { AbiFormData, ExposedFunction, HexAddr } from "lib/types";

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
import { useCelatoneApp } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import AceEditor from "react-ace";

import { CopyButton } from "../../copy";
import { CustomIcon } from "../../icon";
import { useCodeSnippetCli } from "./hooks/use-code-snippet-cli";
import { useSnippetCurl } from "./hooks/use-code-snippet-curl";
import { useCodeSnippetInitiaJs } from "./hooks/use-code-snippet-initiajs";

interface MoveCodeSnippetProps {
  abiData: AbiFormData;
  fn: ExposedFunction;
  ml?: ButtonProps["ml"];
  moduleAddress: HexAddr;
  moduleName: string;
  type: "execute" | "view";
}

const MoveCodeSnippet = ({
  fn,
  ml,
  type = "view",
  ...props
}: MoveCodeSnippetProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { theme } = useCelatoneApp();

  const {
    executeSnippet: executeSnippetCli,
    viewSnippet: viewSnippetCli,
    ...restCodeSnippetCli
  } = useCodeSnippetCli({
    fn,
    ...props,
  });

  const {
    executeCodeSnippet: executeSnippetInitiaJs,
    viewCodeSnippet: viewSnippetInitiaJs,
    ...restCodeSnippetInitiaJs
  } = useCodeSnippetInitiaJs({
    fn,
    ...props,
  });

  const { viewSnippet: viewSnippetCurl, ...restCodeSnippetCurl } =
    useSnippetCurl({
      fn,
      ...props,
    });

  const codeSnippets: Record<
    string,
    { isHidden?: boolean; mode: string; name: string; snippet: string }[]
  > = {
    execute: [
      {
        ...restCodeSnippetInitiaJs,
        snippet: executeSnippetInitiaJs,
      },
      {
        ...restCodeSnippetCli,
        snippet: executeSnippetCli,
      },
    ],
    view: [
      {
        ...restCodeSnippetCurl,
        snippet: viewSnippetCurl,
      },
      {
        ...restCodeSnippetInitiaJs,
        snippet: viewSnippetInitiaJs,
      },
      {
        ...restCodeSnippetCli,
        snippet: viewSnippetCli,
      },
    ],
  };

  return (
    <>
      <Button
        gap={1}
        ml={ml}
        size="md"
        variant="outline-white"
        onClick={() => {
          track(AmpEvent.USE_CONTRACT_SNIPPET, {
            functionType: fn.is_view ? "view" : "Execute",
          });
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
              <TabList borderBottomWidth="1px" borderColor="gray.700">
                {codeSnippets[type].map((item) => (
                  <CustomTab key={`menu-${item.name}`} hidden={item.isHidden}>
                    {item.name}
                  </CustomTab>
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
                          background: "transparent",
                          width: "100%",
                        }}
                        fontSize="14px"
                        mode={item.mode}
                        readOnly
                        setOptions={{
                          printMargin: false,
                          showGutter: false,
                          useWorker: false,
                          wrap: true,
                        }}
                        theme={theme.jsonTheme}
                        value={item.snippet}
                      />
                      <Box position="absolute" right={4} top={4}>
                        <CopyButton
                          amptrackInfo={fn.is_view ? "view" : "Execute"}
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

export default MoveCodeSnippet;
