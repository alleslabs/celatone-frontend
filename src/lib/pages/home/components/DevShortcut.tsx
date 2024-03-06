import type { SystemStyleObject } from "@chakra-ui/react";
import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { useMemo } from "react";

import { useMobile, useMoveConfig, useWasmConfig } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { CustomIcon } from "lib/components/icon";
import type { IconKeys } from "lib/components/icon";

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

export const DevShortcut = () => {
  const isMobile = useMobile();
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
              slug: "query",
              icon: "query" as const,
            },
            {
              title: "Execute",
              subtitle: "Send transactions to contracts",
              slug: "execute",
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

  return (
    <SimpleGrid columns={{ sm: 1, md: 3 }} spacing={4} w="full">
      {shortcutList.map((item) => (
        <div key={item.slug}>
          {!isMobile || item.slug === "query" ? (
            <AppLink href={`/${item.slug}`} key={item.slug}>
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
                      textDecoration="none"
                      variant="body2"
                      color="text.dark"
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
            <Flex opacity={0.5} sx={cardProps}>
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
                  <Text textDecoration="none" variant="body2" color="text.dark">
                    {item.subtitle}
                  </Text>
                </Box>
              </Flex>
            </Flex>
          )}
        </div>
      ))}
    </SimpleGrid>
  );
};
