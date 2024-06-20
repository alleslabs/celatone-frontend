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
  const isFullTier = useTierConfig() === "full";
  const isMobile = useMobile();

  const isDepositOrVoting =
    proposalData.status === ProposalStatus.DEPOSIT_PERIOD ||
    proposalData.status === ProposalStatus.VOTING_PERIOD;
  return (
    <Flex direction="column" gap={5}>
      <Breadcrumb
        items={[
          {
            text: "Proposals",
            href: "/proposals",
          },
          { text: `#${proposalData.id.toString()}` },
        ]}
      />
      <Flex
        justifyContent="space-between"
        direction={{ base: "column", md: "row" }}
      >
        <Flex direction="column" gap={1}>
          <Flex gap={2}>
            <CustomIcon name="proposal" boxSize={5} color="secondary.main" />
            <Heading
              as="h5"
              mt={{ base: 1, md: 0 }}
              ml={{ base: 1, md: 0 }}
              variant={{ base: "h6", md: "h5" }}
              wordBreak="break-word"
              color={proposalData.title ? "text.main" : "text.disabled"}
            >
              <span style={{ color: "var(--chakra-colors-accent-main)" }}>
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
              gap={{ base: 0, md: 2 }}
              direction={{ base: "column", md: "row" }}
              align="start"
            >
              <Text
                variant="body2"
                color="text.dark"
                fontWeight={500}
                whiteSpace="nowrap"
                lineHeight="24px"
                mt="1px"
              >
                Proposal Messages:
              </Text>
              {proposalData.types.length ? (
                <Flex display="inline-block">
                  {proposalData.types.map((msgType, index) => (
                    <Text
                      variant="body2"
                      color="text.main"
                      whiteSpace="normal"
                      wordBreak="break-all"
                      display="inline-block"
                      key={msgType + index.toString()}
                      h={6}
                    >
                      {index > 0 && (
                        <span
                          style={{
                            color: "var(--chakra-colors-accent-main)",
                            marginLeft: "4px",
                            fontWeight: 600,
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
                <Text variant="body2" color="text.dark">
                  (No Message)
                </Text>
              )}
            </Flex>
            {proposalData.createdHeight ? (
              <Flex
                gap={{ base: 0, md: 2 }}
                direction={{ base: "column", md: "row" }}
                alignItems={{ base: "flex-start", md: "center" }}
              >
                <Flex gap={2} alignItems="center">
                  <Text color="text.dark" variant="body2" fontWeight={500}>
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
              <Text color="text.dark" variant="body2">
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
