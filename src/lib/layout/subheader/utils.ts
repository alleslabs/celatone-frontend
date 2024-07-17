/* eslint-disable sonarjs/no-duplicate-string */
import type { IconKeys } from "lib/components/icon";

import type { SubHeaderMenuInfo } from "./types";

export const getSubHeaderLite = (isGov: boolean, isWasm: boolean) => {
  const base: SubHeaderMenuInfo[] = [
    { name: "Overview", slug: "/", icon: "home" },
  ];

  if (isGov) {
    base.push(
      {
        name: "Validators",
        slug: "/validators",
        icon: "validator" as IconKeys,
      },
      { name: "Proposals", slug: "/proposals", icon: "proposal" as IconKeys }
    );
  }

  if (isWasm) {
    base.push({
      name: "Codes",
      slug: "/codes",
      icon: "code" as IconKeys,
    });
  }

  return base;
};

export const getSubHeaderSequencer = (isGov: boolean, isWasm: boolean) => {
  const base: SubHeaderMenuInfo[] = [
    { name: "Overview", slug: "/", icon: "home" },
    { name: "Transactions", slug: "/txs", icon: "file" },
    { name: "Blocks", slug: "/blocks", icon: "block" },
  ];

  if (isGov)
    base.push(
      {
        name: "Validators",
        slug: "/validators",
        icon: "validator" as IconKeys,
      },
      {
        name: "Proposals",
        slug: "/proposals",
        icon: "proposal" as IconKeys,
      }
    );

  if (isWasm)
    base.push({ name: "Codes", slug: "/codes", icon: "code" as IconKeys });

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
    { name: "Overview", slug: "/", icon: "home" },
    { name: "Transactions", slug: "/txs", icon: "file" },
    { name: "Blocks", slug: "/blocks", icon: "block" },
  ];

  if (isGov)
    base.push(
      {
        name: "Validators",
        slug: "/validators",
        icon: "validator" as IconKeys,
      },
      {
        name: "Proposals",
        slug: "/proposals",
        icon: "proposal" as IconKeys,
      }
    );

  if (isWasm)
    base.push(
      { name: "Codes", slug: "/codes", icon: "code" as IconKeys },
      {
        name: "Contracts",
        slug: "/contracts",
        icon: "contract-address" as IconKeys,
      }
    );

  if (isMove)
    base.push({
      name: "Modules",
      slug: "/modules",
      icon: "contract-address" as IconKeys,
    });

  if (isNft)
    base.push({
      name: "NFTs",
      slug: "/nft-collections",
      icon: "group" as IconKeys,
    });

  if (isPool)
    base.push({
      name: "Osmosis Pools",
      slug: "/pools",
      icon: "pool" as IconKeys,
    });

  return base;
};
