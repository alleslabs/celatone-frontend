import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react";

import { LabelText } from "lib/components/LabelText";
import type { BlockDetails } from "lib/types/block";
import { formatInteger } from "lib/utils";

interface BlockInfoProps {
  blockData: BlockDetails;
}

export const BlockInfo = ({ blockData }: BlockInfoProps) => {
  return (
    <Box mb={12}>
      <Heading as="h6" variant="h6" mb={6}>
        Block Information
      </Heading>
      <Flex gap="64px">
        <LabelText label="Network">{blockData.network}</LabelText>
        <LabelText label="Proposed by">
          {/* TODO: Gather this */}
          <Flex gap={1}>
            <Image
              boxSize={6}
              borderRadius="full"
              src="https://ui-avatars.com/api/?name=Honey+toast&background=5942F3&color=fff"
            />
            <Text color="lilac.main" variant="body2">
              Honeytoast
            </Text>
          </Flex>
        </LabelText>
        <LabelText label="Gas (Used/Wanted)">
          {`${blockData.gasUsed ? formatInteger(blockData.gasUsed) : 0} / ${
            blockData.gasLimit ? formatInteger(blockData.gasLimit) : 0
          }`}
        </LabelText>
      </Flex>
    </Box>
  );
};
