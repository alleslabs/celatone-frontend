import { Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import type { Dispatch, SetStateAction } from "react";

import { AmpEvent, track } from "lib/amplitude";
import {
  useCurrentChain,
  useMoveConfig,
  usePublicProjectConfig,
  useWasmConfig,
} from "lib/app-provider";
import type { IconKeys } from "lib/components/icon";
import { StorageKeys, UNDEFINED_ICON_LIST } from "lib/data";
import { useIsCurrentPage } from "lib/hooks";
import { usePublicProjectStore } from "lib/providers/store";

import { CollapseNavMenu } from "./Collapse";
import { ExpandNavMenu } from "./Expand";
import type { MenuInfo } from "./types";
import {
  getDeviceSubmenuWasm,
  getDevSubmenuMove,
  getDevSubmenuWasm,
  getWalletSubSectionMove,
  getWalletSubSectionWasm,
} from "./utils";

interface NavbarProps {
  isExpand: boolean;
  setIsExpand: Dispatch<SetStateAction<boolean>>;
}

const Navbar = observer(({ isExpand, setIsExpand }: NavbarProps) => {
  const { getSavedPublicProjects } = usePublicProjectStore();
  const publicProject = usePublicProjectConfig({ shouldRedirect: false });
  const isCurrentPage = useIsCurrentPage();
  const wasm = useWasmConfig({ shouldRedirect: false });
  const move = useMoveConfig({ shouldRedirect: false });

  const { address } = useCurrentChain();

  const navMenu: MenuInfo[] = [
    {
      category: "Your Account",
      slug: "your-account",
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
          trackEvent: () => track(AmpEvent.USE_TO_YOUR_ACCOUNT),
        },
      ],
    },
    ...(publicProject.enabled
      ? [
          {
            category: "Public Projects",
            slug: StorageKeys.ProjectSidebar,
            submenu: [
              ...getSavedPublicProjects().map((list) => ({
                name: list.name,
                slug: `/projects/${list.slug}`,
                logo: list.logo || UNDEFINED_ICON_LIST[0],
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
    ...(move.enabled || wasm.enabled
      ? [
          {
            category: "Developer Tools",
            slug: StorageKeys.DevSidebar,
            submenu: [
              ...getDevSubmenuMove(move.enabled),
              ...getDevSubmenuWasm(wasm.enabled),
            ],
            subSection: [
              ...getWalletSubSectionMove(move.enabled),
              ...getWalletSubSectionWasm(wasm.enabled),
              {
                category: "This Device",
                submenu: [
                  {
                    name: "Saved Accounts",
                    slug: "/saved-accounts",
                    icon: "admin" as IconKeys,
                  },
                  ...getDeviceSubmenuWasm(wasm.enabled),
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
