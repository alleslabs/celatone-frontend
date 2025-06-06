import type { ProposalData } from "lib/types";

import { Flex, Heading, Text } from "@chakra-ui/react";
import { useMobile, useTierConfig } from "lib/app-provider";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { DotSeparator } from "lib/components/DotSeparator";
import { Emergency } from "lib/components/Emergency";
import { Expedited } from "lib/components/Expedited";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { ProposalStatus } from "lib/types";
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
    <Flex direction="column" gap={5}>
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
        <Flex direction="column" gap={1}>
          <Flex gap={2}>
            <CustomIcon boxSize={5} color="primary.main" name="proposal" />
            <Heading
              as="h5"
              color={proposalData.title ? "text.main" : "text.disabled"}
              ml={{ base: 1, md: 0 }}
              mt={{ base: 1, md: 0 }}
              variant={{ base: "h6", md: "h5" }}
              wordBreak="break-word"
            >
              <span style={{ color: "var(--chakra-colors-primary-main)" }}>
                #{proposalData.id}
              </span>{" "}
              - {proposalData.title ? proposalData.title : "No title"}
              {(proposalData.isExpedited || proposalData.isEmergency) && (
                <span
                  style={{
                    alignItems: "center",
                    display: "inline-flex",
                    gap: "8px",
                    marginLeft: "8px",
                    verticalAlign: "middle",
                  }}
                >
                  {proposalData.isExpedited && (
                    <Expedited isActiveExpedited={isDepositOrVoting} />
                  )}
                  {proposalData.isEmergency && <Emergency />}
                </span>
              )}
            </Heading>
          </Flex>
          <Flex direction="column" gap={{ base: 2, md: 0 }} mb={4}>
            <Flex
              align="start"
              direction={{ base: "column", md: "row" }}
              gap={{ base: 0, md: 2 }}
            >
              <Text
                color="text.dark"
                fontWeight={500}
                lineHeight="24px"
                mt="1px"
                variant="body2"
                whiteSpace="nowrap"
              >
                Proposal messages:
              </Text>
              {proposalData.types.length ? (
                <Flex display="inline-block">
                  {proposalData.types.map((msgType, index) => (
                    <Text
                      key={msgType + index.toString()}
                      color="text.main"
                      display="inline-block"
                      h={6}
                      variant="body2"
                      whiteSpace="normal"
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
                <Text color="text.dark" mt="3px" variant="body2">
                  (No Message)
                </Text>
              )}
            </Flex>
            {proposalData.createdHeight ? (
              <Flex
                alignItems={{ base: "flex-start", md: "center" }}
                direction={{ base: "column", md: "row" }}
                gap={{ base: 0, md: 2 }}
              >
                <Flex alignItems="center" gap={2}>
                  <Text color="text.dark" fontWeight={500} variant="body2">
                    Created height:
                  </Text>
                  <ExplorerLink
                    showCopyOnHover
                    type="block_height"
                    value={proposalData.createdHeight.toString()}
                  >
                    {proposalData.createdHeight.toString()}
                  </ExplorerLink>
                  {!isMobile && <DotSeparator />}
                </Flex>
                <Text color="text.dark" variant="body2">
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
