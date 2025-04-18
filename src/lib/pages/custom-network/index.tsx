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
      <CelatoneSeo pageName="Add rollups" />
      <Flex direction="column" gap={12}>
        <Flex direction="column" gap={4} textAlign="center">
          <Heading as="h4" variant="h4">
            Add custom rollup
          </Heading>
          <Alert my={4} p={3} variant="info">
            <AlertDescription>
              <Text color="text.dark" textAlign="center" lineHeight="normal">
                Please note that the custom rollup you add on our website will
                only be stored locally on your device.
              </Text>
            </AlertDescription>
          </Alert>
        </Flex>
        <Flex direction="column" gap={4}>
          <ButtonCard
            title="Fill in network details manually"
            description="Add new rollup through fill in each configuration manually"
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
