import type { ProposalData } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { ProposalStatus } from "lib/types";
import { formatUTC } from "lib/utils";

import { InfoItem } from "./InfoItem";

interface TimeInfoItemProps {
  data: ProposalData;
}

const ResolvedTimeInfoItems = ({
  resolvedHeightLabel,
  resolvedTimestampLabel,
  resolvedHeight,
  resolvedTimestamp,
}: {
  resolvedHeightLabel: string;
  resolvedTimestampLabel: string;
  resolvedHeight: ProposalData["resolvedHeight"];
  resolvedTimestamp: ProposalData["resolvedTimestamp"];
}) => (
  <Flex direction={{ base: "column", xl: "row" }} gap={{ base: 2, xl: 8 }}>
    <InfoItem label={resolvedHeightLabel}>
      {resolvedHeight ? (
        <ExplorerLink
          showCopyOnHover
          type="block_height"
          value={resolvedHeight.toString()}
        />
      ) : (
        <Text color="text.dark" variant="body2">
          N/A
        </Text>
      )}
    </InfoItem>
    <InfoItem label={resolvedTimestampLabel}>
      <Text color="text.dark" variant="body2">
        {resolvedTimestamp ? formatUTC(resolvedTimestamp) : "N/A"}
      </Text>
    </InfoItem>
  </Flex>
);

export const TimeInfoItem = ({ data }: TimeInfoItemProps) => {
  switch (data.status) {
    case ProposalStatus.DEPOSIT_PERIOD:
      return (
        <>
          <InfoItem label="Deposit start">
            <Text variant="body2" color="text.dark">
              {formatUTC(data.submitTime)}
            </Text>
          </InfoItem>
          <InfoItem label="Deposit end">
            <Text variant="body2" color="text.dark">
              {formatUTC(data.depositEndTime)}
            </Text>
          </InfoItem>
        </>
      );
    case ProposalStatus.DEPOSIT_FAILED:
      return (
        <ResolvedTimeInfoItems
          resolvedHeight={data.resolvedHeight}
          resolvedHeightLabel="Failed at block"
          resolvedTimestamp={data.resolvedTimestamp}
          resolvedTimestampLabel="Failed at"
        />
      );
    case ProposalStatus.VOTING_PERIOD:
      return (
        <>
          <InfoItem label="Voting start">
            <Text variant="body2" color="text.dark">
              {data.votingTime ? `${formatUTC(data.votingTime)}` : "N/A"}
            </Text>
          </InfoItem>
          <InfoItem label="Voting end">
            <Text variant="body2" color="text.dark">
              {data.votingEndTime ? `${formatUTC(data.votingEndTime)}` : "N/A"}
            </Text>
          </InfoItem>
        </>
      );
    case ProposalStatus.PASSED:
    case ProposalStatus.FAILED:
    case ProposalStatus.REJECTED:
      return (
        <ResolvedTimeInfoItems
          resolvedHeightLabel="Resolved block height"
          resolvedTimestampLabel="Resolved at"
          resolvedHeight={data.resolvedHeight}
          resolvedHeightLabel="Resolved Block Height"
          resolvedTimestamp={data.resolvedTimestamp}
          resolvedTimestampLabel="Resolved at"
        />
      );
    case ProposalStatus.CANCELLED:
      return (
        <ResolvedTimeInfoItems
          resolvedHeight={data.resolvedHeight}
          resolvedHeightLabel="Cancelled at block"
          resolvedTimestamp={data.resolvedTimestamp}
          resolvedTimestampLabel="Cancelled at"
        />
      );
    default:
      return (
        <InfoItem label="Proposal status">
          <Flex>N/A</Flex>
        </InfoItem>
      );
  }
};
