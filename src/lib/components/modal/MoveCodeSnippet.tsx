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
import { useCelatoneApp, useGas } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import { getArgType, serializeAbiData } from "lib/utils";
import { useMemo } from "react";
import AceEditor from "react-ace";

import { CopyButton } from "../copy";
import { CustomIcon } from "../icon";

interface MoveCodeSnippetProps {
  moduleAddress: HexAddr;
  moduleName: string;
  fn: ExposedFunction;
  abiData: AbiFormData;
  type: "view" | "execute";
  ml?: ButtonProps["ml"];
}

interface FormatedData {
  showTypeArgs: boolean;
  showArgs: boolean;
  formatedTypeArgs: string;
  formatedArgs: string;
  formatedAbiData: string;
  typeArgsFlags: string;
  argsFlags: string;
  isHiddenCLI: boolean;
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
    chainConfig: { chain, rest: restEndpoint, rpc: rpcEndpoint },
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
        ? `\n\t--args '[${argsWithTypes.map((val) => JSON.stringify(val)).join(",")}]' \\`
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
    { name: string; mode: string; snippet: string; isHidden?: boolean }[]
  > = {
    execute: [
      {
        mode: "javascript",
        name: "InitiaJS",
        snippet: `import { LCDClient, Wallet, MnemonicKey, MsgExecute } from '@initia/initia.js';

const lcd = new LCDClient('${restEndpoint}', {
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
        snippet: `export WALLET_NAME='<your-wallet-name>'\n
export CHAIN_ID='${currentChainId}'\n
export RPC_URL='${rpcEndpoint}'\n
export MODULE_ADDRESS='${moduleAddress}'\n
export MODULE_NAME='${moduleName}'\n
export MODULE_FN='${fn.name}'\n
${daemonName} keys add --recover $WALLET_NAME\n
${daemonName} tx move execute $MODULE_ADDRESS \\
    $MODULE_NAME \\
    $MODULE_FN \\${typeArgsFlags}${argsFlags}
    --from $WALLET_NAME \\
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
        snippet: `\n\ncurl '${restEndpoint}/initia/move/v1/accounts/${moduleAddress}/modules/${moduleName}/view_functions/${fn.name}' \\
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

const lcd = new LCDClient('${restEndpoint}', {
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
