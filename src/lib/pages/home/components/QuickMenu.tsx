import { Flex, Heading, Box, Text, Icon } from "@chakra-ui/react";
import Link from "next/link";
import { MdChevronRight, MdSearch, MdInput } from "react-icons/md";

import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";

// TODO remove link text-decoration underline
const cardProps = {
  width: "100%",
  padding: "16px",
  borderRadius: "4px",
  justifyContent: "space-between",
};

const secondaryMenu = [
  {
    title: "Query",
    subtitle: "Query state data from smart contracts",
    slug: "query",
    icon: MdSearch,
  },
  {
    title: "Execute",
    subtitle: "Send transactions to smart contracts",
    slug: "execute",
    icon: MdInput,
  },
];

export const QuickMenu = () => {
  return (
    <Flex direction="column" gap={4} bg="gray.900" p="48px">
      <Heading as="h6" variant="h6" color="text.main">
        Start using Celatone
      </Heading>
      <ConnectWalletAlert
        title="Connect wallet to start using Celatone"
        subtitle="Actions such as deploying new contracts or sending transactions require a wallet connection"
      />
      <Flex gap={4}>
        <Link href="/deploy" style={{ width: "100%" }}>
          <Flex
            bg="primary.main"
            _hover={{ bg: "primary.light" }}
            style={cardProps}
            transition="all .25s ease-in-out"
            alignItems="flex-end"
            h="full"
          >
            <Flex direction="column" justifyItems="center">
              <Text variant="body1" color="gray.900" fontWeight="800">
                Deploy a new contract
              </Text>
              <Text color="gray.900" variant="body2">
                Upload wasm codes or instantiate a new contract
              </Text>
            </Flex>
            <Icon as={MdChevronRight} color="gray.900" boxSize={9} />
          </Flex>
        </Link>
        <Flex direction="column" gap={4} w="full">
          {secondaryMenu.map((item) => (
            <Link href={`/${item.slug}`} key={item.slug}>
              <Flex
                style={cardProps}
                _hover={{ bg: "hover.main" }}
                transition="all .25s ease-in-out"
                bg="gray.800"
                alignItems="center"
              >
                <Flex alignItems="center" gap={3}>
                  <Icon as={item.icon} color="gray.600" boxSize={9} />
                  <Box>
                    <Text color="text.main" variant="body1" fontWeight="800">
                      {item.title}
                    </Text>
                    <Text
                      textDecoration="none"
                      color="text.main"
                      variant="body2"
                    >
                      {item.subtitle}
                    </Text>
                  </Box>
                </Flex>
                <Icon as={MdChevronRight} color="gray.600" boxSize={9} />
              </Flex>
            </Link>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};
