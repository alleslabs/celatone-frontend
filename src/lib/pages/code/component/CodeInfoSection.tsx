import { Heading, Flex, Text, Box, Grid, Button, Icon } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import { PermissionChip } from "lib/components/PermissionChip";
import { useGetAddressType } from "lib/hooks";
import type { CodeDetails, Option, PermissionAddresses } from "lib/types";
import { getAddressTypeText } from "lib/utils/address";

interface CodeInfoSectionProps {
  codeDetails: Option<CodeDetails>;
}

const getMethodSpecificRender = (
  codeProposalInfo: CodeDetails["proposal"],
  codeTxInfo: Pick<CodeDetails, "hash" | "height" | "created">
): { methodRender: JSX.Element; storedBlockRender: JSX.Element } => {
  if (codeProposalInfo) {
    return {
      methodRender: (
        <LabelText label="Proposal ID ">
          <ExplorerLink
            value={codeProposalInfo.proposalId.toString()}
            canCopyWithHover
            /**
             * @todos remove isReadOnly and add type proposal when proposal page is up
             */
            isReadOnly
          />
        </LabelText>
      ),
      storedBlockRender: (
        <>
          <ExplorerLink
            type="block"
            value={(codeProposalInfo.height ?? "").toString()}
            canCopyWithHover
          />
          <Text variant="body3" color="text.dark">
            ({dayjs(codeProposalInfo.created).fromNow()})
          </Text>
          <Text variant="body3" color="text.dark">
            {dayjs(codeProposalInfo.created)
              .utc()
              .format("MMM DD, YYYY, h:mm:ss A [UTC]")}
          </Text>
        </>
      ),
    };
  }
  if (codeTxInfo.hash && codeTxInfo.height) {
    return {
      methodRender: (
        <LabelText label="Upload Transaction">
          <ExplorerLink
            type="tx_hash"
            value={codeTxInfo.hash}
            canCopyWithHover
          />
        </LabelText>
      ),
      storedBlockRender: (
        <>
          <ExplorerLink
            type="block"
            value={codeTxInfo.height.toString()}
            canCopyWithHover
          />
          <Text variant="body3" color="text.dark">
            ({dayjs(codeTxInfo.created).fromNow()})
          </Text>
          <Text variant="body3" color="text.dark">
            {dayjs(codeTxInfo.created)
              .utc()
              .format("MMM DD, YYYY, h:mm:ss A ([UTC])")}
          </Text>
        </>
      ),
    };
  }
  return {
    methodRender: <LabelText label="Created on">Genesis</LabelText>,
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

const CodeDetailsRender = ({ codeDetails }: { codeDetails: CodeDetails }) => {
  const getAddressType = useGetAddressType();
  const {
    hash,
    height,
    created,
    proposal,
    uploader,
    instantiatePermission,
    permissionAddresses,
  } = codeDetails;
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
    <Grid templateColumns="repeat(5, 1fr)" columnGap={12}>
      <LabelText label="Network">{codeDetails.chainId ?? "unknown"}</LabelText>
      <LabelText label="Uploaded by">
        <Flex direction="column" gap={1}>
          <ExplorerLink type={uploaderType} value={uploader} canCopyWithHover />
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
  );
};

export const CodeInfoSection = ({ codeDetails }: CodeInfoSectionProps) => {
  return (
    <Box mb={12}>
      <Heading as="h6" variant="h6" mb={6}>
        Code Information
      </Heading>
      {codeDetails ? (
        <CodeDetailsRender codeDetails={codeDetails} />
      ) : (
        <Text variant="body2" color="text.dark">
          Error fetching data
        </Text>
      )}
    </Box>
  );
};
