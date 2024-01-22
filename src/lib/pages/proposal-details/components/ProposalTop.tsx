import { Button, Flex, Heading, Text } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { CopyLink } from "lib/components/CopyLink";
import { DotSeparator } from "lib/components/DotSeparator";
import { CustomIcon } from "lib/components/icon";
import { InvalidState } from "lib/components/state";
import type { BechAddr } from "lib/types";
import { ProposalStatus } from "lib/types";

import { ProposalInfo } from "./ProposalInfo";

export const ProposalTop = ({ id }: { id: number }) => {
  const isMobile = useMobile();

  if (!id) return <InvalidState title="Proposal does not exist" />;

  return (
    <Flex direction="column" mb={6} gap={5}>
      <Breadcrumb
        items={[
          {
            text: "Proposals",
            href: "/proposals",
          },
          { text: `#${id.toString()}` },
        ]}
      />
      <Flex direction="column" gap={1}>
        <Flex alignItems="center" justifyContent="space-between" gap={4}>
          <Flex
            gap={1}
            align={{ base: "start", md: "center" }}
            minH="36px"
            overflow="hidden"
            minW={{ md: "680px" }}
          >
            <CustomIcon name="proposal" boxSize={5} color="secondary.main" />
            <Heading
              as="h5"
              mt={{ base: 1, md: 0 }}
              ml={{ base: 1, md: 0 }}
              variant={{ base: "h6", md: "h5" }}
              className={!isMobile ? "ellipsis" : ""}
              wordBreak="break-word"
            >
              <Heading
                variant={{ base: "h6", md: "h5" }}
                color="accent.main"
                display="inline"
              >
                #{id}
              </Heading>{" "}
              - Regular Incentive adjustment for 2023-07-10
            </Heading>
          </Flex>
          {!isMobile && (
            <Button
              variant="outline-primary"
              w="min-content"
              minWidth="150px"
              rightIcon={<CustomIcon name="launch" />}
            >
              View in JSON
            </Button>
          )}
        </Flex>
        <Flex gap={{ base: 2, md: 1 }} mb={4} direction="column">
          <Flex
            mt={{ base: 2, md: 0 }}
            gap={{ base: 0, md: 2 }}
            direction={{ base: "column", md: "row" }}
          >
            <Text
              color="text.dark"
              variant="body2"
              fontWeight={500}
              whiteSpace="nowrap"
            >
              Proposal Messages:
            </Text>
            <Text color="text.main" variant="body2">
              ProposalStoreCode / ProposalStoreCode / ProposalStoreCode /
              ProposalStoreCode / ProposalStoreCode
            </Text>
          </Flex>
          {!isMobile && (
            <Flex
              gap={{ base: 0, md: 2 }}
              alignItems="center"
              direction={{ base: "column", md: "row" }}
            >
              <Text color="text.dark" variant="body2" fontWeight={500}>
                Created Height:
              </Text>
              <CopyLink
                // value={blockData.hash.toUpperCase()}
                value="123"
                type="block_hash"
              />
              <DotSeparator />
              <Text variant={{ base: "body3", md: "body2" }} color="text.dark">
                {/* {formatUTC(blockData.timestamp)} */} timestamp
              </Text>
            </Flex>
          )}
        </Flex>
        {isMobile && (
          <Button
            variant="outline-primary"
            w="full"
            size="sm"
            rightIcon={<CustomIcon name="launch" />}
          >
            View in JSON
          </Button>
        )}
      </Flex>
      <ProposalInfo
        data={{
          status: ProposalStatus.DEPOSIT_PERIOD,
          createdTxHash: "osmo1acqpnvg2t4wmqfdv8hq47d3petfksjs5r9t45p",
          proposer: "osmo1acqpnvg2t4wmqfdv8hq47d3petfksjs5r9t45p" as BechAddr,
          depositStart: new Date(),
          depositEnd: new Date(),
        }}
      />
      <ProposalInfo
        data={{
          status: ProposalStatus.DEPOSIT_FAILED,
          createdTxHash: "osmo1acqpnvg2t4wmqfdv8hq47d3petfksjs5r9t45p",
          proposer: "osmo1acqpnvg2t4wmqfdv8hq47d3petfksjs5r9t45p" as BechAddr,
          resolvedHeight: 123456,
          resolvedDate: new Date(),
        }}
      />
      <ProposalInfo
        data={{
          status: ProposalStatus.VOTING_PERIOD,
          createdTxHash: "osmo1acqpnvg2t4wmqfdv8hq47d3petfksjs5r9t45p",
          proposer: "osmo1acqpnvg2t4wmqfdv8hq47d3petfksjs5r9t45p" as BechAddr,
          voteStart: new Date(),
          voteEnd: new Date(),
        }}
      />
      <ProposalInfo
        data={{
          status: ProposalStatus.PASSED,
          createdTxHash: "osmo1acqpnvg2t4wmqfdv8hq47d3petfksjs5r9t45p",
          proposer: "osmo1acqpnvg2t4wmqfdv8hq47d3petfksjs5r9t45p" as BechAddr,
          resolvedHeight: 123456,
          resolvedDate: new Date(),
        }}
      />
      <ProposalInfo
        data={{
          status: ProposalStatus.REJECTED,
          createdTxHash: "osmo1acqpnvg2t4wmqfdv8hq47d3petfksjs5r9t45p",
          proposer: "osmo1acqpnvg2t4wmqfdv8hq47d3petfksjs5r9t45p" as BechAddr,
          resolvedHeight: 123456,
          resolvedDate: new Date(),
        }}
      />
      <ProposalInfo
        data={{
          status: ProposalStatus.FAILED,
          createdTxHash: "osmo1acqpnvg2t4wmqfdv8hq47d3petfksjs5r9t45p",
          proposer: "osmo1acqpnvg2t4wmqfdv8hq47d3petfksjs5r9t45p" as BechAddr,
          resolvedHeight: 123456,
          resolvedDate: new Date(),
        }}
      />
    </Flex>
  );
};
