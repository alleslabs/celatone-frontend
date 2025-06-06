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
      { icon: "home" as IconKeys, name: "Overview", slug: "/" },
      ...(isGov
        ? [
            {
              icon: "validator" as IconKeys,
              name: "Validators",
              slug: "/validators",
            },
            {
              icon: "proposal" as IconKeys,
              name: "Proposals",
              slug: "/proposals",
            },
          ]
        : []),
      ...(isWasm
        ? [
            {
              icon: "code" as IconKeys,
              name: "Codes",
              slug: "/codes",
            },
            {
              icon: "query" as IconKeys,
              name: "Query",
              slug: "/interact-contract",
            },
          ]
        : []),
      ...(isMove
        ? [
            {
              icon: "0x1" as IconKeys,
              name: "0x1 page",
              slug: "/accounts/0x1",
            },
            {
              icon: "query" as IconKeys,
              name: "View module",
              slug: "/interact",
            },
          ]
        : []),
    ],
  },
];

export const getNavDrawerSequencer = (
  isGov: boolean,
  isWasm: boolean,
  isMove: boolean,
  isNft: boolean
): MenuInfo[] => [
  {
    category: "Overview",
    slug: "overview",
    submenu: [
      { icon: "home" as IconKeys, name: "Overview", slug: "/" },
      {
        icon: "file" as IconKeys,
        name: "Transactions",
        slug: "/txs",
      },
      {
        icon: "block" as IconKeys,
        name: "Blocks",
        slug: "/blocks",
      },
      ...(isGov
        ? [
            {
              icon: "validator" as IconKeys,
              name: "Validators",
              slug: "/validators",
            },
            {
              icon: "proposal" as IconKeys,
              name: "Proposals",
              slug: "/proposals",
            },
          ]
        : []),
      ...(isWasm
        ? [
            {
              icon: "code" as IconKeys,
              name: "Codes",
              slug: "/codes",
            },
            {
              icon: "query" as IconKeys,
              name: "Query",
              slug: "/interact-contract",
            },
          ]
        : []),
      ...(isMove
        ? [
            {
              icon: "0x1" as IconKeys,
              name: "0x1 page",
              slug: "/accounts/0x1",
            },
            {
              icon: "query" as IconKeys,
              name: "View module",
              slug: "/interact",
            },
          ]
        : []),
      ...(isNft
        ? [
            {
              icon: "collection" as IconKeys,
              name: "NFT collections",
              slug: "/nft-collections",
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
      { icon: "home" as IconKeys, name: "Overview", slug: "/" },
      {
        icon: "file" as IconKeys,
        name: "Transactions",
        slug: "/txs",
      },
      {
        icon: "block" as IconKeys,
        name: "Blocks",
        slug: "/blocks",
      },
      ...(isGov
        ? [
            {
              icon: "validator" as IconKeys,
              name: "Validators",
              slug: "/validators",
            },
            {
              icon: "proposal" as IconKeys,
              name: "Proposals",
              slug: "/proposals",
            },
          ]
        : []),
      ...(isWasm
        ? [
            {
              icon: "code" as IconKeys,
              name: "Codes",
              slug: "/codes",
            },
            {
              icon: "contract-address" as IconKeys,
              name: "Contracts",
              slug: "/contracts",
            },
            {
              icon: "query" as IconKeys,
              name: "Query",
              slug: "/interact-contract",
            },
          ]
        : []),
      ...(isMove
        ? [
            {
              icon: "contract-address" as IconKeys,
              name: "Modules",
              slug: "/modules",
            },
            {
              icon: "0x1" as IconKeys,
              name: "0x1 page",
              slug: "/accounts/0x1",
            },
            {
              icon: "query" as IconKeys,
              name: "View module",
              slug: "/interact",
            },
          ]
        : []),
      ...(isNft
        ? [
            {
              icon: "collection" as IconKeys,
              name: "NFT collections",
              slug: "/nft-collections",
            },
          ]
        : []),
    ],
  },
];
