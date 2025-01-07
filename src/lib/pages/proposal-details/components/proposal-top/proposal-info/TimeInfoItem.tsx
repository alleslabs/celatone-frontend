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
  resolvedHeight,
  resolvedHeightLabel,
  resolvedTimestamp,
  resolvedTimestampLabel,
}: {
  resolvedHeight: ProposalData["resolvedHeight"];
  resolvedHeightLabel: string;
  resolvedTimestamp: ProposalData["resolvedTimestamp"];
  resolvedTimestampLabel: string;
}) => (
  <Flex gap={{ base: 2, xl: 8 }} direction={{ base: "column", xl: "row" }}>
    <InfoItem label={resolvedHeightLabel}>
      {resolvedHeight ? (
        <ExplorerLink
          type="block_height"
          value={resolvedHeight.toString()}
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
    case ProposalStatus.CANCELLED:
      return (
        <ResolvedTimeInfoItems
          resolvedHeight={data.resolvedHeight}
          resolvedHeightLabel="Cancelled at block"
          resolvedTimestamp={data.resolvedTimestamp}
          resolvedTimestampLabel="Cancelled at"
        />
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
    case ProposalStatus.DEPOSIT_PERIOD:
      return (
        <>
          <InfoItem label="Deposit Start">
            <Text variant="body2" color="text.dark">
              {formatUTC(data.submitTime)}
            </Text>
          </InfoItem>
          <InfoItem label="Deposit End">
            <Text variant="body2" color="text.dark">
              {formatUTC(data.depositEndTime)}
            </Text>
          </InfoItem>
        </>
      );
    case ProposalStatus.FAILED:
    case ProposalStatus.PASSED:
    case ProposalStatus.REJECTED:
      return (
        <ResolvedTimeInfoItems
          resolvedHeight={data.resolvedHeight}
          resolvedHeightLabel="Resolved Block Height"
          resolvedTimestamp={data.resolvedTimestamp}
          resolvedTimestampLabel="Resolved at"
        />
      );
    case ProposalStatus.VOTING_PERIOD:
      return (
        <>
          <InfoItem label="Voting Start">
            <Text variant="body2" color="text.dark">
              {data.votingTime ? `${formatUTC(data.votingTime)}` : "N/A"}
            </Text>
          </InfoItem>
          <InfoItem label="Voting End">
            <Text variant="body2" color="text.dark">
              {data.votingEndTime ? `${formatUTC(data.votingEndTime)}` : "N/A"}
            </Text>
          </InfoItem>
        </>
      );
    default:
      return (
        <InfoItem label="Proposal Status">
          <Flex>N/A</Flex>
        </InfoItem>
      );
  }
};
