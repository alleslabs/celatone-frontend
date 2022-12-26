import { Flex, Icon, Heading, Button } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useRouter } from "next/router";
import { MdCheckCircle } from "react-icons/md";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { InstantiateOffChainDetail } from "lib/components/InstantiateOffchainDetail";
import { TxReceiptRender } from "lib/components/tx/receipt";
import WasmPageContainer from "lib/components/WasmPageContainer";
import { getExplorerContractAddressUrl } from "lib/data";
import type { ContractAddr } from "lib/types";
import { formatUFee } from "lib/utils";

import type { InstantiateTxInfo } from ".";

interface CompletedProps {
  txInfo: InstantiateTxInfo;
}

const Completed = ({ txInfo }: CompletedProps) => {
  const router = useRouter();
  const { currentChainName } = useWallet();

  return (
    <WasmPageContainer>
      <Icon as={MdCheckCircle} color="success.main" boxSize="12" />
      <Heading as="h4" variant="h4" color="text.main" mt={3} mb={12}>
        Instantiate Complete!
      </Heading>
      <TxReceiptRender
        receipts={[
          {
            title: "Tx Hash",
            html: (
              <ExplorerLink type="tx_hash" value={txInfo.transactionHash} />
            ),
          },
          {
            title: "Contract Address",
            html: (
              <ExplorerLink
                type="contract_address"
                value={txInfo.contractAddress}
              />
            ),
          },
          {
            title: "Tx Fee",
            // TODO: Implement event/rawlog attribute picker
            value: `${formatUFee(
              txInfo.events.find((e) => e.type === "tx")?.attributes[0].value ??
                "0u"
            )}`,
          },
        ]}
        variant="full"
      />
      <Flex
        gap={6}
        w="full"
        borderBottomWidth={1}
        borderBottomColor="divider.main"
        pb={8}
        my={8}
      >
        <Button
          w="full"
          variant="outline-gray"
          onClick={() =>
            window.open(
              `${getExplorerContractAddressUrl(currentChainName)}/${
                txInfo.contractAddress
              }`,
              "_blank",
              "noopener,noreferrer"
            )
          }
        >
          View Contract
        </Button>
        <Button
          w="full"
          variant="outline-gray"
          onClick={() =>
            router.push({
              pathname: "/execute",
              query: { contract: txInfo.contractAddress },
            })
          }
        >
          Execute
        </Button>
        <Button
          w="full"
          variant="outline-gray"
          onClick={() =>
            router.push({
              pathname: "/query",
              query: { contract: txInfo.contractAddress },
            })
          }
        >
          Query
        </Button>
      </Flex>
      {/* Off chain detail */}
      <InstantiateOffChainDetail
        title="Contract Off-Chain Detail"
        subtitle="Filled information below will be saved on Celatone only and able to edit later."
        contractAddress={txInfo.contractAddress as ContractAddr}
        contractLabel={txInfo.contractLabel}
      />
    </WasmPageContainer>
  );
};

export default Completed;
