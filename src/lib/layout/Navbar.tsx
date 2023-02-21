import { Flex, Box, Text, Image } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useCallback } from "react";

import { AppLink } from "lib/components/AppLink";
import type { ICONS } from "lib/components/icon/CustomIcon";
import { CustomIcon } from "lib/components/icon/CustomIcon";
import { CreateNewListModal } from "lib/components/modal";
import { INSTANTIATED_LIST_NAME, getListIcon, SAVED_LIST_NAME } from "lib/data";
import { useContractStore, usePublicProjectStore } from "lib/hooks";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import { cmpContractListInfo } from "lib/stores/contract";
import { formatSlugName } from "lib/utils";

interface SubmenuInfo {
  name: string;
  slug: string;
  icon?: keyof typeof ICONS;
  logo?: string;
}

interface MenuInfo {
  category: string;
  submenu: SubmenuInfo[];
}

const Navbar = observer(() => {
  const { getContractLists } = useContractStore();
  const { getSavedPublicProjects } = usePublicProjectStore();
  const { currentChainRecord } = useWallet();

  const navMenu: MenuInfo[] = [
    {
      category: "Overview",
      submenu: [
        { name: "Overview", slug: "/", icon: "home" },
        {
          name: "Past Transactions",
          slug: "/past-txs",
          icon: "history",
        },
      ],
    },
    {
      category: "Quick Actions",
      submenu: [
        {
          name: "Deploy Contract",
          slug: "/deploy",
          icon: "addNew",
        },
        {
          name: "Query",
          slug: "/query",
          icon: "query",
        },
        {
          name: "Execute",
          slug: "/execute",
          icon: "execute",
        },
        {
          name: "Migrate",
          slug: "/migrate",
          icon: "migrate",
        },
      ],
    },
    {
      category: "Codes",
      submenu: [
        { name: "My Codes", slug: "/codes", icon: "code" },
        { name: "Recent Codes", slug: "/recent-codes", icon: "website" },
      ],
    },
    {
      category: "Contracts",
      submenu: [
        {
          name: INSTANTIATED_LIST_NAME,
          slug: `/contract-list/${formatSlugName(INSTANTIATED_LIST_NAME)}`,
          icon: getListIcon(INSTANTIATED_LIST_NAME),
        },
        {
          name: SAVED_LIST_NAME,
          slug: `/contract-list/${formatSlugName(SAVED_LIST_NAME)}`,
          icon: getListIcon(SAVED_LIST_NAME),
        },
        ...getContractLists()
          .filter((list) => list.slug !== formatSlugName(SAVED_LIST_NAME))
          .sort(cmpContractListInfo)
          .slice(0, 3)
          .map((list) => ({
            name: list.name,
            slug: `/contract-list/${list.slug}`,
            icon: getListIcon(list.name),
          })),
        {
          name: "View All Lists",
          slug: "/contract-list",
          icon: "more",
        },
      ],
    },
  ];

  if (currentChainRecord?.chain.network_type === "mainnet") {
    navMenu.push({
      category: "Public Projects",
      submenu: [
        ...getSavedPublicProjects().map((list) => ({
          name: list.name,
          slug: `/public-project/${list.slug}`,
          logo: list.logo,
        })),
        {
          name: "View All Projects",
          slug: "/public-project",
          icon: "more",
        },
      ],
    });
  }
  const router = useRouter();
  const { network } = router.query;
  const pathName = router.asPath;

  const isCurrentPage = useCallback(
    (slug: string) => {
      if (network) {
        return slug === "/"
          ? pathName === `/${network}`
          : pathName === `/${network}${slug}`;
      }
      return pathName === `${slug}`;
    },
    [network, pathName]
  );

  return (
    <Flex direction="column" h="full" overflow="hidden" position="relative">
      <Box px={4} py={2} overflowY="scroll">
        {navMenu.map((item) => (
          <Box
            pb="4"
            mb="4"
            key={item.category}
            borderBottom="1px solid"
            borderColor="pebble.700"
            sx={{
              "&:last-of-type": {
                borderBottom: "none",
                paddingBottom: "0px",
                marginBottom: "0px",
              },
            }}
          >
            <Flex justifyContent="space-between" alignItems="center">
              <Text py="2" variant="body3" fontWeight="600">
                {item.category}
              </Text>
              {item.category === "Contracts" && (
                <CreateNewListModal
                  buttonProps={{
                    variant: "ghost-info",
                    size: "xs",
                    leftIcon: (
                      <CustomIcon
                        name="plus"
                        color="honeydew.main"
                        boxSize="12px"
                      />
                    ),
                    children: "NEW LIST",
                    onClick: () => AmpTrack(AmpEvent.USE_SIDEBAR),
                  }}
                />
              )}
            </Flex>
            {item.submenu.map((submenu) => (
              <AppLink
                href={submenu.slug}
                key={submenu.slug}
                onClick={() => AmpTrack(AmpEvent.USE_SIDEBAR)}
              >
                <Flex
                  gap="2"
                  p={2}
                  cursor="pointer"
                  _hover={{ bg: "pebble.800", borderRadius: "8px" }}
                  my="1px"
                  transition="all .25s ease-in-out"
                  alignItems="center"
                  bgColor={
                    isCurrentPage(submenu.slug) ? "pebble.800" : "transparent"
                  }
                  borderRadius={isCurrentPage(submenu.slug) ? "8px" : "0px"}
                >
                  {submenu.icon && <CustomIcon name={submenu.icon} />}
                  {submenu.logo && (
                    <Image
                      src={submenu.logo}
                      borderRadius="full"
                      alt={submenu.slug}
                      boxSize={4}
                    />
                  )}
                  <Text variant="body2" className="ellipsis">
                    {submenu.name}
                  </Text>
                </Flex>
              </AppLink>
            ))}
          </Box>
        ))}
      </Box>
    </Flex>
  );
});

export default Navbar;
