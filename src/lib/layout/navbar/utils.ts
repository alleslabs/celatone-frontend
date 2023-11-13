import type { IconKeys } from "lib/components/icon";
import { SAVED_LIST_NAME } from "lib/data";
import { formatSlugName } from "lib/utils";

export const getDevSubmenuMove = (isMove: boolean) =>
  isMove
    ? [
        {
          name: "0x1 Page",
          slug: "/accounts/0x1",
          icon: "hex" as IconKeys,
        },
        {
          name: "Publish Module",
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
