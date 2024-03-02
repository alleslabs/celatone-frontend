import { Flex, Heading, Text } from "@chakra-ui/react";

import { BondedTokenChangeMobileCard } from "../bonded-token-changes/BondedTokenChangeMobileCard";
import { VotingPowerChart } from "../bonded-token-changes/VotingPowerChart";
import { RecentBlocksSection } from "../performance/RecentBlocksSection";
import { UptimeSection } from "../performance/UptimeSection";
import { ProposedBlocksTable } from "../table/ProposedBlocksTable";
import { VotedProposalsTable } from "../table/VotedProposalsTable";
import { useMobile, useMoveConfig } from "lib/app-provider";

import { VotingPowerOverview } from "./VotingPowerOverview";

interface ValidatorOverviewProps {
  onSelectVotes: () => void;
  onSelectPerformance: () => void;
  onSelectBondedTokenChanges: () => void;
}
export const ValidatorOverview = ({
  onSelectVotes,
  onSelectPerformance,
  onSelectBondedTokenChanges,
}: ValidatorOverviewProps) => {
  const move = useMoveConfig({ shouldRedirect: false });
  const isMobile = useMobile();
  return (
    <Flex direction="column" gap={{ base: 4, md: 6 }} pt={6}>
      <Flex direction="column" gap={2}>
        <Heading variant="h6" as="h6" color="text.main">
          Validator Description
        </Heading>
        <Text variant="body1" color="text.main">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ullam ad vel
          assumenda, temporibus maiores quidem quibusdam sapiente expedita
          officiis minus! Officiis itaque nisi reprehenderit tempora eaque eos
          quam, in excepturi.
        </Text>
      </Flex>
      <Flex gap={{ base: 4, md: 6 }} direction={{ base: "column", md: "row" }}>
        <VotingPowerOverview />
        <UptimeSection onViewMore={onSelectPerformance} />
      </Flex>
      {!isMobile && (
        <>
          <Flex backgroundColor="gray.900" p={6} rounded={8} w="100%">
            <RecentBlocksSection hasTitle />
          </Flex>
          {!move.enabled && <VotingPowerChart denom="OSMO" />}
        </>
      )}
      {isMobile && !move.enabled && (
        <BondedTokenChangeMobileCard
          denom="OSMO"
          onViewMore={onSelectBondedTokenChanges}
        />
      )}
      <ProposedBlocksTable onViewMore={onSelectPerformance} />
      <VotedProposalsTable onViewMore={onSelectVotes} />
    </Flex>
  );
};
