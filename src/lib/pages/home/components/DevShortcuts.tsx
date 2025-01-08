import type { SystemStyleObject } from "@chakra-ui/react";
import { Box, Flex, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { useMemo } from "react";

import {
  useCelatoneApp,
  useMobile,
  useMoveConfig,
  useWasmConfig,
} from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { CustomIcon } from "lib/components/icon";
import type { IconKeys } from "lib/components/icon";

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
              subtitle: "Deploy one-time use Script",
              title: "Deploy Script",
            },
          ]
        : []),
    ],
    [wasm.enabled, move.enabled]
  );

  if (shortcutList.length === 0) return null;

  return (
    <Flex gap={4} mb="48px" direction="column">
      <Heading as="h5" variant="h5">
        Dev Shortcuts
      </Heading>
      <ConnectWalletAlert
        subtitle="Specific use cases such as deploying new contract or sending execute messages require a wallet connection."
        title={`Connect wallet to start using ${theme.branding.seo.appName}`}
      />
      <SimpleGrid spacing={4} w="full" columns={{ md: 3, sm: 1 }}>
        {shortcutList.map((item) => (
          <div key={item.slug}>
            {!isMobile || item.slug === "query" ? (
              <AppLink key={item.slug} href={`/${item.slug}`}>
                <Flex
                  sx={cardProps}
                  _hover={{ bg: "gray.800" }}
                  transition="all 0.25s ease-in-out"
                >
                  <Flex alignItems="center" gap={3}>
                    <CustomIcon
                      name={item.icon}
                      boxSize={{ base: 5, md: 6 }}
                      color="gray.600"
                    />
                    <Box>
                      <Text variant="body1" fontWeight="800">
                        {item.title}
                      </Text>
                      <Text
                        variant="body2"
                        color="text.dark"
                        textDecoration="none"
                      >
                        {item.subtitle}
                      </Text>
                    </Box>
                  </Flex>
                  <CustomIcon
                    name="chevron-right"
                    boxSize={{ base: 5, md: 6 }}
                    color="gray.600"
                  />
                </Flex>
              </AppLink>
            ) : (
              <Flex sx={cardProps} opacity={0.5}>
                <Flex alignItems="center" gap={3}>
                  <CustomIcon
                    name={item.icon}
                    boxSize={{ base: 5, md: 6 }}
                    color="gray.600"
                  />
                  <Box>
                    <Text variant="body1" fontWeight="800">
                      {item.title}
                    </Text>
                    <Text
                      variant="body2"
                      color="text.dark"
                      textDecoration="none"
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
