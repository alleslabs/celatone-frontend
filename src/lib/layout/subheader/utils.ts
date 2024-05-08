import type { IconKeys } from "lib/components/icon";

export const getSubHeaderLite = (isGov: boolean, isWasm: boolean) => [
  { name: "Overview", slug: "/", icon: "home" },
  isGov && [
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
  ],
  isWasm && [{ name: "Codes", slug: "/codes", icon: "code" as IconKeys }],
];

export const getSubHeaderFull = (
  isGov: boolean,
  isWasm: boolean,
  isMove: boolean,
  isNft: boolean,
  isPool: boolean
) => [
  { name: "Overview", slug: "/", icon: "home" },
  { name: "Transactions", slug: "/txs", icon: "file" },
  { name: "Blocks", slug: "/blocks", icon: "block" },
  isGov && [
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
  ],
  isWasm && [
    { name: "Codes", slug: "/codes", icon: "code" as IconKeys },
    {
      name: "Contracts",
      slug: "/contracts",
      icon: "contract-address" as IconKeys,
    },
  ],
  isMove && [
    {
      name: "Modules",
      slug: "/modules",
      icon: "contract-address" as IconKeys,
    },
  ],
  isNft && [
    {
      name: "NFTs",
      slug: "/nft-collections",
      icon: "group" as IconKeys,
    },
  ],
  isPool && [
    {
      name: "Osmosis Pools",
      slug: "/pools",
      icon: "pool" as IconKeys,
    },
  ],
];
