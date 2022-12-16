import { makeAutoObservable } from "mobx";
import { isHydrated, makePersistable } from "mobx-persist-store";

import { INSTANTIATED_LIST_NAME, SAVED_LIST_NAME } from "lib/data";
import type { Option, Dict } from "lib/types";
import { formatSlugName } from "lib/utils";

export interface ContractInfo {
  address: string;
  instantiator: string;
  label: string;
  created: Date;
  name?: string;
  description?: string;
  tags?: string[];
  // TODO: replace with another type
  lists?: Option[];
}
interface ContractList {
  name: string;
  slug: string;
  contracts: string[];
  lastUpdated: Date;
  isInfoEditable: boolean;
  isContractRemovable: boolean;
}

export interface ContractListInfo {
  contracts: ContractInfo[];
  name: string;
  slug: string;
  lastUpdated: Date;
  isInfoEditable: boolean;
  isContractRemovable: boolean;
}

export const cmpContractListInfo = (
  a: ContractListInfo,
  b: ContractListInfo
) => {
  if (a.lastUpdated !== b.lastUpdated)
    return b.lastUpdated.getTime() - a.lastUpdated.getTime();
  return a.slug.localeCompare(b.slug);
};

export interface Activity {
  type: "query" | "execute";
  action: string;
  sender: string | undefined;
  contractAddress: string;
  msg: string; // base64
  timestamp: Date;
}

export class ContractStore {
  userKey: string;

  private defaultContractList: ContractList[] = [
    {
      name: SAVED_LIST_NAME,
      slug: formatSlugName(SAVED_LIST_NAME),
      contracts: [],
      lastUpdated: new Date(),
      isInfoEditable: false,
      isContractRemovable: true,
    },
  ];

  contractList: Dict<string, ContractList[]>; // user key

  contractInfo: Dict<
    string, // user key
    Record<string, ContractInfo> // contract address
  >;

  allTags: Dict<string, Map<string, Set<string>>>;

  recentActivities: Dict<string, Activity[]>;

  constructor() {
    this.contractList = {};
    this.contractInfo = {};
    this.allTags = {};
    this.recentActivities = {};
    this.userKey = "";

    makeAutoObservable(this, {}, { autoBind: true });

    makePersistable(this, {
      name: "ContractStore",
      properties: [
        "contractList",
        "contractInfo",
        "allTags",
        "recentActivities",
      ],
    });
  }

  get isHydrated(): boolean {
    return isHydrated(this);
  }

  get isContractUserKeyExist(): boolean {
    return !!this.userKey;
  }

  setContractUserKey(userKey: string) {
    this.userKey = userKey;
  }

  getAllTags(userKey: string): string[] {
    return Array.from(this.allTags[userKey]?.keys() ?? []);
  }

  private getContractList(userKey: string): ContractList[] {
    const contractList = this.contractList[userKey];
    if (contractList) return contractList;

    this.contractList[userKey] = this.defaultContractList;
    return this.defaultContractList;
  }

  getContractLists(): ContractListInfo[] {
    const contractListByUserKey = this.getContractList(this.userKey);
    const contractInfoByUserKey = this.contractInfo[this.userKey];

    return contractListByUserKey.map((contractListInfo) => ({
      ...contractListInfo,
      contracts: contractListInfo.contracts.map((contractAddr) => {
        if (!contractInfoByUserKey)
          return {
            address: contractAddr,
            instantiator: "TODO",
            label: "TODO",
            created: new Date(0),
          };

        const contractInfo = contractInfoByUserKey[contractAddr];

        return { ...contractInfo };
      }),
    }));
  }

  getContractInfo(address: string): ContractInfo | undefined {
    return this.contractInfo[this.userKey]?.[address];
  }

  isContractListExist(userKey: string, name: string): boolean {
    const slug = formatSlugName(name);

    const foundIndex = this.getContractList(userKey).findIndex(
      (each) => each.slug === slug
    );

    return slug === formatSlugName(INSTANTIATED_LIST_NAME) || foundIndex > -1;
  }

  createNewList(userKey: string, name: string) {
    if (!this.isContractListExist(userKey, name)) {
      const oldList = this.getContractList(userKey);

      this.contractList[userKey] = [
        ...oldList,
        {
          name: name.trim(),
          slug: formatSlugName(name),
          contracts: [],
          lastUpdated: new Date(),
          isInfoEditable: true,
          isContractRemovable: true,
        },
      ];
    }
  }

  renameList(userKey: string, slug: string, newName: string) {
    if (!this.isContractListExist(userKey, newName)) {
      const list = this.getContractList(userKey).find(
        (each) => each.slug === slug
      );
      if (!list) return;

      const contracts = this.contractInfo[userKey];

      if (contracts) {
        list.contracts.forEach((addr) => {
          const oldLists = contracts[addr].lists;
          if (oldLists) {
            contracts[addr].lists = oldLists.map((item) =>
              item.value !== slug
                ? item
                : { label: newName, value: formatSlugName(newName) }
            );
          }
        });
      }

      list.name = newName;
      list.slug = formatSlugName(newName);
      list.lastUpdated = new Date();
    }
  }

  removeList(userKey: string, slug: string) {
    const list = this.getContractList(userKey).find(
      (each) => each.slug === slug
    );
    if (!list) return;

    const contracts = this.contractInfo[userKey];

    if (contracts) {
      list.contracts.forEach((addr) => {
        const oldLists = contracts[addr].lists;
        if (oldLists) {
          contracts[addr].lists = oldLists.filter(
            (item) => item.value !== slug
          );
        }
      });
    }

    this.contractList[userKey] = this.getContractList(userKey).filter(
      (each) => each.slug !== slug
    );
  }

  updateContractInfo(
    userKey: string,
    contractAddr: string,
    instantiator: string,
    label: string,
    created: Date,
    name?: string,
    description?: string,
    tags?: string[],
    lists?: Option[]
  ) {
    const contractInfo = this.contractInfo[userKey]?.[contractAddr] ?? {
      address: contractAddr,
      instantiator,
      label,
      created,
    };

    if (name !== undefined)
      contractInfo.name = name.trim().length ? name.trim() : undefined;
    if (description !== undefined)
      contractInfo.description = description.trim().length
        ? description.trim()
        : undefined;
    if (tags !== undefined) {
      this.updateContractInfoTags(
        userKey,
        contractAddr,
        contractInfo.tags ?? [],
        tags
      );
      contractInfo.tags = tags;
    }
    if (lists !== undefined) {
      this.updateContractInfoLists(
        userKey,
        contractAddr,
        contractInfo.lists ?? [],
        lists
      );
      contractInfo.lists = lists;
    }

    if (lists && lists.length === 0) {
      delete this.contractInfo[userKey]?.[contractAddr];
    } else {
      this.contractInfo[userKey] = {
        ...this.contractInfo[userKey],
        [contractAddr]: contractInfo,
      };
    }
  }

  private updateContractInfoTags(
    userKey: string,
    contractAddr: string,
    oldTags: string[],
    newTags: string[]
  ) {
    const tags = this.allTags[userKey] ?? new Map<string, Set<string>>();

    const removedTags = oldTags.filter((oldTag) => !newTags.includes(oldTag));
    removedTags.forEach((oldTag) => {
      const tagInfo = tags.get(oldTag);
      if (tagInfo) {
        tagInfo.delete(contractAddr);
        if (tagInfo.size === 0) tags.delete(oldTag);
        else tags.set(oldTag, tagInfo);
      }
    });

    const addedTags = newTags.filter((newTag) => !oldTags.includes(newTag));
    addedTags.forEach((newTag) => {
      const tagInfo = tags.get(newTag);
      if (!tagInfo) {
        tags.set(newTag, new Set<string>([contractAddr]));
      } else {
        tags.set(newTag, tagInfo.add(contractAddr));
      }
    });

    this.allTags[userKey] = tags;
  }

  private updateContractInfoLists(
    userKey: string,
    contractAddr: string,
    oldLists: Option[],
    newLists: Option[]
  ) {
    const removedLists = oldLists.filter((oldList) =>
      newLists.every((newList) => newList.value !== oldList.value)
    );
    removedLists.forEach((slug) => {
      this.removeContractFromList(userKey, slug.value, contractAddr);
    });

    const addedLists = newLists.filter((newList) =>
      oldLists.every((oldList) => oldList.value !== newList.value)
    );
    addedLists.forEach((slug) => {
      this.addContractToList(userKey, slug.value, contractAddr);
    });
  }

  private addContractToList(
    userKey: string,
    slug: string,
    contractAddr: string
  ) {
    const list = this.getContractList(userKey).find(
      (each) => each.slug === slug
    );
    if (!list) return;

    list.contracts = Array.from(new Set(list.contracts).add(contractAddr));
    list.lastUpdated = new Date();
  }

  private removeContractFromList(
    userKey: string,
    slug: string,
    contractAddr: string
  ) {
    const list = this.getContractList(userKey).find(
      (each) => each.slug === slug
    );
    if (!list) return;

    list.contracts = list.contracts.filter((addr) => addr !== contractAddr);
    list.lastUpdated = new Date();
  }

  addActivity(userKey: string, activity: Activity) {
    const recent = this.recentActivities[userKey];

    if (recent) {
      const targetList = [activity, ...recent].slice(0, 10);
      this.recentActivities[userKey] = targetList;
    } else {
      this.recentActivities[userKey] = [activity];
    }
  }

  getRecentActivities(userKey: string) {
    return this.recentActivities[userKey] ?? [];
  }
}
