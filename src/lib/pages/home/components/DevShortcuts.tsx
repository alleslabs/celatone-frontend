import type { SystemStyleObject } from "@chakra-ui/react";
import type { IconKeys } from "lib/components/icon";

import { Box, Flex, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import {
  useCelatoneApp,
  useMobile,
  useMoveConfig,
  useWasmConfig,
} from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { CustomIcon } from "lib/components/icon";
import { useMemo } from "react";

const cardProps: SystemStyleObject = {
  alignItems: "center",
  bg: "transparent",
  border: "2px solid",
  borderColor: "gray.700",
  borderRadius: "8px",
  height: "full",
  justifyContent: "space-between",
  padding: "16px",
  width: "full",
};

interface ShortcutMetadata {
  icon: IconKeys;
  slug: string;
  subtitle: string;
  title: string;
}

export const DevShortcuts = () => {
  const isMobile = useMobile();
  const { theme } = useCelatoneApp();
  const wasm = useWasmConfig({ shouldRedirect: false });
  const move = useMoveConfig({ shouldRedirect: false });

  const shortcutList = useMemo<ShortcutMetadata[]>(
    () => [
      ...(wasm.enabled
        ? [
            {
              icon: "add-new" as const,
              slug: "deploy",
              subtitle: "Upload code or instantiate contract",
              title: "Deploy",
            },
            {
              icon: "query" as const,
              slug: "interact-contract",
              subtitle: "Query and get contract state data",
              title: "Query",
            },
            {
              icon: "execute" as const,
              slug: "interact-contract?selectedType=execute",
              subtitle: "Send transactions to contracts",
              title: "Execute",
            },
          ]
        : []),
      ...(move.enabled
        ? [
            {
              icon: "add-new" as const,
              slug: "publish-module",
              subtitle: "Upload .mv files to publish new module",
              title: "Publish / Republish",
            },
            {
              icon: "execute" as const,
              slug: "interact",
              subtitle: "Interact with module's functions",
              title: "View / Execute",
            },
            {
              icon: "code" as const,
              slug: "deploy-script",
              subtitle: "Deploy one-time use script",
              title: "Deploy script",
            },
          ]
        : []),
    ],
    [wasm.enabled, move.enabled]
  );

  if (shortcutList.length === 0) return null;

  return (
    <Flex direction="column" gap={4} mb="48px">
      <Heading as="h5" variant="h5">
        Dev shortcuts
      </Heading>
      <ConnectWalletAlert
        subtitle="Specific use cases such as deploying new contract or sending execute messages require a wallet connection."
        title={`Connect wallet to start using ${theme.branding.seo.appName}`}
      />
      <SimpleGrid columns={{ md: 3, sm: 1 }} spacing={4} w="full">
        {shortcutList.map((item) => (
          <div key={item.slug}>
            {!isMobile || item.slug === "query" ? (
              <AppLink key={item.slug} href={`/${item.slug}`}>
                <Flex
                  _hover={{ bg: "gray.800" }}
                  sx={cardProps}
                  transition="all 0.25s ease-in-out"
                >
                  <Flex alignItems="center" gap={3}>
                    <CustomIcon
                      boxSize={{ base: 5, md: 6 }}
                      color="gray.600"
                      name={item.icon}
                    />
                    <Box>
                      <Text fontWeight="800" variant="body1">
                        {item.title}
                      </Text>
                      <Text
                        color="text.dark"
                        textDecoration="none"
                        variant="body2"
                      >
                        {item.subtitle}
                      </Text>
                    </Box>
                  </Flex>
                  <CustomIcon
                    boxSize={{ base: 5, md: 6 }}
                    color="gray.600"
                    name="chevron-right"
                  />
                </Flex>
              </AppLink>
            ) : (
              <Flex opacity={0.5} sx={cardProps}>
                <Flex alignItems="center" gap={3}>
                  <CustomIcon
                    boxSize={{ base: 5, md: 6 }}
                    color="gray.600"
                    name={item.icon}
                  />
                  <Box>
                    <Text fontWeight="800" variant="body1">
                      {item.title}
                    </Text>
                    <Text
                      color="text.dark"
                      textDecoration="none"
                      variant="body2"
                    >
                      {item.subtitle}
                    </Text>
                  </Box>
                </Flex>
              </Flex>
            )}
          </div>
        ))}
      </SimpleGrid>
    </Flex>
  );
};
