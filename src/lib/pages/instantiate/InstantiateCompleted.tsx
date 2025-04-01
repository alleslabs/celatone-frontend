import { Button, Flex, Heading } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import ActionPageContainer from "lib/components/ActionPageContainer";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { CelatoneSeo } from "lib/components/Seo";
import { TxReceiptRender } from "lib/components/tx";
import { ContractInteractionTabs } from "lib/types";
import type { BechAddr32 } from "lib/types";
import { feeFromStr } from "lib/utils";

import { InstantiateOffChainForm } from "./component";
import type { InstantiateTxInfo } from ".";

interface InstantiateCompletedProps {
  txInfo: InstantiateTxInfo;
}

const InstantiateCompleted = ({ txInfo }: InstantiateCompletedProps) => {
  const navigate = useInternalNavigate();
  const txFee = txInfo.events.find((e) => e.type === "tx")?.attributes[0].value;
  return (
    <ActionPageContainer>
      <CelatoneSeo pageName="Instantiate contract" />
      <CustomIcon name="check-circle-solid" color="success.main" boxSize={12} />
      <Heading as="h5" variant="h5" mt={3} mb={12}>
        Instantiate Complete!
      </Heading>
      <TxReceiptRender
        receipts={[
          {
            title: "Tx hash",
            html: (
              <ExplorerLink type="tx_hash" value={txInfo.transactionHash} />
            ),
          },
          {
            title: "Contract address",
            html: txInfo.contractAddress ? (
              <ExplorerLink
                type="contract_address"
                value={txInfo.contractAddress}
              />
            ) : undefined,
          },
          {
            title: "Tx fee",
            html: (
              <EstimatedFeeRender
                estimatedFee={feeFromStr(txFee)}
                loading={false}
              />
            ),
          },
        ]}
        variant="full"
      />
      <Flex
        gap={6}
        w="full"
        borderBottomWidth={1}
        borderBottomColor="gray.700"
        pb={8}
        my={8}
      >
        <Button
          w="full"
          variant="outline-gray"
          onClick={() =>
            navigate({ pathname: `/contracts/${txInfo.contractAddress}` })
          }
        >
          View Contract
        </Button>
        <Button
          w="full"
          variant="outline-gray"
          onClick={() =>
            navigate({
              pathname: "/interact-contract",
              query: {
                selectedType: ContractInteractionTabs.Execute,
                contract: txInfo.contractAddress,
              },
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
              pathname: "/interact-contract",
              query: {
                selectedType: ContractInteractionTabs.Query,
                contract: txInfo.contractAddress,
              },
            })
          }
        >
          Query
        </Button>
      </Flex>
      {/* Off chain detail */}
      <InstantiateOffChainForm
        title="Contract Off-Chain Detail"
        subtitle="Filled information below will be saved on Scan only and able to edit later."
        contractAddress={txInfo.contractAddress as BechAddr32}
        contractLabel={txInfo.contractLabel}
        codeId={txInfo.codeId}
        instantiator={txInfo.instantiator}
      />
    </ActionPageContainer>
  );
};

export default InstantiateCompleted;
