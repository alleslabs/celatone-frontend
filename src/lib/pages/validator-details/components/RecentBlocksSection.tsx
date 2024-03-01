import { Box, Grid, Flex, Text, Heading } from "@chakra-ui/react";

const Block = ({ isHighlighted = false }: { isHighlighted: boolean }) => (
  <Box
    width="12px"
    height="12px"
    backgroundColor={isHighlighted ? "secondary.main" : "primary.main"}
    borderRadius="2px"
  />
);

export const RecentBlocksSection = () => {
  // TODO: remove mock up data
  const blocks = new Array(100)
    .fill(0)
    .map((_, index) => (
      <Block key={`block-${_}`} isHighlighted={index === 0} />
    ));

  return (
    <Flex direction="column" w="full" gap={4}>
      <Flex justify="space-between" align="center" w="full">
        <Heading
          as="h6"
          variant="h6"
          color="text.main"
          display={{ base: "none", md: "flex" }}
        >
          Most Recent 100 Blocks
        </Heading>
        <Text
          variant="body2"
          color="text.dark"
          display={{ base: "none", md: "block" }}
        >
          Latest Update: timestamp
        </Text>
      </Flex>
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
