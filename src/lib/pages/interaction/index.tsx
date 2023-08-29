import type { FlexProps } from "@chakra-ui/react";
import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { CountBadge } from "lib/components/module/CountBadge";
import PageContainer from "lib/components/PageContainer";
import { EmptyState } from "lib/components/state";

import {
  InteractionTypeSwitch,
  InteractionTabs,
} from "./component/InteractionTypeSwitch";
import { ModuleSelectDrawerButton } from "./component/ModuleSelectDrawerButton";

const containerBaseStyle: FlexProps = {
  direction: "column",
  bgColor: "gray.900",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 8,
  gap: 4,
};

export const Interaction = () => {
  const { query, isReady } = useRouter();
  const [tab, setTab] = useState<InteractionTabs>();

  useEffect(() => {
    if (isReady)
      setTab(
        query.type === "execute"
          ? InteractionTabs.EXECUTE_MODULE
          : InteractionTabs.VIEW_MODULE
      );
  }, [isReady, query.type]);

  return (
    <PageContainer>
      <Heading as="h5" variant="h5">
        Module Interactions
      </Heading>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        bgColor="gray.900"
        p={4}
        borderRadius={4}
        my={8}
      >
        <p>Select module to interact with ...</p>
        <ModuleSelectDrawerButton />
      </Flex>
      <Flex borderTop="1px solid" borderColor="gray.700" py={8} gap={8}>
        {/* Left side */}
        <Flex direction="column" flex={0.2}>
          <Flex alignItems="center" gap={2}>
            <Text variant="body2" fontWeight={600}>
              Available functions
            </Text>
            <CountBadge variant="common" count={0} />
          </Flex>
          <InteractionTypeSwitch currentTab={tab} onTabChange={setTab} my={3} />
          <Flex {...containerBaseStyle} p={4} height="full">
            <EmptyState
              imageWidth="80px"
              imageVariant="empty"
              message="Available functions for selected modules will display here"
              textVariant="body2"
            />
          </Flex>
        </Flex>
        {/* Right side */}
        <Flex {...containerBaseStyle} flex={0.8} py={24}>
          <EmptyState
            imageWidth="80px"
            imageVariant="empty"
            message={`Initiate your Module interactions by choosing a module and its associated function. ${"\n"} This section will showcase the input or response type required for the functions.`}
            textVariant="body2"
          />
          <Button variant="primary">Select Module</Button>
        </Flex>
      </Flex>
    </PageContainer>
  );
};
