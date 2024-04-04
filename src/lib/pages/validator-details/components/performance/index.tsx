import { Flex } from "@chakra-ui/react";
import { isUndefined } from "lodash";
import { useState } from "react";

import { ProposedBlocksTable } from "../tables/proposed-blocks";
import { Loading } from "lib/components/Loading";
import { ErrorFetching } from "lib/components/state";
import { useValidatorUptime } from "lib/services/validatorService";
import type { ValidatorAddr } from "lib/types";

import { PenaltySection } from "./PenaltySection";
import { RecentBlocksSection } from "./RecentBlocksSection";
import { UptimeSection } from "./UptimeSection";

interface PerformanceProps {
  validatorAddress: ValidatorAddr;
  onViewMore?: () => void;
}

export const Performance = ({
  validatorAddress,
  onViewMore,
}: PerformanceProps) => {
  const [uptimeBlock, setUptimeBlock] = useState(100);
  const { data: uptimeData, isLoading } = useValidatorUptime(
    validatorAddress,
    uptimeBlock
  );

  if (isLoading) return <Loading />;
  if (isUndefined(uptimeData))
    return <ErrorFetching dataName="performance data" />;

  if (onViewMore)
    return (
      <UptimeSection
        validatorAddress={validatorAddress}
        uptimeData={uptimeData}
        uptimeBlock={uptimeBlock}
        onViewMore={onViewMore}
      />
    );

  return (
    <Flex direction="column" gap={{ base: 4, md: 6 }} pt={6}>
      <Flex gap={{ base: 4, md: 6 }} direction={{ base: "column", md: "row" }}>
        <Flex flex={{ md: "2" }}>
          <UptimeSection
            validatorAddress={validatorAddress}
            uptimeData={uptimeData}
            uptimeBlock={uptimeBlock}
            setUptimeBlock={(block) => setUptimeBlock(block)}
          />
        </Flex>
        <Flex flex={{ md: "1" }}>
          <PenaltySection penaltyEvents={uptimeData.events} />
        </Flex>
      </Flex>
      <Flex
        backgroundColor="gray.900"
        p={{ base: 4, md: 6 }}
        rounded={8}
        w="100%"
      >
        <RecentBlocksSection validatorAddress={validatorAddress} />
      </Flex>
      <ProposedBlocksTable validatorAddress={validatorAddress} />
    </Flex>
  );
};
