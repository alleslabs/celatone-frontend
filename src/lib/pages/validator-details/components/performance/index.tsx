import type { ValidatorAddr } from "lib/types";

import { Flex } from "@chakra-ui/react";
import { Loading } from "lib/components/Loading";
import { ErrorFetching } from "lib/components/state";
import { useValidatorUptime } from "lib/services/validator";
import { isUndefined } from "lodash";
import { useState } from "react";

import { ProposedBlocksTable } from "../tables/ProposedBlocksTable";
import { PenaltySection } from "./PenaltySection";
import { RecentBlocksSection } from "./RecentBlocksSection";
import { UptimeSection } from "./UptimeSection";

interface PerformanceProps {
  validatorAddress: ValidatorAddr;
  onViewMore?: () => void;
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
        uptimeBlock={uptimeBlock}
        uptimeData={uptimeData}
        validatorAddress={validatorAddress}
        onViewMore={onViewMore}
      />
    );

  return (
    <Flex direction="column" gap={{ base: 4, md: 6 }} pt={6}>
      <Flex direction={{ base: "column", md: "row" }} gap={{ base: 4, md: 6 }}>
        <Flex flex={{ md: "2" }}>
          <UptimeSection
            setUptimeBlock={(block) => setUptimeBlock(block)}
            uptimeBlock={uptimeBlock}
            uptimeData={uptimeData}
            validatorAddress={validatorAddress}
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
