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
import { useCelatoneApp, useGas, useMobile } from "lib/app-provider";
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
  funds?: Coin[];
  message: string;
  ml?: ButtonProps["ml"];
  type: "execute" | "query";
  w?: FlexProps["width"];
}

const WasmCodeSnippet = ({
  contractAddress,
  funds = [],
  message,
  ml,
  type = "query",
  w,
}: WasmCodeSnippetProps) => {
  const isMobile = useMobile();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const isDisabled = !contractAddress || !message.length;
  const {
    chainConfig: { chain, lcd: lcdEndpoint, rpc: rpcEndpoint },
    currentChainId,
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
    { mode: string; name: string; snippet: string }[]
  > = {
    execute: [
      {
        mode: "sh",
        name: "CLI",
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
        mode: "javascript",
        name: "CosmJS",
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
    query: [
      {
        mode: "sh",
        name: "CLI",
        snippet: `export CHAIN_ID='${currentChainId}'\n
export CONTRACT_ADDRESS='${contractAddress}'\n
export QUERY_MSG='${message}'\n
export RPC_URL='${rpcEndpoint}'\n
${daemonName} query wasm contract-state smart $CONTRACT_ADDRESS $QUERY_MSG \\
  --chain-id $CHAIN_ID \\
  --node $RPC_URL`,
      },
      {
        mode: "python",
        name: "Python",
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
        mode: "javascript",
        name: "CosmJS",
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
        mode: "javascript",
        name: "Axios",
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
                      {!isMobile && (
                        <Box right={4} position="absolute" top={4}>
                          <CopyButton
                            value={item.snippet}
                            amptrackInfo={type}
                            amptrackSection="code_snippet"
                            amptrackSubSection={item.name}
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
                  value={activeSnippet}
                  amptrackInfo={type}
                  amptrackSection="code_snippet"
                  amptrackSubSection={type}
                  buttonText="Copy Code Snippet"
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
