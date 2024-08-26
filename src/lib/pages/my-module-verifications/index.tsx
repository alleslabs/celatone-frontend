import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";

import { useInitiaL1, useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { UserDocsButton } from "lib/components/UserDocsLink";

import { MyModuleVerificationsTable } from "./components/my-module-verifications-table";

export const MyModuleVerifications = () => {
  const navigate = useInternalNavigate();
  useInitiaL1({ shouldRedirect: true });

  return (
    <PageContainer>
      <CelatoneSeo pageName="My Past Verification" />
      <Flex justifyContent="space-between" mb={4}>
        <Box>
          <Heading as="h5" variant="h5">
            My Past Verification
          </Heading>
          <Text variant="body2" fontWeight={500} color="text.dark">
            Display the request queue for module verifications through
            InitiaScan
          </Text>
        </Box>
        <Flex gap={4}>
          <UserDocsButton
            variant="outline-white"
            title="View Verification Guideline"
            href="initia/move/module-verification"
            isDevTool
          />
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
