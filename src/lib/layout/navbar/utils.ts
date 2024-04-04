import { AmpEvent, track } from "lib/amplitude";
import type { IconKeys } from "lib/components/icon";
import { INSTANTIATED_LIST_NAME, SAVED_LIST_NAME } from "lib/data";
import { formatSlugName, getListIcon } from "lib/utils";

export const getDevSubmenuMove = (isMove: boolean) =>
  isMove
    ? [
        {
          name: "0x1 Page",
          slug: "/accounts/0x1",
          icon: "hex" as IconKeys,
          trackEvent: () => track(AmpEvent.USE_TO_0X1_PAGE),
        },
        {
          name: "Publish / Republish",
          slug: "/publish-module",
          icon: "add-new" as IconKeys,
        },
        {
          name: "View / Execute",
          slug: "/interact",
          icon: "execute" as IconKeys,
        },
        {
          name: "Deploy Script",
          slug: "/deploy-script",
          icon: "code" as IconKeys,
        },
      ]
    : [];

export const getDevSubmenuWasm = (isWasm: boolean) =>
  isWasm
    ? [
        {
          name: "Deploy Contract",
          slug: "/deploy",
          icon: "add-new" as IconKeys,
        },
        {
          name: "Query / Execute",
          slug: "/contract-interaction",
          icon: "query" as IconKeys,
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
      ]
    : [];

export const getWalletSubSectionMove = (isMove: boolean) =>
  isMove
    ? [
        {
          category: "This Wallet",
          submenu: [
            {
              name: "My Published Modules",
              slug: "/my-published-modules",
              icon: "contract-address" as IconKeys,
            },
          ],
        },
      ]
    : [];

export const getWalletSubSectionWasm = (isWasm: boolean) =>
  isWasm
    ? [
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
              slug: `/contract-lists/${formatSlugName(INSTANTIATED_LIST_NAME)}`,
              icon: getListIcon(INSTANTIATED_LIST_NAME),
            },
          ],
        },
      ]
    : [];

export const getDeviceSubmenuWasm = (isWasm: boolean) =>
  isWasm
    ? [
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
      ]
    : [];
