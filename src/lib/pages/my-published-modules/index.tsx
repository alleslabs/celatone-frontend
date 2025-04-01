import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import router from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useInternalNavigate, useIsConnected } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";

import { MyPublishedModulesTable } from "./components/MyPublishedModulesTable";

export const MyPublishedModules = () => {
  const navigate = useInternalNavigate();
  const isConnected = useIsConnected();

  useEffect(() => {
    if (router.isReady)
      track(AmpEvent.TO_MY_PUBLISHED_MODULES, { connected: isConnected });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return (
    <PageContainer>
      <CelatoneSeo pageName="My published modules" />
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
            track(AmpEvent.USE_MY_PUBLISHED_MODULES_CTA, {
              label: "publish new modules",
            });
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
