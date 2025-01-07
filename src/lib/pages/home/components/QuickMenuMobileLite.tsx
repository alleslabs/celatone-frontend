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
  alignItems: "center",
  bg: "gray.800",
  borderRadius: "8px",
  height: "full",
  justifyContent: "space-between",
  padding: "16px",
  width: "full",
};

const cardProps: SystemStyleObject = {
  alignItems: "center",
  bg: "gray.800",
  borderRadius: "8px",
  height: "full",
  justifyContent: "space-between",
  padding: "16px",
  width: "full",
};

interface CardProps {
  icon: IconKeys;
  isDocument: boolean;
  slug?: string;
  subtitle?: string;
  title: string;
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
          h="full"
          direction="column"
          justifyContent="space-between"
        >
          <CustomIcon
            name={item.icon}
            boxSize={{ base: 5, md: 6 }}
            color="gray.600"
          />
          <Box>
            <Heading variant="h6">{item.title}</Heading>
            <Text
              mt={1}
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
  </Box>
);

const ListPageCard = ({ item }: { item: CardProps }) => (
  <Flex
    alignItems="center"
    h="full"
    sx={cardProps}
    justifyContent="space-between"
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
          icon: "admin" as const,
          isDocument: false,
          slug: "validators",
          title: "Validators",
        },
        {
          icon: "proposal" as const,
          isDocument: false,
          slug: "proposals",
          title: "Proposals",
        }
      );

    if (wasm.enabled)
      base.push({
        icon: "code" as const,
        isDocument: false,
        slug: "codes",
        title: "Codes",
      });

    if (move.enabled)
      base.push({
        icon: "0x1" as IconKeys,
        isDocument: false,
        slug: "/accounts/0x1",
        title: "0x1 Page",
      });

    if (publicProject.enabled)
      base.push({
        icon: "public-project" as const,
        isDocument: false,
        slug: "projects",
        title: "Public Projects",
      });

    // default
    base.push({
      icon: "document" as const,
      isDocument: true,
      subtitle: "View Celatone documents",
      title: "User Guide",
    });

    return base;
  }, [gov.enabled, wasm.enabled, move.enabled, publicProject.enabled]);

  return (
    <Grid gap={4} pt={6}>
      {wasm.enabled && (
        <>
          <Heading variant="h6">Quick Action</Heading>
          <QuickActionCard
            item={{
              icon: "query" as const,
              isDocument: false,
              slug: "interact-contract",
              subtitle: "Query and get contract state data",
              title: "Query",
            }}
          />
        </>
      )}
      <Heading mt={6} variant="h6">
        Explore {prettyName}
      </Heading>
      <Grid gap={4}>
        {quickMenu.map((item) =>
          item.isDocument ? (
            <Link key={item.slug} target="_blank" href={USER_GUIDE_DOCS_LINK}>
              <ListPageCard item={item} />
            </Link>
          ) : (
            <AppLink key={item.slug} href={`/${item.slug}`}>
              <ListPageCard item={item} />
            </AppLink>
          )
        )}
      </Grid>
    </Grid>
  );
};
