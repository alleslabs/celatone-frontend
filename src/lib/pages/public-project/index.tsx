import { Flex, Heading } from "@chakra-ui/react";

import PageContainer from "lib/components/PageContainer";

import { AllProject } from "./components/AllProject";

const AllPublicProjectsPage = () => {
  return (
    <PageContainer>
      <Flex direction="column" alignItems="center" gap={8}>
        <Flex justifyContent="space-between" w="full" alignItems="center">
          <Heading as="h5" variant="h5" color="primary.400">
            Public Projects
          </Heading>
        </Flex>
        <AllProject />
      </Flex>
    </PageContainer>
  );
};

export default AllPublicProjectsPage;
