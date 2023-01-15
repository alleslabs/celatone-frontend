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
  Icon,
  Box,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import AceEditor from "react-ace";
import { MdCode } from "react-icons/md";

import { CopyButton } from "../CopyButton";
import { CustomTab } from "lib/components/CustomTab";
import { useEndpoint } from "lib/hooks";
import type { ContractAddr, HumanAddr } from "lib/types";

import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";

interface CodeSnippetProps {
  isDisable?: boolean;
  contractAddress: HumanAddr | ContractAddr;
  // TODO get client: string;
  message: string;
  type: string;
}

export const CodeSnippet = ({
  isDisable,
  contractAddress,
  message,
  type = "query",
}: CodeSnippetProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { currentChainRecord } = useWallet();
  const endpoint = useEndpoint();
  // TODO get dynamic rpc_url
  const rpcUrl = `https://testnet-rpc.osmosis.zone/`;
  const chainId = currentChainRecord?.chain.chain_id;
  const codeSnippets = [
    {
      type: "query",
      snippets: [
        {
          name: "CLI",
          mode: "cli",
          string: `export CHAIN_ID=${chainId}\n
export CONTRACT_ADDRESS=${contractAddress}\n
export QUERY_MSG='${message}'\n
export RPC_URL=${rpcUrl}\n
{client} query wasm contract-state smart $CONTRACT_ADDRESS $QUERY_MSG \\\n
    --chain-id $CHAIN_ID \\\n
    --node $RPC_URL`,
        },
        {
          name: "Python",
          mode: "python",
          string: `import base64\n
import requests\n\n
CONTRACT_ADDRESS = "${contractAddress}"\n
LCD_URL = "${endpoint}"\n
QUERY_MSG = b'${message}'\n\n
query_b64encoded = base64.b64encode(QUERY_MSG).decode("ascii")\n
res = requests.get(\n
"{lcd_url}/cosmwasm/wasm/v1/contract/{contract_address}/smart/{{query_b64encoded}}"\n
).json()\n
print(res)`,
        },
        {
          name: "CosmJS",
          mode: "javascript",
          string: `const {{ SigningCosmWasmClient }} = require("@cosmjs/cosmwasm-stargate");\n\n
const rpcURL = "${rpcUrl}";\n
const contractAddress =\n
  "${contractAddress}";\n\n
const queryMsg = ${message};\n\n
const queryContract = async (rpcURL, contractAddress, queryMsg) => {{\n
  const client = await SigningCosmWasmClient.connect(rpcURL);\n\n
  const queryResult = await client.queryContractSmart(\n
    contractAddress,\n
    JSON.parse('${message}')\n
  );\n\n
  console.log(queryResult);\n
}};\n\n
queryContract(rpcURL, contractAddress, queryMsg);
      `,
        },
        {
          name: "Axios",
          mode: "javascript",
          string: `const axios = require('axios');\n\n
const lcdURL = '${endpoint}';\n
const contractAddress =\n
  "${contractAddress}";\n\n
const queryMsg = ${message};\n\n
const queryContract = async () => {{\n
  const queryB64Encoded = Buffer.from(JSON.stringify(queryMsg)).toString('base64');\n
  console.log(res.data);\n
}};\n\n
queryContract();"`,
        },
      ],
    },
    {
      type: "execute",
      snippets: [
        {
          name: "CLI",
          mode: "cli",
          string: `{client} keys add --recover celatone\n
export CHAIN_ID=${chainId}\n
export RPC_URL=${rpcUrl}\n
export CONTRACT_ADDRESS=${contractAddress}\n
export QUERY_MSG='${message}'\n
{client} tx wasm execute $CONTRACT_ADDRESS $QUERY_MSG \\\n
    --from celatone \\\n
    --chain-id $CHAIN_ID \\\n
    --node $RPC_URL"`,
        },
        {
          name: "CosmJs",
          mode: "javascript",
          string: `const { getOfflineSignerAmino, cosmwasm } = require('osmojs');\n
const { SigningCosmWasmClient } = require('@cosmjs/cosmwasm-stargate');\n
const { Dec, IntPretty } = require('@keplr-wallet/unit');\n
const { coins } = require('@cosmjs/amino');\n
const { toUtf8 } = require('@cosmjs/encoding');\n
const { chains } = require('chain-registry');\n
const { executeContract } = cosmwasm.wasm.v1.MessageComposer.withTypeUrl;\n\n
const chain = chains.find(({{ chain_name }}) => chain_name === 'osmosis');\n
const mnemonic = '<Mnemonic>';\n
const contractAddress = ${contractAddress}\n
const execute = async () => {{\n
  const signer = await getOfflineSignerAmino({{ mnemonic, chain }});\n
  const rpcEndpoint = '${rpcUrl}';\n\n
  const client = await SigningCosmWasmClient.connectWithSigner(rpcEndpoint, signer);\n
  const [sender] = await signer.getAccounts();\n
  const msg = executeContract({{\n
    sender: sender.address,\n
    contract: contractAddress,\n
    msg: toUtf8(JSON.stringify(JSON.parse('${message}'))),\n
    funds: [],\n
  }});\n\n
  const gasEstimated = await client.simulate(sender.address, [msg]);\n
  const fee = {{\n
    amount: coins(0, 'uosmo'),\n
    gas: new IntPretty(new Dec(gasEstimated).mul(new Dec(1.3)))\n
      .maxDecimals(0)\n
      .locale(false)\n
      .toString(),\n
  }};\n
  const tx = await client.signAndBroadcast(sender.address, [msg], fee);\n\n    
  console.log(tx);\n
}};\n\n
execute();\n`,
        },
      ],
    },
  ];

  return (
    <>
      <Button
        isDisabled={isDisable}
        variant="outline-info"
        size="sm"
        ml="auto"
        onClick={onOpen}
      >
        <Icon as={MdCode} boxSize={5} mr={1} />
        Code Snippet
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="4xl">
        <ModalOverlay />
        <ModalContent w="840px">
          <ModalHeader>
            <Icon as={MdCode} color="text.dark" fontSize="24px" />
            <Heading as="h5" variant="h5">
              Code Snippet
            </Heading>
          </ModalHeader>
          <ModalCloseButton color="text.dark" />
          <ModalBody px={4} maxH="640px" overflow="scroll">
            <Tabs>
              <TabList borderBottom="1px solid" borderColor="divider.main">
                {codeSnippets
                  .find((each) => each.type === type)
                  ?.snippets.map((item) => (
                    <CustomTab key={`menu-${item.name}`}>{item.name}</CustomTab>
                  ))}
              </TabList>
              <TabPanels>
                {codeSnippets
                  .find((each) => each.type === type)
                  ?.snippets.map((item) => (
                    <TabPanel key={item.name} px={2} py={4}>
                      <Box
                        bgColor="gray.900"
                        p={4}
                        borderRadius={4}
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
                          value={item.string}
                          setOptions={{
                            showGutter: false,
                            useWorker: false,
                            printMargin: false,
                            wrap: true,
                          }}
                        />
                        <Box position="absolute" top={4} right={4}>
                          <CopyButton value={item.string} />
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
