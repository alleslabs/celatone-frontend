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
  // CONTRACT
  CONTRACT_LCD = "CELATONE_QUERY_CONTRACT_LCD",
  CONTRACT_QUERY_MSGS = "CELATONE_QUERY_CONTRACT_QUERY_MSGS",
  CONTRACT_QUERY_LCD = "CELATONE_QUERY_CONTRACT_QUERY_LCD",
  CONTRACT_STATE = "CELATONE_QUERY_CONTRACT_STATE",
  CONTRACTS_BY_CODE_ID = "CELATONE_QUERY_CONTRACTS_BY_CODE_ID",
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
  CODES_LCD = "CELATONE_QUERY_CODES_LCD",
  CODES_BY_ADDRESS = "CELATONE_QUERY_CODES_BY_ADDRESS",
  CODES_BY_WALLET_ADDRESS = "CELATONE_QUERY_CODES_BY_WALLET_ADDRESS",
  CODES_BY_IDS = "CELATONE_QUERY_CODES_BY_IDS",
  CODE_DATA = "CELATONE_QUERY_CODE_DATA",
  CODE_DATA_LCD = "CELATONE_QUERY_CODE_DATA_LCD",
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
  // X/STAKING
  STAKING_PARAMS_LCD = "CELATONE_QUERY_STAKING_PARAMS_LCD",
  DELEGATIONS_BY_ADDRESS_LCD = "CELATONE_QUERY_DELEGATIONS_BY_ADDRESS_LCD",
  UNBONDINGS_BY_ADDRESS_LCD = "CELATONE_QUERY_UNBONDINGS_BY_ADDRESS_LCD",
  REDELEGATIONS_BY_ADDRESS_LCD = "CELATONE_QUERY_REDELEGATIONS_BY_ADDRESS_LCD",
  DELEGATION_REWARDS_BY_ADDRESS_LCD = "CELATONE_QUERY_DELEGATION_REWARDS_BY_ADDRESS_LCD",
  COMMISSIONS_BY_VALIDATOR_ADDRESS_LCD = "CELATONE_QUERY_COMMISSION_BY_VALIDATOR_ADDRESS_LCD",
  DELEGATIONS_BY_ADDRESS = "CELATONE_QUERY_DELEGATIONS_BY_ADDRESS",
  // VALIDATOR
  VALIDATORS = "CELATONE_QUERY_VALIDATORS",
  VALIDATORS_LCD = "CELATONE_QUERY_VALIDATORS_LCD",
  VALIDATOR_DATA = "CELATONE_QUERY_VALIDATOR_DATA",
  VALIDATOR_DATA_LCD = "CELATONE_QUERY_VALIDATOR_DATA_LCD",
  VALIDATOR_IDENTITY = "CELATONE_QUERY_VALIDATOR_IDENTITY",
  VALIDATOR_UPTIME = "CELATONE_QUERY_VALIDATOR_UPTIME",
  VALIDATOR_HISTORICAL_POWERS = "CELATONE_QUERY_VALIDATOR_HISTORICAL_POWERS",
  VALIDATOR_DELEGATION_RELATED_TXS = "CELATONE_QUERY_VALIDATOR_DELEGATION_RELATED_TXS",
  VALIDATOR_PROPOSED_BLOCKS = "CELATONE_QUERY_VALIDATOR_PROPOSED_BLOCKS",
  VALIDATOR_DELEGATORS = "CELATONE_QUERY_VALIDATOR_DELEGATORS",
  VALIDATOR_STAKING_PROVISIONS = "CELATONE_QUERY_VALIDATOR_STAKING_PROVISIONS",
  VALIDATOR_VOTED_PROPOSALS = "CELATONE_QUERY_VALIDATOR_VOTED_PROPOSALS",
  VALIDATOR_VOTED_PROPOSALS_ANSWER_COUNTS = "CELATONE_QUERY_VALIDATOR_VOTED_PROPOSALS_ANSWER_COUNTS",
  // FAUCET
  FAUCET_INFO = "CELATONE_QUERY_FAUCET_INFO",
  // X/GOV
  PROPOSAL_DATA = "CELATONE_QUERY_PROPOSAL_DATA",
  PROPOSAL_VOTES_INFO = "CELATONE_QUERY_PROPOSAL_VOTES_INFO",
  PROPOSAL_VOTES = "CELATONE_QUERY_PROPOSAL_VOTES",
  PROPOSAL_VALIDATOR_VOTES = "CELATONE_QUERY_PROPOSAL_VALIDATOR_VOTES",
  PROPOSAL_ANSWER_COUNTS = "CELATONE_QUERY_PROPOSAL_ANSWER_COUNTS",
  RELATED_PROPOSALS_BY_CONTRACT_ADDRESS = "CELATONE_QUERY_RELATED_PROPOSALS_BY_CONTRACT_ADDRESS",
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
  MODULE_DATA = "CELATONE_QUERY_MODULE_DATA",
  MODULES_BY_ADDRESS = "CELATONE_QUERY_MODULES_BY_ADDRESS",
  ACCOUNT_MODULE = "CELATONE_QUERY_ACCOUNT_MODULE",
  ACCOUNT_MODULES = "CELATONE_QUERY_ACCOUNT_MODULES",
  MODULES = "CELATONE_QUERY_MODULES",
  MODULE_VERIFICATION = "CELATONE_QUERY_MODULE_VERIFICATION",
  FUNCTION_VIEW = "CELATONE_QUERY_FUNCTION_VIEW",
  MODULE_DECODE = "CELATONE_QUERY_MODULE_DECODE",
  MODULE_TABLE_COUNTS = "CELATONE_QUERY_MODULE_TABLE_COUNTS",
  MODULE_TXS = "CELATONE_QUERY_MODULE_TXS",
  MODULE_HISTORIES = "CELATONE_QUERY_MODULE_HISTORIES",
  MODULE_PROPOSALS = "CELATONE_QUERY_MODULE_PROPOSALS",
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
