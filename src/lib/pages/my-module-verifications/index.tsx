import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";

import { useInternalNavigate, useMoveConfig } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";

import { MyModuleVerificationsTable } from "./components/my-module-verifications-table";

export const MyModuleVerifications = () => {
  const navigate = useInternalNavigate();
  useMoveConfig({ shouldRedirect: true });

  return (
    <PageContainer>
      <CelatoneSeo pageName="My Past Verification" />
      <Flex justifyContent="space-between" mb={4}>
        <Box>
          <Heading as="h5" variant="h5" minH="36px">
            My Past Verification
          </Heading>
          <Text variant="body2" fontWeight={500} color="text.dark">
            Display the request queue for module verifications through
            InitiaScan
          </Text>
        </Box>
        <Flex gap={4}>
          <Button
            leftIcon={<CustomIcon name="document" />}
            variant="outline-white"
          >
            View Verification Guideline
          </Button>
          <Button
            onClick={() => navigate({ pathname: "/modules/verify" })}
            leftIcon={<CustomIcon name="plus" />}
          >
            Submit Verification
          </Button>
        </Flex>
      </Flex>
      <MyModuleVerificationsTable />
    </PageContainer>
  );
};
