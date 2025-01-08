import { Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import type { Dispatch, SetStateAction } from "react";

import {
  useCurrentChain,
  useEvmConfig,
  useInitiaL1,
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
  getDeviceSubmenuMove,
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
  const { address } = useCurrentChain();
  const { isFullTier, isSequencerTier } = useTierConfig();
  const wasm = useWasmConfig({ shouldRedirect: false });
  const move = useMoveConfig({ shouldRedirect: false });
  const evm = useEvmConfig({ shouldRedirect: false });
  const isInitiaL1 = useInitiaL1({ shouldRedirect: false });

  const { getSavedPublicProjects } = usePublicProjectStore();
  const publicProject = usePublicProjectConfig({ shouldRedirect: false });
  const isCurrentPage = useIsCurrentPage();

  const navMenu: MenuInfo[] =
    isFullTier || isSequencerTier
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
          ...(wasm.enabled || move.enabled || evm.enabled
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
                          icon: "admin" as IconKeys,
                          name: "Saved Accounts",
                          slug: "/saved-accounts",
                        },
                        ...getDeviceSubmenuMove(isInitiaL1),
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
                          icon: "admin" as IconKeys,
                          name: "Saved Accounts",
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
    <Flex h="full" direction="column" overflow="hidden" position="relative">
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
