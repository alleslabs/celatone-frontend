import { makeAutoObservable } from "mobx";
import { isHydrated, makePersistable } from "mobx-persist-store";

import { INSTANTIATED_LIST_NAME, SAVED_LIST_NAME } from "lib/data";
import type {
  BechAddr,
  BechAddr20,
  BechAddr32,
  Dict,
  LVPair,
  Option,
} from "lib/types";
import { formatSlugName, getCurrentDate, getTagsDefault } from "lib/utils";

export interface ContractLocalInfo {
  contractAddress: BechAddr32;
  instantiator: Option<BechAddr>;
  label: string; // NOTE: if empty means no label provided
  name?: string;
  description?: string;
  tags?: string[];
  lists?: LVPair[];
}
interface ContractList {
  name: string;
  slug: string;
  contracts: BechAddr32[];
  lastUpdated: Date;
  isInfoEditable: boolean;
  isContractRemovable: boolean;
}

export interface ContractListInfo extends Omit<ContractList, "contracts"> {
  contracts: ContractLocalInfo[];
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
  sender: Option<BechAddr20>;
  contractAddress: BechAddr32;
  msg: string; // base64
  timestamp: Date;
}

export class ContractStore {
  private userKey: string;

  private defaultContractList: ContractList[] = [
    {
      name: SAVED_LIST_NAME,
      slug: formatSlugName(SAVED_LIST_NAME),
      contracts: [],
      lastUpdated: getCurrentDate(),
      isInfoEditable: false,
      isContractRemovable: true,
    },
  ];

  contractList: Dict<string, ContractList[]>; // user key

  contractLocalInfo: Dict<
    string, // user key
    Record<string, ContractLocalInfo> // contract address
  >;

  allTags: Dict<string, Map<string, Set<string>>>;

  recentActivities: Dict<string, Activity[]>;

  constructor() {
    this.contractList = {};
    this.contractLocalInfo = {};
    this.allTags = {};
    this.recentActivities = {};
    this.userKey = "";

    makeAutoObservable(this, {}, { autoBind: true });

    makePersistable(this, {
      name: "ContractStore",
      properties: [
        "contractList",
        "contractLocalInfo",
        "allTags",
        "recentActivities",
      ],
    });
  }

  get isHydrated(): boolean {
    return isHydrated(this);
  }

  isContractUserKeyExist(): boolean {
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
    const contractLocalInfoByUserKey = this.contractLocalInfo[this.userKey];

    return contractListByUserKey.map((contractListInfo) => ({
      ...contractListInfo,
      contracts: contractListInfo.contracts.map((contractAddress) => {
        const contractLocalInfo = contractLocalInfoByUserKey?.[contractAddress];
        if (!contractLocalInfo)
          return {
            contractAddress,
            instantiator: undefined,
            label: "N/A",
          } as ContractLocalInfo;

        return { ...contractLocalInfo };
      }),
    }));
  }

  getContractLocalInfo(contractAddress: string): ContractLocalInfo | undefined {
    return this.contractLocalInfo[this.userKey]?.[contractAddress];
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
          lastUpdated: getCurrentDate(),
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

      const contracts = this.contractLocalInfo[userKey];

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
      list.lastUpdated = getCurrentDate();
    }
  }

  removeList(userKey: string, slug: string) {
    const list = this.getContractList(userKey).find(
      (each) => each.slug === slug
    );
    if (!list) return;

    const contracts = this.contractLocalInfo[userKey];

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

  updateContractLocalInfo(
    userKey: string,
    contractAddress: BechAddr32,
    instantiator: Option<BechAddr>,
    label: string,
    name?: string,
    description?: string,
    tags?: string[],
    lists?: LVPair[]
  ) {
    const contractLocalInfo = this.contractLocalInfo[userKey]?.[
      contractAddress
    ] ?? {
      contractAddress,
      instantiator,
      label,
    };

    if (name !== undefined)
      contractLocalInfo.name = name.trim().length ? name.trim() : undefined;
    if (description !== undefined)
      contractLocalInfo.description = description.trim().length
        ? description.trim()
        : undefined;
    if (tags !== undefined) {
      this.updateAllTags(
        userKey,
        contractAddress,
        getTagsDefault(contractLocalInfo.tags),
        tags
      );
      contractLocalInfo.tags = tags.length ? tags : undefined;
    }
    if (lists !== undefined) {
      this.updateContractInAllLists(
        userKey,
        contractAddress,
        contractLocalInfo.lists ?? [],
        lists
      );
      contractLocalInfo.lists = lists.length ? lists : undefined;
    }

    this.contractLocalInfo[userKey] = {
      ...this.contractLocalInfo[userKey],
      [contractAddress]: contractLocalInfo,
    };
  }

  private updateAllTags(
    userKey: string,
    contractAddress: string,
    oldTags: string[],
    newTags: string[]
  ) {
    const tags = this.allTags[userKey] ?? new Map<string, Set<string>>();

    const removedTags = oldTags.filter((oldTag) => !newTags.includes(oldTag));
    removedTags.forEach((oldTag) => {
      const tagInfo = tags.get(oldTag);
      if (tagInfo) {
        tagInfo.delete(contractAddress);
        if (tagInfo.size === 0) tags.delete(oldTag);
        else tags.set(oldTag, tagInfo);
      }
    });

    const addedTags = newTags.filter((newTag) => !oldTags.includes(newTag));
    addedTags.forEach((newTag) => {
      const tagInfo = tags.get(newTag);
      if (!tagInfo) {
        tags.set(newTag, new Set<string>([contractAddress]));
      } else {
        tags.set(newTag, tagInfo.add(contractAddress));
      }
    });

    this.allTags[userKey] = tags;
  }

  private updateContractInAllLists(
    userKey: string,
    contractAddress: BechAddr32,
    oldLists: LVPair[],
    newLists: LVPair[]
  ) {
    const removedLists = oldLists.filter((oldList) =>
      newLists.every((newList) => newList.value !== oldList.value)
    );
    removedLists.forEach((slug) => {
      this.removeContractFromList(userKey, slug.value, contractAddress);
    });

    const addedLists = newLists.filter((newList) =>
      oldLists.every((oldList) => oldList.value !== newList.value)
    );
    addedLists.forEach((slug) => {
      this.addContractToList(userKey, slug.value, contractAddress);
    });
  }

  private addContractToList(
    userKey: string,
    slug: string,
    contractAddress: BechAddr32
  ) {
    const list = this.getContractList(userKey).find(
      (each) => each.slug === slug
    );
    if (!list) return;

    list.contracts = Array.from(new Set(list.contracts).add(contractAddress));
    list.lastUpdated = getCurrentDate();
  }

  private removeContractFromList(
    userKey: string,
    slug: string,
    contractAddress: string
  ) {
    const list = this.getContractList(userKey).find(
      (each) => each.slug === slug
    );
    if (!list) return;

    list.contracts = list.contracts.filter((addr) => addr !== contractAddress);
    list.lastUpdated = getCurrentDate();
  }

  addActivity(activity: Activity) {
    const { userKey } = this;
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
