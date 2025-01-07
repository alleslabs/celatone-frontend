/* eslint-disable sonarjs/no-duplicate-string */
import { AmpEvent, track } from "lib/amplitude";
import type { IconKeys } from "lib/components/icon";
import {
  INSTANTIATED_LIST_NAME,
  SAVED_LIST_NAME,
  StorageKeys,
  UNDEFINED_ICON_LIST,
} from "lib/data";
import type { PublicProject } from "lib/stores/project";
import type { BechAddr20, Option } from "lib/types";
import { formatSlugName, getListIcon } from "lib/utils";

export const getYourAccountSubmenu = (address: Option<BechAddr20>) => [
  {
    icon: "history" as IconKeys,
    name: "Past Transactions",
    slug: "/past-txs",
  },
  {
    icon: "admin" as IconKeys,
    isDisable: !address,
    name: "Your Account Details",
    slug: `/accounts/${address}`,
    tooltipText: "You need to connect wallet to view your account details.",
    trackEvent: () => track(AmpEvent.USE_TO_YOUR_ACCOUNT),
  },
];

export const getYourAccountSubmenuLite = (isWasm: boolean, isMove: boolean) => [
  ...(isWasm
    ? [
        {
          icon: getListIcon(INSTANTIATED_LIST_NAME),
          name: INSTANTIATED_LIST_NAME,
          slug: `/contract-lists/${formatSlugName(INSTANTIATED_LIST_NAME)}`,
        },
      ]
    : []),
  ...(isMove
    ? [
        {
          icon: "contract-address" as IconKeys,
          name: "My Published Modules",
          slug: "/my-published-modules",
        },
      ]
    : []),
];

export const getPublicProjectsSubmenu = (
  hasPublicProject: boolean,
  projects: PublicProject[]
) =>
  hasPublicProject
    ? [
        {
          category: "Public Projects",
          slug: StorageKeys.ProjectSidebar,
          submenu: [
            ...projects.map((list) => ({
              logo: list.logo || UNDEFINED_ICON_LIST[0],
              name: list.name,
              slug: `/projects/${list.slug}`,
            })),
            {
              icon: "public-project" as IconKeys,
              name: "View All Projects",
              slug: "/projects",
            },
          ],
        },
      ]
    : [];

export const getDevSubmenuMove = (isMove: boolean) =>
  isMove
    ? [
        {
          icon: "0x1" as IconKeys,
          name: "0x1 Page",
          slug: "/accounts/0x1",
          trackEvent: () => track(AmpEvent.USE_TO_0X1_PAGE),
        },
        {
          icon: "add-new" as IconKeys,
          name: "Publish / Republish",
          slug: "/publish-module",
        },
        {
          icon: "execute" as IconKeys,
          name: "View / Execute",
          slug: "/interact",
        },
        {
          icon: "code" as IconKeys,
          name: "Deploy Script",
          slug: "/deploy-script",
        },
      ]
    : [];

export const getDevSubmenuWasm = (isWasm: boolean) =>
  isWasm
    ? [
        {
          icon: "add-new" as IconKeys,
          name: "Deploy Contract",
          slug: "/deploy",
        },
        {
          icon: "query" as IconKeys,
          name: "Query / Execute",
          slug: "/interact-contract",
        },
        {
          icon: "migrate" as IconKeys,
          name: "Migrate",
          slug: "/migrate",
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
              icon: "contract-address" as IconKeys,
              name: "My Published Modules",
              slug: "/my-published-modules",
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
              icon: "code" as IconKeys,
              name: "My Stored Codes",
              slug: "/stored-codes",
            },
            {
              icon: getListIcon(INSTANTIATED_LIST_NAME),
              name: INSTANTIATED_LIST_NAME,
              slug: `/contract-lists/${formatSlugName(INSTANTIATED_LIST_NAME)}`,
            },
          ],
        },
      ]
    : [];

export const getDeviceSubmenuWasm = (isWasm: boolean) =>
  isWasm
    ? [
        {
          icon: "code" as IconKeys,
          name: "Saved Codes",
          slug: "/saved-codes",
        },
        {
          icon: "contract-address" as IconKeys,
          name: SAVED_LIST_NAME,
          slug: `/contract-lists/${formatSlugName(SAVED_LIST_NAME)}`,
        },
        {
          icon: "more" as IconKeys,
          name: "View All Contract List",
          slug: "/contract-lists",
        },
      ]
    : [];

export const getDeviceSubmenuMove = (isInitiaL1: boolean) =>
  isInitiaL1
    ? [
        {
          icon: "list" as IconKeys,
          name: "My Past Verification",
          slug: "/my-module-verifications",
        },
      ]
    : [];
