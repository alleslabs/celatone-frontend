import type {
  BechAddr,
  BechAddr20,
  BechAddr32,
  Dict,
  LVPair,
  Option,
} from "lib/types";

import { INSTANTIATED_LIST_NAME, SAVED_LIST_NAME } from "lib/data";
import { formatSlugName, getCurrentDate, getTagsDefault } from "lib/utils";
import { makeAutoObservable } from "mobx";
import { isHydrated, makePersistable } from "mobx-persist-store";

export interface ContractLocalInfo {
  contractAddress: BechAddr32;
  instantiator: Option<BechAddr>;
  label: string; // NOTE: if empty means no label provided
  codeId?: number;
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
      contracts: [],
      isContractRemovable: true,
      isInfoEditable: false,
      lastUpdated: getCurrentDate(),
      name: SAVED_LIST_NAME,
      slug: formatSlugName(SAVED_LIST_NAME),
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

  getAllTags(): string[] {
    return Array.from(this.allTags[this.userKey]?.keys() ?? []);
  }

  private getContractList(): ContractList[] {
    const contractList = this.contractList[this.userKey];
    if (contractList) return contractList;

    this.contractList[this.userKey] = this.defaultContractList;
    return this.defaultContractList;
  }

  getContractLists(): ContractListInfo[] {
    const contractListByUserKey = this.getContractList();
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

  isContractListExist(name: string): boolean {
    const slug = formatSlugName(name);

    const foundIndex = this.getContractList().findIndex(
      (each) => each.slug === slug
    );

    return slug === formatSlugName(INSTANTIATED_LIST_NAME) || foundIndex > -1;
  }

  createNewList(name: string) {
    if (!this.isContractListExist(name)) {
      const oldList = this.getContractList();

      this.contractList[this.userKey] = [
        ...oldList,
        {
          contracts: [],
          isContractRemovable: true,
          isInfoEditable: true,
          lastUpdated: getCurrentDate(),
          name: name.trim(),
          slug: formatSlugName(name),
        },
      ];
    }
  }

  renameList(slug: string, newName: string) {
    if (!this.isContractListExist(newName)) {
      const list = this.getContractList().find((each) => each.slug === slug);
      if (!list) return;

      const contracts = this.contractLocalInfo[this.userKey];

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

  removeList(slug: string) {
    const list = this.getContractList().find((each) => each.slug === slug);
    if (!list) return;

    const contracts = this.contractLocalInfo[this.userKey];

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

    this.contractList[this.userKey] = this.getContractList().filter(
      (each) => each.slug !== slug
    );
  }

  updateContractLocalInfo(
    contractAddress: BechAddr32,
    label: string,
    codeId: Option<number>,
    instantiator: Option<BechAddr>,
    name?: string,
    description?: string,
    tags?: string[],
    lists?: LVPair[]
  ) {
    const contractLocalInfo = this.contractLocalInfo[this.userKey]?.[
      contractAddress
    ] ?? {
      codeId,
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
        contractAddress,
        getTagsDefault(contractLocalInfo.tags),
        tags
      );
      contractLocalInfo.tags = tags.length ? tags : undefined;
    }
    if (lists !== undefined) {
      this.updateContractInAllLists(
        contractAddress,
        contractLocalInfo.lists ?? [],
        lists
      );
      contractLocalInfo.lists = lists.length ? lists : undefined;
    }

    this.contractLocalInfo[this.userKey] = {
      ...this.contractLocalInfo[this.userKey],
      [contractAddress]: contractLocalInfo,
    };
  }

  private updateAllTags(
    contractAddress: string,
    oldTags: string[],
    newTags: string[]
  ) {
    const tags = this.allTags[this.userKey] ?? new Map<string, Set<string>>();

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

    this.allTags[this.userKey] = tags;
  }

  private updateContractInAllLists(
    contractAddress: BechAddr32,
    oldLists: LVPair[],
    newLists: LVPair[]
  ) {
    const removedLists = oldLists.filter((oldList) =>
      newLists.every((newList) => newList.value !== oldList.value)
    );
    removedLists.forEach((slug) => {
      this.removeContractFromList(slug.value, contractAddress);
    });

    const addedLists = newLists.filter((newList) =>
      oldLists.every((oldList) => oldList.value !== newList.value)
    );
    addedLists.forEach((slug) => {
      this.addContractToList(slug.value, contractAddress);
    });
  }

  private addContractToList(slug: string, contractAddress: BechAddr32) {
    const list = this.getContractList().find((each) => each.slug === slug);
    if (!list) return;

    list.contracts = Array.from(new Set(list.contracts).add(contractAddress));
    list.lastUpdated = getCurrentDate();
  }

  private removeContractFromList(slug: string, contractAddress: string) {
    const list = this.getContractList().find((each) => each.slug === slug);
    if (!list) return;

    list.contracts = list.contracts.filter((addr) => addr !== contractAddress);
    list.lastUpdated = getCurrentDate();
  }

  addActivity(activity: Activity) {
    const recent = this.recentActivities[this.userKey];

    if (recent) {
      const targetList = [activity, ...recent].slice(0, 10);
      this.recentActivities[this.userKey] = targetList;
    } else {
      this.recentActivities[this.userKey] = [activity];
    }
  }

  getRecentActivities() {
    return this.recentActivities[this.userKey] ?? [];
  }
}
