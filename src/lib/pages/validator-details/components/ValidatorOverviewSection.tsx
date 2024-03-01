import { Flex, Heading, Text } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";

import { RecentBlocksSection } from "./RecentBlocksSection";
import { UptimeOverview } from "./UptimeOverview";
import { VotingPowerChart } from "./VotingPowerChart";
import { VotingPowerOverview } from "./VotingPowerOverview";

export const ValidatorOverview = () => {
  const isMobile = useMobile();
  return (
    <Flex direction="column" gap={6} pt={6}>
      <Flex direction="column" gap={2}>
        <Heading variant="h6" as="h6" color="text.main">
          Validator Description
        </Heading>
        <Text variant="body1" color="text.main">
          This is a proposal to give the address
          osmo1raa4kyx5ypz75qqk3566c6slx2mw3qzsu6rymw permission to upload
          CosmWasm contracts to Osmosis without seeking governance approval for
          subsequent uploads.
        </Text>
      </Flex>
      <Flex gap={6} direction={{ base: "column", md: "row" }}>
        <VotingPowerOverview />
        <UptimeOverview />
      </Flex>
      {!isMobile && (
        <>
          <Flex backgroundColor="gray.900" p={6} rounded={8} w="100%">
            <RecentBlocksSection />
          </Flex>
          <VotingPowerChart currency="OSMO" />
        </>
      )}
    </Flex>
  );
};
