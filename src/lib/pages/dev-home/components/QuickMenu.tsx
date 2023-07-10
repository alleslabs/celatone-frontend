import { Flex, Heading, Box, Text, SimpleGrid } from "@chakra-ui/react";

import { CURR_THEME } from "env";
import { useMobile } from "lib/app-provider";
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

export const QuickMenu = () => {
  const isMobile = useMobile();
  return (
    <Flex direction="column" gap={4} bg="gray.900" p={{ sm: 8, md: 12 }}>
      <Heading as="h5" variant="h5">
        Start using {CURR_THEME.branding.seo.appName}
      </Heading>
      {!isMobile && (
        <ConnectWalletAlert
          title={`Connect wallet to start using ${CURR_THEME.branding.seo.appName}`}
          subtitle="Actions such as deploying new contracts or sending transactions require a wallet connection"
        />
      )}
      <Flex gap={4} direction={{ sm: "column", md: "row" }}>
        {!isMobile && (
          <Flex width={{ sm: "full", md: "55%" }}>
            <AppLink href="/deploy" style={{ width: "100%" }}>
              <Flex
                bgGradient={CURR_THEME.colors.gradient?.main}
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
                  <Text variant="body2" color="text.dark">
                    Upload a new wasm code or instantiate a new contract
                  </Text>
                </Flex>
                <CustomIcon
                  name="chevron-right"
                  color="text.main"
                  boxSize="24px"
                />
              </Flex>
            </AppLink>
          </Flex>
        )}
        <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={3} w="full">
          {secondaryMenu.map((item) => (
            <>
              {!isMobile || item.slug === "query" ? (
                <AppLink href={`/${item.slug}`} key={item.slug}>
                  <Flex
                    style={cardProps}
                    _hover={{ bg: "gray.700" }}
                    transition="all .25s ease-in-out"
                    bg="gray.800"
                    alignItems="center"
                  >
                    <Flex alignItems="center" gap={3}>
                      <CustomIcon
                        name={item.icon}
                        boxSize="24px"
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
                      boxSize="24px"
                      color="gray.600"
                    />
                  </Flex>
                </AppLink>
              ) : (
                <Flex
                  opacity={0.5}
                  style={cardProps}
                  _hover={{ bg: "gray.700" }}
                  transition="all .25s ease-in-out"
                  bg="gray.800"
                  alignItems="center"
                >
                  <Flex alignItems="center" gap={3}>
                    <CustomIcon
                      name={item.icon}
                      boxSize="24px"
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
                  <Text variant="body2" color="text.primary">
                    On Mobile Soon
                  </Text>
                </Flex>
              )}
            </>
          ))}
        </SimpleGrid>
      </Flex>
    </Flex>
  );
};
