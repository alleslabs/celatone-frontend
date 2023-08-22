import { Badge, Button, Flex, Heading, Text, Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import PageContainer from "lib/components/PageContainer";
import { StateImage } from "lib/components/state";

import {
  InteractionTypeSwitch,
  MessageTabs,
} from "./component/InteractionTypeSwitch";

export const Interaction = () => {
  const { query, isReady } = useRouter();
  const [tab, setTab] = useState(MessageTabs.VIEW_MODULE);

  useEffect(() => {
    if (isReady)
      setTab(
        query.type === "execute"
          ? MessageTabs.EXECUTE_MODULE
          : MessageTabs.VIEW_MODULE
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
        <Text>Select module to interact with ...</Text>
        <Button variant="primary">Select Module</Button>
      </Flex>
      <Flex borderTop="1px solid" borderColor="gray.700" py={8} gap={8}>
        <Flex flexDirection="column" flex={1}>
          <Flex alignItems="center" gap={2}>
            <Text variant="body2" fontWeight={600}>
              Available functions
            </Text>
            <Badge variant="gray" color="text.main" textColor="text.main">
              <s>0</s>
            </Badge>
          </Flex>
          <Box my={3}>
            <InteractionTypeSwitch currentTab={tab} onTabChange={setTab} />
          </Box>
          <Flex
            flexDirection="column"
            bgColor="gray.900"
            alignItems="center"
            justifyContent="center"
            borderRadius={8}
            p={4}
            gap={4}
            height="full"
          >
            <StateImage imageVariant="empty" width="80px" />
            <Text variant="body2" color="text.dark" textAlign="center">
              Available functions for selected modules will display here
            </Text>
          </Flex>
        </Flex>
        <Flex
          flex={4}
          flexDirection="column"
          bgColor="gray.900"
          alignItems="center"
          justifyContent="center"
          borderRadius={8}
          py={24}
          gap={4}
        >
          <StateImage imageVariant="empty" width="80px" />
          <Text variant="body2" color="text.dark">
            Initiate your Module interactions by choosing a module and its
            associated function.
            <br /> This section will showcase the input or response type
            required for the functions.
          </Text>
          <Button variant="primary">Select Module</Button>
        </Flex>
      </Flex>
    </PageContainer>
  );
};
