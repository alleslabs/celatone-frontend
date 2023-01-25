import { Flex, Box, Text, Icon, Image } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useCallback } from "react";
import type { IconType } from "react-icons";
import {
  MdHome,
  MdCode,
  MdMoreHoriz,
  MdOutlineAdd,
  MdSearch,
  MdInput,
  MdAdd,
  MdOutlineHistory,
  MdPublic,
  MdReadMore,
} from "react-icons/md";

import { AppLink } from "lib/components/AppLink";
import { CreateNewList } from "lib/components/modal";
import { INSTANTIATED_LIST_NAME, getListIcon, SAVED_LIST_NAME } from "lib/data";
import { useContractStore, usePublicProjectStore } from "lib/hooks";
import { cmpContractListInfo } from "lib/stores/contract";
import { formatSlugName } from "lib/utils";

interface SubmenuInfo {
  name: string;
  slug: string;
  icon?: IconType;
  logo?: string;
}

interface MenuInfo {
  category: string;
  submenu: SubmenuInfo[];
}

// TODO: move to proper place
const PERMISSIONED_CHAINS = ["osmosis", "osmosistestnet"];

const Navbar = observer(() => {
  const { getContractLists } = useContractStore();

  const { getSavedPublicProjects } = usePublicProjectStore();

  const { currentChainName } = useWallet();

  const getAllCodesShortCut = () =>
    PERMISSIONED_CHAINS.includes(currentChainName)
      ? [{ name: "All Stored Codes", slug: "/all-codes", icon: MdPublic }]
      : [];

  const navMenu: MenuInfo[] = [
    {
      category: "Overview",
      submenu: [
        { name: "Overview", slug: "/", icon: MdHome },
        {
          name: "Past Transactions",
          slug: "/past-txs",
          icon: MdOutlineHistory,
        },
      ],
    },
    {
      category: "Quick Actions",
      submenu: [
        {
          name: "Deploy contract",
          slug: "/deploy",
          icon: MdOutlineAdd,
        },
        {
          name: "Query",
          slug: "/query",
          icon: MdSearch,
        },
        {
          name: "Execute",
          slug: "/execute",
          icon: MdInput,
        },
        {
          name: "Migrate",
          slug: "/migrate",
          icon: MdReadMore,
        },
      ],
    },
    {
      category: "Codes",
      submenu: [
        { name: "My Codes", slug: "/codes", icon: MdCode },
        ...getAllCodesShortCut(),
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
          name: "View All",
          slug: "/contract-list",
          icon: MdMoreHoriz,
        },
      ],
    },
    {
      category: "Public Projects",
      submenu: [
        ...getSavedPublicProjects().map((list) => ({
          name: list.name,
          slug: `/public-project/${list.slug}`,
          logo: list.logo,
        })),
        {
          name: "View All",
          slug: "/public-project",
          icon: MdMoreHoriz,
        },
      ],
    },
  ];

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
            borderColor="gray.800"
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
                <CreateNewList
                  buttonProps={{
                    variant: "ghost-primary",
                    size: "xs",
                    leftIcon: <MdAdd />,
                    children: "NEW LIST",
                  }}
                />
              )}
            </Flex>
            {item.submenu.map((submenu) => (
              <AppLink href={submenu.slug} key={submenu.slug}>
                <Flex
                  gap="2"
                  p={2}
                  cursor="pointer"
                  _hover={{ bg: "gray.800", borderRadius: "4px" }}
                  transition="all .25s ease-in-out"
                  alignItems="center"
                  bgColor={
                    isCurrentPage(submenu.slug) ? "gray.800" : "transparent"
                  }
                  borderRadius={isCurrentPage(submenu.slug) ? "4px" : "0px"}
                >
                  {submenu.icon && (
                    <Icon as={submenu.icon} color="gray.600" boxSize="4" />
                  )}
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
