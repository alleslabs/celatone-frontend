import type { SystemStyleObject } from "@chakra-ui/react";
import { Box, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useMemo } from "react";

import {
  useGovConfig,
  useMoveConfig,
  usePublicProjectConfig,
  useWasmConfig,
} from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { CustomIcon } from "lib/components/icon";
import type { IconKeys } from "lib/components/icon";
import { USER_GUIDE_DOCS_LINK } from "lib/data";

const actionCardProps: SystemStyleObject = {
  width: "full",
  height: "full",
  padding: "16px",
  borderRadius: "8px",
  justifyContent: "space-between",
  alignItems: "center",
  bg: "gray.800",
};

const cardProps: SystemStyleObject = {
  width: "full",
  height: "full",
  padding: "16px",
  borderRadius: "8px",
  justifyContent: "space-between",
  alignItems: "center",
  bg: "gray.800",
};

interface CardProps {
  title: string;
  subtitle?: string;
  slug?: string;
  icon: IconKeys;
  isDocument: boolean;
}

const QuickActionCard = ({ item }: { item: CardProps }) => (
  <Box>
    <AppLink href={`/${item.slug}`}>
      <Flex
        sx={actionCardProps}
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
            <Text
              textDecoration="none"
              variant="body2"
              color="text.dark"
              mt={1}
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
  </Box>
);

const ListPageCard = ({ item }: { item: CardProps }) => (
  <Flex
    sx={cardProps}
    alignItems="center"
    justifyContent="space-between"
    h="full"
  >
    <Flex alignItems="center" gap={2}>
      <CustomIcon
        name={item.icon}
        boxSize={{ base: 5, md: 6 }}
        color="gray.600"
      />
      <Heading variant="h6">{item.title}</Heading>
    </Flex>
    <CustomIcon
      name={item.isDocument ? "launch" : "chevron-right"}
      boxSize={{ base: 5, md: 6 }}
      color="gray.600"
    />
  </Flex>
);

export const QuickMenuMobileLite = ({ prettyName }: { prettyName: string }) => {
  const wasm = useWasmConfig({ shouldRedirect: false });
  const move = useMoveConfig({ shouldRedirect: false });
  const gov = useGovConfig({ shouldRedirect: false });
  const publicProject = usePublicProjectConfig({ shouldRedirect: false });

  const quickMenu = useMemo<CardProps[]>(() => {
    const base = [];

    if (gov.enabled)
      base.push(
        {
          title: "Validators",
          slug: "validators",
          icon: "admin" as const,
          isDocument: false,
        },
        {
          title: "Proposals",
          slug: "proposals",
          icon: "proposal" as const,
          isDocument: false,
        }
      );

    if (wasm.enabled)
      base.push({
        title: "Codes",
        slug: "codes",
        icon: "code" as const,
        isDocument: false,
      });

    if (move.enabled)
      base.push({
        title: "0x1 page",
        slug: "/accounts/0x1",
        icon: "0x1" as IconKeys,
        isDocument: false,
      });

    if (publicProject.enabled)
      base.push({
        title: "Public projects",
        slug: "projects",
        icon: "public-project" as const,
        isDocument: false,
      });

    // default
    base.push({
      title: "User guide",
      subtitle: "View Scan documents",
      icon: "document" as const,
      isDocument: true,
    });

    return base;
  }, [gov.enabled, wasm.enabled, move.enabled, publicProject.enabled]);

  return (
    <Grid gap={4} pt={6}>
      {wasm.enabled && (
        <>
          <Heading variant="h6">Quick action</Heading>
          <QuickActionCard
            item={{
              title: "Query",
              subtitle: "Query and get contract state data",
              slug: "interact-contract",
              icon: "query" as const,
              isDocument: false,
            }}
          />
        </>
      )}
      <Heading variant="h6" mt={6}>
        Explore {prettyName}
      </Heading>
      <Grid gap={4}>
        {quickMenu.map((item) =>
          item.isDocument ? (
            <Link href={USER_GUIDE_DOCS_LINK} key={item.slug} target="_blank">
              <ListPageCard item={item} />
            </Link>
          ) : (
            <AppLink href={`/${item.slug}`} key={item.slug}>
              <ListPageCard item={item} />
            </AppLink>
          )
        )}
      </Grid>
    </Grid>
  );
};
