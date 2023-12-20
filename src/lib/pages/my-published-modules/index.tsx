import { Text, Flex, Heading, Button } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import PageContainer from "lib/components/PageContainer";

import { MyPublishedModulesTable } from "./components/MyPublishedModulesTable";

export const MyPublishedModules = () => {
  const navigate = useInternalNavigate();
  return (
    <PageContainer>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Flex direction="column">
          <Heading as="h5" variant="h5" minH="36px">
            My Published Modules
          </Heading>
          <Text variant="body2" fontWeight={500} color="text.dark">
            This page displays all the modules published by me on this network
          </Text>
        </Flex>
        <Button
          onClick={() => {
            navigate({
              pathname: "/publish-module",
            });
          }}
          variant="primary"
          leftIcon={<CustomIcon name="add-new" />}
        >
          Publish New Modules
        </Button>
      </Flex>
      <MyPublishedModulesTable />
    </PageContainer>
  );
};
