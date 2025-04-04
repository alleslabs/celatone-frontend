import { Flex, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { ProposalStatus } from "lib/types";
import type { ProposalData } from "lib/types";
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
  <Flex gap={{ base: 2, xl: 8 }} direction={{ base: "column", xl: "row" }}>
    <InfoItem label={resolvedHeightLabel}>
      {resolvedHeight ? (
        <ExplorerLink
          value={resolvedHeight.toString()}
          type="block_height"
          showCopyOnHover
        />
      ) : (
        <Text variant="body2" color="text.dark">
          N/A
        </Text>
      )}
    </InfoItem>
    <InfoItem label={resolvedTimestampLabel}>
      <Text variant="body2" color="text.dark">
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
          resolvedHeightLabel="Failed at block"
          resolvedTimestampLabel="Failed at"
          resolvedHeight={data.resolvedHeight}
          resolvedTimestamp={data.resolvedTimestamp}
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
          resolvedTimestamp={data.resolvedTimestamp}
        />
      );
    case ProposalStatus.CANCELLED:
      return (
        <ResolvedTimeInfoItems
          resolvedHeightLabel="Cancelled at block"
          resolvedTimestampLabel="Cancelled at"
          resolvedHeight={data.resolvedHeight}
          resolvedTimestamp={data.resolvedTimestamp}
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
