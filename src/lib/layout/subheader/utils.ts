import type { IconKeys } from "lib/components/icon";

import type { SubHeaderMenuInfo } from "./types";

export const getSubHeaderLite = (isGov: boolean, isWasm: boolean) => {
  const base: SubHeaderMenuInfo[] = [
    { icon: "home", name: "Overview", slug: "/" },
  ];

  if (isGov) {
    base.push(
      {
        icon: "validator" as IconKeys,
        name: "Validators",
        slug: "/validators",
      },
      { icon: "proposal" as IconKeys, name: "Proposals", slug: "/proposals" }
    );
  }

  if (isWasm) {
    base.push({
      icon: "code" as IconKeys,
      name: "Codes",
      slug: "/codes",
    });
  }

  return base;
};

export const getSubHeaderSequencer = (
  isGov: boolean,
  isWasm: boolean,
  isNft: boolean
) => {
  const base: SubHeaderMenuInfo[] = [
    { icon: "home", name: "Overview", slug: "/" },
    { icon: "file", name: "Transactions", slug: "/txs" },
    { icon: "block", name: "Blocks", slug: "/blocks" },
  ];

  if (isGov)
    base.push(
      {
        icon: "validator" as IconKeys,
        name: "Validators",
        slug: "/validators",
      },
      {
        icon: "proposal" as IconKeys,
        name: "Proposals",
        slug: "/proposals",
      }
    );

  if (isWasm)
    base.push({ icon: "code" as IconKeys, name: "Codes", slug: "/codes" });

  if (isNft)
    base.push({
      icon: "collection" as IconKeys,
      name: "NFTs",
      slug: "/nft-collections",
    });

  return base;
};

export const getSubHeaderFull = (
  isGov: boolean,
  isWasm: boolean,
  isMove: boolean,
  isNft: boolean,
  isPool: boolean
) => {
  const base: SubHeaderMenuInfo[] = [
    { icon: "home", name: "Overview", slug: "/" },
    { icon: "file", name: "Transactions", slug: "/txs" },
    { icon: "block", name: "Blocks", slug: "/blocks" },
  ];

  if (isGov)
    base.push(
      {
        icon: "validator" as IconKeys,
        name: "Validators",
        slug: "/validators",
      },
      {
        icon: "proposal" as IconKeys,
        name: "Proposals",
        slug: "/proposals",
      }
    );

  if (isWasm)
    base.push(
      { icon: "code" as IconKeys, name: "Codes", slug: "/codes" },
      {
        icon: "contract-address" as IconKeys,
        name: "Contracts",
        slug: "/contracts",
      }
    );

  if (isMove)
    base.push({
      icon: "contract-address" as IconKeys,
      name: "Modules",
      slug: "/modules",
    });

  if (isNft)
    base.push({
      icon: "collection" as IconKeys,
      name: "NFTs",
      slug: "/nft-collections",
    });

  if (isPool)
    base.push({
      icon: "pool" as IconKeys,
      name: "Osmosis pools",
      slug: "/pools",
    });

  return base;
};
