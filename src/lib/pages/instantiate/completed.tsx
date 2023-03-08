import { Flex, Heading, Button } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { TxReceiptRender } from "lib/components/tx";
import WasmPageContainer from "lib/components/WasmPageContainer";
import type { ContractAddr } from "lib/types";
import { formatUFee } from "lib/utils";

import type { InstantiateTxInfo } from ".";
import { InstantiateOffChainForm } from "./component/InstantiateOffchainForm";

interface CompletedProps {
  txInfo: InstantiateTxInfo;
}

const Completed = ({ txInfo }: CompletedProps) => {
  const navigate = useInternalNavigate();
  const txFee = txInfo.events.find((e) => e.type === "tx")?.attributes[0].value;
  return (
    <WasmPageContainer>
      <CustomIcon name="check-circle-solid" color="success.main" boxSize="12" />
      <Heading as="h5" variant="h5" mt={3} mb={12}>
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
            value: txFee ? formatUFee(txFee) : "N/A",
          },
        ]}
        variant="full"
      />
      <Flex
        gap={6}
        w="full"
        borderBottomWidth={1}
        borderBottomColor="pebble.700"
        pb={8}
        my={8}
      >
        <Button
          w="full"
          variant="outline-gray"
          onClick={() =>
            navigate({ pathname: `/contract/${txInfo.contractAddress}` })
          }
        >
          View Contract
        </Button>
        <Button
          w="full"
          variant="outline-gray"
          onClick={() =>
            navigate({
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
            navigate({
              pathname: "/query",
              query: { contract: txInfo.contractAddress },
            })
          }
        >
          Query
        </Button>
      </Flex>
      {/* Off chain detail */}
      <InstantiateOffChainForm
        title="Contract Off-Chain Detail"
        subtitle="Filled information below will be saved on Celatone only and able to edit later."
        contractAddress={txInfo.contractAddress as ContractAddr}
        contractLabel={txInfo.contractLabel}
      />
    </WasmPageContainer>
  );
};

export default Completed;
