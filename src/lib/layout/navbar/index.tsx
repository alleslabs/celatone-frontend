import type { IconKeys } from "lib/components/icon";
import type { Dispatch, SetStateAction } from "react";

import { Flex } from "@chakra-ui/react";
import {
  useCurrentChain,
  useEvmConfig,
  useIsApiChain,
  useMoveConfig,
  usePublicProjectConfig,
  useTierConfig,
  useWasmConfig,
} from "lib/app-provider";
import { StorageKeys } from "lib/data";
import { useIsCurrentPage } from "lib/hooks";
import { usePublicProjectStore } from "lib/providers/store";
import { observer } from "mobx-react-lite";

import type { MenuInfo } from "./types";

import { CollapseNavMenu } from "./Collapse";
import { ExpandNavMenu } from "./Expand";
import {
  getDeviceSubmenuMove,
  getDeviceSubmenuWasm,
  getDevSubmenuEvm,
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
  const { address } = useCurrentChain();
  const { isFullTier, isSequencerTier } = useTierConfig();
  const isApiChain = useIsApiChain({ shouldRedirect: false });
  const wasm = useWasmConfig({ shouldRedirect: false });
  const move = useMoveConfig({ shouldRedirect: false });
  const evm = useEvmConfig({ shouldRedirect: false });

  const { getSavedPublicProjects } = usePublicProjectStore();
  const publicProject = usePublicProjectConfig({ shouldRedirect: false });
  const isCurrentPage = useIsCurrentPage();

  const navMenu: MenuInfo[] =
    isFullTier || isSequencerTier
      ? [
          {
            category: "Your account",
            slug: "your-account",
            submenu: [...getYourAccountSubmenu(address)],
          },
          ...(publicProject.enabled
            ? getPublicProjectsSubmenu(
                publicProject.enabled,
                getSavedPublicProjects()
              )
            : []),
          ...(wasm.enabled || move.enabled || evm.enabled
            ? [
                {
                  category: "Developer tools",
                  slug: StorageKeys.DevSidebar,
                  submenu: [
                    ...getDevSubmenuMove(move.enabled),
                    ...getDevSubmenuWasm(wasm.enabled),
                    ...getDevSubmenuEvm(evm.enabled),
                  ],
                  subSection: [
                    ...getWalletSubSectionMove(move.enabled),
                    ...getWalletSubSectionWasm(wasm.enabled, isFullTier),
                    {
                      category: "This device",
                      submenu: [
                        {
                          icon: "admin" as IconKeys,
                          name: "Saved accounts",
                          slug: "/saved-accounts",
                        },
                        ...getDeviceSubmenuMove(move.enabled && isApiChain),
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
            category: "Your account",
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
                  category: "Developer tools",
                  slug: StorageKeys.DevSidebar,
                  submenu: [
                    ...getDevSubmenuMove(move.enabled),
                    ...getDevSubmenuWasm(wasm.enabled),
                  ],
                  subSection: [
                    {
                      category: "This device",
                      submenu: [
                        {
                          icon: "admin" as IconKeys,
                          name: "Saved accounts",
                          slug: "/saved-accounts",
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
          isCurrentPage={isCurrentPage}
          navMenu={navMenu}
          setIsExpand={setIsExpand}
        />
      ) : (
        <CollapseNavMenu
          isCurrentPage={isCurrentPage}
          navMenu={navMenu}
          setIsExpand={setIsExpand}
        />
      )}
    </Flex>
  );
});

export default Navbar;
