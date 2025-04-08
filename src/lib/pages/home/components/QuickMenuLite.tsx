import type { SystemStyleObject } from "@chakra-ui/react";
import type { IconKeys } from "lib/components/icon";

import { Flex, Grid, Heading, Text } from "@chakra-ui/react";
import { useMoveConfig, useWasmConfig } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { CustomIcon } from "lib/components/icon";
import { USER_GUIDE_DOCS_LINK } from "lib/data";
import Link from "next/link";
import { useMemo } from "react";

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
  bgGradient: `linear(to-br, primary.darker, primary.dark)`,
};

interface ShortcutMetadata {
  title: string;
  subtitle: string;
  slug: string;
  icon: IconKeys;
  isHighlight: boolean;
  isDocument: boolean;
}

const HighlightCard = ({ item }: { item: ShortcutMetadata }) => (
  <AppLink href={`/${item.slug}`}>
    <Flex
      _hover={{ opacity: "90%" }}
      sx={highlightCardProps}
      transition="all 0.25s ease-in-out"
    >
      <Flex
        direction="column"
        gap={3}
        h="full"
        justifyContent="space-between"
        w="full"
      >
        <CustomIcon
          boxSize={{ base: 5, md: 6 }}
          color="gray.100"
          name={item.icon ?? "add-new"}
        />
        <Flex alignItems="center" justifyContent="space-between">
          <Flex direction="column" gap={1}>
            <Heading as="h6" variant="h6">
              {item.title}
            </Heading>
            <Text textDecoration="none" variant="body2">
              {item.subtitle}
            </Text>
          </Flex>
          <CustomIcon
            boxSize={{ base: 5, md: 6 }}
            color="gray.100"
            name="chevron-right"
          />
        </Flex>
      </Flex>
    </Flex>
  </AppLink>
);

const ContentCard = ({
  item,
  isDocument,
}: {
  item: ShortcutMetadata;
  isDocument: boolean;
}) => (
  <Flex
    _hover={{ bg: "gray.700" }}
    sx={cardProps}
    transition="all 0.25s ease-in-out"
  >
    <Flex
      direction="column"
      gap={6}
      h="full"
      justifyContent="space-between"
      w="full"
    >
      <CustomIcon
        boxSize={{ base: 5, md: 6 }}
        color="gray.600"
        name={item.icon}
      />
      <Flex alignItems="flex-end" justifyContent="space-between">
        <Flex direction="column">
          <Heading variant="h6">{item.title}</Heading>
          <Text color="text.dark" textDecoration="none" variant="body2">
            {item.subtitle}
          </Text>
        </Flex>
        <CustomIcon
          boxSize={{ base: 5, md: 6 }}
          color="gray.600"
          name={isDocument ? "launch" : "chevron-right"}
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
          title: "Deploy a new contract",
          subtitle: "Upload a new Wasm code or instantiate a new contract",
          slug: "deploy",
          icon: "instantiate" as const,
          isHighlight: true,
          isDocument: false,
        },
        {
          title: "Query",
          subtitle: "Query and get contract state data",
          slug: "interact-contract",
          icon: "query" as const,
          isHighlight: false,
          isDocument: false,
        },
        {
          title: "Execute",
          subtitle: "Send transactions to contracts",
          slug: "interact-contract?selectedType=execute",
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
          title: "User guide",
          subtitle: "View Scan documents",
          slug: "wasm-user-guide",
          icon: "document" as const,
          isHighlight: false,
          isDocument: true,
        }
      );

    if (move.enabled)
      base.push(
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
          title: "Deploy script",
          subtitle: "Deploy one-time use script",
          slug: "deploy-script",
          icon: "code" as const,
          isHighlight: false,
          isDocument: false,
        },
        {
          title: "User guide",
          subtitle: "View Scan documents",
          icon: "document" as const,
          slug: "move-user-guide",
          isHighlight: false,
          isDocument: true,
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
              direction="column"
              gridColumn={move.enabled && index === 0 ? "1 / -1" : "auto"}
              width={move.enabled && index === 0 ? "100%" : "auto"}
            >
              {item.isDocument ? (
                <Link
                  style={{ height: "100%" }}
                  href={USER_GUIDE_DOCS_LINK}
                  target="_blank"
                >
                  <ContentCard isDocument={item.isDocument} item={item} />
                </Link>
              ) : (
                <AppLink style={{ height: "100%" }} href={`/${item.slug}`}>
                  <ContentCard isDocument={item.isDocument} item={item} />
                </AppLink>
              )}
            </Flex>
          ))}
      </Grid>
    </Grid>
  );
};
