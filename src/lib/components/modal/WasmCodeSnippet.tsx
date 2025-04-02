import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-sh";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-one_dark";
import "ace-builds/src-noconflict/theme-pastel_on_dark";

import type { ButtonProps, FlexProps } from "@chakra-ui/react";
import type { Coin } from "@cosmjs/stargate";
import type { BechAddr32 } from "lib/types";

import {
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useCelatoneApp, useGas, useMobile } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import { coinsToStr, jsonPrettify } from "lib/utils";
import { useState } from "react";
import AceEditor from "react-ace";

import { CopyButton } from "../copy";
import { CustomIcon } from "../icon";

interface WasmCodeSnippetProps {
  contractAddress: BechAddr32;
  message: string;
  type: "query" | "execute";
  ml?: ButtonProps["ml"];
  funds?: Coin[];
  w?: FlexProps["width"];
}

const WasmCodeSnippet = ({
  contractAddress,
  message,
  type = "query",
  ml,
  w,
  funds = [],
}: WasmCodeSnippetProps) => {
  const isMobile = useMobile();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const isDisabled = !contractAddress || !message.length;
  const {
    currentChainId,
    chainConfig: { chain, rest: restEndpoint, rpc: rpcEndpoint },
    theme,
  } = useCelatoneApp();
  const gasPrice = useGas();

  const [activeSnippet, setActiveSnippet] = useState("");
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const daemonName = `${chain}d`;
  const gasPriceStr = `${gasPrice.tokenPerGas}${gasPrice.denom}`;
  const fundsFlags = funds.length ? `\n  --amount ${coinsToStr(funds)} \\` : "";

  const codeSnippets: Record<
    string,
    { name: string; mode: string; snippet: string }[]
  > = {
    query: [
      {
        name: "CLI",
        mode: "sh",
        snippet: `export CHAIN_ID='${currentChainId}'\n
export CONTRACT_ADDRESS='${contractAddress}'\n
export QUERY_MSG='${message}'\n
export RPC_URL='${rpcEndpoint}'\n
${daemonName} query wasm contract-state smart $CONTRACT_ADDRESS $QUERY_MSG \\
  --chain-id $CHAIN_ID \\
  --node $RPC_URL`,
      },
      {
        name: "Python",
        mode: "python",
        snippet: `import base64
import requests\n
CONTRACT_ADDRESS = "${contractAddress}"
LCD_URL = "${restEndpoint}"
QUERY_MSG = b'''${message}'''\n
query_b64encoded = base64.b64encode(QUERY_MSG).decode("ascii")
res = requests.get(
  f"{LCD_URL}/cosmwasm/wasm/v1/contract/{CONTRACT_ADDRESS}/smart/{query_b64encoded}"
).json()\n
print(res)`,
      },
      {
        name: "CosmJS",
        mode: "javascript",
        snippet: `const { SigningCosmWasmClient } = require("@cosmjs/cosmwasm-stargate");
const rpcURL = "${rpcEndpoint}";
const contractAddress =
"${contractAddress}";
const queryMsg = \`${message}\`;\n
const queryContract = async (rpcURL, contractAddress, queryMsg) => {
  const client = await SigningCosmWasmClient.connect(rpcURL);
  const queryResult = await client.queryContractSmart(
    contractAddress,
    JSON.parse(queryMsg)
  );
  console.log(queryResult);
};\n
queryContract(rpcURL, contractAddress, queryMsg);`,
      },
      {
        name: "Axios",
        mode: "javascript",
        snippet: `const axios = require('axios');\n
const lcdURL = '${restEndpoint}';
const contractAddress =
"${contractAddress}";
const queryMsg = ${message};\n
const queryContract = async () => {
  const queryB64Encoded = Buffer.from(JSON.stringify(queryMsg)).toString('base64');
  const res = await axios.get(\`$\{lcdURL}/cosmwasm/wasm/v1/contract/$\{contractAddress}/smart/$\{queryB64Encoded}\`);
  console.log(res.data);
};\n
queryContract();`,
      },
    ],
    execute: [
      {
        name: "CosmJS",
        mode: "javascript",
        snippet: `const { GasPrice } = require("@cosmjs/stargate");
const { SigningCosmWasmClient } = require("@cosmjs/cosmwasm-stargate");
const { getOfflineSignerAmino } = require("cosmjs-utils");
const { chains } = require("chain-registry");

// TODO: Replace with your mnemonic (not recommended for production use)
const mnemonic =
  "<MNEMONIC>";
const chain = chains.find(({ chain_id }) => chain_id === '${currentChainId}');
const contractAddress =
  '${contractAddress}';
const msg = ${message};
const funds = [${funds.map((coin) => jsonPrettify(JSON.stringify(coin)))}];

const execute = async () => {
  const rpcEndpoint = '${rpcEndpoint}';
  const signer = await getOfflineSignerAmino({ mnemonic, chain });
  const client = await SigningCosmWasmClient.connectWithSigner(
    rpcEndpoint,
    signer,
    {
      gasPrice: GasPrice.fromString("${gasPriceStr}"),
    }
  );

  const [sender] = await signer.getAccounts();
  const fee = "auto";

  const tx = await client.execute(
    sender.address,
    contractAddress,
    msg,
    fee,
    undefined,
    funds
  );

  console.log(tx.transactionHash);
};

execute();
`,
      },
      {
        name: "CLI",
        mode: "sh",
        snippet: `export WALLET_NAME='<your-wallet-name>'\n
export CHAIN_ID='${currentChainId}'\n
export RPC_URL='${rpcEndpoint}'\n
export CONTRACT_ADDRESS='${contractAddress}'\n
export EXECUTE_MSG='${message}'\n
${daemonName} keys add --recover $WALLET_NAME\n
${daemonName} tx wasm execute $CONTRACT_ADDRESS $EXECUTE_MSG \\
  --from $WALLET_NAME \\
  --chain-id $CHAIN_ID \\
  --node $RPC_URL \\${fundsFlags}
  --gas auto \\
  --gas-prices ${gasPriceStr} \\
  --gas-adjustment 1.5`,
      },
    ],
  };

  const handleTabChange = (index: number) => {
    setActiveTabIndex(index);
    setActiveSnippet(codeSnippets[type][index].snippet);
  };

  return (
    <>
      <Button
        gap={1}
        isDisabled={isDisabled}
        minW="128px"
        ml={ml}
        size="sm"
        variant="outline-white"
        w={w}
        onClick={() => {
          track(AmpEvent.USE_CONTRACT_SNIPPET, { actionType: type });
          onOpen();
        }}
      >
        <CustomIcon name="code" />
        Code Snippet
      </Button>

      <Modal isCentered isOpen={isOpen} size="4xl" onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxH="80vh" w="840px">
          <ModalHeader>
            <CustomIcon boxSize={6} color="gray.600" name="code" />
            <Heading as="h5" variant="h5">
              Code Snippet
            </Heading>
          </ModalHeader>
          <ModalCloseButton color="gray.600" />
          <ModalBody overflow="scroll" px={4}>
            <Tabs index={activeTabIndex} onChange={handleTabChange}>
              <TabList
                borderBottomWidth="1px"
                borderColor="gray.700"
                borderStyle="solid"
              >
                {codeSnippets[type].map((item, index) => (
                  <CustomTab
                    key={`menu-${item.name}`}
                    onClick={() => handleTabChange(index)}
                  >
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
                      {!isMobile && (
                        <Box position="absolute" right={4} top={4}>
                          <CopyButton
                            amptrackInfo={type}
                            amptrackSection="code_snippet"
                            amptrackSubSection={item.name}
                            value={item.snippet}
                          />
                        </Box>
                      )}
                    </Box>
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </ModalBody>
          {isMobile && (
            <ModalFooter>
              <Flex justifyContent="flex-end" w="full">
                <CopyButton
                  amptrackInfo={type}
                  amptrackSection="code_snippet"
                  amptrackSubSection={type}
                  buttonText="Copy Code Snippet"
                  value={activeSnippet}
                />
              </Flex>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default WasmCodeSnippet;
