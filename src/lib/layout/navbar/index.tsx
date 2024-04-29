import { Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import type { Dispatch, SetStateAction } from "react";

import {
  useCurrentChain,
  useMoveConfig,
  usePublicProjectConfig,
  useTierConfig,
  useWasmConfig,
} from "lib/app-provider";
import type { IconKeys } from "lib/components/icon";
import { StorageKeys } from "lib/data";
import { useIsCurrentPage } from "lib/hooks";
import { usePublicProjectStore } from "lib/providers/store";

import { CollapseNavMenu } from "./Collapse";
import { ExpandNavMenu } from "./Expand";
import type { MenuInfo } from "./types";
import {
  getDeviceSubmenuWasm,
  getDevSubmenuMove,
  getDevSubmenuWasm,
  getPublicProjectsSubmenu,
  getWalletSubSectionMove,
  getWalletSubSectionWasm,
  getYourAccountSubmenu,
  getYourAccountSubmenuLite,
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
  const tier = useTierConfig();
  const { address } = useCurrentChain();

  const navMenu: MenuInfo[] =
    tier === "full"
      ? [
          {
            category: "Your Account",
            slug: "your-account",
            submenu: [...getYourAccountSubmenu(address)],
          },
          ...(publicProject.enabled
            ? getPublicProjectsSubmenu(
                publicProject.enabled,
                getSavedPublicProjects()
              )
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
        ]
      : [
          {
            category: "Your Account",
            slug: "your-account",
            submenu: [
              ...getYourAccountSubmenu(address),
              ...getYourAccountSubmenuLite(wasm.enabled, move.enabled),
            ],
          },
          ...(publicProject.enabled
            ? getPublicProjectsSubmenu(
                publicProject.enabled,
                getSavedPublicProjects()
              )
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
