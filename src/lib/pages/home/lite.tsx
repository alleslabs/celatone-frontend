import { Flex, Heading, Spinner, Text } from "@chakra-ui/react";

import { CURR_THEME } from "env";
import { useCelatoneApp, useMobile } from "lib/app-provider";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import PageContainer from "lib/components/PageContainer";
import { TooltipInfo } from "lib/components/Tooltip";
import { useOverviewsStats } from "lib/services/overviewService";

import { QuickMenuLite, QuickMenuMobileLite } from "./components";

export const HomeLite = () => {
  const isMobile = useMobile();
  const {
    chainConfig: { prettyName },
  } = useCelatoneApp();

  const { data: overviewsStats, isLoading } = useOverviewsStats();

  return (
    <PageContainer>
      <Flex
        alignItems="center"
        justifyContent="center"
        h="full"
        direction="column"
        px={{ base: 4, md: 6, xl: 16 }}
        py={{ base: 4, md: 6, xl: 10 }}
      >
        <Flex
          justifyContent="space-between"
          w="full"
          pb={6}
          zIndex={1}
          alignItems={{ base: "start", md: "center" }}
          direction={{ base: "column", md: "row" }}
          gap={{ base: 4, md: 0 }}
          borderBottom={{ base: "1px solid", md: "0px" }}
          borderColor="gray.700"
        >
          <Heading as="h4" variant="h4">
            <Text as="span" color="accent.main">
              {prettyName}
            </Text>{" "}
            Overview
          </Heading>
          <Flex
            alignItems={{ base: "start", md: "end" }}
            direction="column"
            gap={1}
          >
            <Flex alignItems="center" gap={1}>
              <Text variant="body2" color="text.dark">
                Latest Indexed Block Height
              </Text>
              <TooltipInfo
                label="The latest block height indexed by the indexer."
                iconVariant="solid"
              />
            </Flex>
            {isLoading ? (
              <Spinner size="md" />
            ) : (
              <Flex>
                {overviewsStats && (
                  <Flex
                    w={2}
                    h={2}
                    bgColor="success.main"
                    borderRadius="16px"
                    sx={{
                      animation: `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
                      "@keyframes pulse": {
                        "0%, 100%": { opacity: 1 },
                        "50%": { opacity: 0.5 },
                      },
                    }}
                  />
                )}
                <Heading as="h5" variant="h5">
                  {overviewsStats?.latestBlock.toString() ?? "N/A"}
                </Heading>
              </Flex>
            )}
          </Flex>
        </Flex>
        <section style={{ marginBottom: "48px", width: "100%" }}>
          <Flex gap={4} direction="column">
            {!isMobile && (
              <ConnectWalletAlert
                title={`Connect wallet to start using ${CURR_THEME.branding.seo.appName}`}
                subtitle="Specific use cases such as deploying new contract or sending execute messages require a wallet connection."
              />
            )}
            {isMobile ? (
              <QuickMenuMobileLite prettyName={prettyName} />
            ) : (
              <QuickMenuLite />
            )}
          </Flex>
        </section>
      </Flex>
    </PageContainer>
  );
};
