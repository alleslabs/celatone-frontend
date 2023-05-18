import { Flex } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { observer } from "mobx-react-lite";

import { INSTANTIATED_LIST_NAME, getListIcon, SAVED_LIST_NAME } from "lib/data";
import { useIsCurrentPage } from "lib/hooks";
import { useContractStore, usePublicProjectStore } from "lib/providers/store";
import { cmpContractListInfo } from "lib/stores/contract";
import { formatSlugName } from "lib/utils";

import { CollapseNavMenu } from "./Collapse";
import { ExpandNavMenu } from "./Expand";
import type { MenuInfo } from "./type";

interface NavbarProps {
  isExpand: boolean;
  setIsExpand: (value: boolean) => void;
}

const Navbar = observer(({ isExpand, setIsExpand }: NavbarProps) => {
  const { getContractLists } = useContractStore();
  const { getSavedPublicProjects } = usePublicProjectStore();
  const { currentChainRecord } = useWallet();
  const isCurrentPage = useIsCurrentPage();

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
        // {
        //   name: "Proposals",
        //   slug: "/proposals",
        //   icon: "proposal",
        // },
        // {
        //   name: "Osmosis Pools",
        //   slug: "/pools",
        //   icon: "pool",
        // },
      ],
    },
    {
      category: "Quick Actions",
      submenu: [
        {
          name: "Deploy Contract",
          slug: "/deploy",
          icon: "add-new",
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
        { name: "My Codes", slug: "/my-codes", icon: "code" },
        { name: "Recent Codes", slug: "/codes", icon: "website" },
      ],
    },
    {
      category: "Contracts",
      submenu: [
        {
          name: INSTANTIATED_LIST_NAME,
          slug: `/contract-lists/${formatSlugName(INSTANTIATED_LIST_NAME)}`,
          icon: getListIcon(INSTANTIATED_LIST_NAME),
        },
        {
          name: SAVED_LIST_NAME,
          slug: `/contract-lists/${formatSlugName(SAVED_LIST_NAME)}`,
          icon: getListIcon(SAVED_LIST_NAME),
        },
        ...getContractLists()
          .filter((list) => list.slug !== formatSlugName(SAVED_LIST_NAME))
          .sort(cmpContractListInfo)
          .slice(0, 3)
          .map((list) => ({
            name: list.name,
            slug: `/contract-lists/${list.slug}`,
            icon: getListIcon(list.name),
          })),
        {
          name: "View All Lists",
          slug: "/contract-lists",
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
          slug: `/projects/${list.slug}`,
          logo: list.logo,
        })),
        {
          name: "View All Projects",
          slug: "/projects",
          icon: "public-project",
        },
      ],
    });
  }

  return (
    <Flex direction="column" h="full" overflow="hidden" position="relative">
      {isExpand ? (
        <ExpandNavMenu
          navMenu={navMenu}
          isCurrentPage={isCurrentPage}
          setIsExpand={setIsExpand}
        />
      ) : (
        <CollapseNavMenu
          navMenu={navMenu}
          isCurrentPage={isCurrentPage}
          setIsExpand={setIsExpand}
        />
      )}
    </Flex>
  );
});

export default Navbar;
