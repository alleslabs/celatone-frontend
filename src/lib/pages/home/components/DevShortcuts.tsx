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
  width: "full",
  height: "full",
  padding: "16px",
  borderRadius: "8px",
  justifyContent: "space-between",
  bg: "transparent",
  alignItems: "center",
  border: "2px solid",
  borderColor: "gray.700",
};

interface ShortcutMetadata {
  title: string;
  subtitle: string;
  slug: string;
  icon: IconKeys;
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
              title: "Deploy",
              subtitle: "Upload code or instantiate contract",
              slug: "deploy",
              icon: "add-new" as const,
            },
            {
              title: "Query",
              subtitle: "Query and get contract state data",
              slug: "interact-contract",
              icon: "query" as const,
            },
            {
              title: "Execute",
              subtitle: "Send transactions to contracts",
              slug: "interact-contract?selectedType=execute",
              icon: "execute" as const,
            },
          ]
        : []),
      ...(move.enabled
        ? [
            {
              title: "Publish / Republish",
              subtitle: "Upload .mv files to publish new module",
              slug: "publish-module",
              icon: "add-new" as const,
            },
            {
              title: "View / Execute",
              subtitle: "Interact with module's functions",
              slug: "interact",
              icon: "execute" as const,
            },
            {
              title: "Deploy Script",
              subtitle: "Deploy one-time use Script",
              slug: "deploy-script",
              icon: "code" as const,
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
        Dev Shortcuts
      </Heading>
      <ConnectWalletAlert
        subtitle="Specific use cases such as deploying new contract or sending execute messages require a wallet connection."
        title={`Connect wallet to start using ${theme.branding.seo.appName}`}
      />
      <SimpleGrid columns={{ sm: 1, md: 3 }} spacing={4} w="full">
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
