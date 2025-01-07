import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";

import { useInitiaL1, useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { UserDocsButton } from "lib/components/UserDocsButton";

import { MyModuleVerificationsTable } from "./components/my-module-verifications-table";

export const MyModuleVerifications = () => {
  const navigate = useInternalNavigate();
  useInitiaL1({ shouldRedirect: true });

  return (
    <PageContainer>
      <CelatoneSeo pageName="My Past Verification" />
      <Flex mb={4} justifyContent="space-between">
        <Box>
          <Heading as="h5" variant="h5">
            My Past Verification
          </Heading>
          <Text variant="body2" color="text.dark" fontWeight={500}>
            Display the request queue for module verifications through
            InitiaScan
          </Text>
        </Box>
        <Flex gap={4}>
          <UserDocsButton
            title="View Verification Guideline"
            variant="outline-white"
            isDevTool
            href="initia/move/module-verification"
          />
          <Button
            leftIcon={<CustomIcon name="plus" />}
            onClick={() => navigate({ pathname: "/modules/verify" })}
          >
            Submit Verification
          </Button>
        </Flex>
      </Flex>
      <MyModuleVerificationsTable />
    </PageContainer>
  );
};
