import { Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import type { Dispatch, SetStateAction } from "react";

import {
  usePublicProjectConfig,
  useCurrentChain,
  useWasmConfig,
} from "lib/app-provider";
import type { IconKeys } from "lib/components/icon";
import { INSTANTIATED_LIST_NAME, SAVED_LIST_NAME } from "lib/data";
import { useIsCurrentPage } from "lib/hooks";
import { usePublicProjectStore } from "lib/providers/store";
import { formatSlugName, getListIcon } from "lib/utils";

import { CollapseNavMenu } from "./Collapse";
import { ExpandNavMenu } from "./Expand";
import type { MenuInfo } from "./type";

interface NavbarProps {
  isExpand: boolean;
  setIsExpand: Dispatch<SetStateAction<boolean>>;
}

const Navbar = observer(({ isExpand, setIsExpand }: NavbarProps) => {
  const { getSavedPublicProjects } = usePublicProjectStore();
  const publicProject = usePublicProjectConfig({ shouldRedirect: false });
  const isCurrentPage = useIsCurrentPage();
  const wasm = useWasmConfig({ shouldRedirect: false });

  const { address } = useCurrentChain();

  const navMenu: MenuInfo[] = [
    {
      category: "Your Account",
      submenu: [
        {
          name: "Past Transactions",
          slug: "/past-txs",
          icon: "history" as IconKeys,
        },
        {
          name: "Your Account Details",
          slug: `/accounts/${address}`,
          icon: "admin" as IconKeys,
          isDisable: !address,
          tooltipText:
            "You need to connect wallet to view your account details.",
        },
      ],
    },
    ...(publicProject.enabled
      ? [
          {
            category: "Public Projects",
            submenu: [
              ...getSavedPublicProjects().map((list) => ({
                name: list.name,
                slug: `/projects/${list.slug}`,
                logo: list.logo as IconKeys,
              })),
              {
                name: "View All Projects",
                slug: "/projects",
                icon: "public-project" as IconKeys,
              },
            ],
          },
        ]
      : []),
    ...(wasm.enabled
      ? [
          {
            category: "Developer Tools",
            submenu: [
              {
                name: "Deploy Contract",
                slug: "/deploy",
                icon: "add-new" as IconKeys,
              },
              {
                name: "Query",
                slug: "/query",
                icon: "query" as IconKeys,
              },
              {
                name: "Execute",
                slug: "/execute",
                icon: "execute" as IconKeys,
              },
              {
                name: "Migrate",
                slug: "/migrate",
                icon: "migrate" as IconKeys,
              },
              // {
              //   name: "Recent Activities",
              //   slug: "/",
              //   icon: "list" as IconKeys,
              // },
            ],
            subSection: [
              {
                category: "This Wallet",
                submenu: [
                  {
                    name: "My Stored Codes",
                    slug: "/stored-codes",
                    icon: "code" as IconKeys,
                  },
                  {
                    name: INSTANTIATED_LIST_NAME,
                    slug: `/contract-lists/${formatSlugName(
                      INSTANTIATED_LIST_NAME
                    )}`,
                    icon: getListIcon(INSTANTIATED_LIST_NAME),
                  },
                ],
              },
              {
                category: "This Device",
                submenu: [
                  {
                    name: "Saved Codes",
                    slug: "/saved-codes",
                    icon: "code" as IconKeys,
                  },
                  {
                    name: SAVED_LIST_NAME,
                    slug: `/contract-lists/${formatSlugName(SAVED_LIST_NAME)}`,
                    icon: "contract-address" as IconKeys,
                  },
                  {
                    name: "View All Contract List",
                    slug: "/contract-lists",
                    icon: "more" as IconKeys,
                  },
                ],
              },
            ],
          },
        ]
      : []),
  ];

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
