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

import { AmpEvent, track } from "lib/amplitude";
import { useCelatoneApp, useGas } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import type { AbiFormData, ExposedFunction, HexAddr } from "lib/types";
import { getArgType, serializeAbiData } from "lib/utils";
import { CopyButton } from "../copy";
import { CustomIcon } from "../icon";

import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-sh";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-one_dark";
import "ace-builds/src-noconflict/theme-pastel_on_dark";

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
  moduleAddress,
  moduleName,
  fn,
  abiData,
  type = "view",
  ml,
}: MoveCodeSnippetProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    currentChainId,
    chainConfig: { chain, rest: restEndpoint, rpc: rpcEndpoint },
    theme,
  } = useCelatoneApp();
  const gasPrice = useGas();

  const daemonName = `${chain}d`;
  const gasPriceStr = `${gasPrice.tokenPerGas}${gasPrice.denom}`;

  const {
    showTypeArgs,
    showArgs,
    formatedAbiData,
    formatedArgs,
    formatedTypeArgs,
    typeArgsFlags,
    argsFlags,
    isHiddenCLI,
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
      showTypeArgs: displayTypeArgs,
      showArgs: displayArgs,
      formatedTypeArgs: JSON.stringify(serializedAbiData.typeArgs),
      formatedArgs: JSON.stringify(serializedAbiData.args),
      formatedAbiData: JSON.stringify(serializedAbiData),
      typeArgsFlags: displayTypeArgs
        ? `\n\t--type-args '${serializedAbiData.typeArgs.join(" ")}' \\`
        : "",
      argsFlags: displayArgs
        ? `\n\t--args '[${argsWithTypes.map((val) => JSON.stringify(val)).join(",")}]' \\`
        : "",
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
    };
  }, [abiData, fn]);

  const codeSnippets: Record<
    string,
    { name: string; mode: string; snippet: string; isHidden?: boolean }[]
  > = {
    view: [
      {
        name: "Curl",
        mode: "sh",
        snippet: `\n\ncurl '${restEndpoint}/initia/move/v1/accounts/${moduleAddress}/modules/${moduleName}/view_functions/${fn.name}' \\
--data-raw '${formatedAbiData}'`,
      },
      {
        name: "CLI",
        mode: "sh",
        isHidden: isHiddenCLI,
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
        name: "InitiaJS",
        mode: "javascript",
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
    execute: [
      {
        name: "InitiaJS",
        mode: "javascript",
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
        name: "CLI",
        mode: "sh",
        isHidden: isHiddenCLI,
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
  };

  return (
    <>
      <Button
        variant="outline-white"
        size="md"
        ml={ml}
        gap={1}
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
                          amptrackInfo={fn.is_view ? "view" : "Execute"}
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
