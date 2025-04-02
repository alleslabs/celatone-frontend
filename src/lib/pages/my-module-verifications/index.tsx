import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useInternalNavigate, useMoveConfig } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { UserDocsButton } from "lib/components/UserDocsButton";

import { MyModuleVerificationsTable } from "./components/my-module-verifications-table";

export const MyModuleVerifications = () => {
  const navigate = useInternalNavigate();
  useMoveConfig({ shouldRedirect: true });

  return (
    <PageContainer>
      <CelatoneSeo pageName="My Past Verification" />
      <Flex justifyContent="space-between" mb={4}>
        <Box>
          <Heading as="h5" variant="h5">
            My Past Verification
          </Heading>
          <Text color="text.dark" fontWeight={500} variant="body2">
            Display the request queue for module verifications through
            InitiaScan
          </Text>
        </Box>
        <Flex gap={4}>
          <UserDocsButton
            href="initia/move/module-verification"
            isDevTool
            title="View Verification Guideline"
            variant="outline-white"
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
