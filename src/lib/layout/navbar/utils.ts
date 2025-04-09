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
    name: "Past transactions",
    slug: "/past-txs",
    icon: "history" as IconKeys,
  },
  {
    name: "Your account details",
    slug: `/accounts/${address}`,
    icon: "admin" as IconKeys,
    isDisable: !address,
    tooltipText: "You need to connect wallet to view your account details.",
    trackEvent: () => track(AmpEvent.USE_TO_YOUR_ACCOUNT),
  },
];

export const getYourAccountSubmenuLite = (isWasm: boolean, isMove: boolean) => [
  ...(isWasm
    ? [
        {
          name: INSTANTIATED_LIST_NAME,
          slug: `/contract-lists/${formatSlugName(INSTANTIATED_LIST_NAME)}`,
          icon: getListIcon(INSTANTIATED_LIST_NAME),
        },
      ]
    : []),
  ...(isMove
    ? [
        {
          name: "My published modules",
          slug: "/my-published-modules",
          icon: "contract-address" as IconKeys,
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
          category: "Public projects",
          slug: StorageKeys.ProjectSidebar,
          submenu: [
            ...projects.map((list) => ({
              name: list.name,
              slug: `/projects/${list.slug}`,
              logo: list.logo || UNDEFINED_ICON_LIST[0],
            })),
            {
              name: "View all projects",
              slug: "/projects",
              icon: "public-project" as IconKeys,
            },
          ],
        },
      ]
    : [];

export const getDevSubmenuMove = (isMove: boolean) =>
  isMove
    ? [
        {
          name: "0x1 page",
          slug: "/accounts/0x1",
          icon: "0x1" as IconKeys,
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
          name: "Deploy script",
          slug: "/deploy-script",
          icon: "code" as IconKeys,
        },
      ]
    : [];

export const getDevSubmenuWasm = (isWasm: boolean) =>
  isWasm
    ? [
        {
          name: "Deploy contract",
          slug: "/deploy",
          icon: "add-new" as IconKeys,
        },
        {
          name: "Query / Execute",
          slug: "/interact-contract",
          icon: "query" as IconKeys,
        },
        {
          name: "Migrate",
          slug: "/migrate",
          icon: "migrate" as IconKeys,
        },
        // {
        //   name: "Recent activities",
        //   slug: "/",
        //   icon: "list" as IconKeys,
        // },
      ]
    : [];

export const getWalletSubSectionMove = (isMove: boolean) =>
  isMove
    ? [
        {
          category: "This wallet",
          submenu: [
            {
              name: "My published modules",
              slug: "/my-published-modules",
              icon: "contract-address" as IconKeys,
            },
          ],
        },
      ]
    : [];

export const getWalletSubSectionWasm = (
  isWasm: boolean,
  isFullTier: boolean
) =>
  isWasm
    ? [
        {
          category: "This wallet",
          submenu: [
            ...(isFullTier
              ? [
                  {
                    name: "My stored codes",
                    slug: "/stored-codes",
                    icon: "code" as IconKeys,
                  },
                ]
              : []),
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
          name: "Saved codes",
          slug: "/saved-codes",
          icon: "code" as IconKeys,
        },
        {
          name: SAVED_LIST_NAME,
          slug: `/contract-lists/${formatSlugName(SAVED_LIST_NAME)}`,
          icon: "contract-address" as IconKeys,
        },
        {
          name: "View all contract list",
          slug: "/contract-lists",
          icon: "more" as IconKeys,
        },
      ]
    : [];

export const getDeviceSubmenuMove = (enabled: boolean) =>
  enabled
    ? [
        {
          name: "My past verification",
          slug: "/my-module-verifications",
          icon: "list" as IconKeys,
        },
      ]
    : [];
