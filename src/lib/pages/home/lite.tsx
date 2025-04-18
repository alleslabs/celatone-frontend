import { Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { useCelatoneApp, useMobile } from "lib/app-provider";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import PageContainer from "lib/components/PageContainer";
import { useLatestBlockRest } from "lib/services/block";

import { QuickMenuLite, QuickMenuMobileLite } from "./components";

export const HomeLite = () => {
  const isMobile = useMobile();
  const {
    chainConfig: { prettyName },
    theme,
  } = useCelatoneApp();

  const { data: latestHeight, isLoading } = useLatestBlockRest();

  return (
    <PageContainer alignItems="center" display="flex">
      <Flex
        alignItems="center"
        direction="column"
        justifyContent="center"
        px={{ base: 4, md: 6, xl: 16 }}
        w="full"
      >
        <Flex
          alignItems={{ base: "start", md: "center" }}
          borderBottomWidth={{ base: "1px", md: "0px" }}
          borderColor="gray.700"
          direction={{ base: "column", md: "row" }}
          gap={{ base: 4, md: 0 }}
          justifyContent="space-between"
          pb={6}
          w="full"
          zIndex={1}
        >
          <Heading as="h4" color="primary.main" variant="h4">
            {prettyName}
          </Heading>
          <Flex
            alignItems={{ base: "start", md: "end" }}
            direction="column"
            gap={1}
          >
            <Text color="text.dark" variant="body2">
              Latest Block Height
            </Text>
            {isLoading ? (
              <Spinner size="md" />
            ) : (
              <Flex alignItems="center" gap={2} justifyContent="center">
                {latestHeight && (
                  <Flex
                    bgColor="success.main"
                    borderRadius="16px"
                    h={2}
                    sx={{
                      "@keyframes pulse": {
                        "0%, 100%": { opacity: 1 },
                        "50%": { opacity: 0.5 },
                      },
                      animation: `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
                    }}
                    w={2}
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
          <Flex direction="column" gap={4}>
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
