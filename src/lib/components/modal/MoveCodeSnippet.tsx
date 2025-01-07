import type { ButtonProps } from "@chakra-ui/react";
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
import { useMemo } from "react";
import AceEditor from "react-ace";

import { CopyButton } from "../copy";
import { CustomIcon } from "../icon";
import { AmpEvent, track } from "lib/amplitude";
import { useCelatoneApp, useGas } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import type { AbiFormData, ExposedFunction, HexAddr } from "lib/types";
import { getArgType, serializeAbiData } from "lib/utils";

import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-sh";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-one_dark";
import "ace-builds/src-noconflict/theme-pastel_on_dark";

interface FormatedData {
  argsFlags: string;
  formatedAbiData: string;
  formatedArgs: string;
  formatedTypeArgs: string;
  isHiddenCLI: boolean;
  showArgs: boolean;
  showTypeArgs: boolean;
  typeArgsFlags: string;
}

interface MoveCodeSnippetProps {
  abiData: AbiFormData;
  fn: ExposedFunction;
  ml?: ButtonProps["ml"];
  moduleAddress: HexAddr;
  moduleName: string;
  type: "execute" | "view";
}

const MoveCodeSnippet = ({
  abiData,
  fn,
  ml,
  moduleAddress,
  moduleName,
  type = "view",
}: MoveCodeSnippetProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    chainConfig: { chain, lcd: lcdEndpoint, rpc: rpcEndpoint },
    currentChainId,
    theme,
  } = useCelatoneApp();
  const gasPrice = useGas();

  const daemonName = `${chain}d`;
  const gasPriceStr = `${gasPrice.tokenPerGas}${gasPrice.denom}`;

  const {
    argsFlags,
    formatedAbiData,
    formatedArgs,
    formatedTypeArgs,
    isHiddenCLI,
    showArgs,
    showTypeArgs,
    typeArgsFlags,
  } = useMemo<FormatedData>(() => {
    const serializedAbiData = serializeAbiData(fn, abiData);
    const displayTypeArgs = serializedAbiData.typeArgs.length > 0;
    const displayArgs = serializedAbiData.args.length > 0;
    const argTypes = fn.params.map((param) => getArgType(param));

    const argsWithTypes = Object.values(abiData.args).map((arg, index) => {
      const argType = argTypes[index];
      return `${argType}:${arg}`;
    });

    return {
      argsFlags: displayArgs
        ? `\n\t--args '${argsWithTypes.join(" ")}' \\`
        : "",
      formatedAbiData: JSON.stringify(serializedAbiData),
      formatedArgs: JSON.stringify(serializedAbiData.args),
      formatedTypeArgs: JSON.stringify(serializedAbiData.typeArgs),
      isHiddenCLI: argTypes.some(
        (argType) =>
          argType === "vector" ||
          argType === "option" ||
          argType === "object" ||
          argType === "fixed_point32" ||
          argType === "fixed_point64" ||
          argType === "decimal128" ||
          argType === "decimal256"
      ),
      showArgs: displayArgs,
      showTypeArgs: displayTypeArgs,
      typeArgsFlags: displayTypeArgs
        ? `\n\t--type-args '${serializedAbiData.typeArgs.join(" ")}' \\`
        : "",
    };
  }, [abiData, fn]);

  const codeSnippets: Record<
    string,
    { isHidden?: boolean; mode: string; name: string; snippet: string }[]
  > = {
    execute: [
      {
        mode: "javascript",
        name: "InitiaJS",
        snippet: `import { LCDClient, Wallet, MnemonicKey, MsgExecute } from '@initia/initia.js';

const lcd = new LCDClient('${lcdEndpoint}', {
    chainId: '${currentChainId}',
    gasPrices: '${gasPriceStr}',
    gasAdjustment: '2.0',
});
const key = new MnemonicKey({
    mnemonic: "<MNEMONIC>",
});
const wallet = new Wallet(lcd, key);
const msg = new MsgExecute(
    key.accAddress,
    '${moduleAddress}',
    '${moduleName}',
    '${fn.name}'${showTypeArgs ? ",\n\t".concat(formatedTypeArgs) : ""}${
      showArgs
        ? (!showTypeArgs ? ",\n\tundefined" : "") + ",\n\t".concat(formatedArgs)
        : ""
    }
);

const execute = async () => {
    const signedTx = await wallet.createAndSignTx({
        msgs: [msg],
    });

    const broadcastResult = await lcd.tx.broadcast(signedTx);
    console.log(broadcastResult);
};
execute();`,
      },
      {
        isHidden: isHiddenCLI,
        mode: "sh",
        name: "CLI",
        snippet: `${daemonName} keys add --recover celatone\n
export CHAIN_ID='${currentChainId}'\n
export RPC_URL='${rpcEndpoint}'\n
export MODULE_ADDRESS='${moduleAddress}'\n
export MODULE_NAME='${moduleName}'\n
export MODULE_FN='${fn.name}'\n
${daemonName} tx move execute $MODULE_ADDRESS \\
    $MODULE_NAME \\
    $MODULE_FN \\${typeArgsFlags}${argsFlags}
    --from celatone \\
    --chain-id $CHAIN_ID \\
    --node $RPC_URL \\
    --gas auto \\
    --gas-prices ${gasPriceStr} \\
    --gas-adjustment 1.5`,
      },
    ],
    view: [
      {
        mode: "sh",
        name: "Curl",
        snippet: `\n\ncurl '${lcdEndpoint}/initia/move/v1/accounts/${moduleAddress}/modules/${moduleName}/view_functions/${fn.name}' \\
--data-raw '${formatedAbiData}'`,
      },
      {
        isHidden: isHiddenCLI,
        mode: "sh",
        name: "CLI",
        snippet: `export CHAIN_ID='${currentChainId}'\n
export MODULE_ADDRESS='${moduleAddress}'\n
export MODULE_NAME='${moduleName}'\n
export MODULE_FN='${fn.name}'\n
export RPC_URL='${rpcEndpoint}'\n
${daemonName} query move view $MODULE_ADDRESS \\
    $MODULE_NAME \\
    $MODULE_FN \\${typeArgsFlags}${argsFlags}
    --chain-id $CHAIN_ID \\
    --node $RPC_URL`,
      },
      {
        mode: "javascript",
        name: "InitiaJS",
        snippet: `import { LCDClient } from '@initia/initia.js'

const lcd = new LCDClient('${lcdEndpoint}', {
    chainId: '${currentChainId}',
});
const moduleAddress =
"${moduleAddress}";
const moduleName = "${moduleName}";
const fnName = "${fn.name}";
const viewModule = async (moduleAddress, moduleName, fnName) => {
    const viewResult = await lcd.move.viewFunction(
        moduleAddress,
        moduleName,
        fnName${showTypeArgs ? ",\n\t\t".concat(formatedTypeArgs) : ""}${
          showArgs
            ? (!showTypeArgs ? ",\n\t\tundefined" : "") +
              ",\n\t\t".concat(formatedArgs)
            : ""
        }
    )
    console.log(viewResult);
};\n
viewModule(moduleAddress, moduleName, fnName);`,
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
        Code Snippet
      </Button>

      <Modal isCentered isOpen={isOpen} size="4xl" onClose={onClose}>
        <ModalOverlay />
        <ModalContent w="840px">
          <ModalHeader>
            <CustomIcon name="code" boxSize={6} color="gray.600" />
            <Heading as="h5" variant="h5">
              Code Snippet
            </Heading>
          </ModalHeader>
          <ModalCloseButton color="gray.600" />
          <ModalBody maxH="640px" px={4} overflow="scroll">
            <Tabs>
              <TabList borderBottom="1px solid" borderColor="gray.700">
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
                      p={4}
                      bgColor="background.main"
                      borderRadius="8px"
                      position="relative"
                    >
                      <AceEditor
                        style={{
                          background: "transparent",
                          width: "100%",
                        }}
                        readOnly
                        theme={theme.jsonTheme}
                        value={item.snippet}
                        fontSize="14px"
                        mode={item.mode}
                        setOptions={{
                          printMargin: false,
                          showGutter: false,
                          useWorker: false,
                          wrap: true,
                        }}
                      />
                      <Box right={4} position="absolute" top={4}>
                        <CopyButton
                          value={item.snippet}
                          amptrackInfo={fn.is_view ? "view" : "Execute"}
                          amptrackSection="code_snippet"
                          amptrackSubSection={item.name}
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
