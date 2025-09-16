import type { BlockData } from "lib/types";

import { Box, Flex, Grid, GridItem, Heading } from "@chakra-ui/react";
import { useCelatoneApp, useTierConfig } from "lib/app-provider";
import { LabelText } from "lib/components/LabelText";
import { ValidatorBadge } from "lib/components/ValidatorBadge";
import { formatInteger } from "lib/utils";

interface BlockInfoProps {
  blockData: BlockData;
}

export const BlockInfo = ({ blockData }: BlockInfoProps) => {
  const { currentChainId } = useCelatoneApp();
  const { isLiteTier } = useTierConfig();
  return (
    <Box mb={12}>
      <Flex justifyContent="space-between" mb={6}>
        <Heading as="h6" variant="h6">
          Block info
        </Heading>
      </Flex>
      {!isLiteTier ? (
        <Grid
          columnGap={16}
          rowGap={6}
          templateColumns={{
            base: "repeat(2, 1fr)",
            md: "repeat(3, max-content)",
          }}
        >
          <GridItem>
            <LabelText flex={1} label="Network">
              {currentChainId}
            </LabelText>
          </GridItem>
          <GridItem order={{ base: 3, md: 2 }}>
            <LabelText flex={1} label="Proposed by" minW={0}>
              <ValidatorBadge
                badgeSize={6}
                hasLabel={false}
                validator={blockData.proposer}
              />
            </LabelText>
          </GridItem>
          <GridItem order={{ base: 2, md: 3 }}>
            <LabelText flex={1} label="Gas (Used/Wanted)">
              {`${blockData.gasUsed ? formatInteger(blockData.gasUsed) : 0} / ${
                blockData.gasLimit ? formatInteger(blockData.gasLimit) : 0
              }`}
            </LabelText>
          </GridItem>
        </Grid>
      ) : (
        <Flex direction="row" flex={1} maxW={{ md: "400px" }}>
          <LabelText flex={1} label="Network">
            {currentChainId}
          </LabelText>
          <LabelText flex={1} label="Proposed by" minW={0}>
            <ValidatorBadge
              badgeSize={6}
              hasLabel={false}
              validator={blockData.proposer}
            />
          </LabelText>
        </Flex>
      )}
    </Box>
  );
};
