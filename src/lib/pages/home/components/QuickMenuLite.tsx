import type { SystemStyleObject } from "@chakra-ui/react";
import { Flex, Grid, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useMemo } from "react";

import { useMoveConfig, useWasmConfig } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { CustomIcon } from "lib/components/icon";
import type { IconKeys } from "lib/components/icon";
import { USER_GUIDE_DOCS_LINK } from "lib/data";

const baseCardProps: SystemStyleObject = {
  alignItems: "center",
  borderRadius: "8px",
  height: "full",
  justifyContent: "space-between",
  padding: "16px",
  width: "full",
};

const cardProps = {
  ...baseCardProps,
  bg: "gray.800",
};

const highlightCardProps = {
  ...baseCardProps,
  bgGradient: `linear(to-br, primary.darker, primary.dark)`,
};

interface ShortcutMetadata {
  icon: IconKeys;
  isDocument: boolean;
  isHighlight: boolean;
  slug: string;
  subtitle: string;
  title: string;
}

const HighlightCard = ({ item }: { item: ShortcutMetadata }) => (
  <AppLink href={`/${item.slug}`}>
    <Flex
      sx={highlightCardProps}
      _hover={{ opacity: "90%" }}
      transition="all 0.25s ease-in-out"
    >
      <Flex
        gap={3}
        h="full"
        w="full"
        direction="column"
        justifyContent="space-between"
      >
        <CustomIcon
          name={item.icon ?? "add-new"}
          boxSize={{ base: 5, md: 6 }}
          color="gray.100"
        />
        <Flex alignItems="center" justifyContent="space-between">
          <Flex gap={1} direction="column">
            <Heading as="h6" variant="h6">
              {item.title}
            </Heading>
            <Text variant="body2" textDecoration="none">
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
  isDocument,
  item,
}: {
  isDocument: boolean;
  item: ShortcutMetadata;
}) => (
  <Flex
    sx={cardProps}
    _hover={{ bg: "gray.700" }}
    transition="all 0.25s ease-in-out"
  >
    <Flex
      gap={6}
      h="full"
      w="full"
      direction="column"
      justifyContent="space-between"
    >
      <CustomIcon
        name={item.icon}
        boxSize={{ base: 5, md: 6 }}
        color="gray.600"
      />
      <Flex alignItems="flex-end" justifyContent="space-between">
        <Flex direction="column">
          <Heading variant="h6">{item.title}</Heading>
          <Text variant="body2" color="text.dark" textDecoration="none">
            {item.subtitle}
          </Text>
        </Flex>
        <CustomIcon
          name={isDocument ? "launch" : "chevron-right"}
          boxSize={{ base: 5, md: 6 }}
          color="gray.600"
        />
      </Flex>
    </Flex>
  </Flex>
);

export const QuickMenuLite = () => {
  const wasm = useWasmConfig({ shouldRedirect: false });
  const move = useMoveConfig({ shouldRedirect: false });

  const quickMenu = useMemo<ShortcutMetadata[]>(() => {
    const base = [];

    if (wasm.enabled)
      base.push(
        {
          icon: "instantiate" as const,
          isDocument: false,
          isHighlight: true,
          slug: "deploy",
          subtitle: "Upload a new wasm code or instantiate a new contract",
          title: "Deploy a new contract",
        },
        {
          icon: "query" as const,
          isDocument: false,
          isHighlight: false,
          slug: "interact-contract",
          subtitle: "Query and get contract state data",
          title: "Query",
        },
        {
          icon: "execute" as const,
          isDocument: false,
          isHighlight: false,
          slug: "interact-contract?selectedType=execute",
          subtitle: "Send transactions to contracts",
          title: "Execute",
        },
        {
          icon: "migrate" as const,
          isDocument: false,
          isHighlight: false,
          slug: "migrate",
          subtitle: "Migrate contract to new code ID",
          title: "Migrate",
        },
        {
          icon: "document" as const,
          isDocument: true,
          isHighlight: false,
          slug: "wasm-user-guide",
          subtitle: "View Celatone documents",
          title: "User Guide",
        }
      );

    if (move.enabled)
      base.push(
        {
          icon: "add-new" as const,
          isDocument: false,
          isHighlight: true,
          slug: "publish-module",
          subtitle: "Upload .mv files to publish new module",
          title: "Publish / Republish",
        },
        {
          icon: "execute" as const,
          isDocument: false,
          isHighlight: false,
          slug: "interact",
          subtitle: "Interact with module's functions",
          title: "View / Execute",
        },
        {
          icon: "code" as const,
          isDocument: false,
          isHighlight: false,
          slug: "deploy-script",
          subtitle: "Deploy one-time use Script",
          title: "Deploy Script",
        },
        {
          icon: "document" as const,
          isDocument: true,
          isHighlight: false,
          slug: "move-user-guide",
          subtitle: "View Celatone documents",
          title: "User Guide",
        }
      );

    return base;
  }, [wasm.enabled, move.enabled]);

  return (
    <Grid gap={4} templateColumns="1fr 2fr">
      <HighlightCard
        item={quickMenu.find((x) => x.isHighlight) ?? quickMenu[0]}
      />
      <Grid gap={4} templateColumns="1fr 1fr" templateRows="repeat(2, 1fr)">
        {quickMenu
          .filter((item) => !item.isHighlight)
          .map((item, index) => (
            <Flex
              key={item.slug}
              gridColumn={move.enabled && index === 0 ? "1 / -1" : "auto"}
              width={move.enabled && index === 0 ? "100%" : "auto"}
              direction="column"
            >
              {item.isDocument ? (
                <Link
                  style={{ height: "100%" }}
                  target="_blank"
                  href={USER_GUIDE_DOCS_LINK}
                >
                  <ContentCard item={item} isDocument={item.isDocument} />
                </Link>
              ) : (
                <AppLink style={{ height: "100%" }} href={`/${item.slug}`}>
                  <ContentCard item={item} isDocument={item.isDocument} />
                </AppLink>
              )}
            </Flex>
          ))}
      </Grid>
    </Grid>
  );
};
