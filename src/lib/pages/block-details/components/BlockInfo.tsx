import { Box, Flex, Heading } from "@chakra-ui/react";

import { useCelatoneApp } from "lib/app-provider";
import { LabelText } from "lib/components/LabelText";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { ValidatorBadge } from "lib/components/ValidatorBadge";
import type { BlockData } from "lib/types";
import { formatInteger } from "lib/utils";

interface BlockInfoProps {
  blockData: BlockData;
}

export const BlockInfo = ({ blockData }: BlockInfoProps) => {
  const { currentChainId } = useCelatoneApp();
  return (
    <Box mb={12}>
      <Flex mb={6} justifyContent="space-between">
        <Heading as="h6" variant="h6">
          Block Info
        </Heading>
        <UserDocsLink
          cta="More about Block"
          href="general/block/detail-page"
          mt={0}
        />
      </Flex>
      <Flex gap={{ base: 4, md: 12 }} direction={{ base: "column", md: "row" }}>
        <Flex direction="row" flex="1" maxW={{ md: "400px" }}>
          <LabelText flex="1" label="Network">
            {currentChainId}
          </LabelText>
          <LabelText flex="1" label="Gas (Used/Wanted)">
            {`${blockData.gasUsed ? formatInteger(blockData.gasUsed) : 0} / ${
              blockData.gasLimit ? formatInteger(blockData.gasLimit) : 0
            }`}
          </LabelText>
        </Flex>
        <LabelText label="Proposed by" flex="1" minW={0}>
          <ValidatorBadge
            validator={blockData.proposer}
            badgeSize={6}
            hasLabel={false}
          />
        </LabelText>
      </Flex>
    </Box>
  );
};
