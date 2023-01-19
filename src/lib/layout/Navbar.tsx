import { Flex, Box, Text, Icon } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
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
import { useContractStore } from "lib/hooks";
import { cmpContractListInfo } from "lib/stores/contract";
import { formatSlugName } from "lib/utils";

// TODO: move to proper place
const PERMISSIONED_CHAINS = ["osmosis", "osmosistestnet"];

const Navbar = observer(() => {
  const { getContractLists } = useContractStore();
  const { currentChainName } = useWallet();

  const getAllCodesShortCut = () =>
    PERMISSIONED_CHAINS.includes(currentChainName)
      ? [{ name: "All Codes", slug: "/all-codes", icon: MdPublic }]
      : [];

  const navMenu = [
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
          .map((list) => {
            return {
              name: list.name,
              slug: `/contract-list/${list.slug}`,
              icon: getListIcon(list.name),
            };
          }),
        { name: "View All", slug: "/contract-list", icon: MdMoreHoriz },
      ],
    },
    // {
    //   category: "Public Contracts",
    //   submenu: [
    //     {
    //       name: "Astropost",
    //       slug: "/public-contracts/astroport",
    //       icon: MdLibraryBooks,
    //     },
    //     { name: "View All", slug: "/public-contracts", icon: MdMoreHoriz },
    //   ],
    // },
  ];
  const router = useRouter();
  const isCurrentPage = (slug: string) => {
    const { network } = router.query;
    const pathName = router.asPath;
    if (network) {
      return slug === "/"
        ? pathName === `/${network}`
        : pathName === `/${network}${slug}`;
    }
    return pathName === `${slug}`;
  };
  return (
    <Flex direction="column" h="full" overflow="hidden" position="relative">
      <Box p={3} overflowY="scroll">
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
                  <Icon as={submenu.icon} color="gray.600" boxSize="4" />
                  <Text variant="body2" className="ellipsis">
                    {submenu.name}
                  </Text>
                </Flex>
              </AppLink>
            ))}
          </Box>
        ))}
      </Box>
      {/* Hide deploy new contract button for now */}
      {/* <Flex
        position="fixed"
        bottom="0"
        py={3}
        bg="gray.900"
        width="full"
        maxWidth="224px"
        justifyContent="center"
        borderTop="4px solid"
        borderTopColor="background.main"
      >
        <AppLink href="/deploy">
          <Button>
            <Icon as={MdOutlineAdd} boxSize="4" />
            Deploy new contract
          </Button>
        </AppLink>
      </Flex> */}
    </Flex>
  );
});

export default Navbar;
