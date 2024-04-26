import type { SystemStyleObject } from "@chakra-ui/react";
import { Box, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import { useMemo } from "react";

import { CURR_THEME } from "env";
import { useMoveConfig, useWasmConfig } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { CustomIcon } from "lib/components/icon";
import type { IconKeys } from "lib/components/icon";

const baseCardProps: SystemStyleObject = {
  width: "full",
  height: "full",
  padding: "16px",
  borderRadius: "8px",
  justifyContent: "space-between",
  alignItems: "center",
};

const cardProps = {
  ...baseCardProps,
  bg: "gray.800",
};

const highlightCardProps = {
  ...baseCardProps,
  bgGradient: CURR_THEME.colors.gradient?.main,
};

interface ShortcutMetadata {
  title: string;
  subtitle: string;
  slug?: string;
  icon: IconKeys;
  isHighlight: boolean;
  isDocument: boolean;
}

const HighlightCard = ({ item }: { item: ShortcutMetadata }) => (
  <AppLink href={`/${item.slug}`}>
    <Flex
      sx={highlightCardProps}
      _hover={{ opacity: "90%" }}
      transition="all 0.25s ease-in-out"
    >
      <Flex gap={3} direction="column" justifyContent="space-between" h="full">
        <CustomIcon
          name={item.icon ?? "add-new"}
          boxSize={{ base: 5, md: 6 }}
          color="gray.100"
        />
        <Flex alignItems="center">
          <Flex gap={1} direction="column">
            <Heading variant="h6">{item.title}</Heading>
            <Text textDecoration="none" variant="body2">
              {item.subtitle}
            </Text>
          </Flex>
          <CustomIcon
            name="chevron-right"
            boxSize={{ base: 5, md: 6 }}
            color="gray.100"
          />
        </Flex>
      </Flex>
    </Flex>
  </AppLink>
);

const ContentCard = ({
  item,
  index,
  isMove,
}: {
  item: ShortcutMetadata;
  index: number;
  isMove: boolean;
}) => {
  return (
    <Box
      key={item.slug}
      width={isMove && index === 0 ? "100%" : "auto"}
      gridColumn={isMove && index === 0 ? "1 / -1" : "auto"}
    >
      <AppLink href={`/${item.slug}`} key={item.slug}>
        <Flex
          sx={cardProps}
          _hover={{ bg: "gray.700" }}
          transition="all 0.25s ease-in-out"
        >
          <Flex
            gap={6}
            direction="column"
            justifyContent="space-between"
            h="full"
          >
            <CustomIcon
              name={item.icon}
              boxSize={{ base: 5, md: 6 }}
              color="gray.600"
            />
            <Box>
              <Heading variant="h6">{item.title}</Heading>
              <Text textDecoration="none" variant="body2" color="text.dark">
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
    </Box>
  );
};

export const QuickMenuLite = () => {
  const wasm = useWasmConfig({ shouldRedirect: false });
  const move = useMoveConfig({ shouldRedirect: false });

  const quickMenu = useMemo<ShortcutMetadata[]>(
    () => [
      ...(wasm.enabled
        ? [
            {
              title: "Deploy a new contract",
              subtitle: "Upload a new wasm code or instantiate a new contract",
              slug: "deploy",
              icon: "instantiate" as const,
              isHighlight: true,
              isDocument: false,
            },
            {
              title: "Query",
              subtitle: "Query and get contract state data",
              slug: "query",
              icon: "query" as const,
              isHighlight: false,
              isDocument: false,
            },
            {
              title: "Execute",
              subtitle: "Send transactions to contracts",
              slug: "execute",
              icon: "execute" as const,
              isHighlight: false,
              isDocument: false,
            },
            {
              title: "Migrate",
              subtitle: "Migrate contract to new code ID",
              slug: "migrate",
              icon: "migrate" as const,
              isHighlight: false,
              isDocument: false,
            },
            {
              title: "User Guide",
              subtitle: "View Celatone documents",
              icon: "document" as const,
              isHighlight: false,
              isDocument: true,
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
              isHighlight: true,
              isDocument: false,
            },
            {
              title: "View / Execute",
              subtitle: "Interact with module's functions",
              slug: "interact",
              icon: "execute" as const,
              isHighlight: false,
              isDocument: false,
            },
            {
              title: "Deploy Script",
              subtitle: "Deploy one-time use Script",
              slug: "deploy-script",
              icon: "code" as const,
              isHighlight: false,
              isDocument: false,
            },
            {
              title: "User Guide",
              subtitle: "View Celatone documents",
              icon: "document" as const,
              isHighlight: false,
              isDocument: true,
            },
          ]
        : []),
    ],
    [wasm.enabled, move.enabled]
  );

  return (
    <Grid templateColumns="1fr 2fr" gap={4}>
      <HighlightCard
        item={quickMenu.find((x) => x.isHighlight) ?? quickMenu[0]}
      />
      <Grid templateRows="repeat(2, 1fr)" templateColumns="1fr 1fr" gap={4}>
        {quickMenu
          .filter((item) => item.isHighlight === false)
          .map((item, index) => (
            <ContentCard item={item} index={index} isMove={move.enabled} />
          ))}
      </Grid>
    </Grid>
  );
};
