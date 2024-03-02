import { Box, Grid, Flex, Text, Heading } from "@chakra-ui/react";

const Block = ({ isHighlighted = false }: { isHighlighted: boolean }) => (
  <Box
    width="12px"
    height="12px"
    backgroundColor={isHighlighted ? "secondary.main" : "primary.main"}
    borderRadius="2px"
  />
);

interface RecentBlocksSectionProps {
  hasTitle?: boolean;
}
export const RecentBlocksSection = ({
  hasTitle = false,
}: RecentBlocksSectionProps) => {
  // TODO: remove mock up data
  const blocks = new Array(100)
    .fill(0)
    .map((_, index) => (
      <Block key={`block-${_}`} isHighlighted={index === 0} />
    ));

  return (
    <Flex direction="column" w="full" gap={4}>
      {hasTitle && (
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "start", md: "center" }}
          w="full"
        >
          <Heading as="h6" variant="h6" color="text.main">
            Most Recent 100 Blocks
          </Heading>
          <Text variant="body2" color="text.dark">
            Latest Update: timestamp
          </Text>
        </Flex>
      )}
      <Grid
        templateColumns="repeat(auto-fit, minmax(12px, 1fr))"
        gap={1}
        width="full"
      >
        {blocks}
      </Grid>
      {/* TODO: add arrow and align with last block */}
      <Text variant="body2" color="text.dark">
        Most Recent Blocks: 12345678
      </Text>
    </Flex>
  );
};
