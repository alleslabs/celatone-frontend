import { Flex } from "@chakra-ui/react";
import { isUndefined } from "lodash";
import { useState } from "react";

import { ProposedBlocksTable } from "../tables/ProposedBlocksTable";
import { Loading } from "lib/components/Loading";
import { ErrorFetching } from "lib/components/state";
import { useValidatorUptime } from "lib/services/validator";
import type { ValidatorAddr } from "lib/types";

import { PenaltySection } from "./PenaltySection";
import { RecentBlocksSection } from "./RecentBlocksSection";
import { UptimeSection } from "./UptimeSection";

interface PerformanceProps {
  onViewMore?: () => void;
  validatorAddress: ValidatorAddr;
}

export const Performance = ({
  onViewMore,
  validatorAddress,
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
        onViewMore={onViewMore}
        uptimeBlock={uptimeBlock}
      />
    );

  return (
    <Flex gap={{ base: 4, md: 6 }} pt={6} direction="column">
      <Flex gap={{ base: 4, md: 6 }} direction={{ base: "column", md: "row" }}>
        <Flex flex={{ md: "2" }}>
          <UptimeSection
            validatorAddress={validatorAddress}
            uptimeData={uptimeData}
            setUptimeBlock={(block) => setUptimeBlock(block)}
            uptimeBlock={uptimeBlock}
          />
        </Flex>
        <Flex flex={{ md: "1" }}>
          <PenaltySection penaltyEvents={uptimeData.events} />
        </Flex>
      </Flex>
      <Flex
        p={{ base: 4, md: 6 }}
        w="100%"
        backgroundColor="gray.900"
        rounded={8}
      >
        <RecentBlocksSection validatorAddress={validatorAddress} />
      </Flex>
      <ProposedBlocksTable validatorAddress={validatorAddress} />
    </Flex>
  );
};
