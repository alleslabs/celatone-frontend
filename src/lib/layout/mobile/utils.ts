/* eslint-disable sonarjs/no-duplicate-string */
import type { IconKeys } from "lib/components/icon";
import type { MenuInfo } from "../navbar/types";

export const getNavDrawerLite = (
  isGov: boolean,
  isWasm: boolean,
  isMove: boolean
): MenuInfo[] => [
  {
    category: "Overview",
    slug: "overview",
    submenu: [
      { name: "Overview", slug: "/", icon: "home" as IconKeys },
      ...(isGov
        ? [
            {
              name: "Validators",
              slug: "/validators",
              icon: "validator" as IconKeys,
            },
            {
              name: "Proposals",
              slug: "/proposals",
              icon: "proposal" as IconKeys,
            },
          ]
        : []),
      ...(isWasm
        ? [
            {
              name: "Codes",
              slug: "/codes",
              icon: "code" as IconKeys,
            },
            {
              name: "Query",
              slug: "/interact-contract",
              icon: "query" as IconKeys,
            },
          ]
        : []),
      ...(isMove
        ? [
            {
              name: "0x1 page",
              slug: "/accounts/0x1",
              icon: "0x1" as IconKeys,
            },
            {
              name: "View module",
              slug: "/interact",
              icon: "query" as IconKeys,
            },
          ]
        : []),
    ],
  },
];

export const getNavDrawerSequencer = (
  isGov: boolean,
  isWasm: boolean,
  isMove: boolean
): MenuInfo[] => [
  {
    category: "Overview",
    slug: "overview",
    submenu: [
      { name: "Overview", slug: "/", icon: "home" as IconKeys },
      {
        name: "Transactions",
        slug: "/txs",
        icon: "file" as IconKeys,
      },
      {
        name: "Blocks",
        slug: "/blocks",
        icon: "block" as IconKeys,
      },
      ...(isGov
        ? [
            {
              name: "Validators",
              slug: "/validators",
              icon: "validator" as IconKeys,
            },
            {
              name: "Proposals",
              slug: "/proposals",
              icon: "proposal" as IconKeys,
            },
          ]
        : []),
      ...(isWasm
        ? [
            {
              name: "Codes",
              slug: "/codes",
              icon: "code" as IconKeys,
            },
            {
              name: "Query",
              slug: "/interact-contract",
              icon: "query" as IconKeys,
            },
          ]
        : []),
      ...(isMove
        ? [
            {
              name: "0x1 Page",
              slug: "/accounts/0x1",
              icon: "0x1" as IconKeys,
            },
            {
              name: "View module",
              slug: "/interact",
              icon: "query" as IconKeys,
            },
          ]
        : []),
    ],
  },
];

export const getNavDrawerFull = (
  isGov: boolean,
  isWasm: boolean,
  isMove: boolean,
  isNft: boolean
): MenuInfo[] => [
  {
    category: "Overview",
    slug: "overview",
    submenu: [
      { name: "Overview", slug: "/", icon: "home" as IconKeys },
      {
        name: "Transactions",
        slug: "/txs",
        icon: "file" as IconKeys,
      },
      {
        name: "Blocks",
        slug: "/blocks",
        icon: "block" as IconKeys,
      },
      ...(isGov
        ? [
            {
              name: "Validators",
              slug: "/validators",
              icon: "validator" as IconKeys,
            },
            {
              name: "Proposals",
              slug: "/proposals",
              icon: "proposal" as IconKeys,
            },
          ]
        : []),
      ...(isWasm
        ? [
            {
              name: "Codes",
              slug: "/codes",
              icon: "code" as IconKeys,
            },
            {
              name: "Contracts",
              slug: "/contracts",
              icon: "contract-address" as IconKeys,
            },
            {
              name: "Query",
              slug: "/interact-contract",
              icon: "query" as IconKeys,
            },
          ]
        : []),
      ...(isMove
        ? [
            {
              name: "Modules",
              slug: "/modules",
              icon: "contract-address" as IconKeys,
            },
            {
              name: "0x1 Page",
              slug: "/accounts/0x1",
              icon: "0x1" as IconKeys,
            },
            {
              name: "View module",
              slug: "/interact",
              icon: "query" as IconKeys,
            },
          ]
        : []),
      ...(isNft
        ? [
            {
              name: "NFT Collections",
              slug: "/nft-collections",
              icon: "collection" as IconKeys,
            },
          ]
        : []),
    ],
  },
];
