import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import router from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useCurrentChain, useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";

import { MyPublishedModulesTable } from "./components/MyPublishedModulesTable";

export const MyPublishedModules = () => {
  const navigate = useInternalNavigate();
  const { address } = useCurrentChain();

  useEffect(() => {
    if (router.isReady)
      track(AmpEvent.TO_MY_PUBLISHED_MODULES, { connected: !!address });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return (
    <PageContainer>
      <CelatoneSeo pageName="My Published Modules" />
      <Flex alignItems="center" mb={4} justifyContent="space-between">
        <Flex direction="column">
          <Heading as="h5" minH="36px" variant="h5">
            My Published Modules
          </Heading>
          <Text variant="body2" color="text.dark" fontWeight={500}>
            This page displays all the modules published by me on this network
          </Text>
        </Flex>
        <Button
          variant="primary"
          leftIcon={<CustomIcon name="add-new" />}
          onClick={() => {
            track(AmpEvent.USE_MY_PUBLISHED_MODULES_CTA, {
              label: "publish new modules",
            });
            navigate({
              pathname: "/publish-module",
            });
          }}
        >
          Publish New Modules
        </Button>
      </Flex>
      <MyPublishedModulesTable />
    </PageContainer>
  );
};
