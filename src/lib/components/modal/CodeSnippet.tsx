import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
  ModalCloseButton,
  TabList,
  Tabs,
  TabPanels,
  TabPanel,
  Heading,
  Box,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import AceEditor from "react-ace";

import { CopyButton } from "../copy";
import { CustomIcon } from "../icon";
import { useLCDEndpoint } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import type { ContractAddr, Option } from "lib/types";

import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-sh";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

interface CodeSnippetProps {
  contractAddress: ContractAddr;
  message: string;
  type: "query" | "execute";
}

/**
 *
 * @todo: This is a temporary solution to get the full RPC URL for Osmosis.
 */
const getFullRpcUrl = (rpcUrl: Option<string>, chainId: Option<string>) => {
  const baseUrl = rpcUrl?.slice(0, rpcUrl.length - 1);
  switch (chainId) {
    case "osmosis-1":
    case "osmo-test-4":
      return `${baseUrl}:443`;
    default:
      return `${baseUrl}:26657`;
  }
};

const CodeSnippet = ({
  contractAddress,
  message,
  type = "query",
}: CodeSnippetProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { currentChainRecord, currentChainName } = useWallet();
  const isDisabled = !contractAddress || !message.length;

  const endpoint = useLCDEndpoint();
  const client = currentChainRecord?.chain.daemon_name;
  const rpcUrl = currentChainRecord?.preferredEndpoints?.rpc?.[0];
  const chainId = currentChainRecord?.chain.chain_id;
  const codeSnippets: Record<
    string,
    { name: string; mode: string; snippet: string }[]
  > = {
    query: [
      {
        name: "CLI",
        mode: "sh",
        snippet: `export CHAIN_ID='${chainId}'\n
export CONTRACT_ADDRESS='${contractAddress}'\n
export QUERY_MSG='${message}'\n
export RPC_URL='${getFullRpcUrl(rpcUrl, chainId)}'\n
${client} query wasm contract-state smart $CONTRACT_ADDRESS $QUERY_MSG \\
  --chain-id $CHAIN_ID \\
  --node $RPC_URL`,
      },
      {
        name: "Python",
        mode: "python",
        snippet: `import base64
import requests\n
CONTRACT_ADDRESS = "${contractAddress}"
LCD_URL = "${endpoint}"
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
const rpcURL = "${rpcUrl}";
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
const lcdURL = '${endpoint}';
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
        snippet: `${client} keys add --recover celatone\n
export CHAIN_ID='${chainId}'\n
export RPC_URL='${getFullRpcUrl(rpcUrl, chainId)}'\n
export CONTRACT_ADDRESS='${contractAddress}'\n
export EXECUTE_MSG='${message}'\n
${client} tx wasm execute $CONTRACT_ADDRESS $EXECUTE_MSG \\
  --from celatone \\
  --chain-id $CHAIN_ID \\
  --node $RPC_URL`,
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
const chain = chains.find(({ chain_name }) => chain_name === '${currentChainName}');
const contractAddress =
  '${contractAddress}';

const execute = async () => {
  const rpcEndpoint = '${rpcUrl}';
  const signer = await getOfflineSignerAmino({ mnemonic, chain });
  const client = await SigningCosmWasmClient.connectWithSigner(
    rpcEndpoint,
    signer,
    {
      gasPrice: GasPrice.fromString("0.025uosmo"),
    }
  );

  const [sender] = await signer.getAccounts();
  const fee = "auto";

  const tx = await client.execute(
    sender.address,
    contractAddress,
    ${message},
    fee
  );

  console.log(tx.transactionHash);
};

execute();
;`,
      },
    ],
  };

  return (
    <>
      <Button
        isDisabled={isDisabled}
        variant="outline-info"
        size="sm"
        ml="auto"
        gap="1"
        onClick={() => {
          AmpTrack(AmpEvent.USE_CONTRACT_SNIPPET);
          onOpen();
        }}
      >
        <CustomIcon
          name="code"
          color={isDisabled ? "honeydew.darker" : "honeydew.main"}
        />
        Code Snippet
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="4xl">
        <ModalOverlay />
        <ModalContent w="840px">
          <ModalHeader>
            <CustomIcon name="code" boxSize="6" />
            <Heading as="h5" variant="h5">
              Code Snippet
            </Heading>
          </ModalHeader>
          <ModalCloseButton color="pebble.600" />
          <ModalBody px={4} maxH="640px" overflow="scroll">
            <Tabs>
              <TabList borderBottom="1px solid" borderColor="pebble.700">
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
                        theme="monokai"
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
                        <CopyButton value={item.snippet} />
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

export default CodeSnippet;
