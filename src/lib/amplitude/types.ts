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
  // ACCOUNT
  ACCOUNT_SAVE = "Account Save",
  ACCOUNT_EDIT = "Account Edit",
  ACCOUNT_REMOVE = "Account Remove",
  ACCOUNT_FILLED_ERROR = "Account Filled Error",
  ACCOUNT_TO_CONTRACT_BUTTON = "Account To Contract Button",
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
  TO_MY_SAVED_CODES = "To My Saved Codes",
  TO_MY_STORED_CODES = "To My Stored Codes",
  TO_MY_SAVED_ACCOUNTS = "To My Saved Accounts",
  TO_RECENT_CODES = "To Recent Codes",
  TO_RECENT_CONTRACT = "To Recent Contract",
  TO_INSTANTIATED_BY_ME = "To Instantiated By Me",
  TO_SAVED_CONTRACT = "To Saved Contract",
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
  TO_MODULE_DETAIL = "To Module Detail",
  // ACTIONS
  ACTION_UPLOAD = "Action Upload",
  ACTION_INSTANTIATE = "Action Instantiate",
  ACTION_EXECUTE = "Action Execute",
  ACTION_QUERY = "Action Query",
  ACTION_MIGRATE = "Action Migrate",
  ACTION_ADMIN_UPDATE = "Action Admin Update",
  ACTION_ADMIN_CLEAR = "Action Admin Clear",
  ACTION_RESEND = "Action Resend",
  ACTION_FAUCET = "Action Faucet",
  ACTION_ATTACH_JSON = "Action Attach Json",
  // INTERACTS
  USE_SELECT_NETWORK = "Use Select Network",
  USE_CLICK_WALLET = "Use Click Wallet",
  USE_MAIN_SEARCH = "Use Main Search",
  USE_SIDEBAR = "Use Sidebar",
  USE_TOPBAR = "Use Topbar",
  USE_TAB = "Use Tab",
  USE_SUBTAB = "Use Subtab",
  USE_RADIO = "Use Radio",
  USE_VIEW_MORE = "Use View More",
  USE_CODE_SELECT = "Use Code Select",
  USE_CODE_MODAL = "Use Code Modal",
  USE_CODE_FILL = "Use Code Fill",
  USE_ASSIGN_ME = "Use Assign Me",
  USE_ATTACHED_JSON_MODAL = "Use Attached Json Modal",
  USE_VIEW_ATTACHED_JSON = "Use View Attached Json",
  USE_EDIT_ATTACHED_JSON = "Use Edit Attached Json",
  USE_REMOVE_ATTACHED_JSON = "Use Remove Attached Json",
  USE_SWITCH_JSON_INPUT = "Use Switch Json Input",
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
  USE_PAGINATION_PAGE_BUTTON = "Use Pagination Page Button",
  USE_PAGINATION_GO_TO_PAGE = "Use Pagination Go To Page",
  USE_CREATE_NEW_PROPOSAL = "Use Create New Proposal",
  USE_SORT = "Use Sort",
  USE_VIEW = "Use View",
  USE_TOGGLE = "Use Toggle",
  USE_SCHEMA_TOGGLE = "Use Schema Toggle",
  USE_JSON_QUERY_AGAIN = "Use Json Query Again",
  USE_TO_YOUR_ACCOUNT = "Use To Your Account",
  USE_TO_0X1_PAGE = "Use To 0x1 Page",
  USE_CONTRACT_STATES_LOAD_MORE = "Use Contract States Load More",
  USE_CONTRACT_STATES_DOWNLOAD = "Use Contract States Download",
  USE_NAMESPACE_TAB = "Use Namespace Tab",
  USE_NAVIGATING_BUTTON = "Use Navigating Button",
  USE_MAIN_CTA = "Use Main CTA",
  USE_MODULE_FUNCTION_CTA = "Use Module Function CTA",
  USE_BREADCRUMB = "Use Breadcrumb",
  // TX
  TX_SUCCEED = "Tx Succeed",
  TX_FAILED = "Tx Failed",
  TX_REJECTED = "Tx Rejected",
  // EXTERNAL
  MINTSCAN = "Mintscan",
  WEBSITE = "Website",
  SOCIAL = "Social",
  FEEDBACK = "Feedback",
  ALLESLABS = "AllesLabs",
}

export type ActionAmpEvent =
  | AmpEvent.ACTION_INSTANTIATE
  | AmpEvent.ACTION_EXECUTE
  | AmpEvent.ACTION_QUERY
  | AmpEvent.ACTION_MIGRATE;

export type SpecialAmpEvent =
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
  | AmpEvent.USE_SORT
  | AmpEvent.USE_VIEW
  | AmpEvent.USE_TOGGLE
  | AmpEvent.USE_CONTRACT_STATES_LOAD_MORE
  | AmpEvent.USE_CONTRACT_STATES_DOWNLOAD;
