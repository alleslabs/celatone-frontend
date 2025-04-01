import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";

import {
  useInternalNavigate,
  useIsApiChain,
  useMoveConfig,
} from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { UserDocsButton } from "lib/components/UserDocsButton";

import { MyModuleVerificationsTable } from "./components/my-module-verifications-table";

export const MyModuleVerifications = () => {
  const navigate = useInternalNavigate();
  useIsApiChain({ shouldRedirect: true });
  useMoveConfig({ shouldRedirect: true });

  return (
    <PageContainer>
      <CelatoneSeo pageName="My past verification" />
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
            title="View verification guideline"
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
