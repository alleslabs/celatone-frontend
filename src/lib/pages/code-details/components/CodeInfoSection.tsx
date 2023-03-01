import { Heading, Flex, Text, Box, Grid, Button, Icon } from "@chakra-ui/react";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

import { useGetAddressType } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import { PermissionChip } from "lib/components/PermissionChip";
import type { CodeData, PermissionAddresses } from "lib/types";
import { dateFromNow, formatUTC, getAddressTypeText } from "lib/utils";

interface CodeInfoSectionProps {
  codeData: CodeData;
  chainId: string;
}

const getMethodSpecificRender = (
  codeProposalInfo: CodeData["proposal"],
  codeTxInfo: Pick<CodeData, "hash" | "height" | "created">
): { methodRender: JSX.Element; storedBlockRender: JSX.Element } => {
  if (codeProposalInfo) {
    const { height, created, proposalId } = codeProposalInfo;
    return {
      methodRender: (
        <LabelText label="Proposal ID">
          <ExplorerLink
            type="proposal_id"
            value={proposalId.toString()}
            canCopyWithHover
          />
        </LabelText>
      ),
      storedBlockRender:
        height && created ? (
          <>
            <ExplorerLink
              type="block_height"
              value={height.toString()}
              canCopyWithHover
            />
            <Text variant="body3" color="text.dark">
              {formatUTC(created)}
            </Text>
            <Text variant="body3" color="text.dark">
              {dateFromNow(created)}
            </Text>
          </>
        ) : (
          <Text variant="body2">N/A</Text>
        ),
    };
  }
  if (codeTxInfo.hash) {
    const { hash, height, created } = codeTxInfo;
    return {
      methodRender: (
        <LabelText label="Upload Transaction">
          <ExplorerLink type="tx_hash" value={hash} canCopyWithHover />
        </LabelText>
      ),
      storedBlockRender:
        height && created ? (
          <>
            <ExplorerLink
              type="block_height"
              value={height.toString()}
              canCopyWithHover
            />
            <Text variant="body3" color="text.dark">
              {formatUTC(created)}
            </Text>
            <Text variant="body3" color="text.dark">
              {dateFromNow(created)}
            </Text>
          </>
        ) : (
          <Text variant="body3" color="text.dark">
            N/A
          </Text>
        ),
    };
  }
  /**
   * @todo Add genesis conditioning when the view table is available
   */
  return {
    methodRender: <LabelText label="Created on">N/A</LabelText>,
    storedBlockRender: <Text variant="body2">N/A</Text>,
  };
};

const ViewAddresses = ({
  permissionAddresses,
}: {
  permissionAddresses: PermissionAddresses;
}) => {
  const [viewAll, setViewAll] = useState(false);
  const getAddressType = useGetAddressType();
  return (
    <>
      {(viewAll || permissionAddresses.length === 1) &&
        permissionAddresses.map((addr) => {
          return (
            <ExplorerLink
              key={addr}
              type={getAddressType(addr)}
              value={addr}
              canCopyWithHover
            />
          );
        })}
      {permissionAddresses.length > 1 && (
        <Button
          variant="ghost-primary"
          onClick={() => setViewAll((prev) => !prev)}
          size="sm"
          p="unset"
          w="fit-content"
          rightIcon={
            <Icon
              as={FiChevronDown}
              boxSize={4}
              sx={{ transform: viewAll ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          }
        >
          {viewAll ? "See Less" : "View All Addresses"}
        </Button>
      )}
    </>
  );
};

export const CodeInfoSection = ({
  codeData,
  chainId,
}: CodeInfoSectionProps) => {
  const getAddressType = useGetAddressType();
  const {
    hash,
    height,
    created,
    proposal,
    uploader,
    instantiatePermission,
    permissionAddresses,
  } = codeData;
  const { methodRender, storedBlockRender } = getMethodSpecificRender(
    proposal,
    {
      hash,
      height,
      created,
    }
  );
  const uploaderType = getAddressType(uploader);

  return (
    <Box mb={12}>
      <Heading as="h6" variant="h6" mb={6}>
        Code Information
      </Heading>
      <Grid templateColumns="repeat(5, 1fr)" columnGap={12}>
        <LabelText label="Network">{chainId}</LabelText>
        <LabelText label="Uploaded by">
          <Flex direction="column" gap={1}>
            <ExplorerLink
              type={uploaderType}
              value={uploader}
              canCopyWithHover
            />
            <Text variant="body3" color="text.dark">
              {getAddressTypeText(uploaderType)}
            </Text>
          </Flex>
        </LabelText>
        {methodRender}
        <LabelText label="Instantiate Permission">
          <Flex direction="column" gap={1}>
            <PermissionChip
              instantiatePermission={instantiatePermission}
              permissionAddresses={permissionAddresses}
            />
            <ViewAddresses permissionAddresses={permissionAddresses} />
          </Flex>
        </LabelText>
        <LabelText label="Stored on block">
          <Flex direction="column" gap={1}>
            {storedBlockRender}
          </Flex>
        </LabelText>
      </Grid>
    </Box>
  );
};
