import { Flex, Text } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";

import { AppLink } from "lib/components/AppLink";
import type { IconKeys } from "lib/components/icon";
import { CustomIcon } from "lib/components/icon";
import { useIsCurrentPage } from "lib/hooks";

interface SubHeaderMenuInfo {
  name: string;
  slug: string;
  icon: IconKeys;
}
const SubHeader = () => {
  const subHeaderMenu: SubHeaderMenuInfo[] = [
    { name: "Overview", slug: "/", icon: "home" },
    { name: "Transactions", slug: "/txs", icon: "file" },
    { name: "Blocks", slug: "/blocks", icon: "block" },
    // { name: "Validators", slug: "/validators", icon: "admin" },
  ];
  const { address } = useWallet();
  const isCurrentPage = useIsCurrentPage();

  const activeColor = "violet.light";

  const myPageSlug = `/accounts/${address}`;

  return (
    <Flex px={6} alignItems="center" h="full" justifyContent="space-between">
      <Flex h="full">
        {subHeaderMenu.map((item) => (
          <AppLink href={item.slug} key={item.slug}>
            <Flex
              alignItems="center"
              px={4}
              gap={2}
              h="full"
              borderBottomWidth={2}
              borderColor={
                isCurrentPage(item.slug) ? activeColor : "transparent"
              }
              transition="all .25s ease-in-out"
              _hover={{ borderColor: activeColor }}
              sx={{
                _hover: {
                  "> svg, > p": {
                    color: activeColor,
                    transition: "all .25s ease-in-out",
                  },
                  borderBottomWidth: 2,
                  borderColor: activeColor,
                },
              }}
            >
              <CustomIcon
                boxSize={3}
                name={item.icon}
                color={isCurrentPage(item.slug) ? activeColor : "pebble.600"}
              />
              <Text
                variant="body2"
                fontWeight="600"
                color={isCurrentPage(item.slug) ? activeColor : "text.dark"}
              >
                {item.name}
              </Text>
            </Flex>
          </AppLink>
        ))}
      </Flex>
      {address && (
        <Flex h="full">
          <AppLink href={myPageSlug} key={myPageSlug}>
            <Flex
              alignItems="center"
              px={4}
              gap={2}
              h="full"
              borderBottomWidth={2}
              borderColor={
                isCurrentPage(myPageSlug) ? "lilac.main" : "transparent"
              }
              _hover={{ borderColor: "lilac.main" }}
              transition="all .25s ease-in-out"
            >
              <CustomIcon boxSize={3} name="admin" color="lilac.main" />
              <Text variant="body2" fontWeight="600" color="lilac.main">
                My Page
              </Text>
            </Flex>
          </AppLink>
        </Flex>
      )}
    </Flex>
  );
};

export default SubHeader;
