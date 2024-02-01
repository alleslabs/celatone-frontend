import { Button, Flex, Heading, Text } from "@chakra-ui/react";

import { useBaseApiRoute, useMobile } from "lib/app-provider";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { DotSeparator } from "lib/components/DotSeparator";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import type { ProposalData } from "lib/types";
import { formatUTC, openNewTab } from "lib/utils";

import { ProposalInfo } from "./ProposalInfo";

interface ProposalTopProps {
  id: number;
  proposalData: ProposalData;
}

export const ProposalTop = ({ id, proposalData }: ProposalTopProps) => {
  const isMobile = useMobile();
  const endpoint = useBaseApiRoute("proposals");
  const openApiPage = () =>
    openNewTab(`${endpoint}/${encodeURIComponent(id)}/info`);

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
      <Flex
        justifyContent="space-between"
        direction={{ base: "column", md: "row" }}
      >
        <Flex direction="column" gap={1}>
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
              color={proposalData.title ? "text.main" : "text.disabled"}
            >
              <Text
                variant={{ base: "h6", md: "h5" }}
                color="accent.main"
                display="inline"
              >
                #{id}
              </Text>{" "}
              - {proposalData.title ? proposalData.title : "No title"}
            </Heading>
          </Flex>
          <Flex gap={{ base: 2, md: 0 }} mb={4} direction="column">
            <Flex
              gap={{ base: 0, md: 2 }}
              direction={{ base: "column", md: "row" }}
            >
              <Text
                variant="body2"
                color="text.dark"
                fontWeight={500}
                whiteSpace="nowrap"
                lineHeight="24px"
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
                          {" / "}
                        </span>
                      )}
                      {msgType}
                    </Text>
                  ))}
                </Flex>
              ) : (
                <Text variant="body2" color="text.dark" lineHeight={1.8}>
                  No Message
                </Text>
              )}
            </Flex>
            <Flex>
              <Flex
                gap={{ base: 0, md: 2 }}
                direction={{ base: "column", md: "row" }}
                alignItems={{ base: "flex-start", md: "center" }}
              >
                {proposalData.createdHeight && (
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
                )}
                {proposalData.createdTimestamp && (
                  <Text variant="body2" color="text.dark">
                    {formatUTC(proposalData.createdTimestamp)}
                  </Text>
                )}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <Button
          variant="outline-primary"
          w={{ base: "full", md: "min-content" }}
          minWidth={{ md: "150px" }}
          size={{ base: "sm", md: "md" }}
          rightIcon={<CustomIcon name="launch" />}
          onClick={openApiPage}
        >
          View in JSON
        </Button>
      </Flex>
      <ProposalInfo data={proposalData} />
    </Flex>
  );
};
