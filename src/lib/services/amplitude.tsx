import { track } from "@amplitude/analytics-browser";
import big from "big.js";

import type { AttachFundsType } from "lib/components/fund/types";
import type { Option, Token, Dict } from "lib/types";

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
  TO_NETWORK_OVERVIEW = "To Network Overview",
  TO_BLOCKS = "To Blocks",
  TO_BLOCK_DETAIL = "To Block Detail",
  TO_TXS = "To Txs",
  TO_PAST_TXS = "To Past Txs",
  TO_DEPLOY = "To Deploy",
  TO_UPLOAD = "To Upload",
  TO_INSTANTIATE = "To Instantiate",
  TO_PROPOSAL_LIST = "To Proposal List",
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
  TO_POOL_LIST = "To Pool List",
  TO_POOL_DETAIL = "To Pool Detail",
  TO_PROPOSAL_TO_STORE_CODE = "To Proposal To Store Code",
  TO_PROPOSAL_TO_WHITELIST = "To Proposal To Whitelist",
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
  USE_TAB = "Use Tab",
  USE_RADIO = "Use Radio",
  USE_VIEW_MORE = "Use View More",
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
  USE_SEE_REDELEGATIONS = "Use See Redelegations",
  USE_BACK_BUTTON = "Use Back Button",
  USE_COPY_BUTTON = "Use Copy Button",
  USE_COPIER = "Use Copier",
  USE_QUICK_EDIT_CONTRACT = "Use Quick Edit Contract",
  USE_QUICK_EDIT_CODE = "Use Quick Edit Code",
  USE_UNSUPPORTED_ASSETS_MODAL = "Use Unsupported Assets Modal",
  USE_OTHER_MODAL = "Use Other Modal",
  USE_SUBMIT_PROJECT = "Use Submit Project",
  USE_VIEW_JSON = "Use View Json",
  USE_UNSUPPORTED_ASSETS = "Use Unsupported Assets",
  USE_TX_MSG_EXPAND = "Use Transaction Message Expand",
  USE_EXPAND = "Use General Expand",
  USE_EXPAND_ALL = "Use Expand All",
  USE_RIGHT_HELPER_PANEL = "Use Right Helper Panel", // Sticky panel
  USE_UNPIN = "Use Unpin",
  USE_INSTANTIATE_PERMISSION = "Use Instantiate Permission",
  USE_WHITELISTED_ADDRESSES = "Use Whitelisted Addresses",
  USE_DEPOSIT_FILL = "Use Deposit Fill",
  USE_SUBMIT_PROPOSAL = "Use Submit Proposal",
  USE_SEARCH_INPUT = "Use Search Input",
  USE_FILTER_MY_PROPOSALS = "Use Filter My Proposals",
  USE_FILTER_PROPOSALS_STATUS = "Use Filter Proposals Status",
  USE_FILTER_PROPOSALS_TYPE = "Use Filter Proposals Types",
  USE_FILTER_POOL_TYPE = "Use Filter Pool Types",
  USE_PAGINATION_PAGE_SIZE = "Use Pagination Page Size",
  USE_PAGINATION_NAVIGATION = "Use Pagination Navigation",
  USE_CREATE_NEW_PROPOSAL = "Use Create New Proposal",
  USE_SORT = "Use Sort",
  USE_VIEW = "Use View",
  USE_TOGGLE = "Use Toggle",
  USE_ALERT_CTA = "Use Alert CTA",
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
  | AmpEvent.USE_TAB
  | AmpEvent.USE_RADIO
  | AmpEvent.USE_COPIER
  | AmpEvent.USE_OTHER_MODAL
  | AmpEvent.MINTSCAN
  | AmpEvent.WEBSITE
  | AmpEvent.SOCIAL
  | AmpEvent.CELATONE
  | AmpEvent.USE_VIEW_JSON
  | AmpEvent.USE_UNSUPPORTED_ASSETS
  | AmpEvent.USE_COPIER
  | AmpEvent.USE_EXPAND
  | AmpEvent.USE_RIGHT_HELPER_PANEL
  | AmpEvent.USE_UNPIN
  | AmpEvent.USE_INSTANTIATE_PERMISSION
  | AmpEvent.USE_DEPOSIT_FILL
  | AmpEvent.USE_EXPAND_ALL
  | AmpEvent.USE_PAGINATION_NAVIGATION
  | AmpEvent.USE_FILTER_PROPOSALS_STATUS
  | AmpEvent.USE_FILTER_PROPOSALS_TYPE
  | AmpEvent.USE_FILTER_POOL_TYPE
  | AmpEvent.USE_ALERT_CTA
  | AmpEvent.USE_SORT
  | AmpEvent.USE_VIEW
  | AmpEvent.USE_TOGGLE;

export const AmpTrackInvalidState = (title: string) =>
  track(AmpEvent.INVALID_STATE, { title });

export const AmpTrack = (
  event: Exclude<AmpEvent, ActionAmpEvent | SpecialAmpEvent>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties?: Record<string, any>
) => track(event, properties);

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

export const AmpTrackUseTab = (tab: string) => track(AmpEvent.USE_TAB, { tab });

export const AmpTrackUseRadio = (radio: string) =>
  track(AmpEvent.USE_RADIO, { radio });

export const AmpTrackUseOtherModal = (title: string) =>
  track(AmpEvent.USE_OTHER_MODAL, { title });

export const AmpTrackMintscan = (
  type: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties?: Dict<string, any>
) => track(AmpEvent.MINTSCAN, { type, properties });

export const AmpTrackWebsite = (url: string) =>
  track(AmpEvent.WEBSITE, { url });

export const AmpTrackSocial = (url: string) => track(AmpEvent.SOCIAL, { url });

export const AmpTrackCelatone = (url: string) =>
  track(AmpEvent.CELATONE, { url });

export const AmpTrackViewJson = (page: string) =>
  track(AmpEvent.USE_VIEW_JSON, { page });

export const AmpTrackUnsupportedToken = (page: Option<string>) =>
  track(AmpEvent.USE_UNSUPPORTED_ASSETS, { page });

export const AmpTrackCopier = (section: Option<string>, type: string) =>
  track(AmpEvent.USE_COPIER, { section, type });

export const AmpTrackExpand = ({
  action,
  component,
  info,
  section,
}: {
  action: "expand" | "collapse";
  component:
    | "assets"
    | "json"
    | "permission_address"
    | "event_box"
    | "unsupported_pool"
    | "pool_tx_msg";
  info?: object;
  section?: string;
}) => track(AmpEvent.USE_EXPAND, { action, component, info, section });

export const AmpTrackExpandAll = (action: "expand" | "collapse") =>
  track(AmpEvent.USE_EXPAND, { action });

export const AmpTrackUseClickWallet = (page?: string, component?: string) =>
  track(AmpEvent.USE_CLICK_WALLET, { page, component });

export const AmpTrackUseRightHelperPanel = (page: string, action: string) =>
  track(AmpEvent.USE_RIGHT_HELPER_PANEL, { page, action });

export const AmpTrackUseUnpin = (page: string, check: boolean) =>
  track(AmpEvent.USE_UNPIN, { page, check });

export const AmpTrackUseInstantiatePermission = (
  page: string,
  type: string,
  emptyAddressesLength: number,
  addressesLength: number
) =>
  track(AmpEvent.USE_INSTANTIATE_PERMISSION, {
    page,
    type,
    emptyAddressesLength,
    addressesLength,
  });

export const AmpTrackUseWhitelistedAddresses = (
  page: string,
  emptyAddressesLength: number,
  filledAddressesLength: number
) =>
  track(AmpEvent.USE_WHITELISTED_ADDRESSES, {
    page,
    emptyAddressesLength,
    filledAddressesLength,
  });

export const AmpTrackUseDepositFill = (page: string, amount: Token) =>
  track(AmpEvent.USE_DEPOSIT_FILL, { page, amount });

export const AmpTrackUseSubmitProposal = (
  page: string,
  properties: {
    initialDeposit: string;
    minDeposit: Option<string>;
    assetDenom: Option<string>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }
) => {
  const proposalPeriod = big(properties.initialDeposit).lt(
    properties.minDeposit || "0"
  )
    ? "Deposit"
    : "Voting";
  track(AmpEvent.USE_SUBMIT_PROPOSAL, { page, proposalPeriod, ...properties });
};
export const AmpTrackUseFilter = (
  ampEvent: AmpEvent,
  filters: string[],
  action: string
) => track(ampEvent, { action, filters });

export const AmpTrackPaginationNavigate = (
  navigate: string,
  pageSize: number,
  currentPage: number
) =>
  track(AmpEvent.USE_PAGINATION_NAVIGATION, {
    navigate,
    pageSize,
    currentPage,
  });

export const AmpTrackUseSort = (order: "ascending" | "descending") =>
  track(AmpEvent.USE_SORT, { order });

export const AmpTrackUseView = (view: string) =>
  track(AmpEvent.USE_VIEW, { view });

export const AmpTrackUseToggle = (name: string, isActive: boolean) =>
  track(AmpEvent.USE_TOGGLE, { name, isActive });

export const AmpTrackUseAlertCTA = (page: string, action: string) =>
  track(AmpEvent.USE_ALERT_CTA, { page, action });
