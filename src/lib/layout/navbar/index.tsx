import { Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";

import {
  usePublicProjectConfig,
  useCurrentChain,
  useWasmConfig,
} from "lib/app-provider";
import type { IconKeys } from "lib/components/icon";
import { INSTANTIATED_LIST_NAME, SAVED_LIST_NAME } from "lib/data";
import { useIsCurrentPage } from "lib/hooks";
import { useLocalStorage } from "lib/hooks/useLocalStorage";
import { usePublicProjectStore } from "lib/providers/store";
import { formatSlugName, getListIcon } from "lib/utils";

import { CollapseNavMenu } from "./Collapse";
import { ExpandNavMenu } from "./Expand";
import type { MenuInfo } from "./type";

interface NavbarProps {
  isExpand: boolean;
  setIsExpand: (value: boolean) => void;
}

const Navbar = observer(({ isExpand, setIsExpand }: NavbarProps) => {
  const { getSavedPublicProjects } = usePublicProjectStore();
  const publicProject = usePublicProjectConfig({ shouldRedirect: false });
  const isCurrentPage = useIsCurrentPage();
  const [isDevMode] = useLocalStorage("devMode", false);
  const wasm = useWasmConfig({ shouldRedirect: false });

  const prevIsDevModeRef = useRef<boolean>(isDevMode);

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
        ...(isDevMode && wasm.enabled
          ? [
              {
                name: "My Codes",
                slug: "/codes",
                icon: "code" as IconKeys,
              },
              {
                name: INSTANTIATED_LIST_NAME,
                slug: `/contract-lists/${formatSlugName(
                  INSTANTIATED_LIST_NAME
                )}`,
                icon: getListIcon(INSTANTIATED_LIST_NAME),
              },
            ]
          : []),
      ],
    },
    ...(isDevMode && wasm.enabled
      ? [
          {
            category: "Quick Actions",
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
          },
        ]
      : []),
    ...(wasm.enabled
      ? [
          {
            category: "This Device",
            submenu: [
              {
                name: "Saved Codes",
                slug: "/my-codes",
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
        ]
      : []),

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
  ];

  useEffect(() => {
    // Currently in basic mode and want to change from dev and nav is open -> should close
    if (isDevMode && !prevIsDevModeRef.current && !isExpand) {
      setIsExpand(true);
      // Currently in dev mode and want to change to basic and nav is collapse -> should expand
    } else if (!isDevMode && prevIsDevModeRef.current && isExpand) {
      setIsExpand(false);
    }
    prevIsDevModeRef.current = isDevMode;
  }, [isDevMode, isExpand, setIsExpand]);

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
