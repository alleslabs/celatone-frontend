import { Heading, Flex, Text, Box, Grid } from "@chakra-ui/react";
import dayjs from "dayjs";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import { useGetAddressType } from "lib/hooks";
import type { CodeDetails, Option } from "lib/types";
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
          />
        </LabelText>
      ),
      storedBlockRender: (
        <>
          <ExplorerLink
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
          <ExplorerLink value={codeTxInfo.height.toString()} canCopyWithHover />
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

export const CodeInfoSection = ({ codeDetails }: CodeInfoSectionProps) => {
  const getAddressType = useGetAddressType();

  return (
    <Box mb={12}>
      <Heading as="h6" variant="h6" mb={6}>
        Code Information
      </Heading>
      <>
        {codeDetails ? (
          (() => {
            const { hash, height, created, proposal, uploader } = codeDetails;
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
                <LabelText label="Network">
                  {codeDetails.chainId ?? "unknown"}
                </LabelText>
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
                  RENDER CHIP HERE
                </LabelText>
                <LabelText label="Stored on block">
                  <Flex direction="column" gap={1}>
                    {storedBlockRender}
                  </Flex>
                </LabelText>
              </Grid>
            );
          })()
        ) : (
          <Text variant="body2" color="text.dark">
            Error fetching data
          </Text>
        )}
      </>
    </Box>
  );
};
