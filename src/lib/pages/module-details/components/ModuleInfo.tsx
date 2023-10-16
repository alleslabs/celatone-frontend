import { chakra, Flex, Heading, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { LabelText } from "lib/components/LabelText";
import { Loading } from "lib/components/Loading";
import { ModuleSourceCode } from "lib/components/module";
import type { ModuleVerificationInternal } from "lib/services/module";
import type { ModuleDetailsQueryResponse } from "lib/services/moduleService";
import { type IndexedModule } from "lib/services/moduleService";
import type { Nullable, Option } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

const DetailsContainer = chakra(Flex, {
  baseStyle: {
    p: 4,
    borderRadius: "8px",
    border: "1px solid",
    borderColor: "gray.700",
    columnGap: 6,
    "& > div": { flex: 1 },
  },
});

interface ModuleInfoProps {
  moduleDetails: Option<ModuleDetailsQueryResponse>;
  upgradePolicy: IndexedModule["upgradePolicy"];
  verificationData: Option<Nullable<ModuleVerificationInternal>>;
  isLoading: boolean;
}

const InitRender = ({
  initTxHash,
  initProposalTitle,
  initProposalId,
  createdHeight,
}: {
  initTxHash: ModuleDetailsQueryResponse["initTxHash"];
  initProposalTitle: ModuleDetailsQueryResponse["initProposalTitle"];
  initProposalId: ModuleDetailsQueryResponse["initProposalId"];
  createdHeight: Option<number>;
}) => {
  if (initTxHash) {
    return (
      <LabelText label="Initial Published Transaction">
        <ExplorerLink
          type="tx_hash"
          value={initTxHash.toUpperCase()}
          showCopyOnHover
          fixedHeight
        />
      </LabelText>
    );
  }

  if (initProposalTitle && initProposalId) {
    return (
      <LabelText
        label="Initial Published Proposal ID"
        helperText1={initProposalTitle}
      >
        <ExplorerLink
          type="proposal_id"
          value={initProposalId.toString()}
          showCopyOnHover
          fixedHeight
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

const ModuleDetailsBody = ({
  moduleDetails,
  isLoading,
  upgradePolicy,
}: Omit<ModuleInfoProps, "verificationData">) => {
  if (isLoading)
    return (
      <DetailsContainer>
        <Loading my={0} />
      </DetailsContainer>
    );
  if (!moduleDetails)
    return (
      <DetailsContainer>
        <Text variant="body2" color="text.dark" mx="auto">
          Error fetching data
        </Text>
      </DetailsContainer>
    );

  const {
    createdHeight,
    createdTime,
    publisherVmAddress,
    initProposalId,
    initProposalTitle,
    initTxHash,
  } = moduleDetails;

  return (
    <DetailsContainer>
      <LabelText label="Upgrade Policy">{upgradePolicy}</LabelText>
      <LabelText
        label="Initial Published Block Height"
        helperText1={createdTime ? formatUTC(createdTime) : undefined}
        helperText2={createdTime ? dateFromNow(createdTime) : undefined}
      >
        {createdHeight !== undefined ? (
          <ExplorerLink
            type="block_height"
            value={createdHeight.toString()}
            showCopyOnHover
            fixedHeight
          />
        ) : (
          "N/A"
        )}
      </LabelText>
      <LabelText label="Initial Published by" helperText1="(VM Address)">
        <ExplorerLink
          type="user_address"
          value={publisherVmAddress}
          showCopyOnHover
          fixedHeight
        />
      </LabelText>
      <InitRender
        initProposalId={initProposalId}
        initProposalTitle={initProposalTitle}
        initTxHash={initTxHash}
        createdHeight={createdHeight}
      />
    </DetailsContainer>
  );
};

export const ModuleInfo = ({
  verificationData,
  ...details
}: ModuleInfoProps) => {
  return (
    <Flex flexDirection="column" gap={4}>
      <Flex justifyContent="space-between" alignItems="center" w="full">
        <Heading as="h6" variant="h6" fontWeight={600}>
          Module Information
        </Heading>
        {verificationData?.source && (
          <Flex alignItems="center" gap={1}>
            <CustomIcon name="check-circle-solid" color="success.main" />
            <Text variant="body2" color="text.dark">
              This module&#39;s verification is supported by its provided source
              code.
            </Text>
          </Flex>
        )}
      </Flex>
      <ModuleDetailsBody {...details} />
      <ModuleSourceCode sourceCode={verificationData?.source} />
    </Flex>
  );
};
