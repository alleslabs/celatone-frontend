import { Flex, Heading } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import router from "next/router";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { useContractDetail } from "lib/model/contract";
import type { ContractAddr } from "lib/types";
import { addressType, date, dateFromNow, getFirstQueryParam } from "lib/utils";

import { LabelText } from "./LabelText";

export const InstantiateInfo = () => {
  /**
   * @todos
   * - Make an interface
   * - All these are mockups, Wireup with real data and map render LabelText
   */

  const contractAddress = getFirstQueryParam(router.query.contractAddress);
  const { currentChainName } = useWallet();
  const contractDetail = useContractDetail(contractAddress as ContractAddr);

  if (!contractDetail || !contractDetail.instantiateInfo) return null;

  const renderAddressType = () => {
    switch (addressType(contractAddress, currentChainName)) {
      case "contract_address":
        return "(Contract Address)";
      case "user_address":
        return "(Wallet Address)";
      default:
        break;
    }
    return "";
  };

  return (
    <Flex direction="column" gap={6} w="180px">
      <Heading as="h6" variant="h6">
        Instantiate Info
      </Heading>

      <LabelText label="Network">{contractDetail.chainId}</LabelText>

      {contractDetail.instantiateInfo && (
        <LabelText
          label="Instantiated Block Height"
          helperText={`${date(
            contractDetail.instantiateInfo?.createdTime.toString()
          )} ${"\n"}  (${dateFromNow(
            contractDetail.instantiateInfo?.createdTime.toString()
          )})`}
        >
          <ExplorerLink
            value={contractDetail.instantiateInfo?.createdHeight.toString()}
            canCopyWithHover
          />
        </LabelText>
      )}

      <LabelText label="Instantiated by" helperText={renderAddressType()}>
        <ExplorerLink
          type="user_address"
          value={contractDetail.instantiateInfo.instantiator}
          canCopyWithHover
        />
      </LabelText>

      <LabelText
        label="From Code"
        helperText={contractDetail.codeInfo?.description}
      >
        <ExplorerLink
          value={contractDetail.instantiateInfo?.codeId}
          canCopyWithHover
        />
      </LabelText>

      {contractDetail.initTxHash && (
        <LabelText label="Instantiate Transaction">
          <ExplorerLink
            type="tx_hash"
            value={contractDetail.initTxHash.toUpperCase()}
            canCopyWithHover
          />
        </LabelText>
      )}

      {contractDetail.initProposalId && (
        <LabelText
          label="Instantiate Proposal ID"
          helperText={contractDetail.initProposalTitle}
        >
          <ExplorerLink
            value={`#${contractDetail.initProposalId.toString()}`}
            canCopyWithHover
          />
        </LabelText>
      )}

      {contractDetail.instantiateInfo?.admin && (
        <LabelText label="Admin Address">
          <ExplorerLink
            type="user_address"
            value={contractDetail.instantiateInfo.admin}
          />
        </LabelText>
      )}

      {contractDetail.instantiateInfo?.ibcPortId && (
        <LabelText label="IBC Port ID">
          {contractDetail.instantiateInfo?.ibcPortId}
        </LabelText>
      )}
    </Flex>
  );
};
