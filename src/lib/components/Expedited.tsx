import type { Option, Ratio } from "lib/types";

import { Flex, SkeletonText, Text } from "@chakra-ui/react";
import { useProposalParams } from "lib/services/proposal";
import { formatPrettyPercent, formatSeconds } from "lib/utils";

import { CustomIcon } from "./icon";
import { Tooltip } from "./Tooltip";

const ExpeditedText = ({
  isLoading,
  quorum,
  threshold,
  votingPeriod,
}: {
  isLoading: boolean;
  quorum: Option<Ratio<number>>;
  threshold: Option<Ratio<number>>;
  votingPeriod: Option<string>;
}) => {
  if (isLoading)
    <SkeletonText
      color="white"
      noOfLines={4}
      skeletonHeight={2}
      spacing={2.5}
      w="250px"
    />;

  return (
    <Text variant="body3">
      An expedited governance proposal is required to{" "}
      <span style={{ color: "text.main", fontWeight: 700 }}>
        pass a quorum of {quorum ? formatPrettyPercent(quorum, 1, true) : "N/A"}{" "}
        and a high threshold of{" "}
        {threshold ? formatPrettyPercent(threshold, 1, true) : "N/A"} within{" "}
        {formatSeconds(votingPeriod)} voting period
      </span>{" "}
      in order to pass.
    </Text>
  );
};

interface ExpeditedProps {
  isActiveExpedited: boolean;
}

export const Expedited = ({ isActiveExpedited }: ExpeditedProps) => {
  const { data: params, isLoading } = useProposalParams();
  const quorum = params?.expeditedQuorum || params?.quorum;
  const threshold = params?.expeditedThreshold || params?.threshold;
  const votingPeriod = params?.expeditedVotingPeriod || params?.votingPeriod;

  return (
    <Tooltip
      label={
        <ExpeditedText
          isLoading={isLoading}
          quorum={quorum}
          threshold={threshold}
          votingPeriod={votingPeriod}
        />
      }
    >
      <Flex align="center" as="span">
        <CustomIcon
          boxSize={4}
          color={isActiveExpedited ? "secondary.main" : "gray.400"}
          ml={0}
          name="expedited"
        />
        <Text
          as="span"
          color={isActiveExpedited ? "secondary.main" : "text.dark"}
          variant="body3"
        >
          Expedited
        </Text>
      </Flex>
    </Tooltip>
  );
};
