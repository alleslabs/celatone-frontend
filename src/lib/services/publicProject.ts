import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCallback } from "react";

/**
 * Response interface
 */

interface Account {
  address: string;
  description: string;
  name: string;
  slug: string;
}

interface AssetSlug {
  slug: string;
}

interface Asset {
  coingecko: string;
  coinmarketcap: string;
  description: string;
  id: string;
  logo: string;
  name: string;
  precision: number;
  slugs: AssetSlug[];
  symbol: string;
  type: string;
}

export interface Code {
  description: string;
  id: number;
  name: string;
  slug: string;
}

interface RawContract {
  address: string;
  description: string;
  name: string;
  slug: string;
}

interface Social {
  name: string;
  url: string;
}
export interface Detail {
  github: string;
  logo: string;
  name: string;
  socials: Social[];
  website: string;
  description: string;
}

interface RawPublicProjectInfo {
  accounts: Account[];
  assets: Asset[];
  codes: Code[];
  contracts: RawContract[];
  details: Detail;
  slug: string;
}

/**
 * Return interface
 */

export interface Contract extends Omit<RawContract, "address"> {
  contractAddress: string;
}

export interface PublicProjectInfo {
  accounts: Account[];
  assets: Asset[];
  codes: Code[];
  contracts: Contract[];
  details: Detail;
  slug: string;
}

const parseContract = (raw: RawContract): Contract => ({
  contractAddress: raw.address,
  description: raw.description,
  name: raw.name,
  slug: raw.slug,
});

export const usePublicProjectsQuery = () => {
  // const { currentChainName, currentChainRecord } = useWallet();

  const queryFn = useCallback(async () => {
    /**
     * todos
     * remove hardcode
     */
    return axios
      .get<RawPublicProjectInfo[]>(
        "https://celatone-api.alleslabs.dev/projects/osmosis/osmosis-1"
      )
      .then(({ data: projects }) =>
        projects.map<PublicProjectInfo>((project) => ({
          ...project,
          contracts: project.contracts.map(parseContract),
        }))
      );
  }, []);

  return useQuery(["public_project"], queryFn, {
    keepPreviousData: true,
  });
};

export const usePublicProjectBySlugQuery = (slug: string | undefined) => {
  const queryFn = useCallback(async (): Promise<
    PublicProjectInfo | undefined
  > => {
    if (!slug) return undefined;
    /**
     * todos
     * remove hardcode
     */
    return axios
      .get<RawPublicProjectInfo>(
        `https://celatone-api.alleslabs.dev/projects/osmosis/osmosis-1/${slug}`
      )
      .then(({ data: project }) => ({
        ...project,
        contracts: project.contracts.map(parseContract),
      }));
  }, [slug]);

  return useQuery(["public_project"], queryFn, {
    keepPreviousData: true,
    enabled: !!slug,
  });
};
