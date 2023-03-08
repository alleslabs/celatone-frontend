/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  bytea: any;
  json: any;
  proposalstatus: any;
  timestamp: any;
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["Boolean"]>;
  _gt?: InputMaybe<Scalars["Boolean"]>;
  _gte?: InputMaybe<Scalars["Boolean"]>;
  _in?: InputMaybe<Array<Scalars["Boolean"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]>;
  _lt?: InputMaybe<Scalars["Boolean"]>;
  _lte?: InputMaybe<Scalars["Boolean"]>;
  _neq?: InputMaybe<Scalars["Boolean"]>;
  _nin?: InputMaybe<Array<Scalars["Boolean"]>>;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["Int"]>;
  _gt?: InputMaybe<Scalars["Int"]>;
  _gte?: InputMaybe<Scalars["Int"]>;
  _in?: InputMaybe<Array<Scalars["Int"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]>;
  _lt?: InputMaybe<Scalars["Int"]>;
  _lte?: InputMaybe<Scalars["Int"]>;
  _neq?: InputMaybe<Scalars["Int"]>;
  _nin?: InputMaybe<Array<Scalars["Int"]>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["String"]>;
  _gt?: InputMaybe<Scalars["String"]>;
  _gte?: InputMaybe<Scalars["String"]>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars["String"]>;
  _in?: InputMaybe<Array<Scalars["String"]>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars["String"]>;
  _is_null?: InputMaybe<Scalars["Boolean"]>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars["String"]>;
  _lt?: InputMaybe<Scalars["String"]>;
  _lte?: InputMaybe<Scalars["String"]>;
  _neq?: InputMaybe<Scalars["String"]>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars["String"]>;
  _nin?: InputMaybe<Array<Scalars["String"]>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars["String"]>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars["String"]>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars["String"]>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars["String"]>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars["String"]>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars["String"]>;
};

/** columns and relationships of "account_transactions" */
export type Account_Transactions = {
  __typename?: "account_transactions";
  /** An object relationship */
  account: Accounts;
  account_id: Scalars["Int"];
  /** An object relationship */
  transaction: Transactions;
  transaction_id: Scalars["Int"];
};

/** aggregated selection of "account_transactions" */
export type Account_Transactions_Aggregate = {
  __typename?: "account_transactions_aggregate";
  aggregate?: Maybe<Account_Transactions_Aggregate_Fields>;
  nodes: Array<Account_Transactions>;
};

export type Account_Transactions_Aggregate_Bool_Exp = {
  count?: InputMaybe<Account_Transactions_Aggregate_Bool_Exp_Count>;
};

export type Account_Transactions_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Account_Transactions_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]>;
  filter?: InputMaybe<Account_Transactions_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "account_transactions" */
export type Account_Transactions_Aggregate_Fields = {
  __typename?: "account_transactions_aggregate_fields";
  avg?: Maybe<Account_Transactions_Avg_Fields>;
  count: Scalars["Int"];
  max?: Maybe<Account_Transactions_Max_Fields>;
  min?: Maybe<Account_Transactions_Min_Fields>;
  stddev?: Maybe<Account_Transactions_Stddev_Fields>;
  stddev_pop?: Maybe<Account_Transactions_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Account_Transactions_Stddev_Samp_Fields>;
  sum?: Maybe<Account_Transactions_Sum_Fields>;
  var_pop?: Maybe<Account_Transactions_Var_Pop_Fields>;
  var_samp?: Maybe<Account_Transactions_Var_Samp_Fields>;
  variance?: Maybe<Account_Transactions_Variance_Fields>;
};

/** aggregate fields of "account_transactions" */
export type Account_Transactions_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Account_Transactions_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]>;
};

/** order by aggregate values of table "account_transactions" */
export type Account_Transactions_Aggregate_Order_By = {
  avg?: InputMaybe<Account_Transactions_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Account_Transactions_Max_Order_By>;
  min?: InputMaybe<Account_Transactions_Min_Order_By>;
  stddev?: InputMaybe<Account_Transactions_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Account_Transactions_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Account_Transactions_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Account_Transactions_Sum_Order_By>;
  var_pop?: InputMaybe<Account_Transactions_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Account_Transactions_Var_Samp_Order_By>;
  variance?: InputMaybe<Account_Transactions_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "account_transactions" */
export type Account_Transactions_Arr_Rel_Insert_Input = {
  data: Array<Account_Transactions_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Account_Transactions_On_Conflict>;
};

/** aggregate avg on columns */
export type Account_Transactions_Avg_Fields = {
  __typename?: "account_transactions_avg_fields";
  account_id?: Maybe<Scalars["Float"]>;
  transaction_id?: Maybe<Scalars["Float"]>;
};

/** order by avg() on columns of table "account_transactions" */
export type Account_Transactions_Avg_Order_By = {
  account_id?: InputMaybe<Order_By>;
  transaction_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "account_transactions". All fields are combined with a logical 'AND'. */
export type Account_Transactions_Bool_Exp = {
  _and?: InputMaybe<Array<Account_Transactions_Bool_Exp>>;
  _not?: InputMaybe<Account_Transactions_Bool_Exp>;
  _or?: InputMaybe<Array<Account_Transactions_Bool_Exp>>;
  account?: InputMaybe<Accounts_Bool_Exp>;
  account_id?: InputMaybe<Int_Comparison_Exp>;
  transaction?: InputMaybe<Transactions_Bool_Exp>;
  transaction_id?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "account_transactions" */
export enum Account_Transactions_Constraint {
  /** unique or primary key constraint on columns "transaction_id", "account_id" */
  AccountTransactionsPkey = "account_transactions_pkey",
}

/** input type for incrementing numeric columns in table "account_transactions" */
export type Account_Transactions_Inc_Input = {
  account_id?: InputMaybe<Scalars["Int"]>;
  transaction_id?: InputMaybe<Scalars["Int"]>;
};

/** input type for inserting data into table "account_transactions" */
export type Account_Transactions_Insert_Input = {
  account?: InputMaybe<Accounts_Obj_Rel_Insert_Input>;
  account_id?: InputMaybe<Scalars["Int"]>;
  transaction?: InputMaybe<Transactions_Obj_Rel_Insert_Input>;
  transaction_id?: InputMaybe<Scalars["Int"]>;
};

/** aggregate max on columns */
export type Account_Transactions_Max_Fields = {
  __typename?: "account_transactions_max_fields";
  account_id?: Maybe<Scalars["Int"]>;
  transaction_id?: Maybe<Scalars["Int"]>;
};

/** order by max() on columns of table "account_transactions" */
export type Account_Transactions_Max_Order_By = {
  account_id?: InputMaybe<Order_By>;
  transaction_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Account_Transactions_Min_Fields = {
  __typename?: "account_transactions_min_fields";
  account_id?: Maybe<Scalars["Int"]>;
  transaction_id?: Maybe<Scalars["Int"]>;
};

/** order by min() on columns of table "account_transactions" */
export type Account_Transactions_Min_Order_By = {
  account_id?: InputMaybe<Order_By>;
  transaction_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "account_transactions" */
export type Account_Transactions_Mutation_Response = {
  __typename?: "account_transactions_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"];
  /** data from the rows affected by the mutation */
  returning: Array<Account_Transactions>;
};

/** on_conflict condition type for table "account_transactions" */
export type Account_Transactions_On_Conflict = {
  constraint: Account_Transactions_Constraint;
  update_columns?: Array<Account_Transactions_Update_Column>;
  where?: InputMaybe<Account_Transactions_Bool_Exp>;
};

/** Ordering options when selecting data from "account_transactions". */
export type Account_Transactions_Order_By = {
  account?: InputMaybe<Accounts_Order_By>;
  account_id?: InputMaybe<Order_By>;
  transaction?: InputMaybe<Transactions_Order_By>;
  transaction_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: account_transactions */
export type Account_Transactions_Pk_Columns_Input = {
  account_id: Scalars["Int"];
  transaction_id: Scalars["Int"];
};

/** select columns of table "account_transactions" */
export enum Account_Transactions_Select_Column {
  /** column name */
  AccountId = "account_id",
  /** column name */
  TransactionId = "transaction_id",
}

/** input type for updating data in table "account_transactions" */
export type Account_Transactions_Set_Input = {
  account_id?: InputMaybe<Scalars["Int"]>;
  transaction_id?: InputMaybe<Scalars["Int"]>;
};

/** aggregate stddev on columns */
export type Account_Transactions_Stddev_Fields = {
  __typename?: "account_transactions_stddev_fields";
  account_id?: Maybe<Scalars["Float"]>;
  transaction_id?: Maybe<Scalars["Float"]>;
};

/** order by stddev() on columns of table "account_transactions" */
export type Account_Transactions_Stddev_Order_By = {
  account_id?: InputMaybe<Order_By>;
  transaction_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Account_Transactions_Stddev_Pop_Fields = {
  __typename?: "account_transactions_stddev_pop_fields";
  account_id?: Maybe<Scalars["Float"]>;
  transaction_id?: Maybe<Scalars["Float"]>;
};

/** order by stddev_pop() on columns of table "account_transactions" */
export type Account_Transactions_Stddev_Pop_Order_By = {
  account_id?: InputMaybe<Order_By>;
  transaction_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Account_Transactions_Stddev_Samp_Fields = {
  __typename?: "account_transactions_stddev_samp_fields";
  account_id?: Maybe<Scalars["Float"]>;
  transaction_id?: Maybe<Scalars["Float"]>;
};

/** order by stddev_samp() on columns of table "account_transactions" */
export type Account_Transactions_Stddev_Samp_Order_By = {
  account_id?: InputMaybe<Order_By>;
  transaction_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "account_transactions" */
export type Account_Transactions_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Account_Transactions_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Account_Transactions_Stream_Cursor_Value_Input = {
  account_id?: InputMaybe<Scalars["Int"]>;
  transaction_id?: InputMaybe<Scalars["Int"]>;
};

/** aggregate sum on columns */
export type Account_Transactions_Sum_Fields = {
  __typename?: "account_transactions_sum_fields";
  account_id?: Maybe<Scalars["Int"]>;
  transaction_id?: Maybe<Scalars["Int"]>;
};

/** order by sum() on columns of table "account_transactions" */
export type Account_Transactions_Sum_Order_By = {
  account_id?: InputMaybe<Order_By>;
  transaction_id?: InputMaybe<Order_By>;
};

/** update columns of table "account_transactions" */
export enum Account_Transactions_Update_Column {
  /** column name */
  AccountId = "account_id",
  /** column name */
  TransactionId = "transaction_id",
}

export type Account_Transactions_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Account_Transactions_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Account_Transactions_Set_Input>;
  where: Account_Transactions_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Account_Transactions_Var_Pop_Fields = {
  __typename?: "account_transactions_var_pop_fields";
  account_id?: Maybe<Scalars["Float"]>;
  transaction_id?: Maybe<Scalars["Float"]>;
};

/** order by var_pop() on columns of table "account_transactions" */
export type Account_Transactions_Var_Pop_Order_By = {
  account_id?: InputMaybe<Order_By>;
  transaction_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Account_Transactions_Var_Samp_Fields = {
  __typename?: "account_transactions_var_samp_fields";
  account_id?: Maybe<Scalars["Float"]>;
  transaction_id?: Maybe<Scalars["Float"]>;
};

/** order by var_samp() on columns of table "account_transactions" */
export type Account_Transactions_Var_Samp_Order_By = {
  account_id?: InputMaybe<Order_By>;
  transaction_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Account_Transactions_Variance_Fields = {
  __typename?: "account_transactions_variance_fields";
  account_id?: Maybe<Scalars["Float"]>;
  transaction_id?: Maybe<Scalars["Float"]>;
};

/** order by variance() on columns of table "account_transactions" */
export type Account_Transactions_Variance_Order_By = {
  account_id?: InputMaybe<Order_By>;
  transaction_id?: InputMaybe<Order_By>;
};

/** columns and relationships of "accounts" */
export type Accounts = {
  __typename?: "accounts";
  /** An array relationship */
  account_transactions: Array<Account_Transactions>;
  /** An aggregate relationship */
  account_transactions_aggregate: Account_Transactions_Aggregate;
  address: Scalars["String"];
  /** An array relationship */
  codes: Array<Codes>;
  /** An aggregate relationship */
  codes_aggregate: Codes_Aggregate;
  /** An array relationship */
  contract_histories: Array<Contract_Histories>;
  /** An aggregate relationship */
  contract_histories_aggregate: Contract_Histories_Aggregate;
  /** An array relationship */
  contracts: Array<Contracts>;
  /** An array relationship */
  contractsByInitBy: Array<Contracts>;
  /** An aggregate relationship */
  contractsByInitBy_aggregate: Contracts_Aggregate;
  /** An aggregate relationship */
  contracts_aggregate: Contracts_Aggregate;
  id: Scalars["Int"];
  /** An array relationship */
  proposals: Array<Proposals>;
  /** An aggregate relationship */
  proposals_aggregate: Proposals_Aggregate;
  /** An array relationship */
  transactions: Array<Transactions>;
  /** An aggregate relationship */
  transactions_aggregate: Transactions_Aggregate;
};

/** columns and relationships of "accounts" */
export type AccountsAccount_TransactionsArgs = {
  distinct_on?: InputMaybe<Array<Account_Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Account_Transactions_Order_By>>;
  where?: InputMaybe<Account_Transactions_Bool_Exp>;
};

/** columns and relationships of "accounts" */
export type AccountsAccount_Transactions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Account_Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Account_Transactions_Order_By>>;
  where?: InputMaybe<Account_Transactions_Bool_Exp>;
};

/** columns and relationships of "accounts" */
export type AccountsCodesArgs = {
  distinct_on?: InputMaybe<Array<Codes_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Codes_Order_By>>;
  where?: InputMaybe<Codes_Bool_Exp>;
};

/** columns and relationships of "accounts" */
export type AccountsCodes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Codes_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Codes_Order_By>>;
  where?: InputMaybe<Codes_Bool_Exp>;
};

/** columns and relationships of "accounts" */
export type AccountsContract_HistoriesArgs = {
  distinct_on?: InputMaybe<Array<Contract_Histories_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contract_Histories_Order_By>>;
  where?: InputMaybe<Contract_Histories_Bool_Exp>;
};

/** columns and relationships of "accounts" */
export type AccountsContract_Histories_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Contract_Histories_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contract_Histories_Order_By>>;
  where?: InputMaybe<Contract_Histories_Bool_Exp>;
};

/** columns and relationships of "accounts" */
export type AccountsContractsArgs = {
  distinct_on?: InputMaybe<Array<Contracts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contracts_Order_By>>;
  where?: InputMaybe<Contracts_Bool_Exp>;
};

/** columns and relationships of "accounts" */
export type AccountsContractsByInitByArgs = {
  distinct_on?: InputMaybe<Array<Contracts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contracts_Order_By>>;
  where?: InputMaybe<Contracts_Bool_Exp>;
};

/** columns and relationships of "accounts" */
export type AccountsContractsByInitBy_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Contracts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contracts_Order_By>>;
  where?: InputMaybe<Contracts_Bool_Exp>;
};

/** columns and relationships of "accounts" */
export type AccountsContracts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Contracts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contracts_Order_By>>;
  where?: InputMaybe<Contracts_Bool_Exp>;
};

/** columns and relationships of "accounts" */
export type AccountsProposalsArgs = {
  distinct_on?: InputMaybe<Array<Proposals_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Proposals_Order_By>>;
  where?: InputMaybe<Proposals_Bool_Exp>;
};

/** columns and relationships of "accounts" */
export type AccountsProposals_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Proposals_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Proposals_Order_By>>;
  where?: InputMaybe<Proposals_Bool_Exp>;
};

/** columns and relationships of "accounts" */
export type AccountsTransactionsArgs = {
  distinct_on?: InputMaybe<Array<Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Transactions_Order_By>>;
  where?: InputMaybe<Transactions_Bool_Exp>;
};

/** columns and relationships of "accounts" */
export type AccountsTransactions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Transactions_Order_By>>;
  where?: InputMaybe<Transactions_Bool_Exp>;
};

/** aggregated selection of "accounts" */
export type Accounts_Aggregate = {
  __typename?: "accounts_aggregate";
  aggregate?: Maybe<Accounts_Aggregate_Fields>;
  nodes: Array<Accounts>;
};

/** aggregate fields of "accounts" */
export type Accounts_Aggregate_Fields = {
  __typename?: "accounts_aggregate_fields";
  avg?: Maybe<Accounts_Avg_Fields>;
  count: Scalars["Int"];
  max?: Maybe<Accounts_Max_Fields>;
  min?: Maybe<Accounts_Min_Fields>;
  stddev?: Maybe<Accounts_Stddev_Fields>;
  stddev_pop?: Maybe<Accounts_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Accounts_Stddev_Samp_Fields>;
  sum?: Maybe<Accounts_Sum_Fields>;
  var_pop?: Maybe<Accounts_Var_Pop_Fields>;
  var_samp?: Maybe<Accounts_Var_Samp_Fields>;
  variance?: Maybe<Accounts_Variance_Fields>;
};

/** aggregate fields of "accounts" */
export type Accounts_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Accounts_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]>;
};

/** aggregate avg on columns */
export type Accounts_Avg_Fields = {
  __typename?: "accounts_avg_fields";
  id?: Maybe<Scalars["Float"]>;
};

/** Boolean expression to filter rows from the table "accounts". All fields are combined with a logical 'AND'. */
export type Accounts_Bool_Exp = {
  _and?: InputMaybe<Array<Accounts_Bool_Exp>>;
  _not?: InputMaybe<Accounts_Bool_Exp>;
  _or?: InputMaybe<Array<Accounts_Bool_Exp>>;
  account_transactions?: InputMaybe<Account_Transactions_Bool_Exp>;
  account_transactions_aggregate?: InputMaybe<Account_Transactions_Aggregate_Bool_Exp>;
  address?: InputMaybe<String_Comparison_Exp>;
  codes?: InputMaybe<Codes_Bool_Exp>;
  codes_aggregate?: InputMaybe<Codes_Aggregate_Bool_Exp>;
  contract_histories?: InputMaybe<Contract_Histories_Bool_Exp>;
  contract_histories_aggregate?: InputMaybe<Contract_Histories_Aggregate_Bool_Exp>;
  contracts?: InputMaybe<Contracts_Bool_Exp>;
  contractsByInitBy?: InputMaybe<Contracts_Bool_Exp>;
  contractsByInitBy_aggregate?: InputMaybe<Contracts_Aggregate_Bool_Exp>;
  contracts_aggregate?: InputMaybe<Contracts_Aggregate_Bool_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  proposals?: InputMaybe<Proposals_Bool_Exp>;
  proposals_aggregate?: InputMaybe<Proposals_Aggregate_Bool_Exp>;
  transactions?: InputMaybe<Transactions_Bool_Exp>;
  transactions_aggregate?: InputMaybe<Transactions_Aggregate_Bool_Exp>;
};

/** unique or primary key constraints on table "accounts" */
export enum Accounts_Constraint {
  /** unique or primary key constraint on columns "id" */
  AccountsIdKey = "accounts_id_key",
  /** unique or primary key constraint on columns "address" */
  AccountsPkey = "accounts_pkey",
}

/** input type for incrementing numeric columns in table "accounts" */
export type Accounts_Inc_Input = {
  id?: InputMaybe<Scalars["Int"]>;
};

/** input type for inserting data into table "accounts" */
export type Accounts_Insert_Input = {
  account_transactions?: InputMaybe<Account_Transactions_Arr_Rel_Insert_Input>;
  address?: InputMaybe<Scalars["String"]>;
  codes?: InputMaybe<Codes_Arr_Rel_Insert_Input>;
  contract_histories?: InputMaybe<Contract_Histories_Arr_Rel_Insert_Input>;
  contracts?: InputMaybe<Contracts_Arr_Rel_Insert_Input>;
  contractsByInitBy?: InputMaybe<Contracts_Arr_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["Int"]>;
  proposals?: InputMaybe<Proposals_Arr_Rel_Insert_Input>;
  transactions?: InputMaybe<Transactions_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Accounts_Max_Fields = {
  __typename?: "accounts_max_fields";
  address?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["Int"]>;
};

/** aggregate min on columns */
export type Accounts_Min_Fields = {
  __typename?: "accounts_min_fields";
  address?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["Int"]>;
};

/** response of any mutation on the table "accounts" */
export type Accounts_Mutation_Response = {
  __typename?: "accounts_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"];
  /** data from the rows affected by the mutation */
  returning: Array<Accounts>;
};

/** input type for inserting object relation for remote table "accounts" */
export type Accounts_Obj_Rel_Insert_Input = {
  data: Accounts_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Accounts_On_Conflict>;
};

/** on_conflict condition type for table "accounts" */
export type Accounts_On_Conflict = {
  constraint: Accounts_Constraint;
  update_columns?: Array<Accounts_Update_Column>;
  where?: InputMaybe<Accounts_Bool_Exp>;
};

/** Ordering options when selecting data from "accounts". */
export type Accounts_Order_By = {
  account_transactions_aggregate?: InputMaybe<Account_Transactions_Aggregate_Order_By>;
  address?: InputMaybe<Order_By>;
  codes_aggregate?: InputMaybe<Codes_Aggregate_Order_By>;
  contract_histories_aggregate?: InputMaybe<Contract_Histories_Aggregate_Order_By>;
  contractsByInitBy_aggregate?: InputMaybe<Contracts_Aggregate_Order_By>;
  contracts_aggregate?: InputMaybe<Contracts_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  proposals_aggregate?: InputMaybe<Proposals_Aggregate_Order_By>;
  transactions_aggregate?: InputMaybe<Transactions_Aggregate_Order_By>;
};

/** primary key columns input for table: accounts */
export type Accounts_Pk_Columns_Input = {
  address: Scalars["String"];
};

/** select columns of table "accounts" */
export enum Accounts_Select_Column {
  /** column name */
  Address = "address",
  /** column name */
  Id = "id",
}

/** input type for updating data in table "accounts" */
export type Accounts_Set_Input = {
  address?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["Int"]>;
};

/** aggregate stddev on columns */
export type Accounts_Stddev_Fields = {
  __typename?: "accounts_stddev_fields";
  id?: Maybe<Scalars["Float"]>;
};

/** aggregate stddev_pop on columns */
export type Accounts_Stddev_Pop_Fields = {
  __typename?: "accounts_stddev_pop_fields";
  id?: Maybe<Scalars["Float"]>;
};

/** aggregate stddev_samp on columns */
export type Accounts_Stddev_Samp_Fields = {
  __typename?: "accounts_stddev_samp_fields";
  id?: Maybe<Scalars["Float"]>;
};

/** Streaming cursor of the table "accounts" */
export type Accounts_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Accounts_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Accounts_Stream_Cursor_Value_Input = {
  address?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["Int"]>;
};

/** aggregate sum on columns */
export type Accounts_Sum_Fields = {
  __typename?: "accounts_sum_fields";
  id?: Maybe<Scalars["Int"]>;
};

/** update columns of table "accounts" */
export enum Accounts_Update_Column {
  /** column name */
  Address = "address",
  /** column name */
  Id = "id",
}

export type Accounts_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Accounts_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Accounts_Set_Input>;
  where: Accounts_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Accounts_Var_Pop_Fields = {
  __typename?: "accounts_var_pop_fields";
  id?: Maybe<Scalars["Float"]>;
};

/** aggregate var_samp on columns */
export type Accounts_Var_Samp_Fields = {
  __typename?: "accounts_var_samp_fields";
  id?: Maybe<Scalars["Float"]>;
};

/** aggregate variance on columns */
export type Accounts_Variance_Fields = {
  __typename?: "accounts_variance_fields";
  id?: Maybe<Scalars["Float"]>;
};

/** columns and relationships of "blocks" */
export type Blocks = {
  __typename?: "blocks";
  /** An array relationship */
  code_proposals: Array<Code_Proposals>;
  /** An aggregate relationship */
  code_proposals_aggregate: Code_Proposals_Aggregate;
  /** An array relationship */
  contract_histories: Array<Contract_Histories>;
  /** An aggregate relationship */
  contract_histories_aggregate: Contract_Histories_Aggregate;
  /** An array relationship */
  contract_proposals: Array<Contract_Proposals>;
  /** An aggregate relationship */
  contract_proposals_aggregate: Contract_Proposals_Aggregate;
  hash: Scalars["bytea"];
  height: Scalars["Int"];
  timestamp: Scalars["timestamp"];
  /** An array relationship */
  transactions: Array<Transactions>;
  /** An aggregate relationship */
  transactions_aggregate: Transactions_Aggregate;
};

/** columns and relationships of "blocks" */
export type BlocksCode_ProposalsArgs = {
  distinct_on?: InputMaybe<Array<Code_Proposals_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Code_Proposals_Order_By>>;
  where?: InputMaybe<Code_Proposals_Bool_Exp>;
};

/** columns and relationships of "blocks" */
export type BlocksCode_Proposals_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Code_Proposals_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Code_Proposals_Order_By>>;
  where?: InputMaybe<Code_Proposals_Bool_Exp>;
};

/** columns and relationships of "blocks" */
export type BlocksContract_HistoriesArgs = {
  distinct_on?: InputMaybe<Array<Contract_Histories_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contract_Histories_Order_By>>;
  where?: InputMaybe<Contract_Histories_Bool_Exp>;
};

/** columns and relationships of "blocks" */
export type BlocksContract_Histories_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Contract_Histories_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contract_Histories_Order_By>>;
  where?: InputMaybe<Contract_Histories_Bool_Exp>;
};

/** columns and relationships of "blocks" */
export type BlocksContract_ProposalsArgs = {
  distinct_on?: InputMaybe<Array<Contract_Proposals_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contract_Proposals_Order_By>>;
  where?: InputMaybe<Contract_Proposals_Bool_Exp>;
};

/** columns and relationships of "blocks" */
export type BlocksContract_Proposals_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Contract_Proposals_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contract_Proposals_Order_By>>;
  where?: InputMaybe<Contract_Proposals_Bool_Exp>;
};

/** columns and relationships of "blocks" */
export type BlocksTransactionsArgs = {
  distinct_on?: InputMaybe<Array<Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Transactions_Order_By>>;
  where?: InputMaybe<Transactions_Bool_Exp>;
};

/** columns and relationships of "blocks" */
export type BlocksTransactions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Transactions_Order_By>>;
  where?: InputMaybe<Transactions_Bool_Exp>;
};

/** aggregated selection of "blocks" */
export type Blocks_Aggregate = {
  __typename?: "blocks_aggregate";
  aggregate?: Maybe<Blocks_Aggregate_Fields>;
  nodes: Array<Blocks>;
};

/** aggregate fields of "blocks" */
export type Blocks_Aggregate_Fields = {
  __typename?: "blocks_aggregate_fields";
  avg?: Maybe<Blocks_Avg_Fields>;
  count: Scalars["Int"];
  max?: Maybe<Blocks_Max_Fields>;
  min?: Maybe<Blocks_Min_Fields>;
  stddev?: Maybe<Blocks_Stddev_Fields>;
  stddev_pop?: Maybe<Blocks_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Blocks_Stddev_Samp_Fields>;
  sum?: Maybe<Blocks_Sum_Fields>;
  var_pop?: Maybe<Blocks_Var_Pop_Fields>;
  var_samp?: Maybe<Blocks_Var_Samp_Fields>;
  variance?: Maybe<Blocks_Variance_Fields>;
};

/** aggregate fields of "blocks" */
export type Blocks_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Blocks_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]>;
};

/** aggregate avg on columns */
export type Blocks_Avg_Fields = {
  __typename?: "blocks_avg_fields";
  height?: Maybe<Scalars["Float"]>;
};

/** Boolean expression to filter rows from the table "blocks". All fields are combined with a logical 'AND'. */
export type Blocks_Bool_Exp = {
  _and?: InputMaybe<Array<Blocks_Bool_Exp>>;
  _not?: InputMaybe<Blocks_Bool_Exp>;
  _or?: InputMaybe<Array<Blocks_Bool_Exp>>;
  code_proposals?: InputMaybe<Code_Proposals_Bool_Exp>;
  code_proposals_aggregate?: InputMaybe<Code_Proposals_Aggregate_Bool_Exp>;
  contract_histories?: InputMaybe<Contract_Histories_Bool_Exp>;
  contract_histories_aggregate?: InputMaybe<Contract_Histories_Aggregate_Bool_Exp>;
  contract_proposals?: InputMaybe<Contract_Proposals_Bool_Exp>;
  contract_proposals_aggregate?: InputMaybe<Contract_Proposals_Aggregate_Bool_Exp>;
  hash?: InputMaybe<Bytea_Comparison_Exp>;
  height?: InputMaybe<Int_Comparison_Exp>;
  timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
  transactions?: InputMaybe<Transactions_Bool_Exp>;
  transactions_aggregate?: InputMaybe<Transactions_Aggregate_Bool_Exp>;
};

/** unique or primary key constraints on table "blocks" */
export enum Blocks_Constraint {
  /** unique or primary key constraint on columns "height" */
  BlocksPkey = "blocks_pkey",
}

/** input type for incrementing numeric columns in table "blocks" */
export type Blocks_Inc_Input = {
  height?: InputMaybe<Scalars["Int"]>;
};

/** input type for inserting data into table "blocks" */
export type Blocks_Insert_Input = {
  code_proposals?: InputMaybe<Code_Proposals_Arr_Rel_Insert_Input>;
  contract_histories?: InputMaybe<Contract_Histories_Arr_Rel_Insert_Input>;
  contract_proposals?: InputMaybe<Contract_Proposals_Arr_Rel_Insert_Input>;
  hash?: InputMaybe<Scalars["bytea"]>;
  height?: InputMaybe<Scalars["Int"]>;
  timestamp?: InputMaybe<Scalars["timestamp"]>;
  transactions?: InputMaybe<Transactions_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Blocks_Max_Fields = {
  __typename?: "blocks_max_fields";
  height?: Maybe<Scalars["Int"]>;
  timestamp?: Maybe<Scalars["timestamp"]>;
};

/** aggregate min on columns */
export type Blocks_Min_Fields = {
  __typename?: "blocks_min_fields";
  height?: Maybe<Scalars["Int"]>;
  timestamp?: Maybe<Scalars["timestamp"]>;
};

/** response of any mutation on the table "blocks" */
export type Blocks_Mutation_Response = {
  __typename?: "blocks_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"];
  /** data from the rows affected by the mutation */
  returning: Array<Blocks>;
};

/** input type for inserting object relation for remote table "blocks" */
export type Blocks_Obj_Rel_Insert_Input = {
  data: Blocks_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Blocks_On_Conflict>;
};

/** on_conflict condition type for table "blocks" */
export type Blocks_On_Conflict = {
  constraint: Blocks_Constraint;
  update_columns?: Array<Blocks_Update_Column>;
  where?: InputMaybe<Blocks_Bool_Exp>;
};

/** Ordering options when selecting data from "blocks". */
export type Blocks_Order_By = {
  code_proposals_aggregate?: InputMaybe<Code_Proposals_Aggregate_Order_By>;
  contract_histories_aggregate?: InputMaybe<Contract_Histories_Aggregate_Order_By>;
  contract_proposals_aggregate?: InputMaybe<Contract_Proposals_Aggregate_Order_By>;
  hash?: InputMaybe<Order_By>;
  height?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
  transactions_aggregate?: InputMaybe<Transactions_Aggregate_Order_By>;
};

/** primary key columns input for table: blocks */
export type Blocks_Pk_Columns_Input = {
  height: Scalars["Int"];
};

/** select columns of table "blocks" */
export enum Blocks_Select_Column {
  /** column name */
  Hash = "hash",
  /** column name */
  Height = "height",
  /** column name */
  Timestamp = "timestamp",
}

/** input type for updating data in table "blocks" */
export type Blocks_Set_Input = {
  hash?: InputMaybe<Scalars["bytea"]>;
  height?: InputMaybe<Scalars["Int"]>;
  timestamp?: InputMaybe<Scalars["timestamp"]>;
};

/** aggregate stddev on columns */
export type Blocks_Stddev_Fields = {
  __typename?: "blocks_stddev_fields";
  height?: Maybe<Scalars["Float"]>;
};

/** aggregate stddev_pop on columns */
export type Blocks_Stddev_Pop_Fields = {
  __typename?: "blocks_stddev_pop_fields";
  height?: Maybe<Scalars["Float"]>;
};

/** aggregate stddev_samp on columns */
export type Blocks_Stddev_Samp_Fields = {
  __typename?: "blocks_stddev_samp_fields";
  height?: Maybe<Scalars["Float"]>;
};

/** Streaming cursor of the table "blocks" */
export type Blocks_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Blocks_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Blocks_Stream_Cursor_Value_Input = {
  hash?: InputMaybe<Scalars["bytea"]>;
  height?: InputMaybe<Scalars["Int"]>;
  timestamp?: InputMaybe<Scalars["timestamp"]>;
};

/** aggregate sum on columns */
export type Blocks_Sum_Fields = {
  __typename?: "blocks_sum_fields";
  height?: Maybe<Scalars["Int"]>;
};

/** update columns of table "blocks" */
export enum Blocks_Update_Column {
  /** column name */
  Hash = "hash",
  /** column name */
  Height = "height",
  /** column name */
  Timestamp = "timestamp",
}

export type Blocks_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Blocks_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Blocks_Set_Input>;
  where: Blocks_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Blocks_Var_Pop_Fields = {
  __typename?: "blocks_var_pop_fields";
  height?: Maybe<Scalars["Float"]>;
};

/** aggregate var_samp on columns */
export type Blocks_Var_Samp_Fields = {
  __typename?: "blocks_var_samp_fields";
  height?: Maybe<Scalars["Float"]>;
};

/** aggregate variance on columns */
export type Blocks_Variance_Fields = {
  __typename?: "blocks_variance_fields";
  height?: Maybe<Scalars["Float"]>;
};

/** Boolean expression to compare columns of type "bytea". All fields are combined with logical 'AND'. */
export type Bytea_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["bytea"]>;
  _gt?: InputMaybe<Scalars["bytea"]>;
  _gte?: InputMaybe<Scalars["bytea"]>;
  _in?: InputMaybe<Array<Scalars["bytea"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]>;
  _lt?: InputMaybe<Scalars["bytea"]>;
  _lte?: InputMaybe<Scalars["bytea"]>;
  _neq?: InputMaybe<Scalars["bytea"]>;
  _nin?: InputMaybe<Array<Scalars["bytea"]>>;
};

/** columns and relationships of "code_proposals" */
export type Code_Proposals = {
  __typename?: "code_proposals";
  /** An object relationship */
  block?: Maybe<Blocks>;
  /** An object relationship */
  code: Codes;
  code_id: Scalars["Int"];
  /** An object relationship */
  proposal: Proposals;
  proposal_id: Scalars["Int"];
  resolved_height?: Maybe<Scalars["Int"]>;
};

/** aggregated selection of "code_proposals" */
export type Code_Proposals_Aggregate = {
  __typename?: "code_proposals_aggregate";
  aggregate?: Maybe<Code_Proposals_Aggregate_Fields>;
  nodes: Array<Code_Proposals>;
};

export type Code_Proposals_Aggregate_Bool_Exp = {
  count?: InputMaybe<Code_Proposals_Aggregate_Bool_Exp_Count>;
};

export type Code_Proposals_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Code_Proposals_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]>;
  filter?: InputMaybe<Code_Proposals_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "code_proposals" */
export type Code_Proposals_Aggregate_Fields = {
  __typename?: "code_proposals_aggregate_fields";
  avg?: Maybe<Code_Proposals_Avg_Fields>;
  count: Scalars["Int"];
  max?: Maybe<Code_Proposals_Max_Fields>;
  min?: Maybe<Code_Proposals_Min_Fields>;
  stddev?: Maybe<Code_Proposals_Stddev_Fields>;
  stddev_pop?: Maybe<Code_Proposals_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Code_Proposals_Stddev_Samp_Fields>;
  sum?: Maybe<Code_Proposals_Sum_Fields>;
  var_pop?: Maybe<Code_Proposals_Var_Pop_Fields>;
  var_samp?: Maybe<Code_Proposals_Var_Samp_Fields>;
  variance?: Maybe<Code_Proposals_Variance_Fields>;
};

/** aggregate fields of "code_proposals" */
export type Code_Proposals_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Code_Proposals_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]>;
};

/** order by aggregate values of table "code_proposals" */
export type Code_Proposals_Aggregate_Order_By = {
  avg?: InputMaybe<Code_Proposals_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Code_Proposals_Max_Order_By>;
  min?: InputMaybe<Code_Proposals_Min_Order_By>;
  stddev?: InputMaybe<Code_Proposals_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Code_Proposals_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Code_Proposals_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Code_Proposals_Sum_Order_By>;
  var_pop?: InputMaybe<Code_Proposals_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Code_Proposals_Var_Samp_Order_By>;
  variance?: InputMaybe<Code_Proposals_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "code_proposals" */
export type Code_Proposals_Arr_Rel_Insert_Input = {
  data: Array<Code_Proposals_Insert_Input>;
};

/** aggregate avg on columns */
export type Code_Proposals_Avg_Fields = {
  __typename?: "code_proposals_avg_fields";
  code_id?: Maybe<Scalars["Float"]>;
  proposal_id?: Maybe<Scalars["Float"]>;
  resolved_height?: Maybe<Scalars["Float"]>;
};

/** order by avg() on columns of table "code_proposals" */
export type Code_Proposals_Avg_Order_By = {
  code_id?: InputMaybe<Order_By>;
  proposal_id?: InputMaybe<Order_By>;
  resolved_height?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "code_proposals". All fields are combined with a logical 'AND'. */
export type Code_Proposals_Bool_Exp = {
  _and?: InputMaybe<Array<Code_Proposals_Bool_Exp>>;
  _not?: InputMaybe<Code_Proposals_Bool_Exp>;
  _or?: InputMaybe<Array<Code_Proposals_Bool_Exp>>;
  block?: InputMaybe<Blocks_Bool_Exp>;
  code?: InputMaybe<Codes_Bool_Exp>;
  code_id?: InputMaybe<Int_Comparison_Exp>;
  proposal?: InputMaybe<Proposals_Bool_Exp>;
  proposal_id?: InputMaybe<Int_Comparison_Exp>;
  resolved_height?: InputMaybe<Int_Comparison_Exp>;
};

/** input type for incrementing numeric columns in table "code_proposals" */
export type Code_Proposals_Inc_Input = {
  code_id?: InputMaybe<Scalars["Int"]>;
  proposal_id?: InputMaybe<Scalars["Int"]>;
  resolved_height?: InputMaybe<Scalars["Int"]>;
};

/** input type for inserting data into table "code_proposals" */
export type Code_Proposals_Insert_Input = {
  block?: InputMaybe<Blocks_Obj_Rel_Insert_Input>;
  code?: InputMaybe<Codes_Obj_Rel_Insert_Input>;
  code_id?: InputMaybe<Scalars["Int"]>;
  proposal?: InputMaybe<Proposals_Obj_Rel_Insert_Input>;
  proposal_id?: InputMaybe<Scalars["Int"]>;
  resolved_height?: InputMaybe<Scalars["Int"]>;
};

/** aggregate max on columns */
export type Code_Proposals_Max_Fields = {
  __typename?: "code_proposals_max_fields";
  code_id?: Maybe<Scalars["Int"]>;
  proposal_id?: Maybe<Scalars["Int"]>;
  resolved_height?: Maybe<Scalars["Int"]>;
};

/** order by max() on columns of table "code_proposals" */
export type Code_Proposals_Max_Order_By = {
  code_id?: InputMaybe<Order_By>;
  proposal_id?: InputMaybe<Order_By>;
  resolved_height?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Code_Proposals_Min_Fields = {
  __typename?: "code_proposals_min_fields";
  code_id?: Maybe<Scalars["Int"]>;
  proposal_id?: Maybe<Scalars["Int"]>;
  resolved_height?: Maybe<Scalars["Int"]>;
};

/** order by min() on columns of table "code_proposals" */
export type Code_Proposals_Min_Order_By = {
  code_id?: InputMaybe<Order_By>;
  proposal_id?: InputMaybe<Order_By>;
  resolved_height?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "code_proposals" */
export type Code_Proposals_Mutation_Response = {
  __typename?: "code_proposals_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"];
  /** data from the rows affected by the mutation */
  returning: Array<Code_Proposals>;
};

/** Ordering options when selecting data from "code_proposals". */
export type Code_Proposals_Order_By = {
  block?: InputMaybe<Blocks_Order_By>;
  code?: InputMaybe<Codes_Order_By>;
  code_id?: InputMaybe<Order_By>;
  proposal?: InputMaybe<Proposals_Order_By>;
  proposal_id?: InputMaybe<Order_By>;
  resolved_height?: InputMaybe<Order_By>;
};

/** select columns of table "code_proposals" */
export enum Code_Proposals_Select_Column {
  /** column name */
  CodeId = "code_id",
  /** column name */
  ProposalId = "proposal_id",
  /** column name */
  ResolvedHeight = "resolved_height",
}

/** input type for updating data in table "code_proposals" */
export type Code_Proposals_Set_Input = {
  code_id?: InputMaybe<Scalars["Int"]>;
  proposal_id?: InputMaybe<Scalars["Int"]>;
  resolved_height?: InputMaybe<Scalars["Int"]>;
};

/** aggregate stddev on columns */
export type Code_Proposals_Stddev_Fields = {
  __typename?: "code_proposals_stddev_fields";
  code_id?: Maybe<Scalars["Float"]>;
  proposal_id?: Maybe<Scalars["Float"]>;
  resolved_height?: Maybe<Scalars["Float"]>;
};

/** order by stddev() on columns of table "code_proposals" */
export type Code_Proposals_Stddev_Order_By = {
  code_id?: InputMaybe<Order_By>;
  proposal_id?: InputMaybe<Order_By>;
  resolved_height?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Code_Proposals_Stddev_Pop_Fields = {
  __typename?: "code_proposals_stddev_pop_fields";
  code_id?: Maybe<Scalars["Float"]>;
  proposal_id?: Maybe<Scalars["Float"]>;
  resolved_height?: Maybe<Scalars["Float"]>;
};

/** order by stddev_pop() on columns of table "code_proposals" */
export type Code_Proposals_Stddev_Pop_Order_By = {
  code_id?: InputMaybe<Order_By>;
  proposal_id?: InputMaybe<Order_By>;
  resolved_height?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Code_Proposals_Stddev_Samp_Fields = {
  __typename?: "code_proposals_stddev_samp_fields";
  code_id?: Maybe<Scalars["Float"]>;
  proposal_id?: Maybe<Scalars["Float"]>;
  resolved_height?: Maybe<Scalars["Float"]>;
};

/** order by stddev_samp() on columns of table "code_proposals" */
export type Code_Proposals_Stddev_Samp_Order_By = {
  code_id?: InputMaybe<Order_By>;
  proposal_id?: InputMaybe<Order_By>;
  resolved_height?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "code_proposals" */
export type Code_Proposals_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Code_Proposals_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Code_Proposals_Stream_Cursor_Value_Input = {
  code_id?: InputMaybe<Scalars["Int"]>;
  proposal_id?: InputMaybe<Scalars["Int"]>;
  resolved_height?: InputMaybe<Scalars["Int"]>;
};

/** aggregate sum on columns */
export type Code_Proposals_Sum_Fields = {
  __typename?: "code_proposals_sum_fields";
  code_id?: Maybe<Scalars["Int"]>;
  proposal_id?: Maybe<Scalars["Int"]>;
  resolved_height?: Maybe<Scalars["Int"]>;
};

/** order by sum() on columns of table "code_proposals" */
export type Code_Proposals_Sum_Order_By = {
  code_id?: InputMaybe<Order_By>;
  proposal_id?: InputMaybe<Order_By>;
  resolved_height?: InputMaybe<Order_By>;
};

export type Code_Proposals_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Code_Proposals_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Code_Proposals_Set_Input>;
  where: Code_Proposals_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Code_Proposals_Var_Pop_Fields = {
  __typename?: "code_proposals_var_pop_fields";
  code_id?: Maybe<Scalars["Float"]>;
  proposal_id?: Maybe<Scalars["Float"]>;
  resolved_height?: Maybe<Scalars["Float"]>;
};

/** order by var_pop() on columns of table "code_proposals" */
export type Code_Proposals_Var_Pop_Order_By = {
  code_id?: InputMaybe<Order_By>;
  proposal_id?: InputMaybe<Order_By>;
  resolved_height?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Code_Proposals_Var_Samp_Fields = {
  __typename?: "code_proposals_var_samp_fields";
  code_id?: Maybe<Scalars["Float"]>;
  proposal_id?: Maybe<Scalars["Float"]>;
  resolved_height?: Maybe<Scalars["Float"]>;
};

/** order by var_samp() on columns of table "code_proposals" */
export type Code_Proposals_Var_Samp_Order_By = {
  code_id?: InputMaybe<Order_By>;
  proposal_id?: InputMaybe<Order_By>;
  resolved_height?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Code_Proposals_Variance_Fields = {
  __typename?: "code_proposals_variance_fields";
  code_id?: Maybe<Scalars["Float"]>;
  proposal_id?: Maybe<Scalars["Float"]>;
  resolved_height?: Maybe<Scalars["Float"]>;
};

/** order by variance() on columns of table "code_proposals" */
export type Code_Proposals_Variance_Order_By = {
  code_id?: InputMaybe<Order_By>;
  proposal_id?: InputMaybe<Order_By>;
  resolved_height?: InputMaybe<Order_By>;
};

/** columns and relationships of "codes" */
export type Codes = {
  __typename?: "codes";
  access_config_addresses: Scalars["json"];
  access_config_permission: Scalars["String"];
  /** An object relationship */
  account: Accounts;
  /** An array relationship */
  code_proposals: Array<Code_Proposals>;
  /** An aggregate relationship */
  code_proposals_aggregate: Code_Proposals_Aggregate;
  /** An array relationship */
  contract_histories: Array<Contract_Histories>;
  /** An aggregate relationship */
  contract_histories_aggregate: Contract_Histories_Aggregate;
  contract_instantiated: Scalars["Int"];
  /** An array relationship */
  contracts: Array<Contracts>;
  /** An aggregate relationship */
  contracts_aggregate: Contracts_Aggregate;
  cw2_contract?: Maybe<Scalars["String"]>;
  cw2_version?: Maybe<Scalars["String"]>;
  id: Scalars["Int"];
  /** An object relationship */
  transaction?: Maybe<Transactions>;
  transaction_id?: Maybe<Scalars["Int"]>;
  uploader: Scalars["Int"];
};

/** columns and relationships of "codes" */
export type CodesAccess_Config_AddressesArgs = {
  path?: InputMaybe<Scalars["String"]>;
};

/** columns and relationships of "codes" */
export type CodesCode_ProposalsArgs = {
  distinct_on?: InputMaybe<Array<Code_Proposals_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Code_Proposals_Order_By>>;
  where?: InputMaybe<Code_Proposals_Bool_Exp>;
};

/** columns and relationships of "codes" */
export type CodesCode_Proposals_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Code_Proposals_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Code_Proposals_Order_By>>;
  where?: InputMaybe<Code_Proposals_Bool_Exp>;
};

/** columns and relationships of "codes" */
export type CodesContract_HistoriesArgs = {
  distinct_on?: InputMaybe<Array<Contract_Histories_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contract_Histories_Order_By>>;
  where?: InputMaybe<Contract_Histories_Bool_Exp>;
};

/** columns and relationships of "codes" */
export type CodesContract_Histories_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Contract_Histories_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contract_Histories_Order_By>>;
  where?: InputMaybe<Contract_Histories_Bool_Exp>;
};

/** columns and relationships of "codes" */
export type CodesContractsArgs = {
  distinct_on?: InputMaybe<Array<Contracts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contracts_Order_By>>;
  where?: InputMaybe<Contracts_Bool_Exp>;
};

/** columns and relationships of "codes" */
export type CodesContracts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Contracts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contracts_Order_By>>;
  where?: InputMaybe<Contracts_Bool_Exp>;
};

/** aggregated selection of "codes" */
export type Codes_Aggregate = {
  __typename?: "codes_aggregate";
  aggregate?: Maybe<Codes_Aggregate_Fields>;
  nodes: Array<Codes>;
};

export type Codes_Aggregate_Bool_Exp = {
  count?: InputMaybe<Codes_Aggregate_Bool_Exp_Count>;
};

export type Codes_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Codes_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]>;
  filter?: InputMaybe<Codes_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "codes" */
export type Codes_Aggregate_Fields = {
  __typename?: "codes_aggregate_fields";
  avg?: Maybe<Codes_Avg_Fields>;
  count: Scalars["Int"];
  max?: Maybe<Codes_Max_Fields>;
  min?: Maybe<Codes_Min_Fields>;
  stddev?: Maybe<Codes_Stddev_Fields>;
  stddev_pop?: Maybe<Codes_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Codes_Stddev_Samp_Fields>;
  sum?: Maybe<Codes_Sum_Fields>;
  var_pop?: Maybe<Codes_Var_Pop_Fields>;
  var_samp?: Maybe<Codes_Var_Samp_Fields>;
  variance?: Maybe<Codes_Variance_Fields>;
};

/** aggregate fields of "codes" */
export type Codes_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Codes_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]>;
};

/** order by aggregate values of table "codes" */
export type Codes_Aggregate_Order_By = {
  avg?: InputMaybe<Codes_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Codes_Max_Order_By>;
  min?: InputMaybe<Codes_Min_Order_By>;
  stddev?: InputMaybe<Codes_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Codes_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Codes_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Codes_Sum_Order_By>;
  var_pop?: InputMaybe<Codes_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Codes_Var_Samp_Order_By>;
  variance?: InputMaybe<Codes_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "codes" */
export type Codes_Arr_Rel_Insert_Input = {
  data: Array<Codes_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Codes_On_Conflict>;
};

/** aggregate avg on columns */
export type Codes_Avg_Fields = {
  __typename?: "codes_avg_fields";
  contract_instantiated?: Maybe<Scalars["Float"]>;
  id?: Maybe<Scalars["Float"]>;
  transaction_id?: Maybe<Scalars["Float"]>;
  uploader?: Maybe<Scalars["Float"]>;
};

/** order by avg() on columns of table "codes" */
export type Codes_Avg_Order_By = {
  contract_instantiated?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  transaction_id?: InputMaybe<Order_By>;
  uploader?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "codes". All fields are combined with a logical 'AND'. */
export type Codes_Bool_Exp = {
  _and?: InputMaybe<Array<Codes_Bool_Exp>>;
  _not?: InputMaybe<Codes_Bool_Exp>;
  _or?: InputMaybe<Array<Codes_Bool_Exp>>;
  access_config_addresses?: InputMaybe<Json_Comparison_Exp>;
  access_config_permission?: InputMaybe<String_Comparison_Exp>;
  account?: InputMaybe<Accounts_Bool_Exp>;
  code_proposals?: InputMaybe<Code_Proposals_Bool_Exp>;
  code_proposals_aggregate?: InputMaybe<Code_Proposals_Aggregate_Bool_Exp>;
  contract_histories?: InputMaybe<Contract_Histories_Bool_Exp>;
  contract_histories_aggregate?: InputMaybe<Contract_Histories_Aggregate_Bool_Exp>;
  contract_instantiated?: InputMaybe<Int_Comparison_Exp>;
  contracts?: InputMaybe<Contracts_Bool_Exp>;
  contracts_aggregate?: InputMaybe<Contracts_Aggregate_Bool_Exp>;
  cw2_contract?: InputMaybe<String_Comparison_Exp>;
  cw2_version?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  transaction?: InputMaybe<Transactions_Bool_Exp>;
  transaction_id?: InputMaybe<Int_Comparison_Exp>;
  uploader?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "codes" */
export enum Codes_Constraint {
  /** unique or primary key constraint on columns "id" */
  CodesPkey = "codes_pkey",
}

/** input type for incrementing numeric columns in table "codes" */
export type Codes_Inc_Input = {
  contract_instantiated?: InputMaybe<Scalars["Int"]>;
  id?: InputMaybe<Scalars["Int"]>;
  transaction_id?: InputMaybe<Scalars["Int"]>;
  uploader?: InputMaybe<Scalars["Int"]>;
};

/** input type for inserting data into table "codes" */
export type Codes_Insert_Input = {
  access_config_addresses?: InputMaybe<Scalars["json"]>;
  access_config_permission?: InputMaybe<Scalars["String"]>;
  account?: InputMaybe<Accounts_Obj_Rel_Insert_Input>;
  code_proposals?: InputMaybe<Code_Proposals_Arr_Rel_Insert_Input>;
  contract_histories?: InputMaybe<Contract_Histories_Arr_Rel_Insert_Input>;
  contract_instantiated?: InputMaybe<Scalars["Int"]>;
  contracts?: InputMaybe<Contracts_Arr_Rel_Insert_Input>;
  cw2_contract?: InputMaybe<Scalars["String"]>;
  cw2_version?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["Int"]>;
  transaction?: InputMaybe<Transactions_Obj_Rel_Insert_Input>;
  transaction_id?: InputMaybe<Scalars["Int"]>;
  uploader?: InputMaybe<Scalars["Int"]>;
};

/** aggregate max on columns */
export type Codes_Max_Fields = {
  __typename?: "codes_max_fields";
  access_config_permission?: Maybe<Scalars["String"]>;
  contract_instantiated?: Maybe<Scalars["Int"]>;
  cw2_contract?: Maybe<Scalars["String"]>;
  cw2_version?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["Int"]>;
  transaction_id?: Maybe<Scalars["Int"]>;
  uploader?: Maybe<Scalars["Int"]>;
};

/** order by max() on columns of table "codes" */
export type Codes_Max_Order_By = {
  access_config_permission?: InputMaybe<Order_By>;
  contract_instantiated?: InputMaybe<Order_By>;
  cw2_contract?: InputMaybe<Order_By>;
  cw2_version?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  transaction_id?: InputMaybe<Order_By>;
  uploader?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Codes_Min_Fields = {
  __typename?: "codes_min_fields";
  access_config_permission?: Maybe<Scalars["String"]>;
  contract_instantiated?: Maybe<Scalars["Int"]>;
  cw2_contract?: Maybe<Scalars["String"]>;
  cw2_version?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["Int"]>;
  transaction_id?: Maybe<Scalars["Int"]>;
  uploader?: Maybe<Scalars["Int"]>;
};

/** order by min() on columns of table "codes" */
export type Codes_Min_Order_By = {
  access_config_permission?: InputMaybe<Order_By>;
  contract_instantiated?: InputMaybe<Order_By>;
  cw2_contract?: InputMaybe<Order_By>;
  cw2_version?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  transaction_id?: InputMaybe<Order_By>;
  uploader?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "codes" */
export type Codes_Mutation_Response = {
  __typename?: "codes_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"];
  /** data from the rows affected by the mutation */
  returning: Array<Codes>;
};

/** input type for inserting object relation for remote table "codes" */
export type Codes_Obj_Rel_Insert_Input = {
  data: Codes_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Codes_On_Conflict>;
};

/** on_conflict condition type for table "codes" */
export type Codes_On_Conflict = {
  constraint: Codes_Constraint;
  update_columns?: Array<Codes_Update_Column>;
  where?: InputMaybe<Codes_Bool_Exp>;
};

/** Ordering options when selecting data from "codes". */
export type Codes_Order_By = {
  access_config_addresses?: InputMaybe<Order_By>;
  access_config_permission?: InputMaybe<Order_By>;
  account?: InputMaybe<Accounts_Order_By>;
  code_proposals_aggregate?: InputMaybe<Code_Proposals_Aggregate_Order_By>;
  contract_histories_aggregate?: InputMaybe<Contract_Histories_Aggregate_Order_By>;
  contract_instantiated?: InputMaybe<Order_By>;
  contracts_aggregate?: InputMaybe<Contracts_Aggregate_Order_By>;
  cw2_contract?: InputMaybe<Order_By>;
  cw2_version?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  transaction?: InputMaybe<Transactions_Order_By>;
  transaction_id?: InputMaybe<Order_By>;
  uploader?: InputMaybe<Order_By>;
};

/** primary key columns input for table: codes */
export type Codes_Pk_Columns_Input = {
  id: Scalars["Int"];
};

/** select columns of table "codes" */
export enum Codes_Select_Column {
  /** column name */
  AccessConfigAddresses = "access_config_addresses",
  /** column name */
  AccessConfigPermission = "access_config_permission",
  /** column name */
  ContractInstantiated = "contract_instantiated",
  /** column name */
  Cw2Contract = "cw2_contract",
  /** column name */
  Cw2Version = "cw2_version",
  /** column name */
  Id = "id",
  /** column name */
  TransactionId = "transaction_id",
  /** column name */
  Uploader = "uploader",
}

/** input type for updating data in table "codes" */
export type Codes_Set_Input = {
  access_config_addresses?: InputMaybe<Scalars["json"]>;
  access_config_permission?: InputMaybe<Scalars["String"]>;
  contract_instantiated?: InputMaybe<Scalars["Int"]>;
  cw2_contract?: InputMaybe<Scalars["String"]>;
  cw2_version?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["Int"]>;
  transaction_id?: InputMaybe<Scalars["Int"]>;
  uploader?: InputMaybe<Scalars["Int"]>;
};

/** aggregate stddev on columns */
export type Codes_Stddev_Fields = {
  __typename?: "codes_stddev_fields";
  contract_instantiated?: Maybe<Scalars["Float"]>;
  id?: Maybe<Scalars["Float"]>;
  transaction_id?: Maybe<Scalars["Float"]>;
  uploader?: Maybe<Scalars["Float"]>;
};

/** order by stddev() on columns of table "codes" */
export type Codes_Stddev_Order_By = {
  contract_instantiated?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  transaction_id?: InputMaybe<Order_By>;
  uploader?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Codes_Stddev_Pop_Fields = {
  __typename?: "codes_stddev_pop_fields";
  contract_instantiated?: Maybe<Scalars["Float"]>;
  id?: Maybe<Scalars["Float"]>;
  transaction_id?: Maybe<Scalars["Float"]>;
  uploader?: Maybe<Scalars["Float"]>;
};

/** order by stddev_pop() on columns of table "codes" */
export type Codes_Stddev_Pop_Order_By = {
  contract_instantiated?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  transaction_id?: InputMaybe<Order_By>;
  uploader?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Codes_Stddev_Samp_Fields = {
  __typename?: "codes_stddev_samp_fields";
  contract_instantiated?: Maybe<Scalars["Float"]>;
  id?: Maybe<Scalars["Float"]>;
  transaction_id?: Maybe<Scalars["Float"]>;
  uploader?: Maybe<Scalars["Float"]>;
};

/** order by stddev_samp() on columns of table "codes" */
export type Codes_Stddev_Samp_Order_By = {
  contract_instantiated?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  transaction_id?: InputMaybe<Order_By>;
  uploader?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "codes" */
export type Codes_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Codes_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Codes_Stream_Cursor_Value_Input = {
  access_config_addresses?: InputMaybe<Scalars["json"]>;
  access_config_permission?: InputMaybe<Scalars["String"]>;
  contract_instantiated?: InputMaybe<Scalars["Int"]>;
  cw2_contract?: InputMaybe<Scalars["String"]>;
  cw2_version?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["Int"]>;
  transaction_id?: InputMaybe<Scalars["Int"]>;
  uploader?: InputMaybe<Scalars["Int"]>;
};

/** aggregate sum on columns */
export type Codes_Sum_Fields = {
  __typename?: "codes_sum_fields";
  contract_instantiated?: Maybe<Scalars["Int"]>;
  id?: Maybe<Scalars["Int"]>;
  transaction_id?: Maybe<Scalars["Int"]>;
  uploader?: Maybe<Scalars["Int"]>;
};

/** order by sum() on columns of table "codes" */
export type Codes_Sum_Order_By = {
  contract_instantiated?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  transaction_id?: InputMaybe<Order_By>;
  uploader?: InputMaybe<Order_By>;
};

/** update columns of table "codes" */
export enum Codes_Update_Column {
  /** column name */
  AccessConfigAddresses = "access_config_addresses",
  /** column name */
  AccessConfigPermission = "access_config_permission",
  /** column name */
  ContractInstantiated = "contract_instantiated",
  /** column name */
  Cw2Contract = "cw2_contract",
  /** column name */
  Cw2Version = "cw2_version",
  /** column name */
  Id = "id",
  /** column name */
  TransactionId = "transaction_id",
  /** column name */
  Uploader = "uploader",
}

export type Codes_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Codes_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Codes_Set_Input>;
  where: Codes_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Codes_Var_Pop_Fields = {
  __typename?: "codes_var_pop_fields";
  contract_instantiated?: Maybe<Scalars["Float"]>;
  id?: Maybe<Scalars["Float"]>;
  transaction_id?: Maybe<Scalars["Float"]>;
  uploader?: Maybe<Scalars["Float"]>;
};

/** order by var_pop() on columns of table "codes" */
export type Codes_Var_Pop_Order_By = {
  contract_instantiated?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  transaction_id?: InputMaybe<Order_By>;
  uploader?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Codes_Var_Samp_Fields = {
  __typename?: "codes_var_samp_fields";
  contract_instantiated?: Maybe<Scalars["Float"]>;
  id?: Maybe<Scalars["Float"]>;
  transaction_id?: Maybe<Scalars["Float"]>;
  uploader?: Maybe<Scalars["Float"]>;
};

/** order by var_samp() on columns of table "codes" */
export type Codes_Var_Samp_Order_By = {
  contract_instantiated?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  transaction_id?: InputMaybe<Order_By>;
  uploader?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Codes_Variance_Fields = {
  __typename?: "codes_variance_fields";
  contract_instantiated?: Maybe<Scalars["Float"]>;
  id?: Maybe<Scalars["Float"]>;
  transaction_id?: Maybe<Scalars["Float"]>;
  uploader?: Maybe<Scalars["Float"]>;
};

/** order by variance() on columns of table "codes" */
export type Codes_Variance_Order_By = {
  contract_instantiated?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  transaction_id?: InputMaybe<Order_By>;
  uploader?: InputMaybe<Order_By>;
};

/** columns and relationships of "contract_histories" */
export type Contract_Histories = {
  __typename?: "contract_histories";
  /** An object relationship */
  account: Accounts;
  /** An object relationship */
  block: Blocks;
  block_height: Scalars["Int"];
  /** An object relationship */
  code: Codes;
  code_id: Scalars["Int"];
  /** An object relationship */
  contract: Contracts;
  contract_id: Scalars["Int"];
  remark: Scalars["json"];
  sender: Scalars["Int"];
};

/** columns and relationships of "contract_histories" */
export type Contract_HistoriesRemarkArgs = {
  path?: InputMaybe<Scalars["String"]>;
};

/** aggregated selection of "contract_histories" */
export type Contract_Histories_Aggregate = {
  __typename?: "contract_histories_aggregate";
  aggregate?: Maybe<Contract_Histories_Aggregate_Fields>;
  nodes: Array<Contract_Histories>;
};

export type Contract_Histories_Aggregate_Bool_Exp = {
  count?: InputMaybe<Contract_Histories_Aggregate_Bool_Exp_Count>;
};

export type Contract_Histories_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Contract_Histories_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]>;
  filter?: InputMaybe<Contract_Histories_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "contract_histories" */
export type Contract_Histories_Aggregate_Fields = {
  __typename?: "contract_histories_aggregate_fields";
  avg?: Maybe<Contract_Histories_Avg_Fields>;
  count: Scalars["Int"];
  max?: Maybe<Contract_Histories_Max_Fields>;
  min?: Maybe<Contract_Histories_Min_Fields>;
  stddev?: Maybe<Contract_Histories_Stddev_Fields>;
  stddev_pop?: Maybe<Contract_Histories_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Contract_Histories_Stddev_Samp_Fields>;
  sum?: Maybe<Contract_Histories_Sum_Fields>;
  var_pop?: Maybe<Contract_Histories_Var_Pop_Fields>;
  var_samp?: Maybe<Contract_Histories_Var_Samp_Fields>;
  variance?: Maybe<Contract_Histories_Variance_Fields>;
};

/** aggregate fields of "contract_histories" */
export type Contract_Histories_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Contract_Histories_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]>;
};

/** order by aggregate values of table "contract_histories" */
export type Contract_Histories_Aggregate_Order_By = {
  avg?: InputMaybe<Contract_Histories_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Contract_Histories_Max_Order_By>;
  min?: InputMaybe<Contract_Histories_Min_Order_By>;
  stddev?: InputMaybe<Contract_Histories_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Contract_Histories_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Contract_Histories_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Contract_Histories_Sum_Order_By>;
  var_pop?: InputMaybe<Contract_Histories_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Contract_Histories_Var_Samp_Order_By>;
  variance?: InputMaybe<Contract_Histories_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "contract_histories" */
export type Contract_Histories_Arr_Rel_Insert_Input = {
  data: Array<Contract_Histories_Insert_Input>;
};

/** aggregate avg on columns */
export type Contract_Histories_Avg_Fields = {
  __typename?: "contract_histories_avg_fields";
  block_height?: Maybe<Scalars["Float"]>;
  code_id?: Maybe<Scalars["Float"]>;
  contract_id?: Maybe<Scalars["Float"]>;
  sender?: Maybe<Scalars["Float"]>;
};

/** order by avg() on columns of table "contract_histories" */
export type Contract_Histories_Avg_Order_By = {
  block_height?: InputMaybe<Order_By>;
  code_id?: InputMaybe<Order_By>;
  contract_id?: InputMaybe<Order_By>;
  sender?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "contract_histories". All fields are combined with a logical 'AND'. */
export type Contract_Histories_Bool_Exp = {
  _and?: InputMaybe<Array<Contract_Histories_Bool_Exp>>;
  _not?: InputMaybe<Contract_Histories_Bool_Exp>;
  _or?: InputMaybe<Array<Contract_Histories_Bool_Exp>>;
  account?: InputMaybe<Accounts_Bool_Exp>;
  block?: InputMaybe<Blocks_Bool_Exp>;
  block_height?: InputMaybe<Int_Comparison_Exp>;
  code?: InputMaybe<Codes_Bool_Exp>;
  code_id?: InputMaybe<Int_Comparison_Exp>;
  contract?: InputMaybe<Contracts_Bool_Exp>;
  contract_id?: InputMaybe<Int_Comparison_Exp>;
  remark?: InputMaybe<Json_Comparison_Exp>;
  sender?: InputMaybe<Int_Comparison_Exp>;
};

/** input type for incrementing numeric columns in table "contract_histories" */
export type Contract_Histories_Inc_Input = {
  block_height?: InputMaybe<Scalars["Int"]>;
  code_id?: InputMaybe<Scalars["Int"]>;
  contract_id?: InputMaybe<Scalars["Int"]>;
  sender?: InputMaybe<Scalars["Int"]>;
};

/** input type for inserting data into table "contract_histories" */
export type Contract_Histories_Insert_Input = {
  account?: InputMaybe<Accounts_Obj_Rel_Insert_Input>;
  block?: InputMaybe<Blocks_Obj_Rel_Insert_Input>;
  block_height?: InputMaybe<Scalars["Int"]>;
  code?: InputMaybe<Codes_Obj_Rel_Insert_Input>;
  code_id?: InputMaybe<Scalars["Int"]>;
  contract?: InputMaybe<Contracts_Obj_Rel_Insert_Input>;
  contract_id?: InputMaybe<Scalars["Int"]>;
  remark?: InputMaybe<Scalars["json"]>;
  sender?: InputMaybe<Scalars["Int"]>;
};

/** aggregate max on columns */
export type Contract_Histories_Max_Fields = {
  __typename?: "contract_histories_max_fields";
  block_height?: Maybe<Scalars["Int"]>;
  code_id?: Maybe<Scalars["Int"]>;
  contract_id?: Maybe<Scalars["Int"]>;
  sender?: Maybe<Scalars["Int"]>;
};

/** order by max() on columns of table "contract_histories" */
export type Contract_Histories_Max_Order_By = {
  block_height?: InputMaybe<Order_By>;
  code_id?: InputMaybe<Order_By>;
  contract_id?: InputMaybe<Order_By>;
  sender?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Contract_Histories_Min_Fields = {
  __typename?: "contract_histories_min_fields";
  block_height?: Maybe<Scalars["Int"]>;
  code_id?: Maybe<Scalars["Int"]>;
  contract_id?: Maybe<Scalars["Int"]>;
  sender?: Maybe<Scalars["Int"]>;
};

/** order by min() on columns of table "contract_histories" */
export type Contract_Histories_Min_Order_By = {
  block_height?: InputMaybe<Order_By>;
  code_id?: InputMaybe<Order_By>;
  contract_id?: InputMaybe<Order_By>;
  sender?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "contract_histories" */
export type Contract_Histories_Mutation_Response = {
  __typename?: "contract_histories_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"];
  /** data from the rows affected by the mutation */
  returning: Array<Contract_Histories>;
};

/** Ordering options when selecting data from "contract_histories". */
export type Contract_Histories_Order_By = {
  account?: InputMaybe<Accounts_Order_By>;
  block?: InputMaybe<Blocks_Order_By>;
  block_height?: InputMaybe<Order_By>;
  code?: InputMaybe<Codes_Order_By>;
  code_id?: InputMaybe<Order_By>;
  contract?: InputMaybe<Contracts_Order_By>;
  contract_id?: InputMaybe<Order_By>;
  remark?: InputMaybe<Order_By>;
  sender?: InputMaybe<Order_By>;
};

/** select columns of table "contract_histories" */
export enum Contract_Histories_Select_Column {
  /** column name */
  BlockHeight = "block_height",
  /** column name */
  CodeId = "code_id",
  /** column name */
  ContractId = "contract_id",
  /** column name */
  Remark = "remark",
  /** column name */
  Sender = "sender",
}

/** input type for updating data in table "contract_histories" */
export type Contract_Histories_Set_Input = {
  block_height?: InputMaybe<Scalars["Int"]>;
  code_id?: InputMaybe<Scalars["Int"]>;
  contract_id?: InputMaybe<Scalars["Int"]>;
  remark?: InputMaybe<Scalars["json"]>;
  sender?: InputMaybe<Scalars["Int"]>;
};

/** aggregate stddev on columns */
export type Contract_Histories_Stddev_Fields = {
  __typename?: "contract_histories_stddev_fields";
  block_height?: Maybe<Scalars["Float"]>;
  code_id?: Maybe<Scalars["Float"]>;
  contract_id?: Maybe<Scalars["Float"]>;
  sender?: Maybe<Scalars["Float"]>;
};

/** order by stddev() on columns of table "contract_histories" */
export type Contract_Histories_Stddev_Order_By = {
  block_height?: InputMaybe<Order_By>;
  code_id?: InputMaybe<Order_By>;
  contract_id?: InputMaybe<Order_By>;
  sender?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Contract_Histories_Stddev_Pop_Fields = {
  __typename?: "contract_histories_stddev_pop_fields";
  block_height?: Maybe<Scalars["Float"]>;
  code_id?: Maybe<Scalars["Float"]>;
  contract_id?: Maybe<Scalars["Float"]>;
  sender?: Maybe<Scalars["Float"]>;
};

/** order by stddev_pop() on columns of table "contract_histories" */
export type Contract_Histories_Stddev_Pop_Order_By = {
  block_height?: InputMaybe<Order_By>;
  code_id?: InputMaybe<Order_By>;
  contract_id?: InputMaybe<Order_By>;
  sender?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Contract_Histories_Stddev_Samp_Fields = {
  __typename?: "contract_histories_stddev_samp_fields";
  block_height?: Maybe<Scalars["Float"]>;
  code_id?: Maybe<Scalars["Float"]>;
  contract_id?: Maybe<Scalars["Float"]>;
  sender?: Maybe<Scalars["Float"]>;
};

/** order by stddev_samp() on columns of table "contract_histories" */
export type Contract_Histories_Stddev_Samp_Order_By = {
  block_height?: InputMaybe<Order_By>;
  code_id?: InputMaybe<Order_By>;
  contract_id?: InputMaybe<Order_By>;
  sender?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "contract_histories" */
export type Contract_Histories_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Contract_Histories_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Contract_Histories_Stream_Cursor_Value_Input = {
  block_height?: InputMaybe<Scalars["Int"]>;
  code_id?: InputMaybe<Scalars["Int"]>;
  contract_id?: InputMaybe<Scalars["Int"]>;
  remark?: InputMaybe<Scalars["json"]>;
  sender?: InputMaybe<Scalars["Int"]>;
};

/** aggregate sum on columns */
export type Contract_Histories_Sum_Fields = {
  __typename?: "contract_histories_sum_fields";
  block_height?: Maybe<Scalars["Int"]>;
  code_id?: Maybe<Scalars["Int"]>;
  contract_id?: Maybe<Scalars["Int"]>;
  sender?: Maybe<Scalars["Int"]>;
};

/** order by sum() on columns of table "contract_histories" */
export type Contract_Histories_Sum_Order_By = {
  block_height?: InputMaybe<Order_By>;
  code_id?: InputMaybe<Order_By>;
  contract_id?: InputMaybe<Order_By>;
  sender?: InputMaybe<Order_By>;
};

export type Contract_Histories_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Contract_Histories_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Contract_Histories_Set_Input>;
  where: Contract_Histories_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Contract_Histories_Var_Pop_Fields = {
  __typename?: "contract_histories_var_pop_fields";
  block_height?: Maybe<Scalars["Float"]>;
  code_id?: Maybe<Scalars["Float"]>;
  contract_id?: Maybe<Scalars["Float"]>;
  sender?: Maybe<Scalars["Float"]>;
};

/** order by var_pop() on columns of table "contract_histories" */
export type Contract_Histories_Var_Pop_Order_By = {
  block_height?: InputMaybe<Order_By>;
  code_id?: InputMaybe<Order_By>;
  contract_id?: InputMaybe<Order_By>;
  sender?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Contract_Histories_Var_Samp_Fields = {
  __typename?: "contract_histories_var_samp_fields";
  block_height?: Maybe<Scalars["Float"]>;
  code_id?: Maybe<Scalars["Float"]>;
  contract_id?: Maybe<Scalars["Float"]>;
  sender?: Maybe<Scalars["Float"]>;
};

/** order by var_samp() on columns of table "contract_histories" */
export type Contract_Histories_Var_Samp_Order_By = {
  block_height?: InputMaybe<Order_By>;
  code_id?: InputMaybe<Order_By>;
  contract_id?: InputMaybe<Order_By>;
  sender?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Contract_Histories_Variance_Fields = {
  __typename?: "contract_histories_variance_fields";
  block_height?: Maybe<Scalars["Float"]>;
  code_id?: Maybe<Scalars["Float"]>;
  contract_id?: Maybe<Scalars["Float"]>;
  sender?: Maybe<Scalars["Float"]>;
};

/** order by variance() on columns of table "contract_histories" */
export type Contract_Histories_Variance_Order_By = {
  block_height?: InputMaybe<Order_By>;
  code_id?: InputMaybe<Order_By>;
  contract_id?: InputMaybe<Order_By>;
  sender?: InputMaybe<Order_By>;
};

/** columns and relationships of "contract_proposals" */
export type Contract_Proposals = {
  __typename?: "contract_proposals";
  /** An object relationship */
  block?: Maybe<Blocks>;
  /** An object relationship */
  contract: Contracts;
  contract_id: Scalars["Int"];
  /** An object relationship */
  proposal: Proposals;
  proposal_id: Scalars["Int"];
  resolved_height?: Maybe<Scalars["Int"]>;
};

/** aggregated selection of "contract_proposals" */
export type Contract_Proposals_Aggregate = {
  __typename?: "contract_proposals_aggregate";
  aggregate?: Maybe<Contract_Proposals_Aggregate_Fields>;
  nodes: Array<Contract_Proposals>;
};

export type Contract_Proposals_Aggregate_Bool_Exp = {
  count?: InputMaybe<Contract_Proposals_Aggregate_Bool_Exp_Count>;
};

export type Contract_Proposals_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Contract_Proposals_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]>;
  filter?: InputMaybe<Contract_Proposals_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "contract_proposals" */
export type Contract_Proposals_Aggregate_Fields = {
  __typename?: "contract_proposals_aggregate_fields";
  avg?: Maybe<Contract_Proposals_Avg_Fields>;
  count: Scalars["Int"];
  max?: Maybe<Contract_Proposals_Max_Fields>;
  min?: Maybe<Contract_Proposals_Min_Fields>;
  stddev?: Maybe<Contract_Proposals_Stddev_Fields>;
  stddev_pop?: Maybe<Contract_Proposals_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Contract_Proposals_Stddev_Samp_Fields>;
  sum?: Maybe<Contract_Proposals_Sum_Fields>;
  var_pop?: Maybe<Contract_Proposals_Var_Pop_Fields>;
  var_samp?: Maybe<Contract_Proposals_Var_Samp_Fields>;
  variance?: Maybe<Contract_Proposals_Variance_Fields>;
};

/** aggregate fields of "contract_proposals" */
export type Contract_Proposals_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Contract_Proposals_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]>;
};

/** order by aggregate values of table "contract_proposals" */
export type Contract_Proposals_Aggregate_Order_By = {
  avg?: InputMaybe<Contract_Proposals_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Contract_Proposals_Max_Order_By>;
  min?: InputMaybe<Contract_Proposals_Min_Order_By>;
  stddev?: InputMaybe<Contract_Proposals_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Contract_Proposals_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Contract_Proposals_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Contract_Proposals_Sum_Order_By>;
  var_pop?: InputMaybe<Contract_Proposals_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Contract_Proposals_Var_Samp_Order_By>;
  variance?: InputMaybe<Contract_Proposals_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "contract_proposals" */
export type Contract_Proposals_Arr_Rel_Insert_Input = {
  data: Array<Contract_Proposals_Insert_Input>;
};

/** aggregate avg on columns */
export type Contract_Proposals_Avg_Fields = {
  __typename?: "contract_proposals_avg_fields";
  contract_id?: Maybe<Scalars["Float"]>;
  proposal_id?: Maybe<Scalars["Float"]>;
  resolved_height?: Maybe<Scalars["Float"]>;
};

/** order by avg() on columns of table "contract_proposals" */
export type Contract_Proposals_Avg_Order_By = {
  contract_id?: InputMaybe<Order_By>;
  proposal_id?: InputMaybe<Order_By>;
  resolved_height?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "contract_proposals". All fields are combined with a logical 'AND'. */
export type Contract_Proposals_Bool_Exp = {
  _and?: InputMaybe<Array<Contract_Proposals_Bool_Exp>>;
  _not?: InputMaybe<Contract_Proposals_Bool_Exp>;
  _or?: InputMaybe<Array<Contract_Proposals_Bool_Exp>>;
  block?: InputMaybe<Blocks_Bool_Exp>;
  contract?: InputMaybe<Contracts_Bool_Exp>;
  contract_id?: InputMaybe<Int_Comparison_Exp>;
  proposal?: InputMaybe<Proposals_Bool_Exp>;
  proposal_id?: InputMaybe<Int_Comparison_Exp>;
  resolved_height?: InputMaybe<Int_Comparison_Exp>;
};

/** input type for incrementing numeric columns in table "contract_proposals" */
export type Contract_Proposals_Inc_Input = {
  contract_id?: InputMaybe<Scalars["Int"]>;
  proposal_id?: InputMaybe<Scalars["Int"]>;
  resolved_height?: InputMaybe<Scalars["Int"]>;
};

/** input type for inserting data into table "contract_proposals" */
export type Contract_Proposals_Insert_Input = {
  block?: InputMaybe<Blocks_Obj_Rel_Insert_Input>;
  contract?: InputMaybe<Contracts_Obj_Rel_Insert_Input>;
  contract_id?: InputMaybe<Scalars["Int"]>;
  proposal?: InputMaybe<Proposals_Obj_Rel_Insert_Input>;
  proposal_id?: InputMaybe<Scalars["Int"]>;
  resolved_height?: InputMaybe<Scalars["Int"]>;
};

/** aggregate max on columns */
export type Contract_Proposals_Max_Fields = {
  __typename?: "contract_proposals_max_fields";
  contract_id?: Maybe<Scalars["Int"]>;
  proposal_id?: Maybe<Scalars["Int"]>;
  resolved_height?: Maybe<Scalars["Int"]>;
};

/** order by max() on columns of table "contract_proposals" */
export type Contract_Proposals_Max_Order_By = {
  contract_id?: InputMaybe<Order_By>;
  proposal_id?: InputMaybe<Order_By>;
  resolved_height?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Contract_Proposals_Min_Fields = {
  __typename?: "contract_proposals_min_fields";
  contract_id?: Maybe<Scalars["Int"]>;
  proposal_id?: Maybe<Scalars["Int"]>;
  resolved_height?: Maybe<Scalars["Int"]>;
};

/** order by min() on columns of table "contract_proposals" */
export type Contract_Proposals_Min_Order_By = {
  contract_id?: InputMaybe<Order_By>;
  proposal_id?: InputMaybe<Order_By>;
  resolved_height?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "contract_proposals" */
export type Contract_Proposals_Mutation_Response = {
  __typename?: "contract_proposals_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"];
  /** data from the rows affected by the mutation */
  returning: Array<Contract_Proposals>;
};

/** Ordering options when selecting data from "contract_proposals". */
export type Contract_Proposals_Order_By = {
  block?: InputMaybe<Blocks_Order_By>;
  contract?: InputMaybe<Contracts_Order_By>;
  contract_id?: InputMaybe<Order_By>;
  proposal?: InputMaybe<Proposals_Order_By>;
  proposal_id?: InputMaybe<Order_By>;
  resolved_height?: InputMaybe<Order_By>;
};

/** select columns of table "contract_proposals" */
export enum Contract_Proposals_Select_Column {
  /** column name */
  ContractId = "contract_id",
  /** column name */
  ProposalId = "proposal_id",
  /** column name */
  ResolvedHeight = "resolved_height",
}

/** input type for updating data in table "contract_proposals" */
export type Contract_Proposals_Set_Input = {
  contract_id?: InputMaybe<Scalars["Int"]>;
  proposal_id?: InputMaybe<Scalars["Int"]>;
  resolved_height?: InputMaybe<Scalars["Int"]>;
};

/** aggregate stddev on columns */
export type Contract_Proposals_Stddev_Fields = {
  __typename?: "contract_proposals_stddev_fields";
  contract_id?: Maybe<Scalars["Float"]>;
  proposal_id?: Maybe<Scalars["Float"]>;
  resolved_height?: Maybe<Scalars["Float"]>;
};

/** order by stddev() on columns of table "contract_proposals" */
export type Contract_Proposals_Stddev_Order_By = {
  contract_id?: InputMaybe<Order_By>;
  proposal_id?: InputMaybe<Order_By>;
  resolved_height?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Contract_Proposals_Stddev_Pop_Fields = {
  __typename?: "contract_proposals_stddev_pop_fields";
  contract_id?: Maybe<Scalars["Float"]>;
  proposal_id?: Maybe<Scalars["Float"]>;
  resolved_height?: Maybe<Scalars["Float"]>;
};

/** order by stddev_pop() on columns of table "contract_proposals" */
export type Contract_Proposals_Stddev_Pop_Order_By = {
  contract_id?: InputMaybe<Order_By>;
  proposal_id?: InputMaybe<Order_By>;
  resolved_height?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Contract_Proposals_Stddev_Samp_Fields = {
  __typename?: "contract_proposals_stddev_samp_fields";
  contract_id?: Maybe<Scalars["Float"]>;
  proposal_id?: Maybe<Scalars["Float"]>;
  resolved_height?: Maybe<Scalars["Float"]>;
};

/** order by stddev_samp() on columns of table "contract_proposals" */
export type Contract_Proposals_Stddev_Samp_Order_By = {
  contract_id?: InputMaybe<Order_By>;
  proposal_id?: InputMaybe<Order_By>;
  resolved_height?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "contract_proposals" */
export type Contract_Proposals_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Contract_Proposals_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Contract_Proposals_Stream_Cursor_Value_Input = {
  contract_id?: InputMaybe<Scalars["Int"]>;
  proposal_id?: InputMaybe<Scalars["Int"]>;
  resolved_height?: InputMaybe<Scalars["Int"]>;
};

/** aggregate sum on columns */
export type Contract_Proposals_Sum_Fields = {
  __typename?: "contract_proposals_sum_fields";
  contract_id?: Maybe<Scalars["Int"]>;
  proposal_id?: Maybe<Scalars["Int"]>;
  resolved_height?: Maybe<Scalars["Int"]>;
};

/** order by sum() on columns of table "contract_proposals" */
export type Contract_Proposals_Sum_Order_By = {
  contract_id?: InputMaybe<Order_By>;
  proposal_id?: InputMaybe<Order_By>;
  resolved_height?: InputMaybe<Order_By>;
};

export type Contract_Proposals_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Contract_Proposals_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Contract_Proposals_Set_Input>;
  where: Contract_Proposals_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Contract_Proposals_Var_Pop_Fields = {
  __typename?: "contract_proposals_var_pop_fields";
  contract_id?: Maybe<Scalars["Float"]>;
  proposal_id?: Maybe<Scalars["Float"]>;
  resolved_height?: Maybe<Scalars["Float"]>;
};

/** order by var_pop() on columns of table "contract_proposals" */
export type Contract_Proposals_Var_Pop_Order_By = {
  contract_id?: InputMaybe<Order_By>;
  proposal_id?: InputMaybe<Order_By>;
  resolved_height?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Contract_Proposals_Var_Samp_Fields = {
  __typename?: "contract_proposals_var_samp_fields";
  contract_id?: Maybe<Scalars["Float"]>;
  proposal_id?: Maybe<Scalars["Float"]>;
  resolved_height?: Maybe<Scalars["Float"]>;
};

/** order by var_samp() on columns of table "contract_proposals" */
export type Contract_Proposals_Var_Samp_Order_By = {
  contract_id?: InputMaybe<Order_By>;
  proposal_id?: InputMaybe<Order_By>;
  resolved_height?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Contract_Proposals_Variance_Fields = {
  __typename?: "contract_proposals_variance_fields";
  contract_id?: Maybe<Scalars["Float"]>;
  proposal_id?: Maybe<Scalars["Float"]>;
  resolved_height?: Maybe<Scalars["Float"]>;
};

/** order by variance() on columns of table "contract_proposals" */
export type Contract_Proposals_Variance_Order_By = {
  contract_id?: InputMaybe<Order_By>;
  proposal_id?: InputMaybe<Order_By>;
  resolved_height?: InputMaybe<Order_By>;
};

/** columns and relationships of "contract_transactions" */
export type Contract_Transactions = {
  __typename?: "contract_transactions";
  /** An object relationship */
  contract: Contracts;
  contract_id: Scalars["Int"];
  /** An object relationship */
  transaction: Transactions;
  tx_id: Scalars["Int"];
};

/** aggregated selection of "contract_transactions" */
export type Contract_Transactions_Aggregate = {
  __typename?: "contract_transactions_aggregate";
  aggregate?: Maybe<Contract_Transactions_Aggregate_Fields>;
  nodes: Array<Contract_Transactions>;
};

export type Contract_Transactions_Aggregate_Bool_Exp = {
  count?: InputMaybe<Contract_Transactions_Aggregate_Bool_Exp_Count>;
};

export type Contract_Transactions_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Contract_Transactions_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]>;
  filter?: InputMaybe<Contract_Transactions_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "contract_transactions" */
export type Contract_Transactions_Aggregate_Fields = {
  __typename?: "contract_transactions_aggregate_fields";
  avg?: Maybe<Contract_Transactions_Avg_Fields>;
  count: Scalars["Int"];
  max?: Maybe<Contract_Transactions_Max_Fields>;
  min?: Maybe<Contract_Transactions_Min_Fields>;
  stddev?: Maybe<Contract_Transactions_Stddev_Fields>;
  stddev_pop?: Maybe<Contract_Transactions_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Contract_Transactions_Stddev_Samp_Fields>;
  sum?: Maybe<Contract_Transactions_Sum_Fields>;
  var_pop?: Maybe<Contract_Transactions_Var_Pop_Fields>;
  var_samp?: Maybe<Contract_Transactions_Var_Samp_Fields>;
  variance?: Maybe<Contract_Transactions_Variance_Fields>;
};

/** aggregate fields of "contract_transactions" */
export type Contract_Transactions_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Contract_Transactions_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]>;
};

/** order by aggregate values of table "contract_transactions" */
export type Contract_Transactions_Aggregate_Order_By = {
  avg?: InputMaybe<Contract_Transactions_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Contract_Transactions_Max_Order_By>;
  min?: InputMaybe<Contract_Transactions_Min_Order_By>;
  stddev?: InputMaybe<Contract_Transactions_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Contract_Transactions_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Contract_Transactions_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Contract_Transactions_Sum_Order_By>;
  var_pop?: InputMaybe<Contract_Transactions_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Contract_Transactions_Var_Samp_Order_By>;
  variance?: InputMaybe<Contract_Transactions_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "contract_transactions" */
export type Contract_Transactions_Arr_Rel_Insert_Input = {
  data: Array<Contract_Transactions_Insert_Input>;
};

/** aggregate avg on columns */
export type Contract_Transactions_Avg_Fields = {
  __typename?: "contract_transactions_avg_fields";
  contract_id?: Maybe<Scalars["Float"]>;
  tx_id?: Maybe<Scalars["Float"]>;
};

/** order by avg() on columns of table "contract_transactions" */
export type Contract_Transactions_Avg_Order_By = {
  contract_id?: InputMaybe<Order_By>;
  tx_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "contract_transactions". All fields are combined with a logical 'AND'. */
export type Contract_Transactions_Bool_Exp = {
  _and?: InputMaybe<Array<Contract_Transactions_Bool_Exp>>;
  _not?: InputMaybe<Contract_Transactions_Bool_Exp>;
  _or?: InputMaybe<Array<Contract_Transactions_Bool_Exp>>;
  contract?: InputMaybe<Contracts_Bool_Exp>;
  contract_id?: InputMaybe<Int_Comparison_Exp>;
  transaction?: InputMaybe<Transactions_Bool_Exp>;
  tx_id?: InputMaybe<Int_Comparison_Exp>;
};

/** input type for incrementing numeric columns in table "contract_transactions" */
export type Contract_Transactions_Inc_Input = {
  contract_id?: InputMaybe<Scalars["Int"]>;
  tx_id?: InputMaybe<Scalars["Int"]>;
};

/** input type for inserting data into table "contract_transactions" */
export type Contract_Transactions_Insert_Input = {
  contract?: InputMaybe<Contracts_Obj_Rel_Insert_Input>;
  contract_id?: InputMaybe<Scalars["Int"]>;
  transaction?: InputMaybe<Transactions_Obj_Rel_Insert_Input>;
  tx_id?: InputMaybe<Scalars["Int"]>;
};

/** columns and relationships of "contract_transactions_ja" */
export type Contract_Transactions_Ja = {
  __typename?: "contract_transactions_ja";
  contract_address?: Maybe<Scalars["String"]>;
  hash?: Maybe<Scalars["bytea"]>;
  height?: Maybe<Scalars["Int"]>;
  is_clear_admin?: Maybe<Scalars["Boolean"]>;
  is_execute?: Maybe<Scalars["Boolean"]>;
  is_ibc?: Maybe<Scalars["Boolean"]>;
  is_instantiate?: Maybe<Scalars["Boolean"]>;
  is_migrate?: Maybe<Scalars["Boolean"]>;
  is_send?: Maybe<Scalars["Boolean"]>;
  is_store_code?: Maybe<Scalars["Boolean"]>;
  is_update_admin?: Maybe<Scalars["Boolean"]>;
  messages?: Maybe<Scalars["json"]>;
  sender?: Maybe<Scalars["String"]>;
  success?: Maybe<Scalars["Boolean"]>;
  timestamp?: Maybe<Scalars["timestamp"]>;
};

/** columns and relationships of "contract_transactions_ja" */
export type Contract_Transactions_JaMessagesArgs = {
  path?: InputMaybe<Scalars["String"]>;
};

/** aggregated selection of "contract_transactions_ja" */
export type Contract_Transactions_Ja_Aggregate = {
  __typename?: "contract_transactions_ja_aggregate";
  aggregate?: Maybe<Contract_Transactions_Ja_Aggregate_Fields>;
  nodes: Array<Contract_Transactions_Ja>;
};

/** aggregate fields of "contract_transactions_ja" */
export type Contract_Transactions_Ja_Aggregate_Fields = {
  __typename?: "contract_transactions_ja_aggregate_fields";
  avg?: Maybe<Contract_Transactions_Ja_Avg_Fields>;
  count: Scalars["Int"];
  max?: Maybe<Contract_Transactions_Ja_Max_Fields>;
  min?: Maybe<Contract_Transactions_Ja_Min_Fields>;
  stddev?: Maybe<Contract_Transactions_Ja_Stddev_Fields>;
  stddev_pop?: Maybe<Contract_Transactions_Ja_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Contract_Transactions_Ja_Stddev_Samp_Fields>;
  sum?: Maybe<Contract_Transactions_Ja_Sum_Fields>;
  var_pop?: Maybe<Contract_Transactions_Ja_Var_Pop_Fields>;
  var_samp?: Maybe<Contract_Transactions_Ja_Var_Samp_Fields>;
  variance?: Maybe<Contract_Transactions_Ja_Variance_Fields>;
};

/** aggregate fields of "contract_transactions_ja" */
export type Contract_Transactions_Ja_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Contract_Transactions_Ja_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]>;
};

/** aggregate avg on columns */
export type Contract_Transactions_Ja_Avg_Fields = {
  __typename?: "contract_transactions_ja_avg_fields";
  height?: Maybe<Scalars["Float"]>;
};

/** Boolean expression to filter rows from the table "contract_transactions_ja". All fields are combined with a logical 'AND'. */
export type Contract_Transactions_Ja_Bool_Exp = {
  _and?: InputMaybe<Array<Contract_Transactions_Ja_Bool_Exp>>;
  _not?: InputMaybe<Contract_Transactions_Ja_Bool_Exp>;
  _or?: InputMaybe<Array<Contract_Transactions_Ja_Bool_Exp>>;
  contract_address?: InputMaybe<String_Comparison_Exp>;
  hash?: InputMaybe<Bytea_Comparison_Exp>;
  height?: InputMaybe<Int_Comparison_Exp>;
  is_clear_admin?: InputMaybe<Boolean_Comparison_Exp>;
  is_execute?: InputMaybe<Boolean_Comparison_Exp>;
  is_ibc?: InputMaybe<Boolean_Comparison_Exp>;
  is_instantiate?: InputMaybe<Boolean_Comparison_Exp>;
  is_migrate?: InputMaybe<Boolean_Comparison_Exp>;
  is_send?: InputMaybe<Boolean_Comparison_Exp>;
  is_store_code?: InputMaybe<Boolean_Comparison_Exp>;
  is_update_admin?: InputMaybe<Boolean_Comparison_Exp>;
  messages?: InputMaybe<Json_Comparison_Exp>;
  sender?: InputMaybe<String_Comparison_Exp>;
  success?: InputMaybe<Boolean_Comparison_Exp>;
  timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
};

/** aggregate max on columns */
export type Contract_Transactions_Ja_Max_Fields = {
  __typename?: "contract_transactions_ja_max_fields";
  contract_address?: Maybe<Scalars["String"]>;
  height?: Maybe<Scalars["Int"]>;
  sender?: Maybe<Scalars["String"]>;
  timestamp?: Maybe<Scalars["timestamp"]>;
};

/** aggregate min on columns */
export type Contract_Transactions_Ja_Min_Fields = {
  __typename?: "contract_transactions_ja_min_fields";
  contract_address?: Maybe<Scalars["String"]>;
  height?: Maybe<Scalars["Int"]>;
  sender?: Maybe<Scalars["String"]>;
  timestamp?: Maybe<Scalars["timestamp"]>;
};

/** Ordering options when selecting data from "contract_transactions_ja". */
export type Contract_Transactions_Ja_Order_By = {
  contract_address?: InputMaybe<Order_By>;
  hash?: InputMaybe<Order_By>;
  height?: InputMaybe<Order_By>;
  is_clear_admin?: InputMaybe<Order_By>;
  is_execute?: InputMaybe<Order_By>;
  is_ibc?: InputMaybe<Order_By>;
  is_instantiate?: InputMaybe<Order_By>;
  is_migrate?: InputMaybe<Order_By>;
  is_send?: InputMaybe<Order_By>;
  is_store_code?: InputMaybe<Order_By>;
  is_update_admin?: InputMaybe<Order_By>;
  messages?: InputMaybe<Order_By>;
  sender?: InputMaybe<Order_By>;
  success?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
};

/** select columns of table "contract_transactions_ja" */
export enum Contract_Transactions_Ja_Select_Column {
  /** column name */
  ContractAddress = "contract_address",
  /** column name */
  Hash = "hash",
  /** column name */
  Height = "height",
  /** column name */
  IsClearAdmin = "is_clear_admin",
  /** column name */
  IsExecute = "is_execute",
  /** column name */
  IsIbc = "is_ibc",
  /** column name */
  IsInstantiate = "is_instantiate",
  /** column name */
  IsMigrate = "is_migrate",
  /** column name */
  IsSend = "is_send",
  /** column name */
  IsStoreCode = "is_store_code",
  /** column name */
  IsUpdateAdmin = "is_update_admin",
  /** column name */
  Messages = "messages",
  /** column name */
  Sender = "sender",
  /** column name */
  Success = "success",
  /** column name */
  Timestamp = "timestamp",
}

/** aggregate stddev on columns */
export type Contract_Transactions_Ja_Stddev_Fields = {
  __typename?: "contract_transactions_ja_stddev_fields";
  height?: Maybe<Scalars["Float"]>;
};

/** aggregate stddev_pop on columns */
export type Contract_Transactions_Ja_Stddev_Pop_Fields = {
  __typename?: "contract_transactions_ja_stddev_pop_fields";
  height?: Maybe<Scalars["Float"]>;
};

/** aggregate stddev_samp on columns */
export type Contract_Transactions_Ja_Stddev_Samp_Fields = {
  __typename?: "contract_transactions_ja_stddev_samp_fields";
  height?: Maybe<Scalars["Float"]>;
};

/** Streaming cursor of the table "contract_transactions_ja" */
export type Contract_Transactions_Ja_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Contract_Transactions_Ja_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Contract_Transactions_Ja_Stream_Cursor_Value_Input = {
  contract_address?: InputMaybe<Scalars["String"]>;
  hash?: InputMaybe<Scalars["bytea"]>;
  height?: InputMaybe<Scalars["Int"]>;
  is_clear_admin?: InputMaybe<Scalars["Boolean"]>;
  is_execute?: InputMaybe<Scalars["Boolean"]>;
  is_ibc?: InputMaybe<Scalars["Boolean"]>;
  is_instantiate?: InputMaybe<Scalars["Boolean"]>;
  is_migrate?: InputMaybe<Scalars["Boolean"]>;
  is_send?: InputMaybe<Scalars["Boolean"]>;
  is_store_code?: InputMaybe<Scalars["Boolean"]>;
  is_update_admin?: InputMaybe<Scalars["Boolean"]>;
  messages?: InputMaybe<Scalars["json"]>;
  sender?: InputMaybe<Scalars["String"]>;
  success?: InputMaybe<Scalars["Boolean"]>;
  timestamp?: InputMaybe<Scalars["timestamp"]>;
};

/** aggregate sum on columns */
export type Contract_Transactions_Ja_Sum_Fields = {
  __typename?: "contract_transactions_ja_sum_fields";
  height?: Maybe<Scalars["Int"]>;
};

/** aggregate var_pop on columns */
export type Contract_Transactions_Ja_Var_Pop_Fields = {
  __typename?: "contract_transactions_ja_var_pop_fields";
  height?: Maybe<Scalars["Float"]>;
};

/** aggregate var_samp on columns */
export type Contract_Transactions_Ja_Var_Samp_Fields = {
  __typename?: "contract_transactions_ja_var_samp_fields";
  height?: Maybe<Scalars["Float"]>;
};

/** aggregate variance on columns */
export type Contract_Transactions_Ja_Variance_Fields = {
  __typename?: "contract_transactions_ja_variance_fields";
  height?: Maybe<Scalars["Float"]>;
};

/** aggregate max on columns */
export type Contract_Transactions_Max_Fields = {
  __typename?: "contract_transactions_max_fields";
  contract_id?: Maybe<Scalars["Int"]>;
  tx_id?: Maybe<Scalars["Int"]>;
};

/** order by max() on columns of table "contract_transactions" */
export type Contract_Transactions_Max_Order_By = {
  contract_id?: InputMaybe<Order_By>;
  tx_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Contract_Transactions_Min_Fields = {
  __typename?: "contract_transactions_min_fields";
  contract_id?: Maybe<Scalars["Int"]>;
  tx_id?: Maybe<Scalars["Int"]>;
};

/** order by min() on columns of table "contract_transactions" */
export type Contract_Transactions_Min_Order_By = {
  contract_id?: InputMaybe<Order_By>;
  tx_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "contract_transactions" */
export type Contract_Transactions_Mutation_Response = {
  __typename?: "contract_transactions_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"];
  /** data from the rows affected by the mutation */
  returning: Array<Contract_Transactions>;
};

/** Ordering options when selecting data from "contract_transactions". */
export type Contract_Transactions_Order_By = {
  contract?: InputMaybe<Contracts_Order_By>;
  contract_id?: InputMaybe<Order_By>;
  transaction?: InputMaybe<Transactions_Order_By>;
  tx_id?: InputMaybe<Order_By>;
};

/** select columns of table "contract_transactions" */
export enum Contract_Transactions_Select_Column {
  /** column name */
  ContractId = "contract_id",
  /** column name */
  TxId = "tx_id",
}

/** input type for updating data in table "contract_transactions" */
export type Contract_Transactions_Set_Input = {
  contract_id?: InputMaybe<Scalars["Int"]>;
  tx_id?: InputMaybe<Scalars["Int"]>;
};

/** aggregate stddev on columns */
export type Contract_Transactions_Stddev_Fields = {
  __typename?: "contract_transactions_stddev_fields";
  contract_id?: Maybe<Scalars["Float"]>;
  tx_id?: Maybe<Scalars["Float"]>;
};

/** order by stddev() on columns of table "contract_transactions" */
export type Contract_Transactions_Stddev_Order_By = {
  contract_id?: InputMaybe<Order_By>;
  tx_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Contract_Transactions_Stddev_Pop_Fields = {
  __typename?: "contract_transactions_stddev_pop_fields";
  contract_id?: Maybe<Scalars["Float"]>;
  tx_id?: Maybe<Scalars["Float"]>;
};

/** order by stddev_pop() on columns of table "contract_transactions" */
export type Contract_Transactions_Stddev_Pop_Order_By = {
  contract_id?: InputMaybe<Order_By>;
  tx_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Contract_Transactions_Stddev_Samp_Fields = {
  __typename?: "contract_transactions_stddev_samp_fields";
  contract_id?: Maybe<Scalars["Float"]>;
  tx_id?: Maybe<Scalars["Float"]>;
};

/** order by stddev_samp() on columns of table "contract_transactions" */
export type Contract_Transactions_Stddev_Samp_Order_By = {
  contract_id?: InputMaybe<Order_By>;
  tx_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "contract_transactions" */
export type Contract_Transactions_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Contract_Transactions_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Contract_Transactions_Stream_Cursor_Value_Input = {
  contract_id?: InputMaybe<Scalars["Int"]>;
  tx_id?: InputMaybe<Scalars["Int"]>;
};

/** aggregate sum on columns */
export type Contract_Transactions_Sum_Fields = {
  __typename?: "contract_transactions_sum_fields";
  contract_id?: Maybe<Scalars["Int"]>;
  tx_id?: Maybe<Scalars["Int"]>;
};

/** order by sum() on columns of table "contract_transactions" */
export type Contract_Transactions_Sum_Order_By = {
  contract_id?: InputMaybe<Order_By>;
  tx_id?: InputMaybe<Order_By>;
};

export type Contract_Transactions_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Contract_Transactions_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Contract_Transactions_Set_Input>;
  where: Contract_Transactions_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Contract_Transactions_Var_Pop_Fields = {
  __typename?: "contract_transactions_var_pop_fields";
  contract_id?: Maybe<Scalars["Float"]>;
  tx_id?: Maybe<Scalars["Float"]>;
};

/** order by var_pop() on columns of table "contract_transactions" */
export type Contract_Transactions_Var_Pop_Order_By = {
  contract_id?: InputMaybe<Order_By>;
  tx_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Contract_Transactions_Var_Samp_Fields = {
  __typename?: "contract_transactions_var_samp_fields";
  contract_id?: Maybe<Scalars["Float"]>;
  tx_id?: Maybe<Scalars["Float"]>;
};

/** order by var_samp() on columns of table "contract_transactions" */
export type Contract_Transactions_Var_Samp_Order_By = {
  contract_id?: InputMaybe<Order_By>;
  tx_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Contract_Transactions_Variance_Fields = {
  __typename?: "contract_transactions_variance_fields";
  contract_id?: Maybe<Scalars["Float"]>;
  tx_id?: Maybe<Scalars["Float"]>;
};

/** order by variance() on columns of table "contract_transactions" */
export type Contract_Transactions_Variance_Order_By = {
  contract_id?: InputMaybe<Order_By>;
  tx_id?: InputMaybe<Order_By>;
};

/** columns and relationships of "contract_transactions_view" */
export type Contract_Transactions_View = {
  __typename?: "contract_transactions_view";
  contract_address?: Maybe<Scalars["String"]>;
  hash?: Maybe<Scalars["bytea"]>;
  height?: Maybe<Scalars["Int"]>;
  is_clear_admin?: Maybe<Scalars["Boolean"]>;
  is_execute?: Maybe<Scalars["Boolean"]>;
  is_ibc?: Maybe<Scalars["Boolean"]>;
  is_instantiate?: Maybe<Scalars["Boolean"]>;
  is_migrate?: Maybe<Scalars["Boolean"]>;
  is_send?: Maybe<Scalars["Boolean"]>;
  is_store_code?: Maybe<Scalars["Boolean"]>;
  is_update_admin?: Maybe<Scalars["Boolean"]>;
  messages?: Maybe<Scalars["json"]>;
  sender?: Maybe<Scalars["String"]>;
  success?: Maybe<Scalars["Boolean"]>;
  timestamp?: Maybe<Scalars["timestamp"]>;
};

/** columns and relationships of "contract_transactions_view" */
export type Contract_Transactions_ViewMessagesArgs = {
  path?: InputMaybe<Scalars["String"]>;
};

/** aggregated selection of "contract_transactions_view" */
export type Contract_Transactions_View_Aggregate = {
  __typename?: "contract_transactions_view_aggregate";
  aggregate?: Maybe<Contract_Transactions_View_Aggregate_Fields>;
  nodes: Array<Contract_Transactions_View>;
};

/** aggregate fields of "contract_transactions_view" */
export type Contract_Transactions_View_Aggregate_Fields = {
  __typename?: "contract_transactions_view_aggregate_fields";
  avg?: Maybe<Contract_Transactions_View_Avg_Fields>;
  count: Scalars["Int"];
  max?: Maybe<Contract_Transactions_View_Max_Fields>;
  min?: Maybe<Contract_Transactions_View_Min_Fields>;
  stddev?: Maybe<Contract_Transactions_View_Stddev_Fields>;
  stddev_pop?: Maybe<Contract_Transactions_View_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Contract_Transactions_View_Stddev_Samp_Fields>;
  sum?: Maybe<Contract_Transactions_View_Sum_Fields>;
  var_pop?: Maybe<Contract_Transactions_View_Var_Pop_Fields>;
  var_samp?: Maybe<Contract_Transactions_View_Var_Samp_Fields>;
  variance?: Maybe<Contract_Transactions_View_Variance_Fields>;
};

/** aggregate fields of "contract_transactions_view" */
export type Contract_Transactions_View_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Contract_Transactions_View_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]>;
};

/** aggregate avg on columns */
export type Contract_Transactions_View_Avg_Fields = {
  __typename?: "contract_transactions_view_avg_fields";
  height?: Maybe<Scalars["Float"]>;
};

/** Boolean expression to filter rows from the table "contract_transactions_view". All fields are combined with a logical 'AND'. */
export type Contract_Transactions_View_Bool_Exp = {
  _and?: InputMaybe<Array<Contract_Transactions_View_Bool_Exp>>;
  _not?: InputMaybe<Contract_Transactions_View_Bool_Exp>;
  _or?: InputMaybe<Array<Contract_Transactions_View_Bool_Exp>>;
  contract_address?: InputMaybe<String_Comparison_Exp>;
  hash?: InputMaybe<Bytea_Comparison_Exp>;
  height?: InputMaybe<Int_Comparison_Exp>;
  is_clear_admin?: InputMaybe<Boolean_Comparison_Exp>;
  is_execute?: InputMaybe<Boolean_Comparison_Exp>;
  is_ibc?: InputMaybe<Boolean_Comparison_Exp>;
  is_instantiate?: InputMaybe<Boolean_Comparison_Exp>;
  is_migrate?: InputMaybe<Boolean_Comparison_Exp>;
  is_send?: InputMaybe<Boolean_Comparison_Exp>;
  is_store_code?: InputMaybe<Boolean_Comparison_Exp>;
  is_update_admin?: InputMaybe<Boolean_Comparison_Exp>;
  messages?: InputMaybe<Json_Comparison_Exp>;
  sender?: InputMaybe<String_Comparison_Exp>;
  success?: InputMaybe<Boolean_Comparison_Exp>;
  timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
};

/** input type for incrementing numeric columns in table "contract_transactions_view" */
export type Contract_Transactions_View_Inc_Input = {
  height?: InputMaybe<Scalars["Int"]>;
};

/** input type for inserting data into table "contract_transactions_view" */
export type Contract_Transactions_View_Insert_Input = {
  contract_address?: InputMaybe<Scalars["String"]>;
  hash?: InputMaybe<Scalars["bytea"]>;
  height?: InputMaybe<Scalars["Int"]>;
  is_clear_admin?: InputMaybe<Scalars["Boolean"]>;
  is_execute?: InputMaybe<Scalars["Boolean"]>;
  is_ibc?: InputMaybe<Scalars["Boolean"]>;
  is_instantiate?: InputMaybe<Scalars["Boolean"]>;
  is_migrate?: InputMaybe<Scalars["Boolean"]>;
  is_send?: InputMaybe<Scalars["Boolean"]>;
  is_store_code?: InputMaybe<Scalars["Boolean"]>;
  is_update_admin?: InputMaybe<Scalars["Boolean"]>;
  messages?: InputMaybe<Scalars["json"]>;
  sender?: InputMaybe<Scalars["String"]>;
  success?: InputMaybe<Scalars["Boolean"]>;
  timestamp?: InputMaybe<Scalars["timestamp"]>;
};

/** aggregate max on columns */
export type Contract_Transactions_View_Max_Fields = {
  __typename?: "contract_transactions_view_max_fields";
  contract_address?: Maybe<Scalars["String"]>;
  height?: Maybe<Scalars["Int"]>;
  sender?: Maybe<Scalars["String"]>;
  timestamp?: Maybe<Scalars["timestamp"]>;
};

/** aggregate min on columns */
export type Contract_Transactions_View_Min_Fields = {
  __typename?: "contract_transactions_view_min_fields";
  contract_address?: Maybe<Scalars["String"]>;
  height?: Maybe<Scalars["Int"]>;
  sender?: Maybe<Scalars["String"]>;
  timestamp?: Maybe<Scalars["timestamp"]>;
};

/** response of any mutation on the table "contract_transactions_view" */
export type Contract_Transactions_View_Mutation_Response = {
  __typename?: "contract_transactions_view_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"];
  /** data from the rows affected by the mutation */
  returning: Array<Contract_Transactions_View>;
};

/** Ordering options when selecting data from "contract_transactions_view". */
export type Contract_Transactions_View_Order_By = {
  contract_address?: InputMaybe<Order_By>;
  hash?: InputMaybe<Order_By>;
  height?: InputMaybe<Order_By>;
  is_clear_admin?: InputMaybe<Order_By>;
  is_execute?: InputMaybe<Order_By>;
  is_ibc?: InputMaybe<Order_By>;
  is_instantiate?: InputMaybe<Order_By>;
  is_migrate?: InputMaybe<Order_By>;
  is_send?: InputMaybe<Order_By>;
  is_store_code?: InputMaybe<Order_By>;
  is_update_admin?: InputMaybe<Order_By>;
  messages?: InputMaybe<Order_By>;
  sender?: InputMaybe<Order_By>;
  success?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
};

/** select columns of table "contract_transactions_view" */
export enum Contract_Transactions_View_Select_Column {
  /** column name */
  ContractAddress = "contract_address",
  /** column name */
  Hash = "hash",
  /** column name */
  Height = "height",
  /** column name */
  IsClearAdmin = "is_clear_admin",
  /** column name */
  IsExecute = "is_execute",
  /** column name */
  IsIbc = "is_ibc",
  /** column name */
  IsInstantiate = "is_instantiate",
  /** column name */
  IsMigrate = "is_migrate",
  /** column name */
  IsSend = "is_send",
  /** column name */
  IsStoreCode = "is_store_code",
  /** column name */
  IsUpdateAdmin = "is_update_admin",
  /** column name */
  Messages = "messages",
  /** column name */
  Sender = "sender",
  /** column name */
  Success = "success",
  /** column name */
  Timestamp = "timestamp",
}

/** input type for updating data in table "contract_transactions_view" */
export type Contract_Transactions_View_Set_Input = {
  contract_address?: InputMaybe<Scalars["String"]>;
  hash?: InputMaybe<Scalars["bytea"]>;
  height?: InputMaybe<Scalars["Int"]>;
  is_clear_admin?: InputMaybe<Scalars["Boolean"]>;
  is_execute?: InputMaybe<Scalars["Boolean"]>;
  is_ibc?: InputMaybe<Scalars["Boolean"]>;
  is_instantiate?: InputMaybe<Scalars["Boolean"]>;
  is_migrate?: InputMaybe<Scalars["Boolean"]>;
  is_send?: InputMaybe<Scalars["Boolean"]>;
  is_store_code?: InputMaybe<Scalars["Boolean"]>;
  is_update_admin?: InputMaybe<Scalars["Boolean"]>;
  messages?: InputMaybe<Scalars["json"]>;
  sender?: InputMaybe<Scalars["String"]>;
  success?: InputMaybe<Scalars["Boolean"]>;
  timestamp?: InputMaybe<Scalars["timestamp"]>;
};

/** aggregate stddev on columns */
export type Contract_Transactions_View_Stddev_Fields = {
  __typename?: "contract_transactions_view_stddev_fields";
  height?: Maybe<Scalars["Float"]>;
};

/** aggregate stddev_pop on columns */
export type Contract_Transactions_View_Stddev_Pop_Fields = {
  __typename?: "contract_transactions_view_stddev_pop_fields";
  height?: Maybe<Scalars["Float"]>;
};

/** aggregate stddev_samp on columns */
export type Contract_Transactions_View_Stddev_Samp_Fields = {
  __typename?: "contract_transactions_view_stddev_samp_fields";
  height?: Maybe<Scalars["Float"]>;
};

/** Streaming cursor of the table "contract_transactions_view" */
export type Contract_Transactions_View_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Contract_Transactions_View_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Contract_Transactions_View_Stream_Cursor_Value_Input = {
  contract_address?: InputMaybe<Scalars["String"]>;
  hash?: InputMaybe<Scalars["bytea"]>;
  height?: InputMaybe<Scalars["Int"]>;
  is_clear_admin?: InputMaybe<Scalars["Boolean"]>;
  is_execute?: InputMaybe<Scalars["Boolean"]>;
  is_ibc?: InputMaybe<Scalars["Boolean"]>;
  is_instantiate?: InputMaybe<Scalars["Boolean"]>;
  is_migrate?: InputMaybe<Scalars["Boolean"]>;
  is_send?: InputMaybe<Scalars["Boolean"]>;
  is_store_code?: InputMaybe<Scalars["Boolean"]>;
  is_update_admin?: InputMaybe<Scalars["Boolean"]>;
  messages?: InputMaybe<Scalars["json"]>;
  sender?: InputMaybe<Scalars["String"]>;
  success?: InputMaybe<Scalars["Boolean"]>;
  timestamp?: InputMaybe<Scalars["timestamp"]>;
};

/** aggregate sum on columns */
export type Contract_Transactions_View_Sum_Fields = {
  __typename?: "contract_transactions_view_sum_fields";
  height?: Maybe<Scalars["Int"]>;
};

export type Contract_Transactions_View_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Contract_Transactions_View_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Contract_Transactions_View_Set_Input>;
  where: Contract_Transactions_View_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Contract_Transactions_View_Var_Pop_Fields = {
  __typename?: "contract_transactions_view_var_pop_fields";
  height?: Maybe<Scalars["Float"]>;
};

/** aggregate var_samp on columns */
export type Contract_Transactions_View_Var_Samp_Fields = {
  __typename?: "contract_transactions_view_var_samp_fields";
  height?: Maybe<Scalars["Float"]>;
};

/** aggregate variance on columns */
export type Contract_Transactions_View_Variance_Fields = {
  __typename?: "contract_transactions_view_variance_fields";
  height?: Maybe<Scalars["Float"]>;
};

/** columns and relationships of "contracts" */
export type Contracts = {
  __typename?: "contracts";
  /** An object relationship */
  account?: Maybe<Accounts>;
  /** An object relationship */
  accountByInitBy?: Maybe<Accounts>;
  address: Scalars["String"];
  admin?: Maybe<Scalars["Int"]>;
  /** An object relationship */
  code: Codes;
  code_id: Scalars["Int"];
  contract_executed: Scalars["Int"];
  /** An array relationship */
  contract_histories: Array<Contract_Histories>;
  /** An aggregate relationship */
  contract_histories_aggregate: Contract_Histories_Aggregate;
  /** An array relationship */
  contract_proposals: Array<Contract_Proposals>;
  /** An aggregate relationship */
  contract_proposals_aggregate: Contract_Proposals_Aggregate;
  /** An array relationship */
  contract_transactions: Array<Contract_Transactions>;
  /** An aggregate relationship */
  contract_transactions_aggregate: Contract_Transactions_Aggregate;
  id: Scalars["Int"];
  init_by?: Maybe<Scalars["Int"]>;
  init_msg?: Maybe<Scalars["String"]>;
  init_tx_id?: Maybe<Scalars["Int"]>;
  label: Scalars["String"];
  /** An object relationship */
  transaction?: Maybe<Transactions>;
};

/** columns and relationships of "contracts" */
export type ContractsContract_HistoriesArgs = {
  distinct_on?: InputMaybe<Array<Contract_Histories_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contract_Histories_Order_By>>;
  where?: InputMaybe<Contract_Histories_Bool_Exp>;
};

/** columns and relationships of "contracts" */
export type ContractsContract_Histories_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Contract_Histories_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contract_Histories_Order_By>>;
  where?: InputMaybe<Contract_Histories_Bool_Exp>;
};

/** columns and relationships of "contracts" */
export type ContractsContract_ProposalsArgs = {
  distinct_on?: InputMaybe<Array<Contract_Proposals_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contract_Proposals_Order_By>>;
  where?: InputMaybe<Contract_Proposals_Bool_Exp>;
};

/** columns and relationships of "contracts" */
export type ContractsContract_Proposals_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Contract_Proposals_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contract_Proposals_Order_By>>;
  where?: InputMaybe<Contract_Proposals_Bool_Exp>;
};

/** columns and relationships of "contracts" */
export type ContractsContract_TransactionsArgs = {
  distinct_on?: InputMaybe<Array<Contract_Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contract_Transactions_Order_By>>;
  where?: InputMaybe<Contract_Transactions_Bool_Exp>;
};

/** columns and relationships of "contracts" */
export type ContractsContract_Transactions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Contract_Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contract_Transactions_Order_By>>;
  where?: InputMaybe<Contract_Transactions_Bool_Exp>;
};

/** aggregated selection of "contracts" */
export type Contracts_Aggregate = {
  __typename?: "contracts_aggregate";
  aggregate?: Maybe<Contracts_Aggregate_Fields>;
  nodes: Array<Contracts>;
};

export type Contracts_Aggregate_Bool_Exp = {
  count?: InputMaybe<Contracts_Aggregate_Bool_Exp_Count>;
};

export type Contracts_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Contracts_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]>;
  filter?: InputMaybe<Contracts_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "contracts" */
export type Contracts_Aggregate_Fields = {
  __typename?: "contracts_aggregate_fields";
  avg?: Maybe<Contracts_Avg_Fields>;
  count: Scalars["Int"];
  max?: Maybe<Contracts_Max_Fields>;
  min?: Maybe<Contracts_Min_Fields>;
  stddev?: Maybe<Contracts_Stddev_Fields>;
  stddev_pop?: Maybe<Contracts_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Contracts_Stddev_Samp_Fields>;
  sum?: Maybe<Contracts_Sum_Fields>;
  var_pop?: Maybe<Contracts_Var_Pop_Fields>;
  var_samp?: Maybe<Contracts_Var_Samp_Fields>;
  variance?: Maybe<Contracts_Variance_Fields>;
};

/** aggregate fields of "contracts" */
export type Contracts_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Contracts_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]>;
};

/** order by aggregate values of table "contracts" */
export type Contracts_Aggregate_Order_By = {
  avg?: InputMaybe<Contracts_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Contracts_Max_Order_By>;
  min?: InputMaybe<Contracts_Min_Order_By>;
  stddev?: InputMaybe<Contracts_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Contracts_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Contracts_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Contracts_Sum_Order_By>;
  var_pop?: InputMaybe<Contracts_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Contracts_Var_Samp_Order_By>;
  variance?: InputMaybe<Contracts_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "contracts" */
export type Contracts_Arr_Rel_Insert_Input = {
  data: Array<Contracts_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Contracts_On_Conflict>;
};

/** aggregate avg on columns */
export type Contracts_Avg_Fields = {
  __typename?: "contracts_avg_fields";
  admin?: Maybe<Scalars["Float"]>;
  code_id?: Maybe<Scalars["Float"]>;
  contract_executed?: Maybe<Scalars["Float"]>;
  id?: Maybe<Scalars["Float"]>;
  init_by?: Maybe<Scalars["Float"]>;
  init_tx_id?: Maybe<Scalars["Float"]>;
};

/** order by avg() on columns of table "contracts" */
export type Contracts_Avg_Order_By = {
  admin?: InputMaybe<Order_By>;
  code_id?: InputMaybe<Order_By>;
  contract_executed?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  init_by?: InputMaybe<Order_By>;
  init_tx_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "contracts". All fields are combined with a logical 'AND'. */
export type Contracts_Bool_Exp = {
  _and?: InputMaybe<Array<Contracts_Bool_Exp>>;
  _not?: InputMaybe<Contracts_Bool_Exp>;
  _or?: InputMaybe<Array<Contracts_Bool_Exp>>;
  account?: InputMaybe<Accounts_Bool_Exp>;
  accountByInitBy?: InputMaybe<Accounts_Bool_Exp>;
  address?: InputMaybe<String_Comparison_Exp>;
  admin?: InputMaybe<Int_Comparison_Exp>;
  code?: InputMaybe<Codes_Bool_Exp>;
  code_id?: InputMaybe<Int_Comparison_Exp>;
  contract_executed?: InputMaybe<Int_Comparison_Exp>;
  contract_histories?: InputMaybe<Contract_Histories_Bool_Exp>;
  contract_histories_aggregate?: InputMaybe<Contract_Histories_Aggregate_Bool_Exp>;
  contract_proposals?: InputMaybe<Contract_Proposals_Bool_Exp>;
  contract_proposals_aggregate?: InputMaybe<Contract_Proposals_Aggregate_Bool_Exp>;
  contract_transactions?: InputMaybe<Contract_Transactions_Bool_Exp>;
  contract_transactions_aggregate?: InputMaybe<Contract_Transactions_Aggregate_Bool_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  init_by?: InputMaybe<Int_Comparison_Exp>;
  init_msg?: InputMaybe<String_Comparison_Exp>;
  init_tx_id?: InputMaybe<Int_Comparison_Exp>;
  label?: InputMaybe<String_Comparison_Exp>;
  transaction?: InputMaybe<Transactions_Bool_Exp>;
};

/** unique or primary key constraints on table "contracts" */
export enum Contracts_Constraint {
  /** unique or primary key constraint on columns "id" */
  ContractsIdKey = "contracts_id_key",
  /** unique or primary key constraint on columns "address" */
  ContractsPkey = "contracts_pkey",
}

/** input type for incrementing numeric columns in table "contracts" */
export type Contracts_Inc_Input = {
  admin?: InputMaybe<Scalars["Int"]>;
  code_id?: InputMaybe<Scalars["Int"]>;
  contract_executed?: InputMaybe<Scalars["Int"]>;
  id?: InputMaybe<Scalars["Int"]>;
  init_by?: InputMaybe<Scalars["Int"]>;
  init_tx_id?: InputMaybe<Scalars["Int"]>;
};

/** input type for inserting data into table "contracts" */
export type Contracts_Insert_Input = {
  account?: InputMaybe<Accounts_Obj_Rel_Insert_Input>;
  accountByInitBy?: InputMaybe<Accounts_Obj_Rel_Insert_Input>;
  address?: InputMaybe<Scalars["String"]>;
  admin?: InputMaybe<Scalars["Int"]>;
  code?: InputMaybe<Codes_Obj_Rel_Insert_Input>;
  code_id?: InputMaybe<Scalars["Int"]>;
  contract_executed?: InputMaybe<Scalars["Int"]>;
  contract_histories?: InputMaybe<Contract_Histories_Arr_Rel_Insert_Input>;
  contract_proposals?: InputMaybe<Contract_Proposals_Arr_Rel_Insert_Input>;
  contract_transactions?: InputMaybe<Contract_Transactions_Arr_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["Int"]>;
  init_by?: InputMaybe<Scalars["Int"]>;
  init_msg?: InputMaybe<Scalars["String"]>;
  init_tx_id?: InputMaybe<Scalars["Int"]>;
  label?: InputMaybe<Scalars["String"]>;
  transaction?: InputMaybe<Transactions_Obj_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Contracts_Max_Fields = {
  __typename?: "contracts_max_fields";
  address?: Maybe<Scalars["String"]>;
  admin?: Maybe<Scalars["Int"]>;
  code_id?: Maybe<Scalars["Int"]>;
  contract_executed?: Maybe<Scalars["Int"]>;
  id?: Maybe<Scalars["Int"]>;
  init_by?: Maybe<Scalars["Int"]>;
  init_msg?: Maybe<Scalars["String"]>;
  init_tx_id?: Maybe<Scalars["Int"]>;
  label?: Maybe<Scalars["String"]>;
};

/** order by max() on columns of table "contracts" */
export type Contracts_Max_Order_By = {
  address?: InputMaybe<Order_By>;
  admin?: InputMaybe<Order_By>;
  code_id?: InputMaybe<Order_By>;
  contract_executed?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  init_by?: InputMaybe<Order_By>;
  init_msg?: InputMaybe<Order_By>;
  init_tx_id?: InputMaybe<Order_By>;
  label?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Contracts_Min_Fields = {
  __typename?: "contracts_min_fields";
  address?: Maybe<Scalars["String"]>;
  admin?: Maybe<Scalars["Int"]>;
  code_id?: Maybe<Scalars["Int"]>;
  contract_executed?: Maybe<Scalars["Int"]>;
  id?: Maybe<Scalars["Int"]>;
  init_by?: Maybe<Scalars["Int"]>;
  init_msg?: Maybe<Scalars["String"]>;
  init_tx_id?: Maybe<Scalars["Int"]>;
  label?: Maybe<Scalars["String"]>;
};

/** order by min() on columns of table "contracts" */
export type Contracts_Min_Order_By = {
  address?: InputMaybe<Order_By>;
  admin?: InputMaybe<Order_By>;
  code_id?: InputMaybe<Order_By>;
  contract_executed?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  init_by?: InputMaybe<Order_By>;
  init_msg?: InputMaybe<Order_By>;
  init_tx_id?: InputMaybe<Order_By>;
  label?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "contracts" */
export type Contracts_Mutation_Response = {
  __typename?: "contracts_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"];
  /** data from the rows affected by the mutation */
  returning: Array<Contracts>;
};

/** input type for inserting object relation for remote table "contracts" */
export type Contracts_Obj_Rel_Insert_Input = {
  data: Contracts_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Contracts_On_Conflict>;
};

/** on_conflict condition type for table "contracts" */
export type Contracts_On_Conflict = {
  constraint: Contracts_Constraint;
  update_columns?: Array<Contracts_Update_Column>;
  where?: InputMaybe<Contracts_Bool_Exp>;
};

/** Ordering options when selecting data from "contracts". */
export type Contracts_Order_By = {
  account?: InputMaybe<Accounts_Order_By>;
  accountByInitBy?: InputMaybe<Accounts_Order_By>;
  address?: InputMaybe<Order_By>;
  admin?: InputMaybe<Order_By>;
  code?: InputMaybe<Codes_Order_By>;
  code_id?: InputMaybe<Order_By>;
  contract_executed?: InputMaybe<Order_By>;
  contract_histories_aggregate?: InputMaybe<Contract_Histories_Aggregate_Order_By>;
  contract_proposals_aggregate?: InputMaybe<Contract_Proposals_Aggregate_Order_By>;
  contract_transactions_aggregate?: InputMaybe<Contract_Transactions_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  init_by?: InputMaybe<Order_By>;
  init_msg?: InputMaybe<Order_By>;
  init_tx_id?: InputMaybe<Order_By>;
  label?: InputMaybe<Order_By>;
  transaction?: InputMaybe<Transactions_Order_By>;
};

/** primary key columns input for table: contracts */
export type Contracts_Pk_Columns_Input = {
  address: Scalars["String"];
};

/** select columns of table "contracts" */
export enum Contracts_Select_Column {
  /** column name */
  Address = "address",
  /** column name */
  Admin = "admin",
  /** column name */
  CodeId = "code_id",
  /** column name */
  ContractExecuted = "contract_executed",
  /** column name */
  Id = "id",
  /** column name */
  InitBy = "init_by",
  /** column name */
  InitMsg = "init_msg",
  /** column name */
  InitTxId = "init_tx_id",
  /** column name */
  Label = "label",
}

/** input type for updating data in table "contracts" */
export type Contracts_Set_Input = {
  address?: InputMaybe<Scalars["String"]>;
  admin?: InputMaybe<Scalars["Int"]>;
  code_id?: InputMaybe<Scalars["Int"]>;
  contract_executed?: InputMaybe<Scalars["Int"]>;
  id?: InputMaybe<Scalars["Int"]>;
  init_by?: InputMaybe<Scalars["Int"]>;
  init_msg?: InputMaybe<Scalars["String"]>;
  init_tx_id?: InputMaybe<Scalars["Int"]>;
  label?: InputMaybe<Scalars["String"]>;
};

/** aggregate stddev on columns */
export type Contracts_Stddev_Fields = {
  __typename?: "contracts_stddev_fields";
  admin?: Maybe<Scalars["Float"]>;
  code_id?: Maybe<Scalars["Float"]>;
  contract_executed?: Maybe<Scalars["Float"]>;
  id?: Maybe<Scalars["Float"]>;
  init_by?: Maybe<Scalars["Float"]>;
  init_tx_id?: Maybe<Scalars["Float"]>;
};

/** order by stddev() on columns of table "contracts" */
export type Contracts_Stddev_Order_By = {
  admin?: InputMaybe<Order_By>;
  code_id?: InputMaybe<Order_By>;
  contract_executed?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  init_by?: InputMaybe<Order_By>;
  init_tx_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Contracts_Stddev_Pop_Fields = {
  __typename?: "contracts_stddev_pop_fields";
  admin?: Maybe<Scalars["Float"]>;
  code_id?: Maybe<Scalars["Float"]>;
  contract_executed?: Maybe<Scalars["Float"]>;
  id?: Maybe<Scalars["Float"]>;
  init_by?: Maybe<Scalars["Float"]>;
  init_tx_id?: Maybe<Scalars["Float"]>;
};

/** order by stddev_pop() on columns of table "contracts" */
export type Contracts_Stddev_Pop_Order_By = {
  admin?: InputMaybe<Order_By>;
  code_id?: InputMaybe<Order_By>;
  contract_executed?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  init_by?: InputMaybe<Order_By>;
  init_tx_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Contracts_Stddev_Samp_Fields = {
  __typename?: "contracts_stddev_samp_fields";
  admin?: Maybe<Scalars["Float"]>;
  code_id?: Maybe<Scalars["Float"]>;
  contract_executed?: Maybe<Scalars["Float"]>;
  id?: Maybe<Scalars["Float"]>;
  init_by?: Maybe<Scalars["Float"]>;
  init_tx_id?: Maybe<Scalars["Float"]>;
};

/** order by stddev_samp() on columns of table "contracts" */
export type Contracts_Stddev_Samp_Order_By = {
  admin?: InputMaybe<Order_By>;
  code_id?: InputMaybe<Order_By>;
  contract_executed?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  init_by?: InputMaybe<Order_By>;
  init_tx_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "contracts" */
export type Contracts_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Contracts_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Contracts_Stream_Cursor_Value_Input = {
  address?: InputMaybe<Scalars["String"]>;
  admin?: InputMaybe<Scalars["Int"]>;
  code_id?: InputMaybe<Scalars["Int"]>;
  contract_executed?: InputMaybe<Scalars["Int"]>;
  id?: InputMaybe<Scalars["Int"]>;
  init_by?: InputMaybe<Scalars["Int"]>;
  init_msg?: InputMaybe<Scalars["String"]>;
  init_tx_id?: InputMaybe<Scalars["Int"]>;
  label?: InputMaybe<Scalars["String"]>;
};

/** aggregate sum on columns */
export type Contracts_Sum_Fields = {
  __typename?: "contracts_sum_fields";
  admin?: Maybe<Scalars["Int"]>;
  code_id?: Maybe<Scalars["Int"]>;
  contract_executed?: Maybe<Scalars["Int"]>;
  id?: Maybe<Scalars["Int"]>;
  init_by?: Maybe<Scalars["Int"]>;
  init_tx_id?: Maybe<Scalars["Int"]>;
};

/** order by sum() on columns of table "contracts" */
export type Contracts_Sum_Order_By = {
  admin?: InputMaybe<Order_By>;
  code_id?: InputMaybe<Order_By>;
  contract_executed?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  init_by?: InputMaybe<Order_By>;
  init_tx_id?: InputMaybe<Order_By>;
};

/** update columns of table "contracts" */
export enum Contracts_Update_Column {
  /** column name */
  Address = "address",
  /** column name */
  Admin = "admin",
  /** column name */
  CodeId = "code_id",
  /** column name */
  ContractExecuted = "contract_executed",
  /** column name */
  Id = "id",
  /** column name */
  InitBy = "init_by",
  /** column name */
  InitMsg = "init_msg",
  /** column name */
  InitTxId = "init_tx_id",
  /** column name */
  Label = "label",
}

export type Contracts_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Contracts_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Contracts_Set_Input>;
  where: Contracts_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Contracts_Var_Pop_Fields = {
  __typename?: "contracts_var_pop_fields";
  admin?: Maybe<Scalars["Float"]>;
  code_id?: Maybe<Scalars["Float"]>;
  contract_executed?: Maybe<Scalars["Float"]>;
  id?: Maybe<Scalars["Float"]>;
  init_by?: Maybe<Scalars["Float"]>;
  init_tx_id?: Maybe<Scalars["Float"]>;
};

/** order by var_pop() on columns of table "contracts" */
export type Contracts_Var_Pop_Order_By = {
  admin?: InputMaybe<Order_By>;
  code_id?: InputMaybe<Order_By>;
  contract_executed?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  init_by?: InputMaybe<Order_By>;
  init_tx_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Contracts_Var_Samp_Fields = {
  __typename?: "contracts_var_samp_fields";
  admin?: Maybe<Scalars["Float"]>;
  code_id?: Maybe<Scalars["Float"]>;
  contract_executed?: Maybe<Scalars["Float"]>;
  id?: Maybe<Scalars["Float"]>;
  init_by?: Maybe<Scalars["Float"]>;
  init_tx_id?: Maybe<Scalars["Float"]>;
};

/** order by var_samp() on columns of table "contracts" */
export type Contracts_Var_Samp_Order_By = {
  admin?: InputMaybe<Order_By>;
  code_id?: InputMaybe<Order_By>;
  contract_executed?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  init_by?: InputMaybe<Order_By>;
  init_tx_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Contracts_Variance_Fields = {
  __typename?: "contracts_variance_fields";
  admin?: Maybe<Scalars["Float"]>;
  code_id?: Maybe<Scalars["Float"]>;
  contract_executed?: Maybe<Scalars["Float"]>;
  id?: Maybe<Scalars["Float"]>;
  init_by?: Maybe<Scalars["Float"]>;
  init_tx_id?: Maybe<Scalars["Float"]>;
};

/** order by variance() on columns of table "contracts" */
export type Contracts_Variance_Order_By = {
  admin?: InputMaybe<Order_By>;
  code_id?: InputMaybe<Order_By>;
  contract_executed?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  init_by?: InputMaybe<Order_By>;
  init_tx_id?: InputMaybe<Order_By>;
};

/** ordering argument of a cursor */
export enum Cursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = "ASC",
  /** descending ordering of the cursor */
  Desc = "DESC",
}

/** Boolean expression to compare columns of type "json". All fields are combined with logical 'AND'. */
export type Json_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["json"]>;
  _gt?: InputMaybe<Scalars["json"]>;
  _gte?: InputMaybe<Scalars["json"]>;
  _in?: InputMaybe<Array<Scalars["json"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]>;
  _lt?: InputMaybe<Scalars["json"]>;
  _lte?: InputMaybe<Scalars["json"]>;
  _neq?: InputMaybe<Scalars["json"]>;
  _nin?: InputMaybe<Array<Scalars["json"]>>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: "mutation_root";
  /** delete data from the table: "account_transactions" */
  delete_account_transactions?: Maybe<Account_Transactions_Mutation_Response>;
  /** delete single row from the table: "account_transactions" */
  delete_account_transactions_by_pk?: Maybe<Account_Transactions>;
  /** delete data from the table: "accounts" */
  delete_accounts?: Maybe<Accounts_Mutation_Response>;
  /** delete single row from the table: "accounts" */
  delete_accounts_by_pk?: Maybe<Accounts>;
  /** delete data from the table: "blocks" */
  delete_blocks?: Maybe<Blocks_Mutation_Response>;
  /** delete single row from the table: "blocks" */
  delete_blocks_by_pk?: Maybe<Blocks>;
  /** delete data from the table: "code_proposals" */
  delete_code_proposals?: Maybe<Code_Proposals_Mutation_Response>;
  /** delete data from the table: "codes" */
  delete_codes?: Maybe<Codes_Mutation_Response>;
  /** delete single row from the table: "codes" */
  delete_codes_by_pk?: Maybe<Codes>;
  /** delete data from the table: "contract_histories" */
  delete_contract_histories?: Maybe<Contract_Histories_Mutation_Response>;
  /** delete data from the table: "contract_proposals" */
  delete_contract_proposals?: Maybe<Contract_Proposals_Mutation_Response>;
  /** delete data from the table: "contract_transactions" */
  delete_contract_transactions?: Maybe<Contract_Transactions_Mutation_Response>;
  /** delete data from the table: "contract_transactions_view" */
  delete_contract_transactions_view?: Maybe<Contract_Transactions_View_Mutation_Response>;
  /** delete data from the table: "contracts" */
  delete_contracts?: Maybe<Contracts_Mutation_Response>;
  /** delete single row from the table: "contracts" */
  delete_contracts_by_pk?: Maybe<Contracts>;
  /** delete data from the table: "proposals" */
  delete_proposals?: Maybe<Proposals_Mutation_Response>;
  /** delete single row from the table: "proposals" */
  delete_proposals_by_pk?: Maybe<Proposals>;
  /** delete data from the table: "tracking" */
  delete_tracking?: Maybe<Tracking_Mutation_Response>;
  /** delete single row from the table: "tracking" */
  delete_tracking_by_pk?: Maybe<Tracking>;
  /** delete data from the table: "transactions" */
  delete_transactions?: Maybe<Transactions_Mutation_Response>;
  /** delete single row from the table: "transactions" */
  delete_transactions_by_pk?: Maybe<Transactions>;
  /** insert data into the table: "account_transactions" */
  insert_account_transactions?: Maybe<Account_Transactions_Mutation_Response>;
  /** insert a single row into the table: "account_transactions" */
  insert_account_transactions_one?: Maybe<Account_Transactions>;
  /** insert data into the table: "accounts" */
  insert_accounts?: Maybe<Accounts_Mutation_Response>;
  /** insert a single row into the table: "accounts" */
  insert_accounts_one?: Maybe<Accounts>;
  /** insert data into the table: "blocks" */
  insert_blocks?: Maybe<Blocks_Mutation_Response>;
  /** insert a single row into the table: "blocks" */
  insert_blocks_one?: Maybe<Blocks>;
  /** insert data into the table: "code_proposals" */
  insert_code_proposals?: Maybe<Code_Proposals_Mutation_Response>;
  /** insert a single row into the table: "code_proposals" */
  insert_code_proposals_one?: Maybe<Code_Proposals>;
  /** insert data into the table: "codes" */
  insert_codes?: Maybe<Codes_Mutation_Response>;
  /** insert a single row into the table: "codes" */
  insert_codes_one?: Maybe<Codes>;
  /** insert data into the table: "contract_histories" */
  insert_contract_histories?: Maybe<Contract_Histories_Mutation_Response>;
  /** insert a single row into the table: "contract_histories" */
  insert_contract_histories_one?: Maybe<Contract_Histories>;
  /** insert data into the table: "contract_proposals" */
  insert_contract_proposals?: Maybe<Contract_Proposals_Mutation_Response>;
  /** insert a single row into the table: "contract_proposals" */
  insert_contract_proposals_one?: Maybe<Contract_Proposals>;
  /** insert data into the table: "contract_transactions" */
  insert_contract_transactions?: Maybe<Contract_Transactions_Mutation_Response>;
  /** insert a single row into the table: "contract_transactions" */
  insert_contract_transactions_one?: Maybe<Contract_Transactions>;
  /** insert data into the table: "contract_transactions_view" */
  insert_contract_transactions_view?: Maybe<Contract_Transactions_View_Mutation_Response>;
  /** insert a single row into the table: "contract_transactions_view" */
  insert_contract_transactions_view_one?: Maybe<Contract_Transactions_View>;
  /** insert data into the table: "contracts" */
  insert_contracts?: Maybe<Contracts_Mutation_Response>;
  /** insert a single row into the table: "contracts" */
  insert_contracts_one?: Maybe<Contracts>;
  /** insert data into the table: "proposals" */
  insert_proposals?: Maybe<Proposals_Mutation_Response>;
  /** insert a single row into the table: "proposals" */
  insert_proposals_one?: Maybe<Proposals>;
  /** insert data into the table: "tracking" */
  insert_tracking?: Maybe<Tracking_Mutation_Response>;
  /** insert a single row into the table: "tracking" */
  insert_tracking_one?: Maybe<Tracking>;
  /** insert data into the table: "transactions" */
  insert_transactions?: Maybe<Transactions_Mutation_Response>;
  /** insert a single row into the table: "transactions" */
  insert_transactions_one?: Maybe<Transactions>;
  /** update data of the table: "account_transactions" */
  update_account_transactions?: Maybe<Account_Transactions_Mutation_Response>;
  /** update single row of the table: "account_transactions" */
  update_account_transactions_by_pk?: Maybe<Account_Transactions>;
  /** update multiples rows of table: "account_transactions" */
  update_account_transactions_many?: Maybe<
    Array<Maybe<Account_Transactions_Mutation_Response>>
  >;
  /** update data of the table: "accounts" */
  update_accounts?: Maybe<Accounts_Mutation_Response>;
  /** update single row of the table: "accounts" */
  update_accounts_by_pk?: Maybe<Accounts>;
  /** update multiples rows of table: "accounts" */
  update_accounts_many?: Maybe<Array<Maybe<Accounts_Mutation_Response>>>;
  /** update data of the table: "blocks" */
  update_blocks?: Maybe<Blocks_Mutation_Response>;
  /** update single row of the table: "blocks" */
  update_blocks_by_pk?: Maybe<Blocks>;
  /** update multiples rows of table: "blocks" */
  update_blocks_many?: Maybe<Array<Maybe<Blocks_Mutation_Response>>>;
  /** update data of the table: "code_proposals" */
  update_code_proposals?: Maybe<Code_Proposals_Mutation_Response>;
  /** update multiples rows of table: "code_proposals" */
  update_code_proposals_many?: Maybe<
    Array<Maybe<Code_Proposals_Mutation_Response>>
  >;
  /** update data of the table: "codes" */
  update_codes?: Maybe<Codes_Mutation_Response>;
  /** update single row of the table: "codes" */
  update_codes_by_pk?: Maybe<Codes>;
  /** update multiples rows of table: "codes" */
  update_codes_many?: Maybe<Array<Maybe<Codes_Mutation_Response>>>;
  /** update data of the table: "contract_histories" */
  update_contract_histories?: Maybe<Contract_Histories_Mutation_Response>;
  /** update multiples rows of table: "contract_histories" */
  update_contract_histories_many?: Maybe<
    Array<Maybe<Contract_Histories_Mutation_Response>>
  >;
  /** update data of the table: "contract_proposals" */
  update_contract_proposals?: Maybe<Contract_Proposals_Mutation_Response>;
  /** update multiples rows of table: "contract_proposals" */
  update_contract_proposals_many?: Maybe<
    Array<Maybe<Contract_Proposals_Mutation_Response>>
  >;
  /** update data of the table: "contract_transactions" */
  update_contract_transactions?: Maybe<Contract_Transactions_Mutation_Response>;
  /** update multiples rows of table: "contract_transactions" */
  update_contract_transactions_many?: Maybe<
    Array<Maybe<Contract_Transactions_Mutation_Response>>
  >;
  /** update data of the table: "contract_transactions_view" */
  update_contract_transactions_view?: Maybe<Contract_Transactions_View_Mutation_Response>;
  /** update multiples rows of table: "contract_transactions_view" */
  update_contract_transactions_view_many?: Maybe<
    Array<Maybe<Contract_Transactions_View_Mutation_Response>>
  >;
  /** update data of the table: "contracts" */
  update_contracts?: Maybe<Contracts_Mutation_Response>;
  /** update single row of the table: "contracts" */
  update_contracts_by_pk?: Maybe<Contracts>;
  /** update multiples rows of table: "contracts" */
  update_contracts_many?: Maybe<Array<Maybe<Contracts_Mutation_Response>>>;
  /** update data of the table: "proposals" */
  update_proposals?: Maybe<Proposals_Mutation_Response>;
  /** update single row of the table: "proposals" */
  update_proposals_by_pk?: Maybe<Proposals>;
  /** update multiples rows of table: "proposals" */
  update_proposals_many?: Maybe<Array<Maybe<Proposals_Mutation_Response>>>;
  /** update data of the table: "tracking" */
  update_tracking?: Maybe<Tracking_Mutation_Response>;
  /** update single row of the table: "tracking" */
  update_tracking_by_pk?: Maybe<Tracking>;
  /** update multiples rows of table: "tracking" */
  update_tracking_many?: Maybe<Array<Maybe<Tracking_Mutation_Response>>>;
  /** update data of the table: "transactions" */
  update_transactions?: Maybe<Transactions_Mutation_Response>;
  /** update single row of the table: "transactions" */
  update_transactions_by_pk?: Maybe<Transactions>;
  /** update multiples rows of table: "transactions" */
  update_transactions_many?: Maybe<
    Array<Maybe<Transactions_Mutation_Response>>
  >;
};

/** mutation root */
export type Mutation_RootDelete_Account_TransactionsArgs = {
  where: Account_Transactions_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Account_Transactions_By_PkArgs = {
  account_id: Scalars["Int"];
  transaction_id: Scalars["Int"];
};

/** mutation root */
export type Mutation_RootDelete_AccountsArgs = {
  where: Accounts_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Accounts_By_PkArgs = {
  address: Scalars["String"];
};

/** mutation root */
export type Mutation_RootDelete_BlocksArgs = {
  where: Blocks_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Blocks_By_PkArgs = {
  height: Scalars["Int"];
};

/** mutation root */
export type Mutation_RootDelete_Code_ProposalsArgs = {
  where: Code_Proposals_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_CodesArgs = {
  where: Codes_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Codes_By_PkArgs = {
  id: Scalars["Int"];
};

/** mutation root */
export type Mutation_RootDelete_Contract_HistoriesArgs = {
  where: Contract_Histories_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Contract_ProposalsArgs = {
  where: Contract_Proposals_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Contract_TransactionsArgs = {
  where: Contract_Transactions_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Contract_Transactions_ViewArgs = {
  where: Contract_Transactions_View_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_ContractsArgs = {
  where: Contracts_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Contracts_By_PkArgs = {
  address: Scalars["String"];
};

/** mutation root */
export type Mutation_RootDelete_ProposalsArgs = {
  where: Proposals_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Proposals_By_PkArgs = {
  id: Scalars["Int"];
};

/** mutation root */
export type Mutation_RootDelete_TrackingArgs = {
  where: Tracking_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Tracking_By_PkArgs = {
  chain_id: Scalars["String"];
};

/** mutation root */
export type Mutation_RootDelete_TransactionsArgs = {
  where: Transactions_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Transactions_By_PkArgs = {
  hash: Scalars["bytea"];
};

/** mutation root */
export type Mutation_RootInsert_Account_TransactionsArgs = {
  objects: Array<Account_Transactions_Insert_Input>;
  on_conflict?: InputMaybe<Account_Transactions_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Account_Transactions_OneArgs = {
  object: Account_Transactions_Insert_Input;
  on_conflict?: InputMaybe<Account_Transactions_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_AccountsArgs = {
  objects: Array<Accounts_Insert_Input>;
  on_conflict?: InputMaybe<Accounts_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Accounts_OneArgs = {
  object: Accounts_Insert_Input;
  on_conflict?: InputMaybe<Accounts_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_BlocksArgs = {
  objects: Array<Blocks_Insert_Input>;
  on_conflict?: InputMaybe<Blocks_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Blocks_OneArgs = {
  object: Blocks_Insert_Input;
  on_conflict?: InputMaybe<Blocks_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Code_ProposalsArgs = {
  objects: Array<Code_Proposals_Insert_Input>;
};

/** mutation root */
export type Mutation_RootInsert_Code_Proposals_OneArgs = {
  object: Code_Proposals_Insert_Input;
};

/** mutation root */
export type Mutation_RootInsert_CodesArgs = {
  objects: Array<Codes_Insert_Input>;
  on_conflict?: InputMaybe<Codes_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Codes_OneArgs = {
  object: Codes_Insert_Input;
  on_conflict?: InputMaybe<Codes_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Contract_HistoriesArgs = {
  objects: Array<Contract_Histories_Insert_Input>;
};

/** mutation root */
export type Mutation_RootInsert_Contract_Histories_OneArgs = {
  object: Contract_Histories_Insert_Input;
};

/** mutation root */
export type Mutation_RootInsert_Contract_ProposalsArgs = {
  objects: Array<Contract_Proposals_Insert_Input>;
};

/** mutation root */
export type Mutation_RootInsert_Contract_Proposals_OneArgs = {
  object: Contract_Proposals_Insert_Input;
};

/** mutation root */
export type Mutation_RootInsert_Contract_TransactionsArgs = {
  objects: Array<Contract_Transactions_Insert_Input>;
};

/** mutation root */
export type Mutation_RootInsert_Contract_Transactions_OneArgs = {
  object: Contract_Transactions_Insert_Input;
};

/** mutation root */
export type Mutation_RootInsert_Contract_Transactions_ViewArgs = {
  objects: Array<Contract_Transactions_View_Insert_Input>;
};

/** mutation root */
export type Mutation_RootInsert_Contract_Transactions_View_OneArgs = {
  object: Contract_Transactions_View_Insert_Input;
};

/** mutation root */
export type Mutation_RootInsert_ContractsArgs = {
  objects: Array<Contracts_Insert_Input>;
  on_conflict?: InputMaybe<Contracts_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Contracts_OneArgs = {
  object: Contracts_Insert_Input;
  on_conflict?: InputMaybe<Contracts_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_ProposalsArgs = {
  objects: Array<Proposals_Insert_Input>;
  on_conflict?: InputMaybe<Proposals_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Proposals_OneArgs = {
  object: Proposals_Insert_Input;
  on_conflict?: InputMaybe<Proposals_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_TrackingArgs = {
  objects: Array<Tracking_Insert_Input>;
  on_conflict?: InputMaybe<Tracking_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Tracking_OneArgs = {
  object: Tracking_Insert_Input;
  on_conflict?: InputMaybe<Tracking_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_TransactionsArgs = {
  objects: Array<Transactions_Insert_Input>;
  on_conflict?: InputMaybe<Transactions_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Transactions_OneArgs = {
  object: Transactions_Insert_Input;
  on_conflict?: InputMaybe<Transactions_On_Conflict>;
};

/** mutation root */
export type Mutation_RootUpdate_Account_TransactionsArgs = {
  _inc?: InputMaybe<Account_Transactions_Inc_Input>;
  _set?: InputMaybe<Account_Transactions_Set_Input>;
  where: Account_Transactions_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Account_Transactions_By_PkArgs = {
  _inc?: InputMaybe<Account_Transactions_Inc_Input>;
  _set?: InputMaybe<Account_Transactions_Set_Input>;
  pk_columns: Account_Transactions_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Account_Transactions_ManyArgs = {
  updates: Array<Account_Transactions_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_AccountsArgs = {
  _inc?: InputMaybe<Accounts_Inc_Input>;
  _set?: InputMaybe<Accounts_Set_Input>;
  where: Accounts_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Accounts_By_PkArgs = {
  _inc?: InputMaybe<Accounts_Inc_Input>;
  _set?: InputMaybe<Accounts_Set_Input>;
  pk_columns: Accounts_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Accounts_ManyArgs = {
  updates: Array<Accounts_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_BlocksArgs = {
  _inc?: InputMaybe<Blocks_Inc_Input>;
  _set?: InputMaybe<Blocks_Set_Input>;
  where: Blocks_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Blocks_By_PkArgs = {
  _inc?: InputMaybe<Blocks_Inc_Input>;
  _set?: InputMaybe<Blocks_Set_Input>;
  pk_columns: Blocks_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Blocks_ManyArgs = {
  updates: Array<Blocks_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Code_ProposalsArgs = {
  _inc?: InputMaybe<Code_Proposals_Inc_Input>;
  _set?: InputMaybe<Code_Proposals_Set_Input>;
  where: Code_Proposals_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Code_Proposals_ManyArgs = {
  updates: Array<Code_Proposals_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_CodesArgs = {
  _inc?: InputMaybe<Codes_Inc_Input>;
  _set?: InputMaybe<Codes_Set_Input>;
  where: Codes_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Codes_By_PkArgs = {
  _inc?: InputMaybe<Codes_Inc_Input>;
  _set?: InputMaybe<Codes_Set_Input>;
  pk_columns: Codes_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Codes_ManyArgs = {
  updates: Array<Codes_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Contract_HistoriesArgs = {
  _inc?: InputMaybe<Contract_Histories_Inc_Input>;
  _set?: InputMaybe<Contract_Histories_Set_Input>;
  where: Contract_Histories_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Contract_Histories_ManyArgs = {
  updates: Array<Contract_Histories_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Contract_ProposalsArgs = {
  _inc?: InputMaybe<Contract_Proposals_Inc_Input>;
  _set?: InputMaybe<Contract_Proposals_Set_Input>;
  where: Contract_Proposals_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Contract_Proposals_ManyArgs = {
  updates: Array<Contract_Proposals_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Contract_TransactionsArgs = {
  _inc?: InputMaybe<Contract_Transactions_Inc_Input>;
  _set?: InputMaybe<Contract_Transactions_Set_Input>;
  where: Contract_Transactions_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Contract_Transactions_ManyArgs = {
  updates: Array<Contract_Transactions_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Contract_Transactions_ViewArgs = {
  _inc?: InputMaybe<Contract_Transactions_View_Inc_Input>;
  _set?: InputMaybe<Contract_Transactions_View_Set_Input>;
  where: Contract_Transactions_View_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Contract_Transactions_View_ManyArgs = {
  updates: Array<Contract_Transactions_View_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_ContractsArgs = {
  _inc?: InputMaybe<Contracts_Inc_Input>;
  _set?: InputMaybe<Contracts_Set_Input>;
  where: Contracts_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Contracts_By_PkArgs = {
  _inc?: InputMaybe<Contracts_Inc_Input>;
  _set?: InputMaybe<Contracts_Set_Input>;
  pk_columns: Contracts_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Contracts_ManyArgs = {
  updates: Array<Contracts_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_ProposalsArgs = {
  _inc?: InputMaybe<Proposals_Inc_Input>;
  _set?: InputMaybe<Proposals_Set_Input>;
  where: Proposals_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Proposals_By_PkArgs = {
  _inc?: InputMaybe<Proposals_Inc_Input>;
  _set?: InputMaybe<Proposals_Set_Input>;
  pk_columns: Proposals_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Proposals_ManyArgs = {
  updates: Array<Proposals_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_TrackingArgs = {
  _inc?: InputMaybe<Tracking_Inc_Input>;
  _set?: InputMaybe<Tracking_Set_Input>;
  where: Tracking_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Tracking_By_PkArgs = {
  _inc?: InputMaybe<Tracking_Inc_Input>;
  _set?: InputMaybe<Tracking_Set_Input>;
  pk_columns: Tracking_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Tracking_ManyArgs = {
  updates: Array<Tracking_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_TransactionsArgs = {
  _inc?: InputMaybe<Transactions_Inc_Input>;
  _set?: InputMaybe<Transactions_Set_Input>;
  where: Transactions_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Transactions_By_PkArgs = {
  _inc?: InputMaybe<Transactions_Inc_Input>;
  _set?: InputMaybe<Transactions_Set_Input>;
  pk_columns: Transactions_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Transactions_ManyArgs = {
  updates: Array<Transactions_Updates>;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = "asc",
  /** in ascending order, nulls first */
  AscNullsFirst = "asc_nulls_first",
  /** in ascending order, nulls last */
  AscNullsLast = "asc_nulls_last",
  /** in descending order, nulls first */
  Desc = "desc",
  /** in descending order, nulls first */
  DescNullsFirst = "desc_nulls_first",
  /** in descending order, nulls last */
  DescNullsLast = "desc_nulls_last",
}

/** columns and relationships of "proposals" */
export type Proposals = {
  __typename?: "proposals";
  /** An object relationship */
  account?: Maybe<Accounts>;
  /** An array relationship */
  code_proposals: Array<Code_Proposals>;
  /** An aggregate relationship */
  code_proposals_aggregate: Code_Proposals_Aggregate;
  content?: Maybe<Scalars["json"]>;
  /** An array relationship */
  contract_proposals: Array<Contract_Proposals>;
  /** An aggregate relationship */
  contract_proposals_aggregate: Contract_Proposals_Aggregate;
  deposit_end_time: Scalars["timestamp"];
  description: Scalars["String"];
  id: Scalars["Int"];
  proposal_route: Scalars["String"];
  proposer_id?: Maybe<Scalars["Int"]>;
  status: Scalars["proposalstatus"];
  submit_time: Scalars["timestamp"];
  title: Scalars["String"];
  type: Scalars["String"];
  voting_end_time: Scalars["timestamp"];
  voting_time: Scalars["timestamp"];
};

/** columns and relationships of "proposals" */
export type ProposalsCode_ProposalsArgs = {
  distinct_on?: InputMaybe<Array<Code_Proposals_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Code_Proposals_Order_By>>;
  where?: InputMaybe<Code_Proposals_Bool_Exp>;
};

/** columns and relationships of "proposals" */
export type ProposalsCode_Proposals_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Code_Proposals_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Code_Proposals_Order_By>>;
  where?: InputMaybe<Code_Proposals_Bool_Exp>;
};

/** columns and relationships of "proposals" */
export type ProposalsContentArgs = {
  path?: InputMaybe<Scalars["String"]>;
};

/** columns and relationships of "proposals" */
export type ProposalsContract_ProposalsArgs = {
  distinct_on?: InputMaybe<Array<Contract_Proposals_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contract_Proposals_Order_By>>;
  where?: InputMaybe<Contract_Proposals_Bool_Exp>;
};

/** columns and relationships of "proposals" */
export type ProposalsContract_Proposals_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Contract_Proposals_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contract_Proposals_Order_By>>;
  where?: InputMaybe<Contract_Proposals_Bool_Exp>;
};

/** aggregated selection of "proposals" */
export type Proposals_Aggregate = {
  __typename?: "proposals_aggregate";
  aggregate?: Maybe<Proposals_Aggregate_Fields>;
  nodes: Array<Proposals>;
};

export type Proposals_Aggregate_Bool_Exp = {
  count?: InputMaybe<Proposals_Aggregate_Bool_Exp_Count>;
};

export type Proposals_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Proposals_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]>;
  filter?: InputMaybe<Proposals_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "proposals" */
export type Proposals_Aggregate_Fields = {
  __typename?: "proposals_aggregate_fields";
  avg?: Maybe<Proposals_Avg_Fields>;
  count: Scalars["Int"];
  max?: Maybe<Proposals_Max_Fields>;
  min?: Maybe<Proposals_Min_Fields>;
  stddev?: Maybe<Proposals_Stddev_Fields>;
  stddev_pop?: Maybe<Proposals_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Proposals_Stddev_Samp_Fields>;
  sum?: Maybe<Proposals_Sum_Fields>;
  var_pop?: Maybe<Proposals_Var_Pop_Fields>;
  var_samp?: Maybe<Proposals_Var_Samp_Fields>;
  variance?: Maybe<Proposals_Variance_Fields>;
};

/** aggregate fields of "proposals" */
export type Proposals_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Proposals_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]>;
};

/** order by aggregate values of table "proposals" */
export type Proposals_Aggregate_Order_By = {
  avg?: InputMaybe<Proposals_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Proposals_Max_Order_By>;
  min?: InputMaybe<Proposals_Min_Order_By>;
  stddev?: InputMaybe<Proposals_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Proposals_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Proposals_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Proposals_Sum_Order_By>;
  var_pop?: InputMaybe<Proposals_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Proposals_Var_Samp_Order_By>;
  variance?: InputMaybe<Proposals_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "proposals" */
export type Proposals_Arr_Rel_Insert_Input = {
  data: Array<Proposals_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Proposals_On_Conflict>;
};

/** aggregate avg on columns */
export type Proposals_Avg_Fields = {
  __typename?: "proposals_avg_fields";
  id?: Maybe<Scalars["Float"]>;
  proposer_id?: Maybe<Scalars["Float"]>;
};

/** order by avg() on columns of table "proposals" */
export type Proposals_Avg_Order_By = {
  id?: InputMaybe<Order_By>;
  proposer_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "proposals". All fields are combined with a logical 'AND'. */
export type Proposals_Bool_Exp = {
  _and?: InputMaybe<Array<Proposals_Bool_Exp>>;
  _not?: InputMaybe<Proposals_Bool_Exp>;
  _or?: InputMaybe<Array<Proposals_Bool_Exp>>;
  account?: InputMaybe<Accounts_Bool_Exp>;
  code_proposals?: InputMaybe<Code_Proposals_Bool_Exp>;
  code_proposals_aggregate?: InputMaybe<Code_Proposals_Aggregate_Bool_Exp>;
  content?: InputMaybe<Json_Comparison_Exp>;
  contract_proposals?: InputMaybe<Contract_Proposals_Bool_Exp>;
  contract_proposals_aggregate?: InputMaybe<Contract_Proposals_Aggregate_Bool_Exp>;
  deposit_end_time?: InputMaybe<Timestamp_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  proposal_route?: InputMaybe<String_Comparison_Exp>;
  proposer_id?: InputMaybe<Int_Comparison_Exp>;
  status?: InputMaybe<Proposalstatus_Comparison_Exp>;
  submit_time?: InputMaybe<Timestamp_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
  voting_end_time?: InputMaybe<Timestamp_Comparison_Exp>;
  voting_time?: InputMaybe<Timestamp_Comparison_Exp>;
};

/** unique or primary key constraints on table "proposals" */
export enum Proposals_Constraint {
  /** unique or primary key constraint on columns "id" */
  ProposalsPkey = "proposals_pkey",
}

/** input type for incrementing numeric columns in table "proposals" */
export type Proposals_Inc_Input = {
  id?: InputMaybe<Scalars["Int"]>;
  proposer_id?: InputMaybe<Scalars["Int"]>;
};

/** input type for inserting data into table "proposals" */
export type Proposals_Insert_Input = {
  account?: InputMaybe<Accounts_Obj_Rel_Insert_Input>;
  code_proposals?: InputMaybe<Code_Proposals_Arr_Rel_Insert_Input>;
  content?: InputMaybe<Scalars["json"]>;
  contract_proposals?: InputMaybe<Contract_Proposals_Arr_Rel_Insert_Input>;
  deposit_end_time?: InputMaybe<Scalars["timestamp"]>;
  description?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["Int"]>;
  proposal_route?: InputMaybe<Scalars["String"]>;
  proposer_id?: InputMaybe<Scalars["Int"]>;
  status?: InputMaybe<Scalars["proposalstatus"]>;
  submit_time?: InputMaybe<Scalars["timestamp"]>;
  title?: InputMaybe<Scalars["String"]>;
  type?: InputMaybe<Scalars["String"]>;
  voting_end_time?: InputMaybe<Scalars["timestamp"]>;
  voting_time?: InputMaybe<Scalars["timestamp"]>;
};

/** aggregate max on columns */
export type Proposals_Max_Fields = {
  __typename?: "proposals_max_fields";
  deposit_end_time?: Maybe<Scalars["timestamp"]>;
  description?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["Int"]>;
  proposal_route?: Maybe<Scalars["String"]>;
  proposer_id?: Maybe<Scalars["Int"]>;
  status?: Maybe<Scalars["proposalstatus"]>;
  submit_time?: Maybe<Scalars["timestamp"]>;
  title?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
  voting_end_time?: Maybe<Scalars["timestamp"]>;
  voting_time?: Maybe<Scalars["timestamp"]>;
};

/** order by max() on columns of table "proposals" */
export type Proposals_Max_Order_By = {
  deposit_end_time?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  proposal_route?: InputMaybe<Order_By>;
  proposer_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  submit_time?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  voting_end_time?: InputMaybe<Order_By>;
  voting_time?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Proposals_Min_Fields = {
  __typename?: "proposals_min_fields";
  deposit_end_time?: Maybe<Scalars["timestamp"]>;
  description?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["Int"]>;
  proposal_route?: Maybe<Scalars["String"]>;
  proposer_id?: Maybe<Scalars["Int"]>;
  status?: Maybe<Scalars["proposalstatus"]>;
  submit_time?: Maybe<Scalars["timestamp"]>;
  title?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
  voting_end_time?: Maybe<Scalars["timestamp"]>;
  voting_time?: Maybe<Scalars["timestamp"]>;
};

/** order by min() on columns of table "proposals" */
export type Proposals_Min_Order_By = {
  deposit_end_time?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  proposal_route?: InputMaybe<Order_By>;
  proposer_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  submit_time?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  voting_end_time?: InputMaybe<Order_By>;
  voting_time?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "proposals" */
export type Proposals_Mutation_Response = {
  __typename?: "proposals_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"];
  /** data from the rows affected by the mutation */
  returning: Array<Proposals>;
};

/** input type for inserting object relation for remote table "proposals" */
export type Proposals_Obj_Rel_Insert_Input = {
  data: Proposals_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Proposals_On_Conflict>;
};

/** on_conflict condition type for table "proposals" */
export type Proposals_On_Conflict = {
  constraint: Proposals_Constraint;
  update_columns?: Array<Proposals_Update_Column>;
  where?: InputMaybe<Proposals_Bool_Exp>;
};

/** Ordering options when selecting data from "proposals". */
export type Proposals_Order_By = {
  account?: InputMaybe<Accounts_Order_By>;
  code_proposals_aggregate?: InputMaybe<Code_Proposals_Aggregate_Order_By>;
  content?: InputMaybe<Order_By>;
  contract_proposals_aggregate?: InputMaybe<Contract_Proposals_Aggregate_Order_By>;
  deposit_end_time?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  proposal_route?: InputMaybe<Order_By>;
  proposer_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  submit_time?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  voting_end_time?: InputMaybe<Order_By>;
  voting_time?: InputMaybe<Order_By>;
};

/** primary key columns input for table: proposals */
export type Proposals_Pk_Columns_Input = {
  id: Scalars["Int"];
};

/** select columns of table "proposals" */
export enum Proposals_Select_Column {
  /** column name */
  Content = "content",
  /** column name */
  DepositEndTime = "deposit_end_time",
  /** column name */
  Description = "description",
  /** column name */
  Id = "id",
  /** column name */
  ProposalRoute = "proposal_route",
  /** column name */
  ProposerId = "proposer_id",
  /** column name */
  Status = "status",
  /** column name */
  SubmitTime = "submit_time",
  /** column name */
  Title = "title",
  /** column name */
  Type = "type",
  /** column name */
  VotingEndTime = "voting_end_time",
  /** column name */
  VotingTime = "voting_time",
}

/** input type for updating data in table "proposals" */
export type Proposals_Set_Input = {
  content?: InputMaybe<Scalars["json"]>;
  deposit_end_time?: InputMaybe<Scalars["timestamp"]>;
  description?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["Int"]>;
  proposal_route?: InputMaybe<Scalars["String"]>;
  proposer_id?: InputMaybe<Scalars["Int"]>;
  status?: InputMaybe<Scalars["proposalstatus"]>;
  submit_time?: InputMaybe<Scalars["timestamp"]>;
  title?: InputMaybe<Scalars["String"]>;
  type?: InputMaybe<Scalars["String"]>;
  voting_end_time?: InputMaybe<Scalars["timestamp"]>;
  voting_time?: InputMaybe<Scalars["timestamp"]>;
};

/** aggregate stddev on columns */
export type Proposals_Stddev_Fields = {
  __typename?: "proposals_stddev_fields";
  id?: Maybe<Scalars["Float"]>;
  proposer_id?: Maybe<Scalars["Float"]>;
};

/** order by stddev() on columns of table "proposals" */
export type Proposals_Stddev_Order_By = {
  id?: InputMaybe<Order_By>;
  proposer_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Proposals_Stddev_Pop_Fields = {
  __typename?: "proposals_stddev_pop_fields";
  id?: Maybe<Scalars["Float"]>;
  proposer_id?: Maybe<Scalars["Float"]>;
};

/** order by stddev_pop() on columns of table "proposals" */
export type Proposals_Stddev_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  proposer_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Proposals_Stddev_Samp_Fields = {
  __typename?: "proposals_stddev_samp_fields";
  id?: Maybe<Scalars["Float"]>;
  proposer_id?: Maybe<Scalars["Float"]>;
};

/** order by stddev_samp() on columns of table "proposals" */
export type Proposals_Stddev_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  proposer_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "proposals" */
export type Proposals_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Proposals_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Proposals_Stream_Cursor_Value_Input = {
  content?: InputMaybe<Scalars["json"]>;
  deposit_end_time?: InputMaybe<Scalars["timestamp"]>;
  description?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["Int"]>;
  proposal_route?: InputMaybe<Scalars["String"]>;
  proposer_id?: InputMaybe<Scalars["Int"]>;
  status?: InputMaybe<Scalars["proposalstatus"]>;
  submit_time?: InputMaybe<Scalars["timestamp"]>;
  title?: InputMaybe<Scalars["String"]>;
  type?: InputMaybe<Scalars["String"]>;
  voting_end_time?: InputMaybe<Scalars["timestamp"]>;
  voting_time?: InputMaybe<Scalars["timestamp"]>;
};

/** aggregate sum on columns */
export type Proposals_Sum_Fields = {
  __typename?: "proposals_sum_fields";
  id?: Maybe<Scalars["Int"]>;
  proposer_id?: Maybe<Scalars["Int"]>;
};

/** order by sum() on columns of table "proposals" */
export type Proposals_Sum_Order_By = {
  id?: InputMaybe<Order_By>;
  proposer_id?: InputMaybe<Order_By>;
};

/** update columns of table "proposals" */
export enum Proposals_Update_Column {
  /** column name */
  Content = "content",
  /** column name */
  DepositEndTime = "deposit_end_time",
  /** column name */
  Description = "description",
  /** column name */
  Id = "id",
  /** column name */
  ProposalRoute = "proposal_route",
  /** column name */
  ProposerId = "proposer_id",
  /** column name */
  Status = "status",
  /** column name */
  SubmitTime = "submit_time",
  /** column name */
  Title = "title",
  /** column name */
  Type = "type",
  /** column name */
  VotingEndTime = "voting_end_time",
  /** column name */
  VotingTime = "voting_time",
}

export type Proposals_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Proposals_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Proposals_Set_Input>;
  where: Proposals_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Proposals_Var_Pop_Fields = {
  __typename?: "proposals_var_pop_fields";
  id?: Maybe<Scalars["Float"]>;
  proposer_id?: Maybe<Scalars["Float"]>;
};

/** order by var_pop() on columns of table "proposals" */
export type Proposals_Var_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  proposer_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Proposals_Var_Samp_Fields = {
  __typename?: "proposals_var_samp_fields";
  id?: Maybe<Scalars["Float"]>;
  proposer_id?: Maybe<Scalars["Float"]>;
};

/** order by var_samp() on columns of table "proposals" */
export type Proposals_Var_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  proposer_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Proposals_Variance_Fields = {
  __typename?: "proposals_variance_fields";
  id?: Maybe<Scalars["Float"]>;
  proposer_id?: Maybe<Scalars["Float"]>;
};

/** order by variance() on columns of table "proposals" */
export type Proposals_Variance_Order_By = {
  id?: InputMaybe<Order_By>;
  proposer_id?: InputMaybe<Order_By>;
};

/** Boolean expression to compare columns of type "proposalstatus". All fields are combined with logical 'AND'. */
export type Proposalstatus_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["proposalstatus"]>;
  _gt?: InputMaybe<Scalars["proposalstatus"]>;
  _gte?: InputMaybe<Scalars["proposalstatus"]>;
  _in?: InputMaybe<Array<Scalars["proposalstatus"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]>;
  _lt?: InputMaybe<Scalars["proposalstatus"]>;
  _lte?: InputMaybe<Scalars["proposalstatus"]>;
  _neq?: InputMaybe<Scalars["proposalstatus"]>;
  _nin?: InputMaybe<Array<Scalars["proposalstatus"]>>;
};

export type Query_Root = {
  __typename?: "query_root";
  /** An array relationship */
  account_transactions: Array<Account_Transactions>;
  /** An aggregate relationship */
  account_transactions_aggregate: Account_Transactions_Aggregate;
  /** fetch data from the table: "account_transactions" using primary key columns */
  account_transactions_by_pk?: Maybe<Account_Transactions>;
  /** fetch data from the table: "accounts" */
  accounts: Array<Accounts>;
  /** fetch aggregated fields from the table: "accounts" */
  accounts_aggregate: Accounts_Aggregate;
  /** fetch data from the table: "accounts" using primary key columns */
  accounts_by_pk?: Maybe<Accounts>;
  /** fetch data from the table: "blocks" */
  blocks: Array<Blocks>;
  /** fetch aggregated fields from the table: "blocks" */
  blocks_aggregate: Blocks_Aggregate;
  /** fetch data from the table: "blocks" using primary key columns */
  blocks_by_pk?: Maybe<Blocks>;
  /** An array relationship */
  code_proposals: Array<Code_Proposals>;
  /** An aggregate relationship */
  code_proposals_aggregate: Code_Proposals_Aggregate;
  /** An array relationship */
  codes: Array<Codes>;
  /** An aggregate relationship */
  codes_aggregate: Codes_Aggregate;
  /** fetch data from the table: "codes" using primary key columns */
  codes_by_pk?: Maybe<Codes>;
  /** An array relationship */
  contract_histories: Array<Contract_Histories>;
  /** An aggregate relationship */
  contract_histories_aggregate: Contract_Histories_Aggregate;
  /** An array relationship */
  contract_proposals: Array<Contract_Proposals>;
  /** An aggregate relationship */
  contract_proposals_aggregate: Contract_Proposals_Aggregate;
  /** An array relationship */
  contract_transactions: Array<Contract_Transactions>;
  /** An aggregate relationship */
  contract_transactions_aggregate: Contract_Transactions_Aggregate;
  /** fetch data from the table: "contract_transactions_ja" */
  contract_transactions_ja: Array<Contract_Transactions_Ja>;
  /** fetch aggregated fields from the table: "contract_transactions_ja" */
  contract_transactions_ja_aggregate: Contract_Transactions_Ja_Aggregate;
  /** fetch data from the table: "contract_transactions_view" */
  contract_transactions_view: Array<Contract_Transactions_View>;
  /** fetch aggregated fields from the table: "contract_transactions_view" */
  contract_transactions_view_aggregate: Contract_Transactions_View_Aggregate;
  /** An array relationship */
  contracts: Array<Contracts>;
  /** An aggregate relationship */
  contracts_aggregate: Contracts_Aggregate;
  /** fetch data from the table: "contracts" using primary key columns */
  contracts_by_pk?: Maybe<Contracts>;
  /** An array relationship */
  proposals: Array<Proposals>;
  /** An aggregate relationship */
  proposals_aggregate: Proposals_Aggregate;
  /** fetch data from the table: "proposals" using primary key columns */
  proposals_by_pk?: Maybe<Proposals>;
  /** fetch data from the table: "tracking" */
  tracking: Array<Tracking>;
  /** fetch aggregated fields from the table: "tracking" */
  tracking_aggregate: Tracking_Aggregate;
  /** fetch data from the table: "tracking" using primary key columns */
  tracking_by_pk?: Maybe<Tracking>;
  /** An array relationship */
  transactions: Array<Transactions>;
  /** An aggregate relationship */
  transactions_aggregate: Transactions_Aggregate;
  /** fetch data from the table: "transactions" using primary key columns */
  transactions_by_pk?: Maybe<Transactions>;
};

export type Query_RootAccount_TransactionsArgs = {
  distinct_on?: InputMaybe<Array<Account_Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Account_Transactions_Order_By>>;
  where?: InputMaybe<Account_Transactions_Bool_Exp>;
};

export type Query_RootAccount_Transactions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Account_Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Account_Transactions_Order_By>>;
  where?: InputMaybe<Account_Transactions_Bool_Exp>;
};

export type Query_RootAccount_Transactions_By_PkArgs = {
  account_id: Scalars["Int"];
  transaction_id: Scalars["Int"];
};

export type Query_RootAccountsArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Accounts_Order_By>>;
  where?: InputMaybe<Accounts_Bool_Exp>;
};

export type Query_RootAccounts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Accounts_Order_By>>;
  where?: InputMaybe<Accounts_Bool_Exp>;
};

export type Query_RootAccounts_By_PkArgs = {
  address: Scalars["String"];
};

export type Query_RootBlocksArgs = {
  distinct_on?: InputMaybe<Array<Blocks_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Blocks_Order_By>>;
  where?: InputMaybe<Blocks_Bool_Exp>;
};

export type Query_RootBlocks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Blocks_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Blocks_Order_By>>;
  where?: InputMaybe<Blocks_Bool_Exp>;
};

export type Query_RootBlocks_By_PkArgs = {
  height: Scalars["Int"];
};

export type Query_RootCode_ProposalsArgs = {
  distinct_on?: InputMaybe<Array<Code_Proposals_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Code_Proposals_Order_By>>;
  where?: InputMaybe<Code_Proposals_Bool_Exp>;
};

export type Query_RootCode_Proposals_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Code_Proposals_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Code_Proposals_Order_By>>;
  where?: InputMaybe<Code_Proposals_Bool_Exp>;
};

export type Query_RootCodesArgs = {
  distinct_on?: InputMaybe<Array<Codes_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Codes_Order_By>>;
  where?: InputMaybe<Codes_Bool_Exp>;
};

export type Query_RootCodes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Codes_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Codes_Order_By>>;
  where?: InputMaybe<Codes_Bool_Exp>;
};

export type Query_RootCodes_By_PkArgs = {
  id: Scalars["Int"];
};

export type Query_RootContract_HistoriesArgs = {
  distinct_on?: InputMaybe<Array<Contract_Histories_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contract_Histories_Order_By>>;
  where?: InputMaybe<Contract_Histories_Bool_Exp>;
};

export type Query_RootContract_Histories_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Contract_Histories_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contract_Histories_Order_By>>;
  where?: InputMaybe<Contract_Histories_Bool_Exp>;
};

export type Query_RootContract_ProposalsArgs = {
  distinct_on?: InputMaybe<Array<Contract_Proposals_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contract_Proposals_Order_By>>;
  where?: InputMaybe<Contract_Proposals_Bool_Exp>;
};

export type Query_RootContract_Proposals_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Contract_Proposals_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contract_Proposals_Order_By>>;
  where?: InputMaybe<Contract_Proposals_Bool_Exp>;
};

export type Query_RootContract_TransactionsArgs = {
  distinct_on?: InputMaybe<Array<Contract_Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contract_Transactions_Order_By>>;
  where?: InputMaybe<Contract_Transactions_Bool_Exp>;
};

export type Query_RootContract_Transactions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Contract_Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contract_Transactions_Order_By>>;
  where?: InputMaybe<Contract_Transactions_Bool_Exp>;
};

export type Query_RootContract_Transactions_JaArgs = {
  distinct_on?: InputMaybe<Array<Contract_Transactions_Ja_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contract_Transactions_Ja_Order_By>>;
  where?: InputMaybe<Contract_Transactions_Ja_Bool_Exp>;
};

export type Query_RootContract_Transactions_Ja_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Contract_Transactions_Ja_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contract_Transactions_Ja_Order_By>>;
  where?: InputMaybe<Contract_Transactions_Ja_Bool_Exp>;
};

export type Query_RootContract_Transactions_ViewArgs = {
  distinct_on?: InputMaybe<Array<Contract_Transactions_View_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contract_Transactions_View_Order_By>>;
  where?: InputMaybe<Contract_Transactions_View_Bool_Exp>;
};

export type Query_RootContract_Transactions_View_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Contract_Transactions_View_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contract_Transactions_View_Order_By>>;
  where?: InputMaybe<Contract_Transactions_View_Bool_Exp>;
};

export type Query_RootContractsArgs = {
  distinct_on?: InputMaybe<Array<Contracts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contracts_Order_By>>;
  where?: InputMaybe<Contracts_Bool_Exp>;
};

export type Query_RootContracts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Contracts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contracts_Order_By>>;
  where?: InputMaybe<Contracts_Bool_Exp>;
};

export type Query_RootContracts_By_PkArgs = {
  address: Scalars["String"];
};

export type Query_RootProposalsArgs = {
  distinct_on?: InputMaybe<Array<Proposals_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Proposals_Order_By>>;
  where?: InputMaybe<Proposals_Bool_Exp>;
};

export type Query_RootProposals_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Proposals_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Proposals_Order_By>>;
  where?: InputMaybe<Proposals_Bool_Exp>;
};

export type Query_RootProposals_By_PkArgs = {
  id: Scalars["Int"];
};

export type Query_RootTrackingArgs = {
  distinct_on?: InputMaybe<Array<Tracking_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Tracking_Order_By>>;
  where?: InputMaybe<Tracking_Bool_Exp>;
};

export type Query_RootTracking_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Tracking_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Tracking_Order_By>>;
  where?: InputMaybe<Tracking_Bool_Exp>;
};

export type Query_RootTracking_By_PkArgs = {
  chain_id: Scalars["String"];
};

export type Query_RootTransactionsArgs = {
  distinct_on?: InputMaybe<Array<Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Transactions_Order_By>>;
  where?: InputMaybe<Transactions_Bool_Exp>;
};

export type Query_RootTransactions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Transactions_Order_By>>;
  where?: InputMaybe<Transactions_Bool_Exp>;
};

export type Query_RootTransactions_By_PkArgs = {
  hash: Scalars["bytea"];
};

export type Subscription_Root = {
  __typename?: "subscription_root";
  /** An array relationship */
  account_transactions: Array<Account_Transactions>;
  /** An aggregate relationship */
  account_transactions_aggregate: Account_Transactions_Aggregate;
  /** fetch data from the table: "account_transactions" using primary key columns */
  account_transactions_by_pk?: Maybe<Account_Transactions>;
  /** fetch data from the table in a streaming manner: "account_transactions" */
  account_transactions_stream: Array<Account_Transactions>;
  /** fetch data from the table: "accounts" */
  accounts: Array<Accounts>;
  /** fetch aggregated fields from the table: "accounts" */
  accounts_aggregate: Accounts_Aggregate;
  /** fetch data from the table: "accounts" using primary key columns */
  accounts_by_pk?: Maybe<Accounts>;
  /** fetch data from the table in a streaming manner: "accounts" */
  accounts_stream: Array<Accounts>;
  /** fetch data from the table: "blocks" */
  blocks: Array<Blocks>;
  /** fetch aggregated fields from the table: "blocks" */
  blocks_aggregate: Blocks_Aggregate;
  /** fetch data from the table: "blocks" using primary key columns */
  blocks_by_pk?: Maybe<Blocks>;
  /** fetch data from the table in a streaming manner: "blocks" */
  blocks_stream: Array<Blocks>;
  /** An array relationship */
  code_proposals: Array<Code_Proposals>;
  /** An aggregate relationship */
  code_proposals_aggregate: Code_Proposals_Aggregate;
  /** fetch data from the table in a streaming manner: "code_proposals" */
  code_proposals_stream: Array<Code_Proposals>;
  /** An array relationship */
  codes: Array<Codes>;
  /** An aggregate relationship */
  codes_aggregate: Codes_Aggregate;
  /** fetch data from the table: "codes" using primary key columns */
  codes_by_pk?: Maybe<Codes>;
  /** fetch data from the table in a streaming manner: "codes" */
  codes_stream: Array<Codes>;
  /** An array relationship */
  contract_histories: Array<Contract_Histories>;
  /** An aggregate relationship */
  contract_histories_aggregate: Contract_Histories_Aggregate;
  /** fetch data from the table in a streaming manner: "contract_histories" */
  contract_histories_stream: Array<Contract_Histories>;
  /** An array relationship */
  contract_proposals: Array<Contract_Proposals>;
  /** An aggregate relationship */
  contract_proposals_aggregate: Contract_Proposals_Aggregate;
  /** fetch data from the table in a streaming manner: "contract_proposals" */
  contract_proposals_stream: Array<Contract_Proposals>;
  /** An array relationship */
  contract_transactions: Array<Contract_Transactions>;
  /** An aggregate relationship */
  contract_transactions_aggregate: Contract_Transactions_Aggregate;
  /** fetch data from the table: "contract_transactions_ja" */
  contract_transactions_ja: Array<Contract_Transactions_Ja>;
  /** fetch aggregated fields from the table: "contract_transactions_ja" */
  contract_transactions_ja_aggregate: Contract_Transactions_Ja_Aggregate;
  /** fetch data from the table in a streaming manner: "contract_transactions_ja" */
  contract_transactions_ja_stream: Array<Contract_Transactions_Ja>;
  /** fetch data from the table in a streaming manner: "contract_transactions" */
  contract_transactions_stream: Array<Contract_Transactions>;
  /** fetch data from the table: "contract_transactions_view" */
  contract_transactions_view: Array<Contract_Transactions_View>;
  /** fetch aggregated fields from the table: "contract_transactions_view" */
  contract_transactions_view_aggregate: Contract_Transactions_View_Aggregate;
  /** fetch data from the table in a streaming manner: "contract_transactions_view" */
  contract_transactions_view_stream: Array<Contract_Transactions_View>;
  /** An array relationship */
  contracts: Array<Contracts>;
  /** An aggregate relationship */
  contracts_aggregate: Contracts_Aggregate;
  /** fetch data from the table: "contracts" using primary key columns */
  contracts_by_pk?: Maybe<Contracts>;
  /** fetch data from the table in a streaming manner: "contracts" */
  contracts_stream: Array<Contracts>;
  /** An array relationship */
  proposals: Array<Proposals>;
  /** An aggregate relationship */
  proposals_aggregate: Proposals_Aggregate;
  /** fetch data from the table: "proposals" using primary key columns */
  proposals_by_pk?: Maybe<Proposals>;
  /** fetch data from the table in a streaming manner: "proposals" */
  proposals_stream: Array<Proposals>;
  /** fetch data from the table: "tracking" */
  tracking: Array<Tracking>;
  /** fetch aggregated fields from the table: "tracking" */
  tracking_aggregate: Tracking_Aggregate;
  /** fetch data from the table: "tracking" using primary key columns */
  tracking_by_pk?: Maybe<Tracking>;
  /** fetch data from the table in a streaming manner: "tracking" */
  tracking_stream: Array<Tracking>;
  /** An array relationship */
  transactions: Array<Transactions>;
  /** An aggregate relationship */
  transactions_aggregate: Transactions_Aggregate;
  /** fetch data from the table: "transactions" using primary key columns */
  transactions_by_pk?: Maybe<Transactions>;
  /** fetch data from the table in a streaming manner: "transactions" */
  transactions_stream: Array<Transactions>;
};

export type Subscription_RootAccount_TransactionsArgs = {
  distinct_on?: InputMaybe<Array<Account_Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Account_Transactions_Order_By>>;
  where?: InputMaybe<Account_Transactions_Bool_Exp>;
};

export type Subscription_RootAccount_Transactions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Account_Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Account_Transactions_Order_By>>;
  where?: InputMaybe<Account_Transactions_Bool_Exp>;
};

export type Subscription_RootAccount_Transactions_By_PkArgs = {
  account_id: Scalars["Int"];
  transaction_id: Scalars["Int"];
};

export type Subscription_RootAccount_Transactions_StreamArgs = {
  batch_size: Scalars["Int"];
  cursor: Array<InputMaybe<Account_Transactions_Stream_Cursor_Input>>;
  where?: InputMaybe<Account_Transactions_Bool_Exp>;
};

export type Subscription_RootAccountsArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Accounts_Order_By>>;
  where?: InputMaybe<Accounts_Bool_Exp>;
};

export type Subscription_RootAccounts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Accounts_Order_By>>;
  where?: InputMaybe<Accounts_Bool_Exp>;
};

export type Subscription_RootAccounts_By_PkArgs = {
  address: Scalars["String"];
};

export type Subscription_RootAccounts_StreamArgs = {
  batch_size: Scalars["Int"];
  cursor: Array<InputMaybe<Accounts_Stream_Cursor_Input>>;
  where?: InputMaybe<Accounts_Bool_Exp>;
};

export type Subscription_RootBlocksArgs = {
  distinct_on?: InputMaybe<Array<Blocks_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Blocks_Order_By>>;
  where?: InputMaybe<Blocks_Bool_Exp>;
};

export type Subscription_RootBlocks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Blocks_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Blocks_Order_By>>;
  where?: InputMaybe<Blocks_Bool_Exp>;
};

export type Subscription_RootBlocks_By_PkArgs = {
  height: Scalars["Int"];
};

export type Subscription_RootBlocks_StreamArgs = {
  batch_size: Scalars["Int"];
  cursor: Array<InputMaybe<Blocks_Stream_Cursor_Input>>;
  where?: InputMaybe<Blocks_Bool_Exp>;
};

export type Subscription_RootCode_ProposalsArgs = {
  distinct_on?: InputMaybe<Array<Code_Proposals_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Code_Proposals_Order_By>>;
  where?: InputMaybe<Code_Proposals_Bool_Exp>;
};

export type Subscription_RootCode_Proposals_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Code_Proposals_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Code_Proposals_Order_By>>;
  where?: InputMaybe<Code_Proposals_Bool_Exp>;
};

export type Subscription_RootCode_Proposals_StreamArgs = {
  batch_size: Scalars["Int"];
  cursor: Array<InputMaybe<Code_Proposals_Stream_Cursor_Input>>;
  where?: InputMaybe<Code_Proposals_Bool_Exp>;
};

export type Subscription_RootCodesArgs = {
  distinct_on?: InputMaybe<Array<Codes_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Codes_Order_By>>;
  where?: InputMaybe<Codes_Bool_Exp>;
};

export type Subscription_RootCodes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Codes_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Codes_Order_By>>;
  where?: InputMaybe<Codes_Bool_Exp>;
};

export type Subscription_RootCodes_By_PkArgs = {
  id: Scalars["Int"];
};

export type Subscription_RootCodes_StreamArgs = {
  batch_size: Scalars["Int"];
  cursor: Array<InputMaybe<Codes_Stream_Cursor_Input>>;
  where?: InputMaybe<Codes_Bool_Exp>;
};

export type Subscription_RootContract_HistoriesArgs = {
  distinct_on?: InputMaybe<Array<Contract_Histories_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contract_Histories_Order_By>>;
  where?: InputMaybe<Contract_Histories_Bool_Exp>;
};

export type Subscription_RootContract_Histories_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Contract_Histories_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contract_Histories_Order_By>>;
  where?: InputMaybe<Contract_Histories_Bool_Exp>;
};

export type Subscription_RootContract_Histories_StreamArgs = {
  batch_size: Scalars["Int"];
  cursor: Array<InputMaybe<Contract_Histories_Stream_Cursor_Input>>;
  where?: InputMaybe<Contract_Histories_Bool_Exp>;
};

export type Subscription_RootContract_ProposalsArgs = {
  distinct_on?: InputMaybe<Array<Contract_Proposals_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contract_Proposals_Order_By>>;
  where?: InputMaybe<Contract_Proposals_Bool_Exp>;
};

export type Subscription_RootContract_Proposals_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Contract_Proposals_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contract_Proposals_Order_By>>;
  where?: InputMaybe<Contract_Proposals_Bool_Exp>;
};

export type Subscription_RootContract_Proposals_StreamArgs = {
  batch_size: Scalars["Int"];
  cursor: Array<InputMaybe<Contract_Proposals_Stream_Cursor_Input>>;
  where?: InputMaybe<Contract_Proposals_Bool_Exp>;
};

export type Subscription_RootContract_TransactionsArgs = {
  distinct_on?: InputMaybe<Array<Contract_Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contract_Transactions_Order_By>>;
  where?: InputMaybe<Contract_Transactions_Bool_Exp>;
};

export type Subscription_RootContract_Transactions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Contract_Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contract_Transactions_Order_By>>;
  where?: InputMaybe<Contract_Transactions_Bool_Exp>;
};

export type Subscription_RootContract_Transactions_JaArgs = {
  distinct_on?: InputMaybe<Array<Contract_Transactions_Ja_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contract_Transactions_Ja_Order_By>>;
  where?: InputMaybe<Contract_Transactions_Ja_Bool_Exp>;
};

export type Subscription_RootContract_Transactions_Ja_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Contract_Transactions_Ja_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contract_Transactions_Ja_Order_By>>;
  where?: InputMaybe<Contract_Transactions_Ja_Bool_Exp>;
};

export type Subscription_RootContract_Transactions_Ja_StreamArgs = {
  batch_size: Scalars["Int"];
  cursor: Array<InputMaybe<Contract_Transactions_Ja_Stream_Cursor_Input>>;
  where?: InputMaybe<Contract_Transactions_Ja_Bool_Exp>;
};

export type Subscription_RootContract_Transactions_StreamArgs = {
  batch_size: Scalars["Int"];
  cursor: Array<InputMaybe<Contract_Transactions_Stream_Cursor_Input>>;
  where?: InputMaybe<Contract_Transactions_Bool_Exp>;
};

export type Subscription_RootContract_Transactions_ViewArgs = {
  distinct_on?: InputMaybe<Array<Contract_Transactions_View_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contract_Transactions_View_Order_By>>;
  where?: InputMaybe<Contract_Transactions_View_Bool_Exp>;
};

export type Subscription_RootContract_Transactions_View_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Contract_Transactions_View_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contract_Transactions_View_Order_By>>;
  where?: InputMaybe<Contract_Transactions_View_Bool_Exp>;
};

export type Subscription_RootContract_Transactions_View_StreamArgs = {
  batch_size: Scalars["Int"];
  cursor: Array<InputMaybe<Contract_Transactions_View_Stream_Cursor_Input>>;
  where?: InputMaybe<Contract_Transactions_View_Bool_Exp>;
};

export type Subscription_RootContractsArgs = {
  distinct_on?: InputMaybe<Array<Contracts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contracts_Order_By>>;
  where?: InputMaybe<Contracts_Bool_Exp>;
};

export type Subscription_RootContracts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Contracts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contracts_Order_By>>;
  where?: InputMaybe<Contracts_Bool_Exp>;
};

export type Subscription_RootContracts_By_PkArgs = {
  address: Scalars["String"];
};

export type Subscription_RootContracts_StreamArgs = {
  batch_size: Scalars["Int"];
  cursor: Array<InputMaybe<Contracts_Stream_Cursor_Input>>;
  where?: InputMaybe<Contracts_Bool_Exp>;
};

export type Subscription_RootProposalsArgs = {
  distinct_on?: InputMaybe<Array<Proposals_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Proposals_Order_By>>;
  where?: InputMaybe<Proposals_Bool_Exp>;
};

export type Subscription_RootProposals_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Proposals_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Proposals_Order_By>>;
  where?: InputMaybe<Proposals_Bool_Exp>;
};

export type Subscription_RootProposals_By_PkArgs = {
  id: Scalars["Int"];
};

export type Subscription_RootProposals_StreamArgs = {
  batch_size: Scalars["Int"];
  cursor: Array<InputMaybe<Proposals_Stream_Cursor_Input>>;
  where?: InputMaybe<Proposals_Bool_Exp>;
};

export type Subscription_RootTrackingArgs = {
  distinct_on?: InputMaybe<Array<Tracking_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Tracking_Order_By>>;
  where?: InputMaybe<Tracking_Bool_Exp>;
};

export type Subscription_RootTracking_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Tracking_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Tracking_Order_By>>;
  where?: InputMaybe<Tracking_Bool_Exp>;
};

export type Subscription_RootTracking_By_PkArgs = {
  chain_id: Scalars["String"];
};

export type Subscription_RootTracking_StreamArgs = {
  batch_size: Scalars["Int"];
  cursor: Array<InputMaybe<Tracking_Stream_Cursor_Input>>;
  where?: InputMaybe<Tracking_Bool_Exp>;
};

export type Subscription_RootTransactionsArgs = {
  distinct_on?: InputMaybe<Array<Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Transactions_Order_By>>;
  where?: InputMaybe<Transactions_Bool_Exp>;
};

export type Subscription_RootTransactions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Transactions_Order_By>>;
  where?: InputMaybe<Transactions_Bool_Exp>;
};

export type Subscription_RootTransactions_By_PkArgs = {
  hash: Scalars["bytea"];
};

export type Subscription_RootTransactions_StreamArgs = {
  batch_size: Scalars["Int"];
  cursor: Array<InputMaybe<Transactions_Stream_Cursor_Input>>;
  where?: InputMaybe<Transactions_Bool_Exp>;
};

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type Timestamp_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["timestamp"]>;
  _gt?: InputMaybe<Scalars["timestamp"]>;
  _gte?: InputMaybe<Scalars["timestamp"]>;
  _in?: InputMaybe<Array<Scalars["timestamp"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]>;
  _lt?: InputMaybe<Scalars["timestamp"]>;
  _lte?: InputMaybe<Scalars["timestamp"]>;
  _neq?: InputMaybe<Scalars["timestamp"]>;
  _nin?: InputMaybe<Array<Scalars["timestamp"]>>;
};

/** columns and relationships of "tracking" */
export type Tracking = {
  __typename?: "tracking";
  chain_id: Scalars["String"];
  kafka_offset: Scalars["Int"];
  replay_offset: Scalars["Int"];
  replay_topic: Scalars["String"];
  topic: Scalars["String"];
};

/** aggregated selection of "tracking" */
export type Tracking_Aggregate = {
  __typename?: "tracking_aggregate";
  aggregate?: Maybe<Tracking_Aggregate_Fields>;
  nodes: Array<Tracking>;
};

/** aggregate fields of "tracking" */
export type Tracking_Aggregate_Fields = {
  __typename?: "tracking_aggregate_fields";
  avg?: Maybe<Tracking_Avg_Fields>;
  count: Scalars["Int"];
  max?: Maybe<Tracking_Max_Fields>;
  min?: Maybe<Tracking_Min_Fields>;
  stddev?: Maybe<Tracking_Stddev_Fields>;
  stddev_pop?: Maybe<Tracking_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Tracking_Stddev_Samp_Fields>;
  sum?: Maybe<Tracking_Sum_Fields>;
  var_pop?: Maybe<Tracking_Var_Pop_Fields>;
  var_samp?: Maybe<Tracking_Var_Samp_Fields>;
  variance?: Maybe<Tracking_Variance_Fields>;
};

/** aggregate fields of "tracking" */
export type Tracking_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Tracking_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]>;
};

/** aggregate avg on columns */
export type Tracking_Avg_Fields = {
  __typename?: "tracking_avg_fields";
  kafka_offset?: Maybe<Scalars["Float"]>;
  replay_offset?: Maybe<Scalars["Float"]>;
};

/** Boolean expression to filter rows from the table "tracking". All fields are combined with a logical 'AND'. */
export type Tracking_Bool_Exp = {
  _and?: InputMaybe<Array<Tracking_Bool_Exp>>;
  _not?: InputMaybe<Tracking_Bool_Exp>;
  _or?: InputMaybe<Array<Tracking_Bool_Exp>>;
  chain_id?: InputMaybe<String_Comparison_Exp>;
  kafka_offset?: InputMaybe<Int_Comparison_Exp>;
  replay_offset?: InputMaybe<Int_Comparison_Exp>;
  replay_topic?: InputMaybe<String_Comparison_Exp>;
  topic?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "tracking" */
export enum Tracking_Constraint {
  /** unique or primary key constraint on columns "chain_id" */
  TrackingPkey = "tracking_pkey",
}

/** input type for incrementing numeric columns in table "tracking" */
export type Tracking_Inc_Input = {
  kafka_offset?: InputMaybe<Scalars["Int"]>;
  replay_offset?: InputMaybe<Scalars["Int"]>;
};

/** input type for inserting data into table "tracking" */
export type Tracking_Insert_Input = {
  chain_id?: InputMaybe<Scalars["String"]>;
  kafka_offset?: InputMaybe<Scalars["Int"]>;
  replay_offset?: InputMaybe<Scalars["Int"]>;
  replay_topic?: InputMaybe<Scalars["String"]>;
  topic?: InputMaybe<Scalars["String"]>;
};

/** aggregate max on columns */
export type Tracking_Max_Fields = {
  __typename?: "tracking_max_fields";
  chain_id?: Maybe<Scalars["String"]>;
  kafka_offset?: Maybe<Scalars["Int"]>;
  replay_offset?: Maybe<Scalars["Int"]>;
  replay_topic?: Maybe<Scalars["String"]>;
  topic?: Maybe<Scalars["String"]>;
};

/** aggregate min on columns */
export type Tracking_Min_Fields = {
  __typename?: "tracking_min_fields";
  chain_id?: Maybe<Scalars["String"]>;
  kafka_offset?: Maybe<Scalars["Int"]>;
  replay_offset?: Maybe<Scalars["Int"]>;
  replay_topic?: Maybe<Scalars["String"]>;
  topic?: Maybe<Scalars["String"]>;
};

/** response of any mutation on the table "tracking" */
export type Tracking_Mutation_Response = {
  __typename?: "tracking_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"];
  /** data from the rows affected by the mutation */
  returning: Array<Tracking>;
};

/** on_conflict condition type for table "tracking" */
export type Tracking_On_Conflict = {
  constraint: Tracking_Constraint;
  update_columns?: Array<Tracking_Update_Column>;
  where?: InputMaybe<Tracking_Bool_Exp>;
};

/** Ordering options when selecting data from "tracking". */
export type Tracking_Order_By = {
  chain_id?: InputMaybe<Order_By>;
  kafka_offset?: InputMaybe<Order_By>;
  replay_offset?: InputMaybe<Order_By>;
  replay_topic?: InputMaybe<Order_By>;
  topic?: InputMaybe<Order_By>;
};

/** primary key columns input for table: tracking */
export type Tracking_Pk_Columns_Input = {
  chain_id: Scalars["String"];
};

/** select columns of table "tracking" */
export enum Tracking_Select_Column {
  /** column name */
  ChainId = "chain_id",
  /** column name */
  KafkaOffset = "kafka_offset",
  /** column name */
  ReplayOffset = "replay_offset",
  /** column name */
  ReplayTopic = "replay_topic",
  /** column name */
  Topic = "topic",
}

/** input type for updating data in table "tracking" */
export type Tracking_Set_Input = {
  chain_id?: InputMaybe<Scalars["String"]>;
  kafka_offset?: InputMaybe<Scalars["Int"]>;
  replay_offset?: InputMaybe<Scalars["Int"]>;
  replay_topic?: InputMaybe<Scalars["String"]>;
  topic?: InputMaybe<Scalars["String"]>;
};

/** aggregate stddev on columns */
export type Tracking_Stddev_Fields = {
  __typename?: "tracking_stddev_fields";
  kafka_offset?: Maybe<Scalars["Float"]>;
  replay_offset?: Maybe<Scalars["Float"]>;
};

/** aggregate stddev_pop on columns */
export type Tracking_Stddev_Pop_Fields = {
  __typename?: "tracking_stddev_pop_fields";
  kafka_offset?: Maybe<Scalars["Float"]>;
  replay_offset?: Maybe<Scalars["Float"]>;
};

/** aggregate stddev_samp on columns */
export type Tracking_Stddev_Samp_Fields = {
  __typename?: "tracking_stddev_samp_fields";
  kafka_offset?: Maybe<Scalars["Float"]>;
  replay_offset?: Maybe<Scalars["Float"]>;
};

/** Streaming cursor of the table "tracking" */
export type Tracking_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Tracking_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Tracking_Stream_Cursor_Value_Input = {
  chain_id?: InputMaybe<Scalars["String"]>;
  kafka_offset?: InputMaybe<Scalars["Int"]>;
  replay_offset?: InputMaybe<Scalars["Int"]>;
  replay_topic?: InputMaybe<Scalars["String"]>;
  topic?: InputMaybe<Scalars["String"]>;
};

/** aggregate sum on columns */
export type Tracking_Sum_Fields = {
  __typename?: "tracking_sum_fields";
  kafka_offset?: Maybe<Scalars["Int"]>;
  replay_offset?: Maybe<Scalars["Int"]>;
};

/** update columns of table "tracking" */
export enum Tracking_Update_Column {
  /** column name */
  ChainId = "chain_id",
  /** column name */
  KafkaOffset = "kafka_offset",
  /** column name */
  ReplayOffset = "replay_offset",
  /** column name */
  ReplayTopic = "replay_topic",
  /** column name */
  Topic = "topic",
}

export type Tracking_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Tracking_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Tracking_Set_Input>;
  where: Tracking_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Tracking_Var_Pop_Fields = {
  __typename?: "tracking_var_pop_fields";
  kafka_offset?: Maybe<Scalars["Float"]>;
  replay_offset?: Maybe<Scalars["Float"]>;
};

/** aggregate var_samp on columns */
export type Tracking_Var_Samp_Fields = {
  __typename?: "tracking_var_samp_fields";
  kafka_offset?: Maybe<Scalars["Float"]>;
  replay_offset?: Maybe<Scalars["Float"]>;
};

/** aggregate variance on columns */
export type Tracking_Variance_Fields = {
  __typename?: "tracking_variance_fields";
  kafka_offset?: Maybe<Scalars["Float"]>;
  replay_offset?: Maybe<Scalars["Float"]>;
};

/** columns and relationships of "transactions" */
export type Transactions = {
  __typename?: "transactions";
  /** An object relationship */
  account: Accounts;
  /** An array relationship */
  account_transactions: Array<Account_Transactions>;
  /** An aggregate relationship */
  account_transactions_aggregate: Account_Transactions_Aggregate;
  /** An object relationship */
  block: Blocks;
  block_height: Scalars["Int"];
  /** An array relationship */
  codes: Array<Codes>;
  /** An aggregate relationship */
  codes_aggregate: Codes_Aggregate;
  /** An array relationship */
  contract_transactions: Array<Contract_Transactions>;
  /** An aggregate relationship */
  contract_transactions_aggregate: Contract_Transactions_Aggregate;
  /** An array relationship */
  contracts: Array<Contracts>;
  /** An aggregate relationship */
  contracts_aggregate: Contracts_Aggregate;
  err_msg?: Maybe<Scalars["String"]>;
  gas_fee: Scalars["String"];
  gas_limit: Scalars["Int"];
  gas_used: Scalars["Int"];
  hash: Scalars["bytea"];
  id: Scalars["Int"];
  is_clear_admin: Scalars["Boolean"];
  is_execute: Scalars["Boolean"];
  is_ibc: Scalars["Boolean"];
  is_instantiate: Scalars["Boolean"];
  is_migrate: Scalars["Boolean"];
  is_send: Scalars["Boolean"];
  is_store_code: Scalars["Boolean"];
  is_update_admin: Scalars["Boolean"];
  memo: Scalars["String"];
  messages: Scalars["json"];
  sender: Scalars["Int"];
  success: Scalars["Boolean"];
};

/** columns and relationships of "transactions" */
export type TransactionsAccount_TransactionsArgs = {
  distinct_on?: InputMaybe<Array<Account_Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Account_Transactions_Order_By>>;
  where?: InputMaybe<Account_Transactions_Bool_Exp>;
};

/** columns and relationships of "transactions" */
export type TransactionsAccount_Transactions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Account_Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Account_Transactions_Order_By>>;
  where?: InputMaybe<Account_Transactions_Bool_Exp>;
};

/** columns and relationships of "transactions" */
export type TransactionsCodesArgs = {
  distinct_on?: InputMaybe<Array<Codes_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Codes_Order_By>>;
  where?: InputMaybe<Codes_Bool_Exp>;
};

/** columns and relationships of "transactions" */
export type TransactionsCodes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Codes_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Codes_Order_By>>;
  where?: InputMaybe<Codes_Bool_Exp>;
};

/** columns and relationships of "transactions" */
export type TransactionsContract_TransactionsArgs = {
  distinct_on?: InputMaybe<Array<Contract_Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contract_Transactions_Order_By>>;
  where?: InputMaybe<Contract_Transactions_Bool_Exp>;
};

/** columns and relationships of "transactions" */
export type TransactionsContract_Transactions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Contract_Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contract_Transactions_Order_By>>;
  where?: InputMaybe<Contract_Transactions_Bool_Exp>;
};

/** columns and relationships of "transactions" */
export type TransactionsContractsArgs = {
  distinct_on?: InputMaybe<Array<Contracts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contracts_Order_By>>;
  where?: InputMaybe<Contracts_Bool_Exp>;
};

/** columns and relationships of "transactions" */
export type TransactionsContracts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Contracts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  order_by?: InputMaybe<Array<Contracts_Order_By>>;
  where?: InputMaybe<Contracts_Bool_Exp>;
};

/** columns and relationships of "transactions" */
export type TransactionsMessagesArgs = {
  path?: InputMaybe<Scalars["String"]>;
};

/** aggregated selection of "transactions" */
export type Transactions_Aggregate = {
  __typename?: "transactions_aggregate";
  aggregate?: Maybe<Transactions_Aggregate_Fields>;
  nodes: Array<Transactions>;
};

export type Transactions_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Transactions_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Transactions_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Transactions_Aggregate_Bool_Exp_Count>;
};

export type Transactions_Aggregate_Bool_Exp_Bool_And = {
  arguments: Transactions_Select_Column_Transactions_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]>;
  filter?: InputMaybe<Transactions_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Transactions_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Transactions_Select_Column_Transactions_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]>;
  filter?: InputMaybe<Transactions_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Transactions_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Transactions_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]>;
  filter?: InputMaybe<Transactions_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "transactions" */
export type Transactions_Aggregate_Fields = {
  __typename?: "transactions_aggregate_fields";
  avg?: Maybe<Transactions_Avg_Fields>;
  count: Scalars["Int"];
  max?: Maybe<Transactions_Max_Fields>;
  min?: Maybe<Transactions_Min_Fields>;
  stddev?: Maybe<Transactions_Stddev_Fields>;
  stddev_pop?: Maybe<Transactions_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Transactions_Stddev_Samp_Fields>;
  sum?: Maybe<Transactions_Sum_Fields>;
  var_pop?: Maybe<Transactions_Var_Pop_Fields>;
  var_samp?: Maybe<Transactions_Var_Samp_Fields>;
  variance?: Maybe<Transactions_Variance_Fields>;
};

/** aggregate fields of "transactions" */
export type Transactions_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Transactions_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]>;
};

/** order by aggregate values of table "transactions" */
export type Transactions_Aggregate_Order_By = {
  avg?: InputMaybe<Transactions_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Transactions_Max_Order_By>;
  min?: InputMaybe<Transactions_Min_Order_By>;
  stddev?: InputMaybe<Transactions_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Transactions_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Transactions_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Transactions_Sum_Order_By>;
  var_pop?: InputMaybe<Transactions_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Transactions_Var_Samp_Order_By>;
  variance?: InputMaybe<Transactions_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "transactions" */
export type Transactions_Arr_Rel_Insert_Input = {
  data: Array<Transactions_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Transactions_On_Conflict>;
};

/** aggregate avg on columns */
export type Transactions_Avg_Fields = {
  __typename?: "transactions_avg_fields";
  block_height?: Maybe<Scalars["Float"]>;
  gas_limit?: Maybe<Scalars["Float"]>;
  gas_used?: Maybe<Scalars["Float"]>;
  id?: Maybe<Scalars["Float"]>;
  sender?: Maybe<Scalars["Float"]>;
};

/** order by avg() on columns of table "transactions" */
export type Transactions_Avg_Order_By = {
  block_height?: InputMaybe<Order_By>;
  gas_limit?: InputMaybe<Order_By>;
  gas_used?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  sender?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "transactions". All fields are combined with a logical 'AND'. */
export type Transactions_Bool_Exp = {
  _and?: InputMaybe<Array<Transactions_Bool_Exp>>;
  _not?: InputMaybe<Transactions_Bool_Exp>;
  _or?: InputMaybe<Array<Transactions_Bool_Exp>>;
  account?: InputMaybe<Accounts_Bool_Exp>;
  account_transactions?: InputMaybe<Account_Transactions_Bool_Exp>;
  account_transactions_aggregate?: InputMaybe<Account_Transactions_Aggregate_Bool_Exp>;
  block?: InputMaybe<Blocks_Bool_Exp>;
  block_height?: InputMaybe<Int_Comparison_Exp>;
  codes?: InputMaybe<Codes_Bool_Exp>;
  codes_aggregate?: InputMaybe<Codes_Aggregate_Bool_Exp>;
  contract_transactions?: InputMaybe<Contract_Transactions_Bool_Exp>;
  contract_transactions_aggregate?: InputMaybe<Contract_Transactions_Aggregate_Bool_Exp>;
  contracts?: InputMaybe<Contracts_Bool_Exp>;
  contracts_aggregate?: InputMaybe<Contracts_Aggregate_Bool_Exp>;
  err_msg?: InputMaybe<String_Comparison_Exp>;
  gas_fee?: InputMaybe<String_Comparison_Exp>;
  gas_limit?: InputMaybe<Int_Comparison_Exp>;
  gas_used?: InputMaybe<Int_Comparison_Exp>;
  hash?: InputMaybe<Bytea_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  is_clear_admin?: InputMaybe<Boolean_Comparison_Exp>;
  is_execute?: InputMaybe<Boolean_Comparison_Exp>;
  is_ibc?: InputMaybe<Boolean_Comparison_Exp>;
  is_instantiate?: InputMaybe<Boolean_Comparison_Exp>;
  is_migrate?: InputMaybe<Boolean_Comparison_Exp>;
  is_send?: InputMaybe<Boolean_Comparison_Exp>;
  is_store_code?: InputMaybe<Boolean_Comparison_Exp>;
  is_update_admin?: InputMaybe<Boolean_Comparison_Exp>;
  memo?: InputMaybe<String_Comparison_Exp>;
  messages?: InputMaybe<Json_Comparison_Exp>;
  sender?: InputMaybe<Int_Comparison_Exp>;
  success?: InputMaybe<Boolean_Comparison_Exp>;
};

/** unique or primary key constraints on table "transactions" */
export enum Transactions_Constraint {
  /** unique or primary key constraint on columns "id" */
  TransactionsIdKey = "transactions_id_key",
  /** unique or primary key constraint on columns "hash" */
  TransactionsPkey = "transactions_pkey",
}

/** input type for incrementing numeric columns in table "transactions" */
export type Transactions_Inc_Input = {
  block_height?: InputMaybe<Scalars["Int"]>;
  gas_limit?: InputMaybe<Scalars["Int"]>;
  gas_used?: InputMaybe<Scalars["Int"]>;
  id?: InputMaybe<Scalars["Int"]>;
  sender?: InputMaybe<Scalars["Int"]>;
};

/** input type for inserting data into table "transactions" */
export type Transactions_Insert_Input = {
  account?: InputMaybe<Accounts_Obj_Rel_Insert_Input>;
  account_transactions?: InputMaybe<Account_Transactions_Arr_Rel_Insert_Input>;
  block?: InputMaybe<Blocks_Obj_Rel_Insert_Input>;
  block_height?: InputMaybe<Scalars["Int"]>;
  codes?: InputMaybe<Codes_Arr_Rel_Insert_Input>;
  contract_transactions?: InputMaybe<Contract_Transactions_Arr_Rel_Insert_Input>;
  contracts?: InputMaybe<Contracts_Arr_Rel_Insert_Input>;
  err_msg?: InputMaybe<Scalars["String"]>;
  gas_fee?: InputMaybe<Scalars["String"]>;
  gas_limit?: InputMaybe<Scalars["Int"]>;
  gas_used?: InputMaybe<Scalars["Int"]>;
  hash?: InputMaybe<Scalars["bytea"]>;
  id?: InputMaybe<Scalars["Int"]>;
  is_clear_admin?: InputMaybe<Scalars["Boolean"]>;
  is_execute?: InputMaybe<Scalars["Boolean"]>;
  is_ibc?: InputMaybe<Scalars["Boolean"]>;
  is_instantiate?: InputMaybe<Scalars["Boolean"]>;
  is_migrate?: InputMaybe<Scalars["Boolean"]>;
  is_send?: InputMaybe<Scalars["Boolean"]>;
  is_store_code?: InputMaybe<Scalars["Boolean"]>;
  is_update_admin?: InputMaybe<Scalars["Boolean"]>;
  memo?: InputMaybe<Scalars["String"]>;
  messages?: InputMaybe<Scalars["json"]>;
  sender?: InputMaybe<Scalars["Int"]>;
  success?: InputMaybe<Scalars["Boolean"]>;
};

/** aggregate max on columns */
export type Transactions_Max_Fields = {
  __typename?: "transactions_max_fields";
  block_height?: Maybe<Scalars["Int"]>;
  err_msg?: Maybe<Scalars["String"]>;
  gas_fee?: Maybe<Scalars["String"]>;
  gas_limit?: Maybe<Scalars["Int"]>;
  gas_used?: Maybe<Scalars["Int"]>;
  id?: Maybe<Scalars["Int"]>;
  memo?: Maybe<Scalars["String"]>;
  sender?: Maybe<Scalars["Int"]>;
};

/** order by max() on columns of table "transactions" */
export type Transactions_Max_Order_By = {
  block_height?: InputMaybe<Order_By>;
  err_msg?: InputMaybe<Order_By>;
  gas_fee?: InputMaybe<Order_By>;
  gas_limit?: InputMaybe<Order_By>;
  gas_used?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  memo?: InputMaybe<Order_By>;
  sender?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Transactions_Min_Fields = {
  __typename?: "transactions_min_fields";
  block_height?: Maybe<Scalars["Int"]>;
  err_msg?: Maybe<Scalars["String"]>;
  gas_fee?: Maybe<Scalars["String"]>;
  gas_limit?: Maybe<Scalars["Int"]>;
  gas_used?: Maybe<Scalars["Int"]>;
  id?: Maybe<Scalars["Int"]>;
  memo?: Maybe<Scalars["String"]>;
  sender?: Maybe<Scalars["Int"]>;
};

/** order by min() on columns of table "transactions" */
export type Transactions_Min_Order_By = {
  block_height?: InputMaybe<Order_By>;
  err_msg?: InputMaybe<Order_By>;
  gas_fee?: InputMaybe<Order_By>;
  gas_limit?: InputMaybe<Order_By>;
  gas_used?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  memo?: InputMaybe<Order_By>;
  sender?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "transactions" */
export type Transactions_Mutation_Response = {
  __typename?: "transactions_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"];
  /** data from the rows affected by the mutation */
  returning: Array<Transactions>;
};

/** input type for inserting object relation for remote table "transactions" */
export type Transactions_Obj_Rel_Insert_Input = {
  data: Transactions_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Transactions_On_Conflict>;
};

/** on_conflict condition type for table "transactions" */
export type Transactions_On_Conflict = {
  constraint: Transactions_Constraint;
  update_columns?: Array<Transactions_Update_Column>;
  where?: InputMaybe<Transactions_Bool_Exp>;
};

/** Ordering options when selecting data from "transactions". */
export type Transactions_Order_By = {
  account?: InputMaybe<Accounts_Order_By>;
  account_transactions_aggregate?: InputMaybe<Account_Transactions_Aggregate_Order_By>;
  block?: InputMaybe<Blocks_Order_By>;
  block_height?: InputMaybe<Order_By>;
  codes_aggregate?: InputMaybe<Codes_Aggregate_Order_By>;
  contract_transactions_aggregate?: InputMaybe<Contract_Transactions_Aggregate_Order_By>;
  contracts_aggregate?: InputMaybe<Contracts_Aggregate_Order_By>;
  err_msg?: InputMaybe<Order_By>;
  gas_fee?: InputMaybe<Order_By>;
  gas_limit?: InputMaybe<Order_By>;
  gas_used?: InputMaybe<Order_By>;
  hash?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_clear_admin?: InputMaybe<Order_By>;
  is_execute?: InputMaybe<Order_By>;
  is_ibc?: InputMaybe<Order_By>;
  is_instantiate?: InputMaybe<Order_By>;
  is_migrate?: InputMaybe<Order_By>;
  is_send?: InputMaybe<Order_By>;
  is_store_code?: InputMaybe<Order_By>;
  is_update_admin?: InputMaybe<Order_By>;
  memo?: InputMaybe<Order_By>;
  messages?: InputMaybe<Order_By>;
  sender?: InputMaybe<Order_By>;
  success?: InputMaybe<Order_By>;
};

/** primary key columns input for table: transactions */
export type Transactions_Pk_Columns_Input = {
  hash: Scalars["bytea"];
};

/** select columns of table "transactions" */
export enum Transactions_Select_Column {
  /** column name */
  BlockHeight = "block_height",
  /** column name */
  ErrMsg = "err_msg",
  /** column name */
  GasFee = "gas_fee",
  /** column name */
  GasLimit = "gas_limit",
  /** column name */
  GasUsed = "gas_used",
  /** column name */
  Hash = "hash",
  /** column name */
  Id = "id",
  /** column name */
  IsClearAdmin = "is_clear_admin",
  /** column name */
  IsExecute = "is_execute",
  /** column name */
  IsIbc = "is_ibc",
  /** column name */
  IsInstantiate = "is_instantiate",
  /** column name */
  IsMigrate = "is_migrate",
  /** column name */
  IsSend = "is_send",
  /** column name */
  IsStoreCode = "is_store_code",
  /** column name */
  IsUpdateAdmin = "is_update_admin",
  /** column name */
  Memo = "memo",
  /** column name */
  Messages = "messages",
  /** column name */
  Sender = "sender",
  /** column name */
  Success = "success",
}

/** select "transactions_aggregate_bool_exp_bool_and_arguments_columns" columns of table "transactions" */
export enum Transactions_Select_Column_Transactions_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsClearAdmin = "is_clear_admin",
  /** column name */
  IsExecute = "is_execute",
  /** column name */
  IsIbc = "is_ibc",
  /** column name */
  IsInstantiate = "is_instantiate",
  /** column name */
  IsMigrate = "is_migrate",
  /** column name */
  IsSend = "is_send",
  /** column name */
  IsStoreCode = "is_store_code",
  /** column name */
  IsUpdateAdmin = "is_update_admin",
  /** column name */
  Success = "success",
}

/** select "transactions_aggregate_bool_exp_bool_or_arguments_columns" columns of table "transactions" */
export enum Transactions_Select_Column_Transactions_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsClearAdmin = "is_clear_admin",
  /** column name */
  IsExecute = "is_execute",
  /** column name */
  IsIbc = "is_ibc",
  /** column name */
  IsInstantiate = "is_instantiate",
  /** column name */
  IsMigrate = "is_migrate",
  /** column name */
  IsSend = "is_send",
  /** column name */
  IsStoreCode = "is_store_code",
  /** column name */
  IsUpdateAdmin = "is_update_admin",
  /** column name */
  Success = "success",
}

/** input type for updating data in table "transactions" */
export type Transactions_Set_Input = {
  block_height?: InputMaybe<Scalars["Int"]>;
  err_msg?: InputMaybe<Scalars["String"]>;
  gas_fee?: InputMaybe<Scalars["String"]>;
  gas_limit?: InputMaybe<Scalars["Int"]>;
  gas_used?: InputMaybe<Scalars["Int"]>;
  hash?: InputMaybe<Scalars["bytea"]>;
  id?: InputMaybe<Scalars["Int"]>;
  is_clear_admin?: InputMaybe<Scalars["Boolean"]>;
  is_execute?: InputMaybe<Scalars["Boolean"]>;
  is_ibc?: InputMaybe<Scalars["Boolean"]>;
  is_instantiate?: InputMaybe<Scalars["Boolean"]>;
  is_migrate?: InputMaybe<Scalars["Boolean"]>;
  is_send?: InputMaybe<Scalars["Boolean"]>;
  is_store_code?: InputMaybe<Scalars["Boolean"]>;
  is_update_admin?: InputMaybe<Scalars["Boolean"]>;
  memo?: InputMaybe<Scalars["String"]>;
  messages?: InputMaybe<Scalars["json"]>;
  sender?: InputMaybe<Scalars["Int"]>;
  success?: InputMaybe<Scalars["Boolean"]>;
};

/** aggregate stddev on columns */
export type Transactions_Stddev_Fields = {
  __typename?: "transactions_stddev_fields";
  block_height?: Maybe<Scalars["Float"]>;
  gas_limit?: Maybe<Scalars["Float"]>;
  gas_used?: Maybe<Scalars["Float"]>;
  id?: Maybe<Scalars["Float"]>;
  sender?: Maybe<Scalars["Float"]>;
};

/** order by stddev() on columns of table "transactions" */
export type Transactions_Stddev_Order_By = {
  block_height?: InputMaybe<Order_By>;
  gas_limit?: InputMaybe<Order_By>;
  gas_used?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  sender?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Transactions_Stddev_Pop_Fields = {
  __typename?: "transactions_stddev_pop_fields";
  block_height?: Maybe<Scalars["Float"]>;
  gas_limit?: Maybe<Scalars["Float"]>;
  gas_used?: Maybe<Scalars["Float"]>;
  id?: Maybe<Scalars["Float"]>;
  sender?: Maybe<Scalars["Float"]>;
};

/** order by stddev_pop() on columns of table "transactions" */
export type Transactions_Stddev_Pop_Order_By = {
  block_height?: InputMaybe<Order_By>;
  gas_limit?: InputMaybe<Order_By>;
  gas_used?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  sender?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Transactions_Stddev_Samp_Fields = {
  __typename?: "transactions_stddev_samp_fields";
  block_height?: Maybe<Scalars["Float"]>;
  gas_limit?: Maybe<Scalars["Float"]>;
  gas_used?: Maybe<Scalars["Float"]>;
  id?: Maybe<Scalars["Float"]>;
  sender?: Maybe<Scalars["Float"]>;
};

/** order by stddev_samp() on columns of table "transactions" */
export type Transactions_Stddev_Samp_Order_By = {
  block_height?: InputMaybe<Order_By>;
  gas_limit?: InputMaybe<Order_By>;
  gas_used?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  sender?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "transactions" */
export type Transactions_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Transactions_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Transactions_Stream_Cursor_Value_Input = {
  block_height?: InputMaybe<Scalars["Int"]>;
  err_msg?: InputMaybe<Scalars["String"]>;
  gas_fee?: InputMaybe<Scalars["String"]>;
  gas_limit?: InputMaybe<Scalars["Int"]>;
  gas_used?: InputMaybe<Scalars["Int"]>;
  hash?: InputMaybe<Scalars["bytea"]>;
  id?: InputMaybe<Scalars["Int"]>;
  is_clear_admin?: InputMaybe<Scalars["Boolean"]>;
  is_execute?: InputMaybe<Scalars["Boolean"]>;
  is_ibc?: InputMaybe<Scalars["Boolean"]>;
  is_instantiate?: InputMaybe<Scalars["Boolean"]>;
  is_migrate?: InputMaybe<Scalars["Boolean"]>;
  is_send?: InputMaybe<Scalars["Boolean"]>;
  is_store_code?: InputMaybe<Scalars["Boolean"]>;
  is_update_admin?: InputMaybe<Scalars["Boolean"]>;
  memo?: InputMaybe<Scalars["String"]>;
  messages?: InputMaybe<Scalars["json"]>;
  sender?: InputMaybe<Scalars["Int"]>;
  success?: InputMaybe<Scalars["Boolean"]>;
};

/** aggregate sum on columns */
export type Transactions_Sum_Fields = {
  __typename?: "transactions_sum_fields";
  block_height?: Maybe<Scalars["Int"]>;
  gas_limit?: Maybe<Scalars["Int"]>;
  gas_used?: Maybe<Scalars["Int"]>;
  id?: Maybe<Scalars["Int"]>;
  sender?: Maybe<Scalars["Int"]>;
};

/** order by sum() on columns of table "transactions" */
export type Transactions_Sum_Order_By = {
  block_height?: InputMaybe<Order_By>;
  gas_limit?: InputMaybe<Order_By>;
  gas_used?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  sender?: InputMaybe<Order_By>;
};

/** update columns of table "transactions" */
export enum Transactions_Update_Column {
  /** column name */
  BlockHeight = "block_height",
  /** column name */
  ErrMsg = "err_msg",
  /** column name */
  GasFee = "gas_fee",
  /** column name */
  GasLimit = "gas_limit",
  /** column name */
  GasUsed = "gas_used",
  /** column name */
  Hash = "hash",
  /** column name */
  Id = "id",
  /** column name */
  IsClearAdmin = "is_clear_admin",
  /** column name */
  IsExecute = "is_execute",
  /** column name */
  IsIbc = "is_ibc",
  /** column name */
  IsInstantiate = "is_instantiate",
  /** column name */
  IsMigrate = "is_migrate",
  /** column name */
  IsSend = "is_send",
  /** column name */
  IsStoreCode = "is_store_code",
  /** column name */
  IsUpdateAdmin = "is_update_admin",
  /** column name */
  Memo = "memo",
  /** column name */
  Messages = "messages",
  /** column name */
  Sender = "sender",
  /** column name */
  Success = "success",
}

export type Transactions_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Transactions_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Transactions_Set_Input>;
  where: Transactions_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Transactions_Var_Pop_Fields = {
  __typename?: "transactions_var_pop_fields";
  block_height?: Maybe<Scalars["Float"]>;
  gas_limit?: Maybe<Scalars["Float"]>;
  gas_used?: Maybe<Scalars["Float"]>;
  id?: Maybe<Scalars["Float"]>;
  sender?: Maybe<Scalars["Float"]>;
};

/** order by var_pop() on columns of table "transactions" */
export type Transactions_Var_Pop_Order_By = {
  block_height?: InputMaybe<Order_By>;
  gas_limit?: InputMaybe<Order_By>;
  gas_used?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  sender?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Transactions_Var_Samp_Fields = {
  __typename?: "transactions_var_samp_fields";
  block_height?: Maybe<Scalars["Float"]>;
  gas_limit?: Maybe<Scalars["Float"]>;
  gas_used?: Maybe<Scalars["Float"]>;
  id?: Maybe<Scalars["Float"]>;
  sender?: Maybe<Scalars["Float"]>;
};

/** order by var_samp() on columns of table "transactions" */
export type Transactions_Var_Samp_Order_By = {
  block_height?: InputMaybe<Order_By>;
  gas_limit?: InputMaybe<Order_By>;
  gas_used?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  sender?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Transactions_Variance_Fields = {
  __typename?: "transactions_variance_fields";
  block_height?: Maybe<Scalars["Float"]>;
  gas_limit?: Maybe<Scalars["Float"]>;
  gas_used?: Maybe<Scalars["Float"]>;
  id?: Maybe<Scalars["Float"]>;
  sender?: Maybe<Scalars["Float"]>;
};

/** order by variance() on columns of table "transactions" */
export type Transactions_Variance_Order_By = {
  block_height?: InputMaybe<Order_By>;
  gas_limit?: InputMaybe<Order_By>;
  gas_used?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  sender?: InputMaybe<Order_By>;
};

export type GetBlockTimestampByHeightQueryQueryVariables = Exact<{
  height: Scalars["Int"];
}>;

export type GetBlockTimestampByHeightQueryQuery = {
  __typename?: "query_root";
  blocks_by_pk?: { __typename?: "blocks"; timestamp: any } | null;
};

export type GetCodeListQueryQueryVariables = Exact<{ [key: string]: never }>;

export type GetCodeListQueryQuery = {
  __typename?: "query_root";
  codes: Array<{
    __typename?: "codes";
    id: number;
    access_config_permission: string;
    access_config_addresses: any;
    cw2_contract?: string | null;
    cw2_version?: string | null;
    contracts_aggregate: {
      __typename?: "contracts_aggregate";
      aggregate?: {
        __typename?: "contracts_aggregate_fields";
        count: number;
      } | null;
    };
    account: { __typename?: "accounts"; uploader: string };
  }>;
};

export type GetCodeListByUserQueryQueryVariables = Exact<{
  walletAddr: Scalars["String"];
}>;

export type GetCodeListByUserQueryQuery = {
  __typename?: "query_root";
  codes: Array<{
    __typename?: "codes";
    id: number;
    access_config_permission: string;
    access_config_addresses: any;
    cw2_contract?: string | null;
    cw2_version?: string | null;
    contracts_aggregate: {
      __typename?: "contracts_aggregate";
      aggregate?: {
        __typename?: "contracts_aggregate_fields";
        count: number;
      } | null;
    };
    account: { __typename?: "accounts"; uploader: string };
  }>;
};

export type GetCodeListByIDsQueryQueryVariables = Exact<{
  ids: Array<Scalars["Int"]> | Scalars["Int"];
}>;

export type GetCodeListByIDsQueryQuery = {
  __typename?: "query_root";
  codes: Array<{
    __typename?: "codes";
    id: number;
    access_config_permission: string;
    access_config_addresses: any;
    cw2_contract?: string | null;
    cw2_version?: string | null;
    contracts_aggregate: {
      __typename?: "contracts_aggregate";
      aggregate?: {
        __typename?: "contracts_aggregate_fields";
        count: number;
      } | null;
    };
    account: { __typename?: "accounts"; uploader: string };
  }>;
};

export type GetCodeDataByCodeIdQueryVariables = Exact<{
  codeId: Scalars["Int"];
}>;

export type GetCodeDataByCodeIdQuery = {
  __typename?: "query_root";
  codes_by_pk?: {
    __typename?: "codes";
    id: number;
    access_config_permission: string;
    access_config_addresses: any;
    cw2_contract?: string | null;
    cw2_version?: string | null;
    account: { __typename?: "accounts"; address: string };
    transaction?: {
      __typename?: "transactions";
      hash: any;
      block: { __typename?: "blocks"; height: number; timestamp: any };
    } | null;
    code_proposals: Array<{
      __typename?: "code_proposals";
      proposal_id: number;
      block?: { __typename?: "blocks"; height: number; timestamp: any } | null;
    }>;
  } | null;
};

export type GetCodeListByWalletAddressPaginationQueryVariables = Exact<{
  walletAddress: Scalars["String"];
  offset: Scalars["Int"];
  pageSize: Scalars["Int"];
}>;

export type GetCodeListByWalletAddressPaginationQuery = {
  __typename?: "query_root";
  codes: Array<{
    __typename?: "codes";
    id: number;
    access_config_permission: string;
    access_config_addresses: any;
    cw2_contract?: string | null;
    cw2_version?: string | null;
    contracts_aggregate: {
      __typename?: "contracts_aggregate";
      aggregate?: {
        __typename?: "contracts_aggregate_fields";
        count: number;
      } | null;
    };
    account: { __typename?: "accounts"; uploader: string };
  }>;
};

export type GetCodeListCountByWalletAddressQueryVariables = Exact<{
  walletAddress: Scalars["String"];
}>;

export type GetCodeListCountByWalletAddressQuery = {
  __typename?: "query_root";
  codes_aggregate: {
    __typename?: "codes_aggregate";
    aggregate?: { __typename?: "codes_aggregate_fields"; count: number } | null;
  };
};

export type GetInstantiatedListByUserQueryDocumentQueryVariables = Exact<{
  walletAddr: Scalars["String"];
}>;

export type GetInstantiatedListByUserQueryDocumentQuery = {
  __typename?: "query_root";
  contracts: Array<{
    __typename?: "contracts";
    label: string;
    address: string;
    accountByInitBy?: { __typename?: "accounts"; address: string } | null;
  }>;
};

export type GetInstantiatedCountByUserQueryDocumentQueryVariables = Exact<{
  walletAddr: Scalars["String"];
}>;

export type GetInstantiatedCountByUserQueryDocumentQuery = {
  __typename?: "query_root";
  contracts_aggregate: {
    __typename?: "contracts_aggregate";
    aggregate?: {
      __typename?: "contracts_aggregate_fields";
      count: number;
    } | null;
  };
};

export type GetInstantiateDetailByContractQueryDocumentQueryVariables = Exact<{
  contractAddress: Scalars["String"];
}>;

export type GetInstantiateDetailByContractQueryDocumentQuery = {
  __typename?: "query_root";
  contracts_by_pk?: {
    __typename?: "contracts";
    init_msg?: string | null;
    transaction?: { __typename?: "transactions"; hash: any } | null;
    contract_proposals: Array<{
      __typename?: "contract_proposals";
      proposal: { __typename?: "proposals"; id: number; title: string };
    }>;
  } | null;
};

export type GetAdminByContractAddressesQueryDocumentQueryVariables = Exact<{
  contractAddresses: Array<Scalars["String"]> | Scalars["String"];
}>;

export type GetAdminByContractAddressesQueryDocumentQuery = {
  __typename?: "query_root";
  contracts: Array<{
    __typename?: "contracts";
    address: string;
    admin?: { __typename?: "accounts"; address: string } | null;
  }>;
};

export type GetContractListByAdminQueryVariables = Exact<{
  address: Scalars["String"];
}>;

export type GetContractListByAdminQuery = {
  __typename?: "query_root";
  contracts: Array<{
    __typename?: "contracts";
    address: string;
    label: string;
    accountByInitBy?: { __typename?: "accounts"; address: string } | null;
  }>;
};

export type GetContractListByCodeIdPaginationQueryVariables = Exact<{
  codeId: Scalars["Int"];
  offset: Scalars["Int"];
  pageSize: Scalars["Int"];
}>;

export type GetContractListByCodeIdPaginationQuery = {
  __typename?: "query_root";
  contracts: Array<{
    __typename?: "contracts";
    address: string;
    label: string;
    admin?: { __typename?: "accounts"; address: string } | null;
    init_by: Array<{
      __typename?: "contract_histories";
      account: { __typename?: "accounts"; address: string };
    }>;
    contract_histories: Array<{
      __typename?: "contract_histories";
      remark: any;
      block: { __typename?: "blocks"; timestamp: any };
      account: { __typename?: "accounts"; address: string };
    }>;
  }>;
};

export type GetContractListCountByCodeIdQueryVariables = Exact<{
  codeId: Scalars["Int"];
}>;

export type GetContractListCountByCodeIdQuery = {
  __typename?: "query_root";
  contracts_aggregate: {
    __typename?: "contracts_aggregate";
    aggregate?: {
      __typename?: "contracts_aggregate_fields";
      count: number;
    } | null;
  };
};

export type GetMigrationHistoriesByContractAddressQueryVariables = Exact<{
  contractAddress: Scalars["String"];
  offset: Scalars["Int"];
  pageSize: Scalars["Int"];
}>;

export type GetMigrationHistoriesByContractAddressQuery = {
  __typename?: "query_root";
  contract_histories: Array<{
    __typename?: "contract_histories";
    code_id: number;
    remark: any;
    account: { __typename?: "accounts"; address: string };
    block: { __typename?: "blocks"; height: number; timestamp: any };
    code: {
      __typename?: "codes";
      cw2_contract?: string | null;
      cw2_version?: string | null;
      account: { __typename?: "accounts"; address: string };
    };
  }>;
};

export type GetMigrationHistoriesCountByContractAddressQueryVariables = Exact<{
  contractAddress: Scalars["String"];
}>;

export type GetMigrationHistoriesCountByContractAddressQuery = {
  __typename?: "query_root";
  contract_histories_aggregate: {
    __typename?: "contract_histories_aggregate";
    aggregate?: {
      __typename?: "contract_histories_aggregate_fields";
      count: number;
    } | null;
  };
};

export type GetContractListByWalletAddressPaginationQueryVariables = Exact<{
  walletAddress: Scalars["String"];
  offset: Scalars["Int"];
  pageSize: Scalars["Int"];
}>;

export type GetContractListByWalletAddressPaginationQuery = {
  __typename?: "query_root";
  contracts: Array<{
    __typename?: "contracts";
    address: string;
    label: string;
    admin?: { __typename?: "accounts"; address: string } | null;
    init_by: Array<{
      __typename?: "contract_histories";
      account: { __typename?: "accounts"; address: string };
    }>;
    contract_histories: Array<{
      __typename?: "contract_histories";
      remark: any;
      block: { __typename?: "blocks"; timestamp: any };
      account: { __typename?: "accounts"; address: string };
    }>;
  }>;
};

export type GetContractListByAdminPaginationQueryVariables = Exact<{
  walletAddress: Scalars["String"];
  offset: Scalars["Int"];
  pageSize: Scalars["Int"];
}>;

export type GetContractListByAdminPaginationQuery = {
  __typename?: "query_root";
  contracts: Array<{
    __typename?: "contracts";
    address: string;
    label: string;
    admin?: { __typename?: "accounts"; address: string } | null;
    init_by: Array<{
      __typename?: "contract_histories";
      account: { __typename?: "accounts"; address: string };
    }>;
    contract_histories: Array<{
      __typename?: "contract_histories";
      remark: any;
      block: { __typename?: "blocks"; timestamp: any };
      account: { __typename?: "accounts"; address: string };
    }>;
  }>;
};

export type GetContractListCountByAdminQueryVariables = Exact<{
  walletAddress: Scalars["String"];
}>;

export type GetContractListCountByAdminQuery = {
  __typename?: "query_root";
  contracts_aggregate: {
    __typename?: "contracts_aggregate";
    aggregate?: {
      __typename?: "contracts_aggregate_fields";
      count: number;
    } | null;
  };
};

export type GetRelatedProposalsByContractAddressPaginationQueryVariables =
  Exact<{
    contractAddress: Scalars["String"];
    offset: Scalars["Int"];
    pageSize: Scalars["Int"];
  }>;

export type GetRelatedProposalsByContractAddressPaginationQuery = {
  __typename?: "query_root";
  contract_proposals: Array<{
    __typename?: "contract_proposals";
    proposal_id: number;
    resolved_height?: number | null;
    proposal: {
      __typename?: "proposals";
      title: string;
      status: any;
      voting_end_time: any;
      deposit_end_time: any;
      type: string;
      account?: { __typename?: "accounts"; address: string } | null;
    };
  }>;
};

export type GetRelatedProposalsCountByContractAddressQueryVariables = Exact<{
  contractAddress: Scalars["String"];
}>;

export type GetRelatedProposalsCountByContractAddressQuery = {
  __typename?: "query_root";
  contract_proposals_aggregate: {
    __typename?: "contract_proposals_aggregate";
    aggregate?: {
      __typename?: "contract_proposals_aggregate_fields";
      count: number;
    } | null;
  };
};

export type GetProposalsByWalletAddressPaginationQueryVariables = Exact<{
  walletAddress: Scalars["String"];
  offset: Scalars["Int"];
  pageSize: Scalars["Int"];
}>;

export type GetProposalsByWalletAddressPaginationQuery = {
  __typename?: "query_root";
  proposals: Array<{
    __typename?: "proposals";
    title: string;
    status: any;
    voting_end_time: any;
    deposit_end_time: any;
    type: string;
    id: number;
    contract_proposals: Array<{
      __typename?: "contract_proposals";
      resolved_height?: number | null;
    }>;
    code_proposals: Array<{
      __typename?: "code_proposals";
      resolved_height?: number | null;
    }>;
  }>;
};

export type GetProposalsCountByWalletAddressQueryVariables = Exact<{
  walletAddress: Scalars["String"];
}>;

export type GetProposalsCountByWalletAddressQuery = {
  __typename?: "query_root";
  proposals_aggregate: {
    __typename?: "proposals_aggregate";
    aggregate?: {
      __typename?: "proposals_aggregate_fields";
      count: number;
    } | null;
  };
};

export type GetExecuteTxsByContractAddressPaginationQueryVariables = Exact<{
  contractAddress: Scalars["String"];
  offset: Scalars["Int"];
  pageSize: Scalars["Int"];
}>;

export type GetExecuteTxsByContractAddressPaginationQuery = {
  __typename?: "query_root";
  contract_transactions_view: Array<{
    __typename?: "contract_transactions_view";
    hash?: any | null;
    messages?: any | null;
    success?: boolean | null;
    sender?: string | null;
    height?: number | null;
    timestamp?: any | null;
    is_execute?: boolean | null;
    is_ibc?: boolean | null;
    is_instantiate?: boolean | null;
    is_send?: boolean | null;
    is_store_code?: boolean | null;
    is_migrate?: boolean | null;
    is_update_admin?: boolean | null;
    is_clear_admin?: boolean | null;
  }>;
};

export type GetExecuteTxsCountByContractAddressQueryVariables = Exact<{
  contractAddress: Scalars["String"];
}>;

export type GetExecuteTxsCountByContractAddressQuery = {
  __typename?: "query_root";
  contract_transactions_aggregate: {
    __typename?: "contract_transactions_aggregate";
    aggregate?: {
      __typename?: "contract_transactions_aggregate_fields";
      count: number;
    } | null;
  };
};

export type GetTxsByContractAddressQueryVariables = Exact<{
  contractAddress: Scalars["String"];
  offset: Scalars["Int"];
  pageSize: Scalars["Int"];
}>;

export type GetTxsByContractAddressQuery = {
  __typename?: "query_root";
  contract_transactions_view: Array<{
    __typename?: "contract_transactions_view";
    hash?: any | null;
    success?: boolean | null;
    messages?: any | null;
    sender?: string | null;
    height?: number | null;
    timestamp?: any | null;
    is_execute?: boolean | null;
    is_ibc?: boolean | null;
    is_instantiate?: boolean | null;
    is_send?: boolean | null;
    is_store_code?: boolean | null;
    is_migrate?: boolean | null;
    is_update_admin?: boolean | null;
    is_clear_admin?: boolean | null;
  }>;
};

export type GetTxsCountByContractAddressQueryVariables = Exact<{
  contractAddress: Scalars["String"];
}>;

export type GetTxsCountByContractAddressQuery = {
  __typename?: "query_root";
  contract_transactions_aggregate: {
    __typename?: "contract_transactions_aggregate";
    aggregate?: {
      __typename?: "contract_transactions_aggregate_fields";
      count: number;
    } | null;
  };
};

export const GetBlockTimestampByHeightQueryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getBlockTimestampByHeightQuery" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "height" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "blocks_by_pk" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "height" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "height" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "timestamp" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetBlockTimestampByHeightQueryQuery,
  GetBlockTimestampByHeightQueryQueryVariables
>;
export const GetCodeListQueryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getCodeListQuery" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "codes" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: { kind: "IntValue", value: "100" },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "offset" },
                value: { kind: "IntValue", value: "0" },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "id" },
                      value: { kind: "EnumValue", value: "desc" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "contracts_aggregate" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "aggregate" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "count" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "account" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        alias: { kind: "Name", value: "uploader" },
                        name: { kind: "Name", value: "address" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "access_config_permission" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "access_config_addresses" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "cw2_contract" },
                },
                { kind: "Field", name: { kind: "Name", value: "cw2_version" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetCodeListQueryQuery,
  GetCodeListQueryQueryVariables
>;
export const GetCodeListByUserQueryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getCodeListByUserQuery" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "walletAddr" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "codes" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "account" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "address" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "_eq" },
                                  value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "walletAddr" },
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: { kind: "IntValue", value: "100" },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "offset" },
                value: { kind: "IntValue", value: "0" },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "id" },
                      value: { kind: "EnumValue", value: "desc" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "contracts_aggregate" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "aggregate" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "count" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "account" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        alias: { kind: "Name", value: "uploader" },
                        name: { kind: "Name", value: "address" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "access_config_permission" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "access_config_addresses" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "cw2_contract" },
                },
                { kind: "Field", name: { kind: "Name", value: "cw2_version" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetCodeListByUserQueryQuery,
  GetCodeListByUserQueryQueryVariables
>;
export const GetCodeListByIDsQueryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getCodeListByIDsQuery" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "ids" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: { kind: "Name", value: "Int" },
                },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "codes" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_in" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "ids" },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "contracts_aggregate" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "aggregate" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "count" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "account" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        alias: { kind: "Name", value: "uploader" },
                        name: { kind: "Name", value: "address" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "access_config_permission" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "access_config_addresses" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "cw2_contract" },
                },
                { kind: "Field", name: { kind: "Name", value: "cw2_version" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetCodeListByIDsQueryQuery,
  GetCodeListByIDsQueryQueryVariables
>;
export const GetCodeDataByCodeIdDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getCodeDataByCodeId" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "codeId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "codes_by_pk" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "codeId" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "account" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "address" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "transaction" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "hash" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "block" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "height" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "timestamp" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "code_proposals" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "limit" },
                      value: { kind: "IntValue", value: "1" },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "proposal_id" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "block" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "height" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "timestamp" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "access_config_permission" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "access_config_addresses" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "cw2_contract" },
                },
                { kind: "Field", name: { kind: "Name", value: "cw2_version" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetCodeDataByCodeIdQuery,
  GetCodeDataByCodeIdQueryVariables
>;
export const GetCodeListByWalletAddressPaginationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getCodeListByWalletAddressPagination" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "walletAddress" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "offset" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "pageSize" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "codes" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "account" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "address" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "_eq" },
                                  value: {
                                    kind: "Variable",
                                    name: {
                                      kind: "Name",
                                      value: "walletAddress",
                                    },
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "pageSize" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "offset" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "offset" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "id" },
                      value: { kind: "EnumValue", value: "desc" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "contracts_aggregate" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "aggregate" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "count" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "account" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        alias: { kind: "Name", value: "uploader" },
                        name: { kind: "Name", value: "address" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "access_config_permission" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "access_config_addresses" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "cw2_contract" },
                },
                { kind: "Field", name: { kind: "Name", value: "cw2_version" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetCodeListByWalletAddressPaginationQuery,
  GetCodeListByWalletAddressPaginationQueryVariables
>;
export const GetCodeListCountByWalletAddressDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getCodeListCountByWalletAddress" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "walletAddress" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "codes_aggregate" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "account" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "address" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "_eq" },
                                  value: {
                                    kind: "Variable",
                                    name: {
                                      kind: "Name",
                                      value: "walletAddress",
                                    },
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "aggregate" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetCodeListCountByWalletAddressQuery,
  GetCodeListCountByWalletAddressQueryVariables
>;
export const GetInstantiatedListByUserQueryDocumentDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getInstantiatedListByUserQueryDocument" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "walletAddr" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "contracts" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "accountByInitBy" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "address" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "_eq" },
                                  value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "walletAddr" },
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: { kind: "IntValue", value: "100" },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "offset" },
                value: { kind: "IntValue", value: "0" },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "transaction" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "block" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "timestamp" },
                                  value: { kind: "EnumValue", value: "desc" },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "label" } },
                { kind: "Field", name: { kind: "Name", value: "address" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "accountByInitBy" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "address" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetInstantiatedListByUserQueryDocumentQuery,
  GetInstantiatedListByUserQueryDocumentQueryVariables
>;
export const GetInstantiatedCountByUserQueryDocumentDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getInstantiatedCountByUserQueryDocument" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "walletAddr" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "contracts_aggregate" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "accountByInitBy" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "address" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "_eq" },
                                  value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "walletAddr" },
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "aggregate" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetInstantiatedCountByUserQueryDocumentQuery,
  GetInstantiatedCountByUserQueryDocumentQueryVariables
>;
export const GetInstantiateDetailByContractQueryDocumentDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: {
        kind: "Name",
        value: "getInstantiateDetailByContractQueryDocument",
      },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "contractAddress" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "contracts_by_pk" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "address" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "contractAddress" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "init_msg" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "transaction" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "hash" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "contract_proposals" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "where" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "proposal" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "type" },
                                  value: {
                                    kind: "ObjectValue",
                                    fields: [
                                      {
                                        kind: "ObjectField",
                                        name: { kind: "Name", value: "_in" },
                                        value: {
                                          kind: "ListValue",
                                          values: [
                                            {
                                              kind: "StringValue",
                                              value: "InstantiateContract",
                                              block: false,
                                            },
                                            {
                                              kind: "StringValue",
                                              value: "InstantiateContract2",
                                              block: false,
                                            },
                                            {
                                              kind: "StringValue",
                                              value: "SoftwareUpgrade",
                                              block: false,
                                            },
                                          ],
                                        },
                                      },
                                    ],
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "order_by" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "proposal" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "id" },
                                  value: { kind: "EnumValue", value: "asc" },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "limit" },
                      value: { kind: "IntValue", value: "1" },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "proposal" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "title" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetInstantiateDetailByContractQueryDocumentQuery,
  GetInstantiateDetailByContractQueryDocumentQueryVariables
>;
export const GetAdminByContractAddressesQueryDocumentDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getAdminByContractAddressesQueryDocument" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "contractAddresses" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: { kind: "Name", value: "String" },
                },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "contracts" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "address" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_in" },
                            value: {
                              kind: "Variable",
                              name: {
                                kind: "Name",
                                value: "contractAddresses",
                              },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "address" } },
                {
                  kind: "Field",
                  alias: { kind: "Name", value: "admin" },
                  name: { kind: "Name", value: "account" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "address" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetAdminByContractAddressesQueryDocumentQuery,
  GetAdminByContractAddressesQueryDocumentQueryVariables
>;
export const GetContractListByAdminDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getContractListByAdmin" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "address" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "contracts" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "account" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "address" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "_eq" },
                                  value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "address" },
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "transaction" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "block" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "timestamp" },
                                  value: { kind: "EnumValue", value: "desc" },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "address" } },
                { kind: "Field", name: { kind: "Name", value: "label" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "accountByInitBy" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "address" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetContractListByAdminQuery,
  GetContractListByAdminQueryVariables
>;
export const GetContractListByCodeIdPaginationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getContractListByCodeIdPagination" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "codeId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "offset" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "pageSize" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "contracts" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "code_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "codeId" },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "transaction" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "block" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "timestamp" },
                                  value: { kind: "EnumValue", value: "desc" },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "offset" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "offset" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "pageSize" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "address" } },
                { kind: "Field", name: { kind: "Name", value: "label" } },
                {
                  kind: "Field",
                  alias: { kind: "Name", value: "admin" },
                  name: { kind: "Name", value: "account" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "address" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  alias: { kind: "Name", value: "init_by" },
                  name: { kind: "Name", value: "contract_histories" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "order_by" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "block" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "timestamp" },
                                  value: { kind: "EnumValue", value: "asc" },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "limit" },
                      value: { kind: "IntValue", value: "1" },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "account" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "address" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "contract_histories" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "order_by" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "block" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "timestamp" },
                                  value: { kind: "EnumValue", value: "desc" },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "limit" },
                      value: { kind: "IntValue", value: "1" },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "block" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "timestamp" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "account" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "address" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "remark" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetContractListByCodeIdPaginationQuery,
  GetContractListByCodeIdPaginationQueryVariables
>;
export const GetContractListCountByCodeIdDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getContractListCountByCodeId" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "codeId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "contracts_aggregate" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "code_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "codeId" },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "aggregate" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetContractListCountByCodeIdQuery,
  GetContractListCountByCodeIdQueryVariables
>;
export const GetMigrationHistoriesByContractAddressDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getMigrationHistoriesByContractAddress" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "contractAddress" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "offset" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "pageSize" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "contract_histories" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "contract" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "address" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "_eq" },
                                  value: {
                                    kind: "Variable",
                                    name: {
                                      kind: "Name",
                                      value: "contractAddress",
                                    },
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "block" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "timestamp" },
                            value: { kind: "EnumValue", value: "desc" },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "pageSize" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "offset" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "offset" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "code_id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "account" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "address" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "block" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "height" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "timestamp" },
                      },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "remark" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "code" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "account" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "address" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "cw2_contract" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "cw2_version" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetMigrationHistoriesByContractAddressQuery,
  GetMigrationHistoriesByContractAddressQueryVariables
>;
export const GetMigrationHistoriesCountByContractAddressDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: {
        kind: "Name",
        value: "getMigrationHistoriesCountByContractAddress",
      },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "contractAddress" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "contract_histories_aggregate" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "contract" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "address" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "_eq" },
                                  value: {
                                    kind: "Variable",
                                    name: {
                                      kind: "Name",
                                      value: "contractAddress",
                                    },
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "aggregate" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetMigrationHistoriesCountByContractAddressQuery,
  GetMigrationHistoriesCountByContractAddressQueryVariables
>;
export const GetContractListByWalletAddressPaginationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getContractListByWalletAddressPagination" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "walletAddress" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "offset" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "pageSize" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "contracts" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "accountByInitBy" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "address" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "_eq" },
                                  value: {
                                    kind: "Variable",
                                    name: {
                                      kind: "Name",
                                      value: "walletAddress",
                                    },
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "pageSize" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "offset" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "offset" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "transaction" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "block" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "timestamp" },
                                  value: { kind: "EnumValue", value: "desc" },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "address" } },
                { kind: "Field", name: { kind: "Name", value: "label" } },
                {
                  kind: "Field",
                  alias: { kind: "Name", value: "admin" },
                  name: { kind: "Name", value: "account" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "address" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  alias: { kind: "Name", value: "init_by" },
                  name: { kind: "Name", value: "contract_histories" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "order_by" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "block" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "timestamp" },
                                  value: { kind: "EnumValue", value: "asc" },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "limit" },
                      value: { kind: "IntValue", value: "1" },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "account" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "address" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "contract_histories" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "order_by" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "block" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "timestamp" },
                                  value: { kind: "EnumValue", value: "desc" },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "limit" },
                      value: { kind: "IntValue", value: "1" },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "block" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "timestamp" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "account" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "address" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "remark" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetContractListByWalletAddressPaginationQuery,
  GetContractListByWalletAddressPaginationQueryVariables
>;
export const GetContractListByAdminPaginationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getContractListByAdminPagination" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "walletAddress" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "offset" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "pageSize" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "contracts" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "account" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "address" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "_eq" },
                                  value: {
                                    kind: "Variable",
                                    name: {
                                      kind: "Name",
                                      value: "walletAddress",
                                    },
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "pageSize" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "offset" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "offset" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "transaction" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "block" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "timestamp" },
                                  value: { kind: "EnumValue", value: "desc" },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "address" } },
                { kind: "Field", name: { kind: "Name", value: "label" } },
                {
                  kind: "Field",
                  alias: { kind: "Name", value: "admin" },
                  name: { kind: "Name", value: "account" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "address" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  alias: { kind: "Name", value: "init_by" },
                  name: { kind: "Name", value: "contract_histories" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "order_by" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "block" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "timestamp" },
                                  value: { kind: "EnumValue", value: "asc" },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "limit" },
                      value: { kind: "IntValue", value: "1" },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "account" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "address" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "contract_histories" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "order_by" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "block" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "timestamp" },
                                  value: { kind: "EnumValue", value: "desc" },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "limit" },
                      value: { kind: "IntValue", value: "1" },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "block" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "timestamp" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "account" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "address" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "remark" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetContractListByAdminPaginationQuery,
  GetContractListByAdminPaginationQueryVariables
>;
export const GetContractListCountByAdminDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getContractListCountByAdmin" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "walletAddress" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "contracts_aggregate" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "account" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "address" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "_eq" },
                                  value: {
                                    kind: "Variable",
                                    name: {
                                      kind: "Name",
                                      value: "walletAddress",
                                    },
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "aggregate" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetContractListCountByAdminQuery,
  GetContractListCountByAdminQueryVariables
>;
export const GetRelatedProposalsByContractAddressPaginationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: {
        kind: "Name",
        value: "getRelatedProposalsByContractAddressPagination",
      },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "contractAddress" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "offset" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "pageSize" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "contract_proposals" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "contract" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "address" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "_eq" },
                                  value: {
                                    kind: "Variable",
                                    name: {
                                      kind: "Name",
                                      value: "contractAddress",
                                    },
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "proposal_id" },
                      value: { kind: "EnumValue", value: "desc" },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "offset" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "offset" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "pageSize" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "proposal" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "title" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "status" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "voting_end_time" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "deposit_end_time" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "type" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "account" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "address" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "proposal_id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "resolved_height" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetRelatedProposalsByContractAddressPaginationQuery,
  GetRelatedProposalsByContractAddressPaginationQueryVariables
>;
export const GetRelatedProposalsCountByContractAddressDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: {
        kind: "Name",
        value: "getRelatedProposalsCountByContractAddress",
      },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "contractAddress" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "contract_proposals_aggregate" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "contract" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "address" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "_eq" },
                                  value: {
                                    kind: "Variable",
                                    name: {
                                      kind: "Name",
                                      value: "contractAddress",
                                    },
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "aggregate" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetRelatedProposalsCountByContractAddressQuery,
  GetRelatedProposalsCountByContractAddressQueryVariables
>;
export const GetProposalsByWalletAddressPaginationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getProposalsByWalletAddressPagination" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "walletAddress" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "offset" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "pageSize" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "proposals" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "account" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "address" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "_eq" },
                                  value: {
                                    kind: "Variable",
                                    name: {
                                      kind: "Name",
                                      value: "walletAddress",
                                    },
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "id" },
                      value: { kind: "EnumValue", value: "desc" },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "offset" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "offset" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "pageSize" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "title" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "voting_end_time" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "deposit_end_time" },
                },
                { kind: "Field", name: { kind: "Name", value: "type" } },
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "contract_proposals" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "resolved_height" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "code_proposals" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "resolved_height" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetProposalsByWalletAddressPaginationQuery,
  GetProposalsByWalletAddressPaginationQueryVariables
>;
export const GetProposalsCountByWalletAddressDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getProposalsCountByWalletAddress" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "walletAddress" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "proposals_aggregate" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "account" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "address" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "_eq" },
                                  value: {
                                    kind: "Variable",
                                    name: {
                                      kind: "Name",
                                      value: "walletAddress",
                                    },
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "aggregate" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetProposalsCountByWalletAddressQuery,
  GetProposalsCountByWalletAddressQueryVariables
>;
export const GetExecuteTxsByContractAddressPaginationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getExecuteTxsByContractAddressPagination" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "contractAddress" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "offset" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "pageSize" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "contract_transactions_view" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "contract_address" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "contractAddress" },
                            },
                          },
                        ],
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_execute" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: true },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "timestamp" },
                      value: { kind: "EnumValue", value: "desc" },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "pageSize" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "offset" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "offset" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "hash" } },
                { kind: "Field", name: { kind: "Name", value: "messages" } },
                { kind: "Field", name: { kind: "Name", value: "success" } },
                { kind: "Field", name: { kind: "Name", value: "sender" } },
                { kind: "Field", name: { kind: "Name", value: "height" } },
                { kind: "Field", name: { kind: "Name", value: "timestamp" } },
                { kind: "Field", name: { kind: "Name", value: "is_execute" } },
                { kind: "Field", name: { kind: "Name", value: "is_ibc" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "is_instantiate" },
                },
                { kind: "Field", name: { kind: "Name", value: "is_send" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "is_store_code" },
                },
                { kind: "Field", name: { kind: "Name", value: "is_migrate" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "is_update_admin" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "is_clear_admin" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetExecuteTxsByContractAddressPaginationQuery,
  GetExecuteTxsByContractAddressPaginationQueryVariables
>;
export const GetExecuteTxsCountByContractAddressDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getExecuteTxsCountByContractAddress" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "contractAddress" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "contract_transactions_aggregate" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "contract" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "address" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "_eq" },
                                  value: {
                                    kind: "Variable",
                                    name: {
                                      kind: "Name",
                                      value: "contractAddress",
                                    },
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "transaction" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "is_execute" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "_eq" },
                                  value: { kind: "BooleanValue", value: true },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "aggregate" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetExecuteTxsCountByContractAddressQuery,
  GetExecuteTxsCountByContractAddressQueryVariables
>;
export const GetTxsByContractAddressDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getTxsByContractAddress" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "contractAddress" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "offset" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "pageSize" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "contract_transactions_view" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "contract_address" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "contractAddress" },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "timestamp" },
                      value: { kind: "EnumValue", value: "desc" },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "offset" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "offset" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "pageSize" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "hash" } },
                { kind: "Field", name: { kind: "Name", value: "success" } },
                { kind: "Field", name: { kind: "Name", value: "messages" } },
                { kind: "Field", name: { kind: "Name", value: "sender" } },
                { kind: "Field", name: { kind: "Name", value: "height" } },
                { kind: "Field", name: { kind: "Name", value: "timestamp" } },
                { kind: "Field", name: { kind: "Name", value: "is_execute" } },
                { kind: "Field", name: { kind: "Name", value: "is_ibc" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "is_instantiate" },
                },
                { kind: "Field", name: { kind: "Name", value: "is_send" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "is_store_code" },
                },
                { kind: "Field", name: { kind: "Name", value: "is_migrate" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "is_update_admin" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "is_clear_admin" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetTxsByContractAddressQuery,
  GetTxsByContractAddressQueryVariables
>;
export const GetTxsCountByContractAddressDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getTxsCountByContractAddress" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "contractAddress" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "contract_transactions_aggregate" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "contract" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "address" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "_eq" },
                                  value: {
                                    kind: "Variable",
                                    name: {
                                      kind: "Name",
                                      value: "contractAddress",
                                    },
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "aggregate" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetTxsCountByContractAddressQuery,
  GetTxsCountByContractAddressQueryVariables
>;
