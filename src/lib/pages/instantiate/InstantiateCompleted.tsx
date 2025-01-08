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

import type { InstantiateTxInfo } from ".";
import { InstantiateOffChainForm } from "./component";

interface InstantiateCompletedProps {
  txInfo: InstantiateTxInfo;
}

const InstantiateCompleted = ({ txInfo }: InstantiateCompletedProps) => {
  const navigate = useInternalNavigate();
  const txFee = txInfo.events.find((e) => e.type === "tx")?.attributes[0].value;
  return (
    <ActionPageContainer>
      <CelatoneSeo pageName="Instantiate Contract" />
      <CustomIcon name="check-circle-solid" boxSize={12} color="success.main" />
      <Heading as="h5" mb={12} mt={3} variant="h5">
        Instantiate Complete!
      </Heading>
      <TxReceiptRender
        receipts={[
          {
            html: (
              <ExplorerLink type="tx_hash" value={txInfo.transactionHash} />
            ),
            title: "Tx Hash",
          },
          {
            html: txInfo.contractAddress ? (
              <ExplorerLink
                type="contract_address"
                value={txInfo.contractAddress}
              />
            ) : undefined,
            title: "Contract Address",
          },
          {
            html: (
              <EstimatedFeeRender
                estimatedFee={feeFromStr(txFee)}
                loading={false}
              />
            ),
            title: "Tx Fee",
          },
        ]}
        variant="full"
      />
      <Flex
        borderBottomWidth={1}
        gap={6}
        my={8}
        pb={8}
        w="full"
        borderBottomColor="gray.700"
      >
        <Button
          variant="outline-gray"
          w="full"
          onClick={() =>
            navigate({ pathname: `/contracts/${txInfo.contractAddress}` })
          }
        >
          View Contract
        </Button>
        <Button
          variant="outline-gray"
          w="full"
          onClick={() =>
            navigate({
              pathname: "/interact-contract",
              query: {
                contract: txInfo.contractAddress,
                selectedType: ContractInteractionTabs.Execute,
              },
            })
          }
        >
          Execute
        </Button>
        <Button
          variant="outline-gray"
          w="full"
          onClick={() =>
            navigate({
              pathname: "/interact-contract",
              query: {
                contract: txInfo.contractAddress,
                selectedType: ContractInteractionTabs.Query,
              },
            })
          }
        >
          Query
        </Button>
      </Flex>
      {/* Off chain detail */}
      <InstantiateOffChainForm
        subtitle="Filled information below will be saved on Celatone only and able to edit later."
        title="Contract Off-Chain Detail"
        codeId={txInfo.codeId}
        contractAddress={txInfo.contractAddress as BechAddr32}
        contractLabel={txInfo.contractLabel}
        instantiator={txInfo.instantiator}
      />
    </ActionPageContainer>
  );
};

export default InstantiateCompleted;
