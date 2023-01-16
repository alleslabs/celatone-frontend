import { Divider, Flex, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import { useGetAddressType } from "lib/hooks";
import type { ContractData } from "lib/model/contract";
import { formatUTC, dateFromNow } from "lib/utils";
import { getAddressTypeText } from "lib/utils/address";

interface InstantiateInfoProps {
  contractData: ContractData;
}

export const InstantiateInfo = ({ contractData }: InstantiateInfoProps) => {
  const getAddressType = useGetAddressType();

  const renderDataFound = () => {
    if (contractData.instantiateInfo) {
      const instantiatorType = getAddressType(
        contractData.instantiateInfo.instantiator
      );
      return (
        <>
          <LabelText label="Network">{contractData.chainId}</LabelText>

          <LabelText
            label="From Code"
            helperText1={contractData.codeInfo?.description}
          >
            <ExplorerLink
              type="code_id"
              value={contractData.instantiateInfo.codeId}
              canCopyWithHover
            />
          </LabelText>

          {contractData.instantiateInfo.admin && (
            <LabelText label="Admin Address">
              <ExplorerLink
                type="user_address"
                value={contractData.instantiateInfo.admin}
                canCopyWithHover
              />
            </LabelText>
          )}

          <Divider border="1px solid" borderColor="divider.main" />

          {contractData.instantiateInfo &&
            (contractData.instantiateInfo.createdHeight !== -1 ? (
              <LabelText
                label="Instantiated Block Height"
                helperText1={
                  contractData.instantiateInfo.createdTime
                    ? formatUTC(contractData.instantiateInfo.createdTime)
                    : undefined
                }
                helperText2={
                  contractData.instantiateInfo.createdTime
                    ? dateFromNow(contractData.instantiateInfo.createdTime)
                    : undefined
                }
              >
                <ExplorerLink
                  value={contractData.instantiateInfo.createdHeight.toString()}
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
              value={contractData.instantiateInfo.instantiator}
              canCopyWithHover
            />
          </LabelText>

          {contractData.initProposalId ? (
            <LabelText
              label="Instantiate Proposal ID"
              helperText1={contractData.initProposalTitle}
            >
              <ExplorerLink
                value={`#${contractData.initProposalId.toString()}`}
                canCopyWithHover
              />
            </LabelText>
          ) : (
            <LabelText label="Instantiate Transaction">
              <ExplorerLink
                type="tx_hash"
                value={contractData.initTxHash?.toUpperCase() ?? "Genesis"}
                canCopyWithHover
                isReadOnly={!contractData.initTxHash}
              />
            </LabelText>
          )}

          {contractData.instantiateInfo.ibcPortId && (
            <LabelText label="IBC Port ID">
              {contractData.instantiateInfo.ibcPortId}
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
    <Flex direction="column" gap={6} w="250px">
      {renderDataFound()}
    </Flex>
  );
};
