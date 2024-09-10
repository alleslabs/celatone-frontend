import type { ButtonProps, FlexProps } from "@chakra-ui/react";
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
import type { Coin } from "@cosmjs/stargate";
import { useState } from "react";
import AceEditor from "react-ace";

import { CopyButton } from "../copy";
import { CustomIcon } from "../icon";
import { AmpEvent, track } from "lib/amplitude";
import {
  useCelatoneApp,
  useGas,
  useLcdEndpoint,
  useMobile,
  useRpcEndpoint,
} from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import type { BechAddr32 } from "lib/types";
import { coinsToStr, jsonPrettify } from "lib/utils";

import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-sh";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-one_dark";
import "ace-builds/src-noconflict/theme-pastel_on_dark";

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
  const lcdEndpoint = useLcdEndpoint();
  const rpcEndpoint = useRpcEndpoint();
  const {
    currentChainId,
    chainConfig: { chain },
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
LCD_URL = "${lcdEndpoint}"
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
const lcdURL = '${lcdEndpoint}';
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
        name: "CLI",
        mode: "sh",
        snippet: `${daemonName} keys add --recover celatone\n
export CHAIN_ID='${currentChainId}'\n
export RPC_URL='${rpcEndpoint}'\n
export CONTRACT_ADDRESS='${contractAddress}'\n
export EXECUTE_MSG='${message}'\n
${daemonName} tx wasm execute $CONTRACT_ADDRESS $EXECUTE_MSG \\
  --from celatone \\
  --chain-id $CHAIN_ID \\
  --node $RPC_URL \\${fundsFlags}
  --gas auto \\
  --gas-prices ${gasPriceStr} \\
  --gas-adjustment 1.5`,
      },
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
    ],
  };

  const handleTabChange = (index: number) => {
    setActiveTabIndex(index);
    setActiveSnippet(codeSnippets[type][index].snippet);
  };

  return (
    <>
      <Button
        isDisabled={isDisabled}
        variant="outline-white"
        w={w}
        minW="128px"
        size="sm"
        ml={ml}
        gap={1}
        onClick={() => {
          track(AmpEvent.USE_CONTRACT_SNIPPET, { actionType: type });
          onOpen();
        }}
      >
        <CustomIcon name="code" />
        Code Snippet
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="4xl">
        <ModalOverlay />
        <ModalContent w="840px" maxH="80vh">
          <ModalHeader>
            <CustomIcon name="code" boxSize={6} color="gray.600" />
            <Heading as="h5" variant="h5">
              Code Snippet
            </Heading>
          </ModalHeader>
          <ModalCloseButton color="gray.600" />
          <ModalBody px={4} overflow="scroll">
            <Tabs index={activeTabIndex} onChange={handleTabChange}>
              <TabList borderBottom="1px solid" borderColor="gray.700">
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
                      {!isMobile && (
                        <Box position="absolute" top={4} right={4}>
                          <CopyButton
                            value={item.snippet}
                            amptrackSection="code_snippet"
                            amptrackSubSection={item.name}
                            amptrackInfo={type}
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
              <Flex w="full" justifyContent="flex-end">
                <CopyButton
                  buttonText="Copy Code Snippet"
                  value={activeSnippet}
                  amptrackSection="code_snippet"
                  amptrackSubSection={type}
                  amptrackInfo={type}
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
