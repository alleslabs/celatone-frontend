import { track } from "@amplitude/analytics-browser";

import type { AttachFundsType } from "lib/components/fund/types";

export enum AmpEvent {
  INVALID_STATE = "To Invalid State",
  // CODE
  CODE_SAVE = "Code Save",
  CODE_EDIT = "Code Edit",
  CODE_REMOVE = "Code Remove",
  // CONTRACT
  CONTRACT_SAVE_AFTER_INIT = "Contract Save After Init",
  CONTRACT_SAVE = "Contract Save",
  CONTRACT_EDIT = "Contract Edit",
  CONTRACT_EDIT_TAGS = "Contract Edit Tags",
  CONTRACT_EDIT_LISTS = "Contract Edit Lists",
  CONTRACT_REMOVE = "Contract Remove",
  // TAG
  TAG_CREATE = "Tag Create",
  // LIST
  LIST_CREATE = "List Create",
  LIST_EDIT = "List Edit",
  LIST_REMOVE = "List Remove",
  // PUBLIC PROJECT
  PUBLIC_SAVE = "Public Project Save",
  PUBLIC_REMOVE = "Public Project Remove",
  // NAVIGATE
  TO_OVERVIEW = "To Overview",
  TO_PAST_TXS = "To Past Txs",
  TO_DEPLOY = "To Deploy",
  TO_UPLOAD = "To Upload",
  TO_INSTANTIATE = "To Instantiate",
  TO_PROPOSAL = "To Proposal", // TODO: use later
  TO_QUERY = "To Query",
  TO_EXECUTE = "To Execute",
  TO_MIGRATE = "To Migrate",
  TO_ADMIN_UPDATE = "To Admin Update",
  TO_MY_CODES = "To My Codes",
  TO_RECENT_CODES = "To Recent Codes",
  TO_LIST_BY_ME = "To List By Me",
  TO_LIST_SAVED = "To List Saved",
  TO_LIST_OTHERS = "To List Others",
  TO_ALL_LISTS = "To All Lists",
  TO_ALL_PROJECTS = "To All Public Projects",
  TO_ACCOUNT_DETAIL = "To Account Detail",
  TO_CONTRACT_DETAIL = "To Contract Detail",
  TO_CODE_DETAIL = "To Code Detail",
  TO_PROJECT_DETAIL = "To Public Project Detail",
  TO_TRANSACTION_DETAIL = "To Transaction Detail",
  TO_NOT_FOUND = "To 404 Not Found",
  TO_FAUCET = "To Faucet",
  // ACTIONS
  ACTION_UPLOAD = "Act Upload",
  ACTION_INSTANTIATE = "Action Instantiate",
  ACTION_EXECUTE = "Action Execute",
  ACTION_QUERY = "Action Query",
  ACTION_MIGRATE = "Action Migrate",
  ACTION_ADMIN_UPDATE = "Action Admin Update",
  ACTION_ADMIN_CLEAR = "Action Admin Clear",
  ACTION_RESEND = "Action Resend",
  ACTION_FAUCET = "Action Faucet",
  // INTERACTS
  USE_SELECT_NETWORK = "Use Select Network",
  USE_CLICK_WALLET = "Use Click Wallet",
  USE_MAIN_SEARCH = "Use Main Search",
  USE_SIDEBAR = "Use Sidebar",
  USE_CODE_SELECT = "Use Code Select",
  USE_CODE_MODAL = "Use Code Modal",
  USE_CODE_FILL = "Use Code Fill",
  USE_ASSIGN_ME = "Use Assign Me",
  USE_CONTRACT_FORM = "Use Contract Form",
  USE_CONTRACT_MODAL = "Use Contract Modal",
  USE_CONTRACT_MODAL_SEARCH = "Use Contract Modal Search",
  USE_CONTRACT_MODAL_LISTS = "Use Contract Modal Lists",
  USE_CONTRACT_SNIPPET = "Use Contract Snippet",
  USE_CMD_QUERY = "Use Command Query",
  USE_CMD_EXECUTE = "Use Command Execute",
  USE_BACK_BUTTON = "Use Back Button",
  USE_COPY_BUTTON = "Use Copy Button",
  USE_COPIER = "Use Copier",
  USE_QUICK_EDIT_CONTRACT = "Use Quick Edit Contract",
  USE_QUICK_EDIT_CODE = "Use Quick Edit Code",
  USE_OTHER_MODAL = "Use Other Modal",
  USE_SUBMIT_PROJECT = "Use Submit Project",
  // TX
  TX_SUCCEED = "Tx Succeed",
  TX_FAILED = "Tx Failed",
  TX_REJECTED = "Tx Rejected",
  // MINTSCAN
  MINTSCAN = "Mintscan",
  // EXTERNAL
  WEBSITE = "Website",
  SOCIAL = "Social",
  CELATONE = "Celatone",
  FEEDBACK = "Feedback",
  ALLESLABS = "AllesLabs",
}

type ActionAmpEvent = AmpEvent.ACTION_INSTANTIATE | AmpEvent.ACTION_EXECUTE;

type SpecialAmpEvent =
  | AmpEvent.INVALID_STATE
  | AmpEvent.TO_QUERY
  | AmpEvent.TO_EXECUTE
  | AmpEvent.TO_INSTANTIATE
  | AmpEvent.TO_MIGRATE
  | AmpEvent.TO_ADMIN_UPDATE
  | AmpEvent.USE_MAIN_SEARCH
  | AmpEvent.USE_OTHER_MODAL
  | AmpEvent.MINTSCAN
  | AmpEvent.WEBSITE
  | AmpEvent.SOCIAL
  | AmpEvent.CELATONE;

export const AmpTrackInvalidState = (title: string) =>
  track(AmpEvent.INVALID_STATE, { title });

export const AmpTrack = (
  event: Exclude<AmpEvent, ActionAmpEvent | SpecialAmpEvent>
) => track(event);

export const AmpTrackAction = (
  event: ActionAmpEvent,
  funds: number,
  attachFundsOption: AttachFundsType
) => track(event, { funds, attachFundsOption });

export const AmpTrackToQuery = (contract: boolean, msg: boolean) =>
  track(AmpEvent.TO_QUERY, { contract, msg });

export const AmpTrackToExecute = (contract: boolean, msg: boolean) =>
  track(AmpEvent.TO_EXECUTE, { contract, msg });

export const AmpTrackToInstantiate = (msg: boolean, codeId: boolean) =>
  track(AmpEvent.TO_INSTANTIATE, { msg, codeId });

export const AmpTrackToMigrate = (contract: boolean, codeId: boolean) =>
  track(AmpEvent.TO_MIGRATE, { contract, codeId });

export const AmpTrackToAdminUpdate = (contract: boolean) =>
  track(AmpEvent.TO_ADMIN_UPDATE, { contract });

export const AmpTrackUseMainSearch = (isClick: boolean) =>
  track(AmpEvent.USE_MAIN_SEARCH, { isClick });

export const AmpTrackUseOtherModal = (title: string) =>
  track(AmpEvent.USE_OTHER_MODAL, { title });

export const AmpTrackMintscan = (type: string) =>
  track(AmpEvent.MINTSCAN, { type });

export const AmpTrackWebsite = (url: string) =>
  track(AmpEvent.WEBSITE, { url });

export const AmpTrackSocial = (url: string) => track(AmpEvent.SOCIAL, { url });

export const AmpTrackCelatone = (url: string) =>
  track(AmpEvent.CELATONE, { url });
