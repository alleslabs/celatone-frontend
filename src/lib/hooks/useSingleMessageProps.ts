import { useWallet } from "@cosmos-kit/react";
import router from "next/router";

import { getAddressTypeByLength } from "lib/app-provider";
import type { SingleMsgProps } from "lib/components/action-msg/SingleMsg";
import type { LinkType } from "lib/components/ExplorerLink";
import { useContractStore } from "lib/providers/store";
import { useAssetInfos } from "lib/services/assetService";
import type { ContractLocalInfo } from "lib/stores/contract";
import type {
  DetailExecute,
  DetailInstantiate,
  DetailSend,
  DetailUpdateAdmin,
  DetailUpload,
  Message,
  Option,
  DetailMigrate,
  DetailClearAdmin,
  ContractAddr,
  AssetInfo,
} from "lib/types";
import { getFirstQueryParam, getExecuteMsgTags } from "lib/utils";

/**
 * Returns messages variations for MsgInstantiateContract and MsgInstantiateContract2.
 *
 * @remarks
 * Will render Instantiate2 instead of Instantiate if MsgInstantiateContract2
 * More than 1 msg: Instantiate [length] contracts
 * Only 1 msg: Instantiate contract [name || contract address] from Code ID [code ID]
 * Fail with more than 1 msg: Failed to instantiate [length] contracts
 * Fail with 1 msg: Failed to instantiate contract from Code ID [code ID]
 *
 * @param isSuccess - boolean of whether tx is succeed or not
 * @param messages - list of messages
 * @param chainName - chain name
 * @param getContractLocalInfo - contract local info
 * @param isInstantiate2 - boolean of whether the message is instantiate2 or not
 *
 * @returns msgProps use in <SingleMsg />
 *
 */
const instantiateSingleMsgProps = (
  isSuccess: boolean,
  messages: Message[],
  chainName: string,
  getContractLocalInfo: (
    contractAddress: ContractAddr
  ) => Option<ContractLocalInfo>,
  isInstantiate2: boolean
) => {
  const detail = messages[0].detail as DetailInstantiate;
  // TODO - revisit, instantiate detail response when query from contract transaction table doesn't contain contract addr
  const contractAddress =
    detail.contractAddress ||
    (getFirstQueryParam(router.query.contractAddress) as ContractAddr);

  const contractLocalInfo = getContractLocalInfo(contractAddress);
  const type = isInstantiate2 ? "Instantiate2" : "Instantiate";

  if (messages.length > 1) {
    return isSuccess
      ? {
          type,
          length: messages.length,
          text2: "contracts",
        }
      : {
          type: "Failed",
          text1: `to ${type}`,
          length: messages.length,
          text2: "contracts",
        };
  }

  return isSuccess
    ? {
        type,
        text1: "contract",
        link1: {
          type: getAddressTypeByLength(chainName, contractAddress),
          value: contractLocalInfo?.name || contractAddress,
          copyValue: contractAddress,
        },
        text3: "from Code ID",
        link2: {
          type: "code_id" as LinkType,
          value: detail.codeId.toString(),
        },
      }
    : {
        type: "Failed",
        text1: `to ${type} contract from Code ID`,
        link1: {
          type: "code_id" as LinkType,
          value: detail.codeId.toString(),
        },
      };
};

/**
 * Returns messages variations for MsgExecuteContract.
 *
 * @remarks
 * - More than 1 msg:
 *  With same contract addr: Execute [length] messages  on [name \\ contract address]
 *  With different contract addr: Execute [length] messages
 * Only 1 address: Execute [msg1] [msg2] [+number] on [name || contract address]
 * Fail with more than 1 msg:
 *  With same contract addr: Failed to execute [length] messages  on [name \\ contract address]
 *  With diff contract addr: Failed to execute [length] messages
 * Fail with 1 msg: Failed to execute message from [name || contract address]
 *
 * @param isSuccess - boolean of whether tx is succeed or not
 * @param messages - list of messages
 * @param chainName - chain name
 * @param singleMsg - true when use in accordion
 * @param getContractLocalInfo - contract local info
 *
 * @returns msgProps use in <SingleMsg />
 *
 */
const executeSingleMsgProps = (
  isSuccess: boolean,
  messages: Message[],
  chainName: string,
  singleMsg: Option<boolean>,
  getContractLocalInfo: (
    contractAddress: ContractAddr
  ) => Option<ContractLocalInfo>
) => {
  const detail = messages[0].detail as DetailExecute;
  const contractLocalInfo = getContractLocalInfo(detail.contract);

  if (messages.length > 1) {
    if (
      messages.some((msg) => {
        const msgDetail = msg.detail as DetailExecute;
        return msgDetail.contract !== detail.contract;
      })
    ) {
      return isSuccess
        ? {
            type: "Execute",
            length: messages.length,
            text2: "messages",
          }
        : {
            type: "Failed",
            // eslint-disable-next-line sonarjs/no-duplicate-string
            text1: "to execute",
            length: messages.length,
            text2: "messages",
          };
    }
    return isSuccess
      ? {
          type: "Execute",
          length: messages.length,
          text2: "messages on",
          link2: {
            type: getAddressTypeByLength(chainName, detail.contract),
            value: contractLocalInfo?.name || detail.contract,
            copyValue: detail.contract,
          },
        }
      : {
          type: "Failed",
          text1: "to execute",
          length: messages.length,
          text2: "messages on",
          link2: {
            type: getAddressTypeByLength(chainName, detail.contract),
            value: contractLocalInfo?.name || detail.contract,
            copyValue: detail.contract,
          },
        };
  }

  return isSuccess
    ? {
        type: "Execute",
        tags: getExecuteMsgTags(messages, singleMsg ? 1 : 2),
        text2: "on",
        link2: {
          type: getAddressTypeByLength(chainName, detail.contract),
          value: contractLocalInfo?.name || detail.contract,
          copyValue: detail.contract,
        },
      }
    : {
        type: "Failed",
        text1: "to execute message from",
        link1: {
          type: getAddressTypeByLength(chainName, detail.contract),
          value: contractLocalInfo?.name || detail.contract,
          copyValue: detail.contract,
        },
      };
};

/**
 * Returns messages variations for MsgSend.
 *
 * @remarks
 * More than 1 msg:
 *  With same address: Send assets to [name \\ contract address/ user address]
 *  With different address: Send assets to [length] addresses
 * Only 1 msg: Send [amount] [denom] to [contract address / user address]
 * Fail with more than 1 msg:
 *  With same address: Failed to send assets to  [name \\ contract address/ user address]
 *  With diff address: Failed to send assets to [length] addresses
 * Fail with 1 msg: Failed to send assets to [contract address / user address]
 *
 * @param isSuccess - boolean of whether tx is succeed or not
 * @param messages - list of messages
 * @param chainName - chain name
 * @param assetInfos - information of assets
 * @param getContractLocalInfo - contract local info
 *
 * @returns msgProps use in <SingleMsg />
 *
 */
const sendSingleMsgProps = (
  isSuccess: boolean,
  messages: Message[],
  chainName: string,
  assetInfos: Option<Record<string, AssetInfo>>,
  getContractLocalInfo: (
    contractAddress: ContractAddr
  ) => Option<ContractLocalInfo>
) => {
  const detail = messages[0].detail as DetailSend;
  const contractLocalInfo = getContractLocalInfo(
    detail.toAddress as ContractAddr
  );

  const tokens = detail.amount.map((coin) => ({
    symbol: assetInfos?.[coin.denom]?.symbol,
    amount: coin.amount,
    id: coin.denom,
    precision: assetInfos?.[coin.denom]?.precision,
  }));

  const uniqueAddressLength = new Set(
    messages.map((msg) => {
      const msgDetail = msg.detail as DetailSend;
      return msgDetail.toAddress;
    })
  ).size;

  if (messages.length > 1) {
    if (uniqueAddressLength > 1) {
      return isSuccess
        ? {
            type: "Send ",
            text1: "assets to",
            length: uniqueAddressLength,
            text2: "addresses",
          }
        : {
            type: "Failed",
            // eslint-disable-next-line sonarjs/no-duplicate-string
            text1: "to send assets to",
            length: uniqueAddressLength,
            text2: "addresses",
          };
    }
    return isSuccess
      ? {
          type: "Send",
          text1: "assets to",
          link2: {
            type: getAddressTypeByLength(chainName, detail.toAddress),
            value: contractLocalInfo?.name || detail.toAddress,
            copyValue: detail.toAddress,
          },
        }
      : {
          type: "Failed",
          text1: "to send assets to",
          link2: {
            type: getAddressTypeByLength(chainName, detail.toAddress),
            value: contractLocalInfo?.name || detail.toAddress,
            copyValue: detail.toAddress,
          },
        };
  }
  return isSuccess
    ? {
        type: "Send",
        tokens,
        text2: "to",
        link1: {
          type: getAddressTypeByLength(chainName, detail.toAddress),
          value: detail.toAddress,
        },
      }
    : {
        type: "Failed",
        text1: "to send assets to",
        link1: {
          type: getAddressTypeByLength(chainName, detail.toAddress),
          value: detail.toAddress,
        },
      };
};

/**
 * Returns messages variations for MsgMigrateContract.
 *
 * @remarks
 * More than 1 msg: Migrate [length] contracts
 * Only 1 msg: Migrate [name || contract address] to Code ID [code ID]
 * Fail with more than 1 msg: Failed to migrate [length] contracts
 * Fail with 1 msg: Failed to migrate [name || contract address] to code ID [code ID]
 *
 * @param isSuccess - boolean of whether tx is succeed or not
 * @param messages - list of messages
 * @param chainName - chain name
 * @param getContractLocalInfo - contract local info
 *
 * @returns msgProps use in <SingleMsg />
 *
 */
const migrateSingleMsgProps = (
  isSuccess: boolean,
  messages: Message[],
  chainName: string,
  getContractLocalInfo: (
    contractAddress: ContractAddr
  ) => Option<ContractLocalInfo>
) => {
  const detail = messages[0].detail as DetailMigrate;
  const contractLocalInfo = getContractLocalInfo(detail.contract);

  if (messages.length > 1) {
    return isSuccess
      ? {
          type: "Migrate",
          length: messages.length,
          text2: "contracts",
        }
      : {
          type: "Failed",
          text1: "to migrate",
          length: messages.length,
          text2: "contracts",
        };
  }
  return isSuccess
    ? {
        type: "Migrate",
        link1: {
          type: getAddressTypeByLength(chainName, detail.contract),
          value: contractLocalInfo?.name || detail.contract,
          copyValue: detail.contract,
        },
        text3: "to Code ID",
        link2: {
          type: "code_id" as LinkType,
          value: detail.codeId.toString(),
        },
      }
    : {
        type: "Failed",
        text1: "to migrate from code ID",
        link1: {
          type: "code_id" as LinkType,
          value: detail.codeId.toString(),
        },
      };
};

/**
 * Returns messages variations for MsgUpdateAdmin.
 *
 * @remarks
 * More than 1 msg: Update [length] admins
 * Only 1 msg: Update admin on [name || contract address] to [user address || contract address]
 * Fail with more than 1 msg: Failed to update [length] admins
 * Fail with 1 msg: Failed to update admin on [name || contract address] to [user address || contract address]

 *
 * @param isSuccess - boolean of whether tx is succeed or not
 * @param messages - list of messages
 * @param chainName - chain name
 * @param getContractLocalInfo - contract local info
 * 
 * @returns msgProps use in <SingleMsg />
 *
 */
const updateAdminSingleMsgProps = (
  isSuccess: boolean,
  messages: Message[],
  chainName: string,
  getContractLocalInfo: (
    contractAddress: ContractAddr
  ) => Option<ContractLocalInfo>
) => {
  const detail = messages[0].detail as DetailUpdateAdmin;
  const contractLocalInfo = getContractLocalInfo(detail.contract);
  const adminLocalInfo = getContractLocalInfo(detail.newAdmin as ContractAddr);

  if (messages.length > 1) {
    return isSuccess
      ? {
          type: "Update",
          length: messages.length,
          text2: "admins",
        }
      : {
          type: "Failed",
          text1: "to update",
          length: messages.length,
          text2: "admins",
        };
  }
  return isSuccess
    ? {
        type: "Update admin",
        text1: "on",
        link1: {
          type: getAddressTypeByLength(chainName, detail.contract),
          value: contractLocalInfo?.name || detail.contract,
          copyValue: detail.contract,
        },
        text3: "to",
        link2: {
          type: getAddressTypeByLength(chainName, detail.newAdmin),
          value: adminLocalInfo?.name || detail.newAdmin,
        },
      }
    : {
        type: "Failed",
        text1: "to update admin on",
        link1: {
          type: getAddressTypeByLength(chainName, detail.contract),
          value: contractLocalInfo?.name || detail.contract,
          copyValue: detail.contract,
        },
        text3: "to",
        link2: {
          type: getAddressTypeByLength(chainName, detail.newAdmin),
          value: adminLocalInfo?.name || detail.newAdmin,
        },
      };
};

/**
 * Returns messages variations for MsgClearAdmin.
 *
 * @remarks
 * More than 1 msg: Clear admins on [length] contracts
 * Only 1 msg: Clear admin on [name || contract address]
 * Fail with more than 1 msg: Failed to clear admins on [length] contracts
 * Fail with 1 msg: Failed to clear admin on [name || contract address]
 *
 * @param isSuccess - boolean of whether tx is succeed or not
 * @param messages - list of messages
 * @param chainName - chain name
 * @param getContractLocalInfo - contract local info
 *
 * @returns msgProps use in <SingleMsg />
 *
 */
const clearAdminSingleMsgProps = (
  isSuccess: boolean,
  messages: Message[],
  chainName: string,
  getContractLocalInfo: (
    contractAddress: ContractAddr
  ) => Option<ContractLocalInfo>
) => {
  const detail = messages[0].detail as DetailClearAdmin;
  const contractLocalInfo = getContractLocalInfo(detail.contract);

  if (messages.length > 1) {
    return isSuccess
      ? {
          type: "Clear admins",
          text1: "on",
          length: messages.length,
          text2: "contracts",
        }
      : {
          type: "Failed",
          text1: "to clear admin on",
          length: messages.length,
          text2: "contracts",
        };
  }
  return isSuccess
    ? {
        type: "Clear admin",
        text1: "on",
        link1: {
          type: getAddressTypeByLength(chainName, detail.contract),
          value: contractLocalInfo?.name || detail.contract,
          copyValue: detail.contract,
        },
      }
    : {
        type: "Failed",
        text1: "to clear admin on",
        link1: {
          type: getAddressTypeByLength(chainName, detail.contract),
          value: contractLocalInfo?.name || detail.contract,
          copyValue: detail.contract,
        },
      };
};

/**
 * Returns messages variations for MsgStoreCode.
 *
 * @remarks
 * More than 1 msg: Upload [length] Wasm files
 * Only 1 msg: Upload Wasm to Code ID [code ID]
 * Fail with more than 1 msg: Failed to upload [length] Wasm files
 * Fail with 1 msg: Failed to upload Wasm to Code ID [code ID]
 *
 * @param isSuccess - boolean of whether tx is succeed or not
 * @param messages - list of messages
 *
 * @returns msgProps use in <SingleMsg />
 *
 */
const storeCodeSingleMsgProps = (isSuccess: boolean, messages: Message[]) => {
  const detail = messages[0].detail as DetailUpload;

  if (messages.length > 1) {
    return isSuccess
      ? {
          type: "Upload",
          length: messages.length,
          text2: "Wasm files",
        }
      : {
          type: "Failed",
          text1: "to upload",
          length: messages.length,
          text2: "Wasm files",
        };
  }
  return isSuccess
    ? {
        type: "Upload",
        text1: "Wasm to Code ID",
        link1: {
          type: "code_id" as LinkType,
          value: detail.id ? detail.id.toString() : "",
        },
      }
    : {
        type: "Failed",
        text1: "to upload Wasm to Code ID",
        link1: {
          type: "code_id" as LinkType,
          value: detail.id ? detail.id.toString() : "",
        },
      };
};

const otherMessageSingleMsgProps = (
  isSuccess: boolean,
  messages: Message[],
  type: string
) => {
  if (messages.length > 1) {
    return isSuccess
      ? {
          type: "Messages",
          length: messages.length,
        }
      : {
          type: "Failed",
          text1: "messages",
          length: messages.length,
        };
  }
  return isSuccess
    ? {
        type: "Message",
        tags: [type],
      }
    : {
        type: "Failed message",
        tags: [type],
      };
};

export const useSingleActionMsgProps = (
  type: string,
  isSuccess: boolean,
  messages: Message[],
  singleMsg: Option<boolean>
): SingleMsgProps => {
  const { currentChainName } = useWallet();
  const { getContractLocalInfo } = useContractStore();
  const assetInfos = useAssetInfos();

  switch (type) {
    case "MsgExecuteContract":
      return executeSingleMsgProps(
        isSuccess,
        messages,
        currentChainName,
        singleMsg,
        getContractLocalInfo
      );
    case "MsgSend":
      return sendSingleMsgProps(
        isSuccess,
        messages,
        currentChainName,
        assetInfos,
        getContractLocalInfo
      );
    case "MsgMigrateContract":
      return migrateSingleMsgProps(
        isSuccess,
        messages,
        currentChainName,
        getContractLocalInfo
      );
    case "MsgInstantiateContract":
      return instantiateSingleMsgProps(
        isSuccess,
        messages,
        currentChainName,
        getContractLocalInfo,
        false
      );
    case "MsgInstantiateContract2":
      return instantiateSingleMsgProps(
        isSuccess,
        messages,
        currentChainName,
        getContractLocalInfo,
        true
      );
    case "MsgUpdateAdmin":
      return updateAdminSingleMsgProps(
        isSuccess,
        messages,
        currentChainName,
        getContractLocalInfo
      );
    case "MsgClearAdmin":
      return clearAdminSingleMsgProps(
        isSuccess,
        messages,
        currentChainName,
        getContractLocalInfo
      );
    case "MsgStoreCode":
      return storeCodeSingleMsgProps(isSuccess, messages);
    default:
      return otherMessageSingleMsgProps(isSuccess, messages, type);
  }
};
