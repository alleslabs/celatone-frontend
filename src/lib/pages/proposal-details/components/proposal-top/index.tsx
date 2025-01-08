import { Flex, Heading, Text } from "@chakra-ui/react";

import { useMobile, useTierConfig } from "lib/app-provider";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { DotSeparator } from "lib/components/DotSeparator";
import { Expedited } from "lib/components/Expedited";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { ProposalStatus } from "lib/types";
import type { ProposalData } from "lib/types";
import { formatUTC } from "lib/utils";

import { ProposalInfo } from "./proposal-info";
import { ViewProposalJson } from "./ViewProposalJson";

interface ProposalTopProps {
  proposalData: ProposalData;
}

export const ProposalTop = ({ proposalData }: ProposalTopProps) => {
  const { isFullTier } = useTierConfig();
  const isMobile = useMobile();

  const isDepositOrVoting =
    proposalData.status === ProposalStatus.DEPOSIT_PERIOD ||
    proposalData.status === ProposalStatus.VOTING_PERIOD;
  return (
    <Flex gap={5} direction="column">
      <Breadcrumb
        items={[
          {
            href: "/proposals",
            text: "Proposals",
          },
          { text: `#${proposalData.id.toString()}` },
        ]}
      />
      <Flex
        direction={{ base: "column", md: "row" }}
        justifyContent="space-between"
      >
        <Flex gap={1} direction="column">
          <Flex gap={2}>
            <CustomIcon name="proposal" boxSize={5} color="primary.main" />
            <Heading
              as="h5"
              ml={{ base: 1, md: 0 }}
              mt={{ base: 1, md: 0 }}
              variant={{ base: "h6", md: "h5" }}
              color={proposalData.title ? "text.main" : "text.disabled"}
              wordBreak="break-word"
            >
              <span style={{ color: "var(--chakra-colors-primary-main)" }}>
                #{proposalData.id}
              </span>{" "}
              - {proposalData.title ? proposalData.title : "No title"}
              {proposalData.isExpedited && (
                <span
                  style={{
                    display: "inline-block",
                    marginLeft: "8px",
                    verticalAlign: "middle",
                  }}
                >
                  <Expedited isActiveExpedited={isDepositOrVoting} />
                </span>
              )}
            </Heading>
          </Flex>
          <Flex gap={{ base: 2, md: 0 }} mb={4} direction="column">
            <Flex
              align="start"
              gap={{ base: 0, md: 2 }}
              direction={{ base: "column", md: "row" }}
            >
              <Text
                lineHeight="24px"
                mt="1px"
                variant="body2"
                whiteSpace="nowrap"
                color="text.dark"
                fontWeight={500}
              >
                Proposal Messages:
              </Text>
              {proposalData.types.length ? (
                <Flex display="inline-block">
                  {proposalData.types.map((msgType, index) => (
                    <Text
                      key={msgType + index.toString()}
                      display="inline-block"
                      h={6}
                      variant="body2"
                      whiteSpace="normal"
                      color="text.main"
                      wordBreak="break-all"
                    >
                      {index > 0 && (
                        <span
                          style={{
                            color: "var(--chakra-colors-primary-main)",
                            fontWeight: 600,
                            marginLeft: "4px",
                          }}
                        >
                          {" , "}
                        </span>
                      )}
                      {msgType}
                    </Text>
                  ))}
                </Flex>
              ) : (
                <Text mt="3px" variant="body2" color="text.dark">
                  (No Message)
                </Text>
              )}
            </Flex>
            {proposalData.createdHeight ? (
              <Flex
                alignItems={{ base: "flex-start", md: "center" }}
                gap={{ base: 0, md: 2 }}
                direction={{ base: "column", md: "row" }}
              >
                <Flex alignItems="center" gap={2}>
                  <Text variant="body2" color="text.dark" fontWeight={500}>
                    Created Height:
                  </Text>
                  <ExplorerLink
                    type="block_height"
                    value={proposalData.createdHeight.toString()}
                    showCopyOnHover
                  >
                    {proposalData.createdHeight.toString()}
                  </ExplorerLink>
                  {!isMobile && <DotSeparator />}
                </Flex>
                <Text variant="body2" color="text.dark">
                  {formatUTC(proposalData.submitTime)}
                </Text>
              </Flex>
            ) : (
              <Text variant="body2" color="text.dark">
                <span style={{ fontWeight: 500 }}>Created Time: </span>
                {formatUTC(proposalData.submitTime)}
              </Text>
            )}
          </Flex>
        </Flex>
        <ViewProposalJson id={proposalData.id} status={proposalData.status} />
      </Flex>
      {(isFullTier || isDepositOrVoting) && (
        <ProposalInfo data={proposalData} />
      )}
    </Flex>
  );
};
