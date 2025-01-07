import { Flex, Heading, Spinner, Text } from "@chakra-ui/react";

import { useCelatoneApp, useMobile } from "lib/app-provider";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import PageContainer from "lib/components/PageContainer";
import { useLatestBlockLcd } from "lib/services/block";

import { QuickMenuLite, QuickMenuMobileLite } from "./components";

export const HomeLite = () => {
  const isMobile = useMobile();
  const {
    chainConfig: { prettyName },
    theme,
  } = useCelatoneApp();

  const { data: latestHeight, isLoading } = useLatestBlockLcd();

  return (
    <PageContainer alignItems="center" display="flex">
      <Flex
        alignItems="center"
        px={{ base: 4, md: 6, xl: 16 }}
        w="full"
        direction="column"
        justifyContent="center"
      >
        <Flex
          alignItems={{ base: "start", md: "center" }}
          gap={{ base: 4, md: 0 }}
          pb={6}
          w="full"
          zIndex={1}
          borderBottom={{ base: "1px solid", md: "0px" }}
          borderColor="gray.700"
          direction={{ base: "column", md: "row" }}
          justifyContent="space-between"
        >
          <Heading as="h4" variant="h4" color="primary.main">
            {prettyName}
          </Heading>
          <Flex
            alignItems={{ base: "start", md: "end" }}
            gap={1}
            direction="column"
          >
            <Text variant="body2" color="text.dark">
              Latest Block Height
            </Text>
            {isLoading ? (
              <Spinner size="md" />
            ) : (
              <Flex alignItems="center" gap={2} justifyContent="center">
                {latestHeight && (
                  <Flex
                    h={2}
                    sx={{
                      "@keyframes pulse": {
                        "0%, 100%": { opacity: 1 },
                        "50%": { opacity: 0.5 },
                      },
                      animation: `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
                    }}
                    w={2}
                    bgColor="success.main"
                    borderRadius="16px"
                  />
                )}
                <Heading as="h5" variant="h5">
                  {latestHeight?.toString() ?? "N/A"}
                </Heading>
              </Flex>
            )}
          </Flex>
        </Flex>
        <section style={{ marginBottom: "48px", width: "100%" }}>
          <Flex gap={4} direction="column">
            {!isMobile && (
              <ConnectWalletAlert
                subtitle="Specific use cases such as deploying new contract or sending execute messages require a wallet connection."
                title={`Connect wallet to start using ${theme.branding.seo.appName}`}
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
