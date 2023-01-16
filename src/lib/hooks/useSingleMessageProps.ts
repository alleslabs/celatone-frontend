import { useWallet } from "@cosmos-kit/react";

import type { SingleMsgProps } from "lib/components/action-msg/SingleMsg";
import type { LinkType } from "lib/components/ExplorerLink";
import { getAddressTypeByLength, useContractStore } from "lib/hooks";
import type { ContractInfo } from "lib/stores/contract";
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
} from "lib/types";
import { formatBalanceWithDenom } from "lib/utils";
import { getExecuteMsgTags } from "lib/utils/executeTags";

/**
 * Returns messages variations for MsgInstantiateContract.
 *
 * @remarks
 * More than 1 msg: Instantiate [length] contracts
 * Only 1 msg: Instantiate contract [name || contract address] from Code ID [code ID]
 * Fail with more than 1 msg: Failed to instantiate [length] contracts
 * Fail with 1 msg: Failed to instantiate contract from Code ID [code ID]
 *
 * @param isSuccess - boolean of whether tx is succeed or not
 * @param messages - list of messages
 *
 * @returns msgProps use in <SingleMsg />
 *
 */
const instantiateSingleMsgProps = (
  isSuccess: boolean,
  messages: Message[],
  getContractInfo: (contractAddress: string) => Option<ContractInfo>
) => {
  const detail = messages[0].detail as DetailInstantiate;
  const contractInfo = getContractInfo(detail.contractAddress);

  if (messages.length > 1) {
    return isSuccess
      ? {
          type: "Instantiate",
          length: messages.length,
          text2: "contracts",
        }
      : {
          type: "Failed",
          text1: "to instantiate",
          length: messages.length,
          text2: "contracts",
        };
  }

  return isSuccess
    ? {
        type: "Instantiate",
        text1: "contract",
        link1: {
          type: "contract_address" as LinkType,
          value: contractInfo?.name || detail.contractAddress,
          copyValue: detail.contractAddress,
        },
        text3: "from Code ID",
        link2: {
          type: "code_id" as LinkType,
          value: detail.codeId.toString(),
        },
      }
    : {
        type: "Failed",
        text1: "to instantiate contract from Code ID",
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
 * More than 1 address: Execute [length] messages
 * Only 1 address: Execute [msg1] [msg2] [+number] on [name || contract address]
 * Fail with more than 1 msg: Failed to execute [length] messages
 * Fail with 1 msg: Failed to execute message from [name || contract address]
 *
 * @param isSuccess - boolean of whether tx is succeed or not
 * @param messages - list of messages
 * @param singleMsg - true when use in accordion
 *
 * @returns msgProps use in <SingleMsg />
 *
 */
const executeSingleMsgProps = (
  isSuccess: boolean,
  messages: Message[],
  singleMsg: Option<boolean>,
  getContractInfo: (contractAddress: string) => Option<ContractInfo>
) => {
  const detail = messages[0].detail as DetailExecute;
  const contractInfo = getContractInfo(detail.contract);

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
          text1: "to execute",
          length: messages.length,
          text2: "messages",
        };
  }

  return isSuccess
    ? {
        type: "Execute",
        tags: getExecuteMsgTags(messages, singleMsg ? 1 : 2),
        text2: "on",
        link2: {
          type: "contract_address" as LinkType,
          value: contractInfo?.name || detail.contract,
          copyValue: detail.contract,
        },
      }
    : {
        type: "Failed",
        text1: "to execute message from",
        link1: {
          type: "contract_address" as LinkType,
          value: contractInfo?.name || detail.contract,
          copyValue: detail.contract,
        },
      };
};

/**
 * Returns messages variations for MsgSend.
 *
 * @remarks
 * More than 1 msg: Send assets to [length] addresses
 * Only 1 msg: Send [amount] [denom] to [contract address / user address]
 * Fail with more than 1 msg: Failed to send assets to [length] addresses
 * Fail with 1 msg: Failed to send assets to [contract address / user address]
 *
 * @param isSuccess - boolean of whether tx is succeed or not
 * @param messages - list of messages
 *
 * @returns msgProps use in <SingleMsg />
 *
 */
const sendSingleMsgProps = (
  isSuccess: boolean,
  messages: Message[],
  chainName: string
) => {
  const detail = messages[0].detail as DetailSend;

  if (messages.length > 1) {
    return isSuccess
      ? {
          type: "Send assets to",
          length: messages.length,
          text: "addresses",
        }
      : {
          type: "Failed",
          text1: "to send assets to",
          length: messages.length,
          text2: "addresses",
        };
  }
  return isSuccess
    ? {
        type: "Send",
        bolds: formatBalanceWithDenom(detail.amount),
        text2: "to",
        link1: {
          type: getAddressTypeByLength(chainName, detail.toAddress) as LinkType,
          value: detail.toAddress,
        },
      }
    : {
        type: "Failed",
        text1: "to send assets to",
        link1: {
          type: getAddressTypeByLength(chainName, detail.toAddress) as LinkType,
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
 *
 * @returns msgProps use in <SingleMsg />
 *
 */
const migrateSingleMsgProps = (
  isSuccess: boolean,
  messages: Message[],
  getContractInfo: (contractAddress: string) => Option<ContractInfo>
) => {
  const detail = messages[0].detail as DetailMigrate;
  const contractInfo = getContractInfo(detail.contract);

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
          type: "contract_address" as LinkType,
          value: contractInfo?.name || detail.contract,
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
 * Only 1 msg: Update admin on [name || contract address] to [user address]
 * Fail with more than 1 msg: Failed to update [length] admins
 * Fail with 1 msg: Failed to update admin on [name || contract address] to [user address]

 *
 * @param isSuccess - boolean of whether tx is succeed or not
 * @param messages - list of messages
 *
 * @returns msgProps use in <SingleMsg />
 *
 */
const updateAdminSingleMsgProps = (
  isSuccess: boolean,
  messages: Message[],
  getContractInfo: (contractAddress: string) => Option<ContractInfo>
) => {
  const detail = messages[0].detail as DetailUpdateAdmin;
  const contractInfo = getContractInfo(detail.contract);

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
          type: "contract_address" as LinkType,
          value: contractInfo?.name || detail.contract,
          copyValue: detail.contract,
        },
        text3: "to",
        link2: {
          type: "user_address" as LinkType,
          value: detail.newAdmin,
        },
      }
    : {
        type: "Failed",
        text1: "to update admin on",
        link1: {
          type: "contract_address" as LinkType,
          value: contractInfo?.name || detail.contract,
          copyValue: detail.contract,
        },
        text3: "to",
        link2: {
          type: "user_address" as LinkType,
          value: detail.newAdmin,
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
 *
 * @returns msgProps use in <SingleMsg />
 *
 */
const clearAdminSingleMsgProps = (
  isSuccess: boolean,
  messages: Message[],
  getContractInfo: (contractAddress: string) => Option<ContractInfo>
) => {
  const detail = messages[0].detail as DetailClearAdmin;
  const contractInfo = getContractInfo(detail.contract);

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
          type: "contract_address" as LinkType,
          value: contractInfo?.name || detail.contract,
          copyValue: detail.contract,
        },
      }
    : {
        type: "Failed",
        text1: "to clear admin on",
        link1: {
          type: "contract_address" as LinkType,
          value: contractInfo?.name || detail.contract,
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
  const { getContractInfo } = useContractStore();

  switch (type) {
    case "MsgExecuteContract":
      return executeSingleMsgProps(
        isSuccess,
        messages,
        singleMsg,
        getContractInfo
      );
    case "MsgSend":
      return sendSingleMsgProps(isSuccess, messages, currentChainName);
    case "MsgMigrateContract":
      return migrateSingleMsgProps(isSuccess, messages, getContractInfo);
    case "MsgInstantiateContract":
      return instantiateSingleMsgProps(isSuccess, messages, getContractInfo);
    case "MsgUpdateAdmin":
      return updateAdminSingleMsgProps(isSuccess, messages, getContractInfo);
    case "MsgClearAdmin":
      return clearAdminSingleMsgProps(isSuccess, messages, getContractInfo);
    case "MsgStoreCode":
      return storeCodeSingleMsgProps(isSuccess, messages);
    default:
      return otherMessageSingleMsgProps(isSuccess, messages, type);
  }
};
