import { Alert, AlertDescription, Flex, Heading, Text } from "@chakra-ui/react";

import { useAllowCustomNetworks, useInternalNavigate } from "lib/app-provider";
import ActionPageContainer from "lib/components/ActionPageContainer";
import { ButtonCard } from "lib/components/ButtonCard";
import { CelatoneSeo } from "lib/components/Seo";

export const AddNetwork = () => {
  useAllowCustomNetworks({ shouldRedirect: true });
  const navigate = useInternalNavigate();

  return (
    <ActionPageContainer>
      <CelatoneSeo pageName="Add Minitias" />
      <Flex gap={12} direction="column">
        <Flex gap={4} textAlign="center" direction="column">
          <Heading as="h4" variant="h4">
            Add Custom Minitia
          </Heading>
          <Alert my={4} p={3} variant="info">
            <AlertDescription>
              <Text lineHeight="normal" textAlign="center" color="text.dark">
                Please note that the custom Minitia you add on our website will
                only be stored locally on your device.
              </Text>
            </AlertDescription>
          </Alert>
        </Flex>
        <Flex gap={4} direction="column">
          <ButtonCard
            title="Fill in Network Details Manually"
            description="Add new Minitia through fill in each configuration manually"
            onClick={() => navigate({ pathname: "/custom-network/add/manual" })}
          />
          <ButtonCard
            title="Import JSON"
            description="Import available JSON that contains all the configuration"
            onClick={() => navigate({ pathname: "/custom-network/add/json" })}
          />
        </Flex>
      </Flex>
    </ActionPageContainer>
  );
};
