export enum AmpEvent {
  ACCOUNT_EDIT = "Account Edit",
  ACCOUNT_FILLED_ERROR = "Account Filled Error",
  ACCOUNT_REMOVE = "Account Remove",
  // ACCOUNT
  ACCOUNT_SAVE = "Account Save",
  ACCOUNT_TO_CONTRACT_BUTTON = "Account To Contract Button",
  ACTION_ADMIN_CLEAR = "Action Admin Clear",
  ACTION_ADMIN_UPDATE = "Action Admin Update",
  ACTION_ATTACH_JSON = "Action Attach JSON",
  ACTION_EVM_READ = "Action Evm Read",
  ACTION_EVM_READ_AGAIN = "Action Evm Read Again",
  ACTION_EVM_WRITE = "Action Evm Write",
  ACTION_EXECUTE = "Action Execute",
  ACTION_EXECUTE_SCRIPT = "Action Execute Script",
  ACTION_FAUCET = "Action Faucet",
  ACTION_INSTANTIATE = "Action Instantiate",
  ACTION_MIGRATE = "Action Migrate",
  ACTION_MOVE_EXECUTE = "Action Move Execute",
  ACTION_MOVE_PUBLISH = "Action Move Publish",
  ACTION_MOVE_VIEW = "Action Move View",
  ACTION_QUERY = "Action Query",
  ACTION_RESEND = "Action Resend",
  // ACTIONS
  ACTION_UPLOAD = "Action Upload",
  CODE_EDIT = "Code Edit",
  CODE_REMOVE = "Code Remove",
  // CODE
  CODE_SAVE = "Code Save",
  CONTRACT_EDIT = "Contract Edit",
  CONTRACT_EDIT_LISTS = "Contract Edit Lists",
  CONTRACT_EDIT_TAGS = "Contract Edit Tags",
  CONTRACT_REMOVE = "Contract Remove",
  CONTRACT_SAVE = "Contract Save",
  // CONTRACT
  CONTRACT_SAVE_AFTER_INIT = "Contract Save After Init",
  INVALID_STATE = "To Invalid State",
  // LIST
  LIST_CREATE = "List Create",
  LIST_EDIT = "List Edit",
  LIST_REMOVE = "List Remove",
  // EXTERNAL
  MINTSCAN = "Mintscan",
  PUBLIC_REMOVE = "Public Project Remove",
  // PUBLIC PROJECT
  PUBLIC_SAVE = "Public Project Save",
  SOCIAL = "Social",
  // TAG
  TAG_CREATE = "Tag Create",
  TO_ACCOUNT_DETAILS = "To Account Detail",
  TO_ADMIN_UPDATE = "To Admin Update",
  TO_ALL_LISTS = "To All Lists",
  TO_ALL_PROJECTS = "To All Public Projects",
  TO_BLOCK_DETAILS = "To Block Detail",
  TO_BLOCKS = "To Blocks",
  TO_CODE_DETAILS = "To Code Detail",
  TO_CODES = "To Codes",
  TO_CONTRACT_DETAILS = "To Contract Detail",
  TO_CONTRACTS = "To Contracts",
  TO_DEPLOY = "To Deploy",
  TO_DEPLOY_SCRIPT = "To Deploy Script",
  TO_EVM_CONTRACT_DETAILS = "To EVM Contract Detail",
  TO_EVM_CONTRACT_VERIFY = "To EVM Contract Verify",
  TO_EVM_TRANSACTION_DETAILS = "To EVM Transaction Detail",
  TO_EXECUTE = "To Execute",
  TO_FAUCET = "To Faucet",
  TO_INSTANTIATE = "To Instantiate",
  TO_INSTANTIATED_BY_ME = "To Instantiated By Me",
  TO_LIST_OTHERS = "To List Others",
  TO_MIGRATE = "To Migrate",
  TO_MODULE_DETAILS = "To Module Detail",
  TO_MODULE_INTERACTION = "To Module Interaction",
  TO_MODULES = "To Modules",
  TO_MY_PUBLISHED_MODULES = "To My Published Modules",
  TO_MY_SAVED_ACCOUNTS = "To My Saved Accounts",
  TO_MY_SAVED_CODES = "To My Saved Codes",
  TO_MY_STORED_CODES = "To My Stored Codes",
  TO_NFT_COLLECTION_DETAILS = "To NFT Collection Detail",
  TO_NFT_COLLECTIONS_LIST = "To NFT Collections List",
  TO_NFT_DETAILS = "To NFT Detail",
  TO_NOT_FOUND = "To 404 Not Found",
  // NAVIGATE
  TO_OVERVIEW = "To Overview",
  TO_PAST_TXS = "To Past Txs",
  TO_POOL_DETAILS = "To Pool Detail",
  TO_POOL_LIST = "To Pool List",
  TO_PROJECT_DETAILS = "To Public Project Detail",
  TO_PROPOSAL_DETAILS = "To Proposal Detail",
  TO_PROPOSAL_LIST = "To Proposal List",
  TO_PROPOSAL_TO_STORE_CODE = "To Proposal To Store Code",
  TO_PROPOSAL_TO_WHITELIST = "To Proposal To Whitelist",
  TO_PUBLISH_MODULE = "To Publish Module",
  TO_QUERY = "To Query",
  TO_SAVED_CONTRACT = "To Saved Contract",
  TO_TRANSACTION_DETAILS = "To Transaction Detail",
  TO_TXS = "To Txs",
  TO_UPLOAD = "To Upload",
  TO_VALIDATOR_DETAILS = "To Validator Detail",
  TO_VALIDATORS = "To Validators",
  TX_FAILED = "Tx Failed",
  TX_REJECTED = "Tx Rejected",
  // TX
  TX_SUCCEED = "Tx Succeed",
  USE_ADD_MODULE_UPLOAD_BOX = "Use Add Module Upload Box",
  USE_ASSIGN_ME = "Use Assign Me",
  USE_ATTACHED_JSON_MODAL = "Use Attached JSON Modal",
  USE_BACK_BUTTON = "Use Back Button",
  USE_BREADCRUMB = "Use Breadcrumb",
  USE_CLICK_WALLET = "Use Click Wallet",
  USE_CMD_EXECUTE = "Use Command Execute",
  USE_CMD_QUERY = "Use Command Query",
  USE_CODE_FILL = "Use Code Fill",
  USE_CODE_MODAL = "Use Code Modal",
  USE_CODE_SELECT = "Use Code Select",
  USE_CONTRACT_FORM = "Use Contract Form",
  USE_CONTRACT_MODAL = "Use Contract Modal",
  USE_CONTRACT_MODAL_LISTS = "Use Contract Modal Lists",
  USE_CONTRACT_MODAL_SEARCH = "Use Contract Modal Search",
  USE_CONTRACT_SNIPPET = "Use Contract Snippet",
  USE_CONTRACT_STATES_DOWNLOAD = "Use Contract States Download",
  USE_CONTRACT_STATES_LOAD_MORE = "Use Contract States Load More",
  USE_COPIER = "Use Copier",
  USE_COPY_BUTTON = "Use Copy Button",
  USE_CREATE_NEW_PROPOSAL = "Use Create New Proposal",
  USE_DEPOSIT_FILL = "Use Deposit Fill",
  USE_EDIT_ATTACHED_JSON = "Use Edit Attached JSON",
  USE_EXPAND = "Use General Expand",
  USE_EXPAND_ALL = "Use Expand All",
  USE_FILTER_MY_PROPOSALS = "Use Filter My Proposals",
  USE_FILTER_POOL_TYPE = "Use Filter Pool Types",
  USE_FILTER_PROPOSALS_STATUS = "Use Filter Proposals Status",
  USE_FILTER_PROPOSALS_TYPE = "Use Filter Proposals Types",
  USE_FILTER_VALIDATORS_ACTIVE = "Use Filter Validators Active",
  USE_FILTER_VOTED_PROPOSALS_ANSWER = "Use Filter Voted Proposals Answer",
  USE_FUNCTION_SELECTION = "Use Function Selection",
  USE_INSTANTIATE_PERMISSION = "Use Instantiate Permission",
  USE_JSON_QUERY_AGAIN = "Use JSON Query Again",
  USE_MAIN_SEARCH = "Use Main Search",
  USE_MODULE_CARD = "Use Module Card",
  USE_MODULE_DETAILS_MAIN_CTA = "Use Module Detail Main CTA",
  USE_MODULE_FUNCTION_CTA = "Use Module Function CTA",
  USE_MODULE_SELECTION_DRAWER = "Use Module Selection Drawer",
  USE_MODULE_SELECTION_FUNCTION = "Use Module Selection Function",
  USE_MODULE_SELECTION_INPUT_FILL = "Use Module Selection Input Fill",
  USE_MODULE_SELECTION_MODULE = "Use Module Selection Module",
  USE_MODULE_TABLE_CTA = "Use Module Table CTA",
  USE_MY_PUBLISHED_MODULES_CTA = "Use My Published Modules CTA",
  USE_NAMESPACE_TAB = "Use Namespace Tab",
  USE_NAVIGATING_BUTTON = "Use Navigating Button",
  USE_NFT_CARD = "Use NFT Card",
  USE_NFT_COLLECTION_INFO_CARD = "Use NFT Collection Info Card",
  USE_NFT_VIEW_RESOURCE_CTA = "Use NFT View Resource CTA",
  USE_OTHER_MODAL = "Use Other Modal",
  USE_PAGINATION_GO_TO_PAGE = "Use Pagination Go To Page",
  USE_PAGINATION_NAVIGATION = "Use Pagination Navigation",
  USE_PAGINATION_PAGE_BUTTON = "Use Pagination Page Button",
  USE_PAGINATION_PAGE_SIZE = "Use Pagination Page Size",
  USE_PUBLISH_MORE_MODULE_BUTTON = "Use Publish More Module Button",
  USE_PUBLISH_POLICY_SELECTION = "Use Publish Policy Selection",
  USE_PUBLISHED_MODULE_ACTION = "Use Published Module Action",
  USE_QUICK_EDIT_CODE = "Use Quick Edit Code",
  USE_QUICK_EDIT_CONTRACT = "Use Quick Edit Contract",
  USE_RADIO = "Use Radio",
  USE_REMOVE_ATTACHED_JSON = "Use Remove Attached JSON",
  USE_REMOVE_MODULE_UPLOAD_BOX = "Use Remove Module Upload Box",
  USE_REMOVE_UPLOAD_FILE = "Use Remove Upload File",
  USE_RIGHT_HELPER_PANEL = "Use Right Helper Panel", // Sticky panel
  USE_SCHEMA_TOGGLE = "Use Schema Toggle",
  USE_SEARCH_INPUT = "Use Search Input",
  USE_SEE_MODULE_BUTTON = "Use See Module Button",
  USE_SEE_REDELEGATIONS = "Use See Redelegations",
  USE_SEE_VALIDATOR_VOTES = "Use See Validator Votes",
  USE_SEE_VOTES = "Use See Votes",
  // INTERACTS
  USE_SELECT_NETWORK = "Use Select Network",
  USE_SELECT_NFT_COLLECTION_GROUP = "Use Select NFT Selection Group",
  USE_SELECT_RESOURCE_GROUP = "Use Select Resource Group",
  USE_SIDEBAR = "Use Sidebar",
  USE_SORT = "Use Sort",
  USE_SUBMIT_PROJECT = "Use Submit Project",
  USE_SUBMIT_PROPOSAL = "Use Submit Proposal",
  USE_SUBTAB = "Use Subtab",
  USE_SWITCH_JSON_INPUT = "Use Switch JSON Input",
  USE_TAB = "Use Tab",
  USE_TO_0X1_PAGE = "Use To 0x1 Page",
  USE_TO_YOUR_ACCOUNT = "Use To Your Account",
  USE_TOGGLE = "Use Toggle",
  USE_TOPBAR = "Use Topbar",
  USE_TX_MSG_EXPAND = "Use Transaction Message Expand",
  USE_UNPIN = "Use Unpin",
  USE_UNSUPPORTED_ASSETS = "Use Unsupported Assets",
  USE_UNSUPPORTED_ASSETS_MODAL = "Use Unsupported Assets Modal",
  USE_UPLOAD_CARD_MOVE_DOWN = "Use Upload Card Move Down",
  USE_UPLOAD_CARD_MOVE_UP = "Use Upload Card Move Up",
  USE_UPLOAD_FILE = "Use Upload File",
  USE_UPTIME = "Use Uptime",
  USE_VIEW = "Use View",

  USE_VIEW_ATTACHED_JSON = "Use View Attached JSON",
  USE_VIEW_CONDITION = "Use View Condition",
  USE_VIEW_JSON = "Use View JSON",
  USE_VIEW_MORE = "Use View More",
  USE_WHITELISTED_ADDRESSES = "Use Whitelisted Addresses",
  WEBSITE = "Website",
}

export type ActionAmpEvent =
  | AmpEvent.ACTION_EXECUTE
  | AmpEvent.ACTION_INSTANTIATE
  | AmpEvent.ACTION_MIGRATE
  | AmpEvent.ACTION_QUERY;

export type SpecialAmpEvent =
  | AmpEvent.INVALID_STATE
  | AmpEvent.MINTSCAN
  | AmpEvent.SOCIAL
  | AmpEvent.TO_ADMIN_UPDATE
  | AmpEvent.TO_EXECUTE
  | AmpEvent.TO_INSTANTIATE
  | AmpEvent.TO_MIGRATE
  | AmpEvent.TO_MODULE_INTERACTION
  | AmpEvent.TO_QUERY
  | AmpEvent.USE_CONTRACT_STATES_DOWNLOAD
  | AmpEvent.USE_CONTRACT_STATES_LOAD_MORE
  | AmpEvent.USE_COPIER
  | AmpEvent.USE_COPIER
  | AmpEvent.USE_DEPOSIT_FILL
  | AmpEvent.USE_EXPAND
  | AmpEvent.USE_EXPAND_ALL
  | AmpEvent.USE_FILTER_POOL_TYPE
  | AmpEvent.USE_FILTER_PROPOSALS_STATUS
  | AmpEvent.USE_FILTER_PROPOSALS_TYPE
  | AmpEvent.USE_INSTANTIATE_PERMISSION
  | AmpEvent.USE_MAIN_SEARCH
  | AmpEvent.USE_MODULE_SELECTION_INPUT_FILL
  | AmpEvent.USE_OTHER_MODAL
  | AmpEvent.USE_PAGINATION_NAVIGATION
  | AmpEvent.USE_RADIO
  | AmpEvent.USE_RIGHT_HELPER_PANEL
  | AmpEvent.USE_SORT
  | AmpEvent.USE_TAB
  | AmpEvent.USE_TOGGLE
  | AmpEvent.USE_UNPIN
  | AmpEvent.USE_UNSUPPORTED_ASSETS
  | AmpEvent.USE_VIEW
  | AmpEvent.USE_VIEW_JSON
  | AmpEvent.WEBSITE;
