import { Flex } from "@chakra-ui/react";

import { ProposedBlocksTable } from "../table/ProposedBlocksTable";

import { PenaltySection } from "./PenaltySection";
import { RecentBlocksSection } from "./RecentBlocksSection";
import { UptimeSection } from "./UptimeSection";

export const PerformanceSection = () => {
  return (
    <Flex direction="column" gap={{ base: 4, md: 6 }} pt={6}>
      <Flex gap={{ base: 4, md: 6 }} direction={{ base: "column", md: "row" }}>
        <Flex flex={{ md: "2" }}>
          <UptimeSection isDetailPage />
        </Flex>
        <Flex flex={{ md: "1" }}>
          <PenaltySection />
        </Flex>
      </Flex>
      <Flex
        backgroundColor="gray.900"
        p={{ base: 4, md: 6 }}
        rounded={8}
        w="100%"
      >
        <RecentBlocksSection hasTitle />
      </Flex>
      <ProposedBlocksTable />
    </Flex>
  );
};
