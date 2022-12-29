import { Flex, Heading, Text } from "@chakra-ui/react";
import router from "next/router";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import { useAddressType } from "lib/hooks";
import type { ContractDetail } from "lib/model/contract";
import { date, dateFromNow, getFirstQueryParam } from "lib/utils";

interface InstantiateInfoProps {
  contractDetail: ContractDetail;
}
export const InstantiateInfo = ({ contractDetail }: InstantiateInfoProps) => {
  const contractAddress = getFirstQueryParam(router.query.contractAddress);
  const addressType = useAddressType(contractAddress);

  const renderAddressType = () => {
    switch (addressType) {
      case "contract_address":
        return "(Contract Address)";
      case "user_address":
        return "(Wallet Address)";
      default:
        break;
    }
    return "";
  };

  const renderDataFound = () => {
    if (contractDetail?.instantiateInfo) {
      return (
        <>
          <LabelText label="Network">{contractDetail.chainId}</LabelText>

          {contractDetail.instantiateInfo &&
            (contractDetail.instantiateInfo.createdHeight ? (
              <LabelText
                label="Instantiated Block Height"
                helperText={`${date(
                  contractDetail.instantiateInfo.createdTime.toString()
                )} ${"\n"}  (${dateFromNow(
                  contractDetail.instantiateInfo.createdTime.toString()
                )})`}
              >
                <ExplorerLink
                  value={contractDetail.instantiateInfo.createdHeight.toString()}
                  canCopyWithHover
                />
              </LabelText>
            ) : (
              <LabelText label="Instantiated Block Height">N/A</LabelText>
            ))}

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
              value={contractDetail.instantiateInfo.codeId}
              canCopyWithHover
            />
          </LabelText>

          {contractDetail.initProposalId ? (
            <LabelText
              label="Instantiate Proposal ID"
              helperText={contractDetail.initProposalTitle}
            >
              <ExplorerLink
                value={`#${contractDetail.initProposalId.toString()}`}
                canCopyWithHover
              />
            </LabelText>
          ) : (
            <LabelText label="Instantiate Transaction">
              <ExplorerLink
                type="tx_hash"
                value={contractDetail.initTxHash?.toUpperCase() ?? ""}
                canCopyWithHover
              />
            </LabelText>
          )}

          {contractDetail.instantiateInfo.admin && (
            <LabelText label="Admin Address">
              <ExplorerLink
                type="user_address"
                value={contractDetail.instantiateInfo.admin}
              />
            </LabelText>
          )}

          {contractDetail.instantiateInfo.ibcPortId && (
            <LabelText label="IBC Port ID">
              {contractDetail.instantiateInfo.ibcPortId}
            </LabelText>
          )}
        </>
      );
    }
    return (
      <Text variant="body2" color="text.dark">
        Error fetching data
      </Text>
    );
  };

  return (
    <Flex direction="column" gap={6} w="180px">
      <Heading as="h6" variant="h6">
        Instantiate Info
      </Heading>
      {renderDataFound()}
    </Flex>
  );
};
