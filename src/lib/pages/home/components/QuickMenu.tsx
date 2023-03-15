import { Flex, Heading, Box, Text, SimpleGrid } from "@chakra-ui/react";

import { AppLink } from "lib/components/AppLink";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { CustomIcon } from "lib/components/icon";
import type { IconKeys } from "lib/components/icon";

const cardProps = {
  width: "100%",
  padding: "16px",
  borderRadius: "8px",
  justifyContent: "space-between",
  height: "100%",
};

interface SecondaryMenuType {
  title: string;
  subtitle: string;
  slug: string;
  icon: IconKeys;
}

const secondaryMenu: SecondaryMenuType[] = [
  {
    title: "Query",
    subtitle: "Query and get contract state data",
    slug: "query",
    icon: "query",
  },
  {
    title: "Execute",
    subtitle: "Send transactions to contracts",
    slug: "execute",
    icon: "execute",
  },
  {
    title: "Migrate",
    subtitle: "Migrate contract to new code ID",
    slug: "migrate",
    icon: "migrate",
  },
  {
    title: "Update Admin",
    subtitle: "Change contract admin",
    slug: "admin",
    icon: "admin",
  },
];

export const QuickMenu = () => (
  <Flex direction="column" gap={4} bg="pebble.900" p="48px">
    <Heading as="h5" variant="h5">
      Start using Celatone
    </Heading>
    <ConnectWalletAlert
      title="Connect wallet to start using Celatone"
      subtitle="Actions such as deploying new contracts or sending transactions require a wallet connection"
    />
    <Flex gap={4}>
      <AppLink href="/deploy" style={{ width: "55%" }}>
        <Flex
          bgGradient="linear(to-tr, violet.main, violet.light)"
          _hover={{ opacity: "85%" }}
          style={cardProps}
          transition="all .25s ease-in-out"
          alignItems="flex-end"
          h="full"
        >
          <Flex direction="column" justifyItems="center">
            <Text variant="body1" fontWeight="800">
              Deploy a new contract
            </Text>
            <Text variant="body2">
              Upload a new wasm code or instantiate a new contract
            </Text>
          </Flex>
          <CustomIcon name="chevron-right" color="text.main" boxSize="24px" />
        </Flex>
      </AppLink>

      <SimpleGrid columns={2} spacing={3} w="full">
        {secondaryMenu.map((item) => (
          <AppLink href={`/${item.slug}`} key={item.slug}>
            <Flex
              style={cardProps}
              _hover={{ bg: "pebble.700" }}
              transition="all .25s ease-in-out"
              bg="pebble.800"
              alignItems="center"
            >
              <Flex alignItems="center" gap={3}>
                <CustomIcon name={item.icon} boxSize="24px" />
                <Box>
                  <Text variant="body1" fontWeight="800">
                    {item.title}
                  </Text>
                  <Text textDecoration="none" variant="body2">
                    {item.subtitle}
                  </Text>
                </Box>
              </Flex>
              <CustomIcon name="chevron-right" boxSize="24px" />
            </Flex>
          </AppLink>
        ))}
      </SimpleGrid>
    </Flex>
  </Flex>
);
