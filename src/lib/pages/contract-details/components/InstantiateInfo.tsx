import { Box, chakra, Divider, Flex, Text } from "@chakra-ui/react";

import type { ContractData } from "../types";
import { useGetAddressType } from "lib/app-provider";
import { Copier } from "lib/components/copy";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import { Loading } from "lib/components/Loading";
import type { Option } from "lib/types";
import { formatUTC, dateFromNow } from "lib/utils";
import { getAddressTypeText } from "lib/utils/address";

interface InstantiateInfoProps {
  chainId: ContractData["chainId"];
  codeLocalInfo: ContractData["codeLocalInfo"];
  contractDetail: ContractData["contractDetail"];
  contractCw2Info: ContractData["contractCw2Info"];
  initTxHash: ContractData["initTxHash"];
  initProposalId: ContractData["initProposalId"];
  initProposalTitle: ContractData["initProposalTitle"];
  createdHeight: ContractData["createdHeight"];
  createdTime: ContractData["createdTime"];
  rawContractResponse: ContractData["rawContractResponse"];
  isLoading: boolean;
}

const Container = chakra(Flex, {
  baseStyle: {
    flexDir: "column",
    gap: 6,
    w: "250px",
  },
});

const PortIdRender = ({ portId }: { portId: string }) => {
  const charArray = portId.match(/.{1,28}/g);

  return (
    <Box
      className="copier-wrapper"
      fontSize="14px"
      transition="all .25s ease-in-out"
    >
      {charArray?.map((line, idx) =>
        idx === charArray.length - 1 ? (
          <Flex align="center" key={line}>
            {line}
            <Copier type="ibc_port" value={portId} display="none" />
          </Flex>
        ) : (
          line
        )
      )}
    </Box>
  );
};

const InitRender = ({
  initTxHash,
  initProposalTitle,
  initProposalId,
  createdHeight,
}: {
  initTxHash: ContractData["initTxHash"];
  initProposalTitle: ContractData["initProposalTitle"];
  initProposalId: ContractData["initProposalId"];
  createdHeight: Option<number>;
}) => {
  if (initTxHash) {
    return (
      <LabelText label="Instantiate Transaction">
        <ExplorerLink
          type="tx_hash"
          value={initTxHash.toUpperCase()}
          showCopyOnHover
        />
      </LabelText>
    );
  }

  if (initProposalTitle && initProposalId) {
    return (
      <LabelText
        label="Instantiate Proposal ID"
        helperText1={initProposalTitle}
      >
        <ExplorerLink
          type="proposal_id"
          value={initProposalId.toString()}
          showCopyOnHover
        />
      </LabelText>
    );
  }

  return createdHeight === 0 ? (
    <LabelText label="Created by">
      <Text variant="body2">Genesis</Text>
    </LabelText>
  ) : (
    <LabelText label="Instantiate Transaction">
      <Text variant="body2">N/A</Text>
    </LabelText>
  );
};

export const InstantiateInfo = ({
  chainId,
  codeLocalInfo,
  contractDetail,
  contractCw2Info,
  initTxHash,
  initProposalId,
  initProposalTitle,
  createdHeight,
  createdTime,
  rawContractResponse,
  isLoading,
}: InstantiateInfoProps) => {
  const getAddressType = useGetAddressType();

  if (isLoading)
    return (
      <Container>
        <Loading />
      </Container>
    );

  if (!contractDetail) {
    return (
      <Container>
        <Text variant="body2" color="text.dark">
          Error fetching data
        </Text>
      </Container>
    );
  }

  const instantiatorType = getAddressType(contractDetail.instantiator);
  const adminType = getAddressType(contractDetail.admin);

  return (
    <Container>
      <LabelText label="Network">{chainId}</LabelText>

      <LabelText label="From Code" helperText1={codeLocalInfo?.name}>
        <ExplorerLink
          type="code_id"
          value={contractDetail.codeId.toString()}
          showCopyOnHover
        />
      </LabelText>

      <LabelText label="CW2 Info">
        {contractCw2Info ? (
          <Text variant="body2">
            {contractCw2Info.contract} ({contractCw2Info.version})
          </Text>
        ) : (
          <Text variant="body2" color="text.dark">
            No Info
          </Text>
        )}
      </LabelText>

      {contractDetail.admin ? (
        <LabelText
          label="Admin Address"
          helperText1={getAddressTypeText(adminType)}
        >
          <ExplorerLink
            type={adminType}
            value={contractDetail.admin}
            showCopyOnHover
          />
        </LabelText>
      ) : (
        <LabelText label="Admin Address">
          <Text variant="body2" color="text.dark">
            No Admin
          </Text>
        </LabelText>
      )}

      <Divider border="1px solid" borderColor="gray.700" />

      {createdHeight ? (
        <LabelText
          label="Instantiated Block Height"
          helperText1={createdTime ? formatUTC(createdTime) : undefined}
          helperText2={createdTime ? dateFromNow(createdTime) : undefined}
        >
          <ExplorerLink
            type="block_height"
            value={createdHeight.toString()}
            showCopyOnHover
          />
        </LabelText>
      ) : (
        <LabelText label="Instantiated Block Height">N/A</LabelText>
      )}

      <LabelText
        label="Instantiated by"
        helperText1={getAddressTypeText(instantiatorType)}
      >
        <ExplorerLink
          type={instantiatorType}
          value={contractDetail.instantiator ?? "N/A"}
          showCopyOnHover
        />
      </LabelText>

      <InitRender
        initTxHash={initTxHash}
        initProposalId={initProposalId}
        initProposalTitle={initProposalTitle}
        createdHeight={createdHeight}
      />

      {rawContractResponse?.contract_info.ibc_port_id && (
        <LabelText label="IBC Port ID">
          <PortIdRender
            portId={rawContractResponse.contract_info.ibc_port_id}
          />
        </LabelText>
      )}
    </Container>
  );
};
