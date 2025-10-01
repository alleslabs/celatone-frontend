import { Flex, Heading } from "@chakra-ui/react";
import { useAllowCustomNetworks, useInternalNavigate } from "lib/app-provider";
import ActionPageContainer from "lib/components/ActionPageContainer";
import { ButtonCard } from "lib/components/ButtonCard";
import { CelatoneSeo } from "lib/components/Seo";

import { CustomNetworkAlertInfo } from "./components";

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
          <CustomNetworkAlertInfo />
        </Flex>
        <Flex direction="column" gap={4}>
          <ButtonCard
            description="Add new rollup through fill in each configuration manually"
            title="Fill in network details manually"
            onClick={() => navigate({ pathname: "/custom-network/add/manual" })}
          />
          <ButtonCard
            description="Import available JSON that contains all the configuration"
            title="Import JSON"
            onClick={() => navigate({ pathname: "/custom-network/add/json" })}
          />
        </Flex>
      </Flex>
    </ActionPageContainer>
  );
};
