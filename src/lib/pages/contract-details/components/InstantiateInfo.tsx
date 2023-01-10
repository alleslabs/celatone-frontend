import { Flex, Heading, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import type { AddressReturnType } from "lib/hooks";
import { useGetAddressType } from "lib/hooks";
import type { ContractDetail } from "lib/model/contract";
import { formatUTC, dateFromNow } from "lib/utils";

const getAddressTypeText = (addressType: AddressReturnType) => {
  switch (addressType) {
    case "contract_address":
      return "(Contract Address)";
    case "user_address":
      return "(Wallet Address)";
    default:
      return "(Invalid Address)";
  }
};

interface InstantiateInfoProps {
  contractDetail: ContractDetail;
}

export const InstantiateInfo = ({ contractDetail }: InstantiateInfoProps) => {
  const getAddressType = useGetAddressType();

  const renderDataFound = () => {
    if (contractDetail?.instantiateInfo) {
      const instantiatorType = getAddressType(
        contractDetail.instantiateInfo.instantiator
      );
      return (
        <>
          <LabelText label="Network">{contractDetail.chainId}</LabelText>

          {contractDetail.instantiateInfo &&
            (contractDetail.instantiateInfo.createdHeight !== -1 ? (
              <LabelText
                label="Instantiated Block Height"
                helperText1={formatUTC(
                  contractDetail.instantiateInfo.createdTime.toString()
                )}
                helperText2={dateFromNow(
                  contractDetail.instantiateInfo.createdTime.toString()
                )}
              >
                <ExplorerLink
                  value={contractDetail.instantiateInfo.createdHeight.toString()}
                  canCopyWithHover
                />
              </LabelText>
            ) : (
              <LabelText label="Instantiated Block Height">N/A</LabelText>
            ))}

          <LabelText
            label="Instantiated by"
            helperText1={getAddressTypeText(instantiatorType)}
          >
            <ExplorerLink
              type="user_address"
              value={contractDetail.instantiateInfo.instantiator}
              canCopyWithHover
            />
          </LabelText>

          <LabelText
            label="From Code"
            helperText1={contractDetail.codeInfo?.description}
          >
            <ExplorerLink
              type="code_id"
              value={contractDetail.instantiateInfo.codeId}
              canCopyWithHover
            />
          </LabelText>

          {contractDetail.initProposalId ? (
            <LabelText
              label="Instantiate Proposal ID"
              helperText1={contractDetail.initProposalTitle}
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
                value={contractDetail.initTxHash?.toUpperCase() ?? "Genesis"}
                canCopyWithHover
                isReadOnly={!contractDetail.initTxHash}
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
