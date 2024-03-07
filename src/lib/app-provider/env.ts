// eslint-disable-next-line @typescript-eslint/naming-convention
export enum CELATONE_QUERY_KEYS {
  OVERVIEWS_STATS = "CELATONE_OVERVIEWS_STATS",
  // SIMULATE
  SIMULATE_FEE = "CELATONE_QUERY_SIMULATE_FEE",
  SIMULATE_FEE_STORE_CODE = "CELATONE_QUERY_SIMULATE_FEE_STORE_CODE",
  SIMULATE_FEE_STORE_CODE_PROPOSAL = "CELATONE_QUERY_SIMULATE_FEE_STORE_CODE_PROPOSAL",
  // BALANCES
  BALANCES = "CELATONE_QUERY_BALANCES",
  // TABLE
  ACCOUNT_TABLE_COUNTS = "CELATONE_QUERY_ACCOUNT_TABLE_COUNTS",
  CONTRACT_TABLE_COUNTS = "CELATONE_QUERY_CONTRACT_TABLE_COUNTS",
  // CONTRACT,CODE LCD
  CODE_INFO = "CELATONE_QUERY_CODE_INFO",
  CONTRACT_DETAIL_BY_CONTRACT_ADDRESS = "CELATONE_QUERY_CONTRACT_DETAIL_BY_CONTRACT_ADDRESS",
  CONTRACT_INFO = "CELATONE_QUERY_CONTRACT_INFO",
  CONTRACT_QUERY_MSGS = "CELATONE_QUERY_CONTRACT_QUERY_MSGS",
  CONTRACT_QUERY = "CELATONE_QUERY_CONTRACT_QUERY",
  CONTRACT_STATE = "CELATONE_QUERY_CONTRACT_STATE",
  // ACCOUNT
  ACCOUNT_DATA = "CELATONE_QUERY_ACCOUNT_DATA",
  ACCOUNT_TYPE = "CELATONE_QUERY_ACCOUNT_TYPE",
  // ASSET
  ASSET_INFOS = "CELATONE_QUERY_ASSET_INFOS",
  ASSET_INFO_LIST = "CELATONE_QUERY_ASSET_INFO_LIST",
  // BLOCK
  BLOCKS = "CELATONE_QUERY_BLOCKS",
  BLOCK_DATA = "CELATONE_QUERY_BLOCK_DATA",
  // CODE GQL
  CODES = "CELATONE_QUERY_CODES",
  CODES_BY_ADDRESS = "CELATONE_QUERY_CODES_BY_ADDRESS",
  CODES_BY_WALLET_ADDRESS = "CELATONE_QUERY_CODES_BY_WALLET_ADDRESS",
  CODES_BY_IDS = "CELATONE_QUERY_CODES_BY_IDS",
  CODE_DATA = "CELATONE_QUERY_CODE_DATA",
  // CONTRACT GQL
  CONTRACTS = "CELATONE_QUERY_CONTRACTS",
  CONTRACT_DATA = "CELATONE_QUERY_CONTRACT_DATA",
  CONTRACTS_BY_ADMIN = "CELATONE_QUERY_CONTRACT_BY_ADMIN",
  INSTANTIATED_CONTRACTS_BY_ADDRESS = "CELATONE_QUERY_INSTANTIATED_CONTRACTS_BY_ADDRESS",
  ADMIN_CONTRACTS_BY_ADDRESS = "CELATONE_QUERY_ADMIN_CONTRACTS_BY_ADDRESS",
  INSTANTIATED_COUNT_BY_WALLET_ADDRESS = "CELATONE_QUERY_INSTANTIATED_COUNT_BY_WALLET_ADDRESS",
  INSTANTIATED_LIST_BY_WALLET_ADDRESS = "CELATONE_QUERY_INSTANTIATED_LIST_BY_WALLET_ADDRESS",
  ADMINS_BY_CONTRACTS = "CELATONE_QUERY_ADMINS_BY_CONTRACTS",
  CONTRACT_MIGRATION_HISTORIES_BY_CONTRACT_ADDRESS = "CELATONE_QUERY_CONTRACT_MIGRATION_HISTORIES_BY_CONTRACT_ADDRESS",
  CONTRACTS_BY_CODE_ID_PAGINATION = "CELATONE_QUERY_CONTRACTS_BY_CODE_ID_PAGINATION",
  CONTRACTS_BY_CODE_ID_COUNT = "CELATONE_QUERY_CONTRACTS_BY_CODE_ID_COUNT",
  // X/STAKING
  DELEGATIONS_BY_ADDRESS = "CELATONE_QUERY_DELEGATIONS_BY_ADDRESS",
  VALIDATOR_INFO_BY_ADDRESS = "CELATONE_QUERY_VALIDATOR_INFO_BY_ADDRESS",
  VALIDATOR_IDENTITY_BY_ADDRESS = "CELATONE_QUERY_VALIDATOR_IDENTITY_BY_ADDRESS",
  // VALIDATOR
  VALIDATORS = "CELATONE_QUERY_VALIDATORS",
  VALIDATOR_DATA = "CELATONE_QUERY_VALIDATOR_DATA",
  VALIDATOR_UPTIME = "CELATONE_QUERY_VALIDATOR_UPTIME",
  VALIDATOR_HISTORICAL_POWERS = "CELATONE_QUERY_VALIDATOR_HISTORICAL_POWERS",
  // FAUCET
  FAUCET_INFO = "CELATONE_QUERY_FAUCET_INFO",
  // X/GOV
  PROPOSAL_DATA = "CELATONE_QUERY_PROPOSAL_DATA",
  PROPOSAL_VOTES_INFO = "CELATONE_QUERY_PROPOSAL_VOTES_INFO",
  PROPOSAL_VOTES = "CELATONE_QUERY_PROPOSAL_VOTES",
  PROPOSAL_VALIDATOR_VOTES = "CELATONE_QUERY_PROPOSAL_VALIDATOR_VOTES",
  PROPOSAL_ANSWER_COUNTS = "CELATONE_QUERY_PROPOSAL_ANSWER_COUNTS",
  RELATED_PROPOSALS_BY_CONTRACT_ADDRESS = "CELATONE_QUERY_RELATED_PROPOSALS_BY_CONTRACT_ADDRESS",
  PROPOSALS_BY_MODULE_ID = "CELATONE_QUERY_PROPOSALS_BY_MODULE_ID",
  PROPOSALS_COUNT_BY_MODULE_ID = "CELATONE_QUERY_PROPOSALS_COUNT_BY_MODULE_ID",
  PROPOSALS_BY_ADDRESS = "CELATONE_QUERY_PROPOSALS_BY_ADDRESS",
  PROPOSALS = "CELATONE_QUERY_PROPOSALS",
  PROPOSAL_PARAMS = "CELATONE_QUERY_PROPOSAL_PARAMS",
  PROPOSAL_TYPES = "CELATONE_QUERY_PROPOSAL_TYPES",
  GOV_PARAMS = "CELATONE_QUERY_GOV_PARAMS",
  UPLOAD_ACCESS_PARAMS = "CELATONE_QUERY_UPLOAD_ACCESS_PARAMS",
  // PUBLIC PROJECT
  PUBLIC_PROJECTS = "CELATONE_QUERY_PUBLIC_PROJECTS",
  PUBLIC_PROJECT_BY_SLUG = "CELATONE_QUERY_PUBLIC_PROJECT_BY_SLUG",
  PUBLIC_PROJECT_BY_CODE_ID = "CELATONE_QUERY_PUBLIC_PROJECT_BY_CODE_ID",
  PUBLIC_PROJECT_BY_WALLET_ADDRESS = "CELATONE_QUERY_PUBLIC_PROJECT_BY_WALLET_ADDRESS",
  PUBLIC_PROJECT_BY_MODULE_PATH = "CELATONE_QUERY_PUBLIC_PROJECT_BY_MODULE_PATH",
  // TX
  TX_DATA = "CELATONE_QUERY_TX_DATA",
  TXS_BY_ADDRESS = "CELATONE_QUERY_TXS_BY_ADDRESS",
  TXS_COUNT_BY_ADDRESS = "CELATONE_QUERY_TXS_COUNT_BY_ADDRESS",
  TXS = "CELATONE_QUERY_TXS",
  TXS_BY_BLOCK_HEIGHT = "CELATONE_QUERY_TXS_BY_BLOCK_HEIGHT",
  // ICNS
  ICNS_NAMES_BY_ADDRESS = "CELATONE_QUERY_ICNS_NAMES_BY_ADDRESS",
  ADDRESS_BY_ICNS_NAME = "CELATONE_QUERY_ADDRESS_BY_ICNS_NAME",
  // POOL
  POOL_LIST = "CELATONE_QUERY_POOL_LIST",
  POOL_LIST_COUNT = "CELATONE_QUERY_POOL_LIST_COUNT",
  POOL_INFO_BY_ID = "CELATONE_QUERY_POOL_INFO_BY_ID",
  POOL_INFO_BY_IDS = "CELATONE_QUERY_POOL_INFO_BY_IDS",
  POOL_TRANSACTION_BY_ID = "CELATONE_QUERY_POOL_TRANSACTION_BY_ID",
  POOL_TRANSACTION_BY_ID_COUNT = "CELATONE_QUERY_POOL_TRANSACTION_BY_ID_COUNT",
  // MOVE
  MOVE_POOL_INFOS = "CELATONE_QUERY_MOVE_POOL_INFOS",
  // MODULES
  MODULES_BY_ADDRESS = "CELATONE_QUERY_MODULES_BY_ADDRESS",
  ACCOUNT_MODULES = "CELATONE_QUERY_ACCOUNT_MODULES",
  MODULES = "CELATONE_QUERY_MODULES",
  MODULE_VERIFICATION = "CELATONE_QUERY_MODULE_VERIFICATION",
  FUNCTION_VIEW = "CELATONE_QUERY_FUNCTION_VIEW",
  MODULE_DECODE = "CELATONE_QUERY_MODULE_DECODE",
  MODULE_ID = "CELATONE_QUERY_MODULE_ID",
  MODULE_TXS = "CELATONE_QUERY_MODULE_TXS",
  MODULE_TXS_COUNT = "CELATONE_QUERY_MODULE_TXS_COUNT",
  MODULE_HISTORIES = "CELATONE_QUERY_MODULE_HISTORIES",
  MODULE_HISTORIES_COUNT = "CELATONE_QUERY_MODULE_HISTORIES_COUNT",
  MODULE_DETAILS = "CELATONE_QUERY_MODULE_DETAILS",
  SCRIPT_DECODE = "CELATONE_QUERY_SCRIPT_DECODE",
  // RESOURCE
  RESOURCES_BY_ADDRESS = "CELATONE_QUERY_RESOURCES_BY_ADDRESS",
  // NFTS
  NFT_COLLECTIONS = "CELATONE_QUERY_NFT_COLLECTIONS",
  NFT_COLLECTION_BY_COLLECTION_ADDRESS = "CELATONE_QUERY_NFT_COLLECTION_BY_COLLECTION_ADDRESS",
  NFT_COLLECTION_TOTAL_BURNED = "CELATONE_QUERY_NFT_COLLECTION_TOTAL_BURNED",
  NFT_COLLECTION_CREATOR = "CELATONE_QUERY_NFT_COLLECTION_CREATOR",
  NFT_COLLECTION_ACTIVITIES = "CELATONE_QUERY_NFT_COLLECTION_ACTIVITIES",
  NFT_COLLECTION_ACTIVITIES_COUNT = "CELATONE_QUERY_NFT_COLLECTION_ACTIVITIES_COUNT",
  NFT_COLLECTION_MUTATE_EVENTS = "CELATONE_QUERY_NFT_COLLECTION_MUTATE_EVENTS",
  NFT_COLLECTION_MUTATE_EVENTS_COUNT = "CELATONE_QUERY_NFT_COLLECTION_MUTATE_EVENTS_COUNT",
  NFT_COLLECTION_UNIQUE_HOLDERS_COUNT = "CELATONE_QUERY_NFT_COLLECTION_UNIQUE_HOLDERS_COUNT",
  NFT_COLLECTIONS_BY_ACCOUNT = "CELATONE_QUERY_NFT_COLLECTIONS_BY_ACCOUNT",
  NFTS = "CELATONE_QUERY_NFTS",
  NFT_BY_NFT_ADDRESS = "CELATONE_QUERY_NFT_BY_NFT_ADDRESS",
  NFT_TOKEN_MINT_INFO = "CELATONE_QUERY_NFT_TOKEN_MINT_INFO",
  NFT_METADATA = "CELATONE_QUERY_NFT_METADATA",
  NFT_TRANSACTIONS = "CELATONE_QUERY_NFT_TRANSACTIONS",
  NFT_TRANSACTIONS_COUNT = "CELATONE_QUERY_NFT_TRANSACTIONS_COUNT",
  NFT_MUTATE_EVENTS = "CELATONE_QUERY_NFT_MUTATE_EVENTS",
  NFT_MUTATE_EVENTS_COUNT = "CELATONE_QUERY_NFT_MUTATE_EVENTS_COUNT",
  NFTS_COUNT_BY_ACCOUNT = "CELATONE_QUERY_NFTS_COUNT_BY_ACCOUNT",
  NFTS_BY_ACCOUNT_BY_COLLECTION = "CELATONE_QUERY_NFTS_BY_ACCOUNT_BY_COLLECTION",
}
