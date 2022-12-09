import { Flex, Heading, Text, Button } from "@chakra-ui/react";

import PageContainer from "lib/components/PageContainer";

/* remove later */
const Home = () => {
  return (
    <PageContainer>
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        gap={4}
        mb={8}
        w="full"
      >
        <Heading as="h1" variant="h1" color="primary.light" mb={4}>
          What a Dev Tool
        </Heading>
        <Heading as="h4" variant="h4" color="primary.light" mb={4}>
          What a Dev Tool
        </Heading>
        <Text color="warning.dark">For the sake of Cosmos</Text>
        <Text variant="body2" color="warning.dark">
          For the sake of Cosmos
        </Text>
        <Flex flexDir="row" gap={16}>
          <Button>Primary</Button>
          <Button variant="outline-primary">Outline Primary</Button>
          <Button variant="outline-gray">Outline Gray</Button>
          <Button variant="ghost-primary">Ghost Primary</Button>
          <Button variant="ghost-gray">Ghost Gray</Button>
        </Flex>
        <Flex flexDir="row" gap={16}>
          <Button disabled>Primary</Button>
          <Button disabled variant="outline-primary">
            Outline Primary
          </Button>
          <Button disabled variant="outline-gray">
            Outline Gray
          </Button>
          <Button disabled variant="ghost-primary">
            Ghost Primary
          </Button>
          <Button disabled variant="ghost-gray">
            Ghost Gray
          </Button>
        </Flex>
        <Flex flexDir="row" gap={16}>
          <Button isLoading>Primary</Button>
          <Button isLoading variant="outline-primary">
            Outline Primary
          </Button>
          <Button isLoading variant="outline-gray">
            Outline Gray
          </Button>
          <Button isLoading variant="ghost-primary">
            Ghost Primary
          </Button>
          <Button isLoading variant="ghost-gray">
            Ghost Gray
          </Button>
        </Flex>
      </Flex>
    </PageContainer>
  );
};

export default Home;
