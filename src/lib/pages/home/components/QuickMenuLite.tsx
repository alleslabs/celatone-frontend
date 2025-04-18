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
  isDocument,
  item,
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
          icon: "instantiate" as const,
          isDocument: false,
          isHighlight: true,
          slug: "deploy",
          subtitle: "Upload a new Wasm code or instantiate a new contract",
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
          subtitle: "View Scan documents",
          title: "User guide",
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
          subtitle: "Deploy one-time use script",
          title: "Deploy script",
        },
        {
          icon: "document" as const,
          isDocument: true,
          isHighlight: false,
          slug: "move-user-guide",
          subtitle: "View Scan documents",
          title: "User guide",
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
