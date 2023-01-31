import { Flex, Heading } from "@chakra-ui/react";

import PageContainer from "lib/components/PageContainer";

import { AllProject } from "./components/AllProject";

export const AllPublicProjectsPage = () => (
  <PageContainer>
    <Flex direction="column" alignItems="center" gap={8}>
      <Flex justifyContent="space-between" w="full" alignItems="center">
        <Heading as="h5" variant="h5" color="text.main">
          Public Projects
        </Heading>
      </Flex>
      <AllProject />
    </Flex>
  </PageContainer>
);
