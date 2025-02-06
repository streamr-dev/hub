import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigDecimal: { input: any; output: any; }
  BigInt: { input: any; output: any; }
  Bytes: { input: any; output: any; }
  Int8: { input: any; output: any; }
  Timestamp: { input: any; output: any; }
};

export enum Aggregation_Interval {
  Day = 'day',
  Hour = 'hour'
}

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

export type Delegation = {
  __typename?: 'Delegation';
  /** Past value of DATA value of the Operator tokens this delegator holds, at latestDelegationTimestamp. Calculate current value by `operatorTokenBalanceWei * operator.exchangeRate`. */
  _valueDataWei: Scalars['BigInt']['output'];
  delegator: Delegator;
  /** earliest time this delegator can undelegate from this operator (0 if this.isSelfDelegation because it doesn't apply) */
  earliestUndelegationTimestamp: Scalars['Int']['output'];
  /** 0xoperatorAddress-0xdelegatorAddress */
  id: Scalars['ID']['output'];
  /** `true` if delegator == operator.owner */
  isSelfDelegation: Scalars['Boolean']['output'];
  /** latest delegation done by the delegator to this operator */
  latestDelegationTimestamp: Scalars['Int']['output'];
  operator: Operator;
  /** Amount of internal Operator tokens this delegator holds */
  operatorTokenBalanceWei: Scalars['BigInt']['output'];
};

export type Delegation_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  _valueDataWei?: InputMaybe<Scalars['BigInt']['input']>;
  _valueDataWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  _valueDataWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  _valueDataWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  _valueDataWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  _valueDataWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  _valueDataWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  _valueDataWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Delegation_Filter>>>;
  delegator?: InputMaybe<Scalars['String']['input']>;
  delegator_?: InputMaybe<Delegator_Filter>;
  delegator_contains?: InputMaybe<Scalars['String']['input']>;
  delegator_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_ends_with?: InputMaybe<Scalars['String']['input']>;
  delegator_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_gt?: InputMaybe<Scalars['String']['input']>;
  delegator_gte?: InputMaybe<Scalars['String']['input']>;
  delegator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  delegator_lt?: InputMaybe<Scalars['String']['input']>;
  delegator_lte?: InputMaybe<Scalars['String']['input']>;
  delegator_not?: InputMaybe<Scalars['String']['input']>;
  delegator_not_contains?: InputMaybe<Scalars['String']['input']>;
  delegator_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  delegator_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  delegator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  delegator_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_starts_with?: InputMaybe<Scalars['String']['input']>;
  delegator_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  earliestUndelegationTimestamp?: InputMaybe<Scalars['Int']['input']>;
  earliestUndelegationTimestamp_gt?: InputMaybe<Scalars['Int']['input']>;
  earliestUndelegationTimestamp_gte?: InputMaybe<Scalars['Int']['input']>;
  earliestUndelegationTimestamp_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  earliestUndelegationTimestamp_lt?: InputMaybe<Scalars['Int']['input']>;
  earliestUndelegationTimestamp_lte?: InputMaybe<Scalars['Int']['input']>;
  earliestUndelegationTimestamp_not?: InputMaybe<Scalars['Int']['input']>;
  earliestUndelegationTimestamp_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  isSelfDelegation?: InputMaybe<Scalars['Boolean']['input']>;
  isSelfDelegation_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isSelfDelegation_not?: InputMaybe<Scalars['Boolean']['input']>;
  isSelfDelegation_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  latestDelegationTimestamp?: InputMaybe<Scalars['Int']['input']>;
  latestDelegationTimestamp_gt?: InputMaybe<Scalars['Int']['input']>;
  latestDelegationTimestamp_gte?: InputMaybe<Scalars['Int']['input']>;
  latestDelegationTimestamp_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  latestDelegationTimestamp_lt?: InputMaybe<Scalars['Int']['input']>;
  latestDelegationTimestamp_lte?: InputMaybe<Scalars['Int']['input']>;
  latestDelegationTimestamp_not?: InputMaybe<Scalars['Int']['input']>;
  latestDelegationTimestamp_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  operator?: InputMaybe<Scalars['String']['input']>;
  operatorTokenBalanceWei?: InputMaybe<Scalars['BigInt']['input']>;
  operatorTokenBalanceWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  operatorTokenBalanceWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  operatorTokenBalanceWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  operatorTokenBalanceWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  operatorTokenBalanceWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  operatorTokenBalanceWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  operatorTokenBalanceWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  operator_?: InputMaybe<Operator_Filter>;
  operator_contains?: InputMaybe<Scalars['String']['input']>;
  operator_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_ends_with?: InputMaybe<Scalars['String']['input']>;
  operator_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_gt?: InputMaybe<Scalars['String']['input']>;
  operator_gte?: InputMaybe<Scalars['String']['input']>;
  operator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operator_lt?: InputMaybe<Scalars['String']['input']>;
  operator_lte?: InputMaybe<Scalars['String']['input']>;
  operator_not?: InputMaybe<Scalars['String']['input']>;
  operator_not_contains?: InputMaybe<Scalars['String']['input']>;
  operator_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  operator_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  operator_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_starts_with?: InputMaybe<Scalars['String']['input']>;
  operator_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Delegation_Filter>>>;
};

export enum Delegation_OrderBy {
  ValueDataWei = '_valueDataWei',
  Delegator = 'delegator',
  DelegatorCumulativeEarningsWei = 'delegator__cumulativeEarningsWei',
  DelegatorId = 'delegator__id',
  DelegatorNumberOfDelegations = 'delegator__numberOfDelegations',
  DelegatorTotalValueDataWei = 'delegator__totalValueDataWei',
  EarliestUndelegationTimestamp = 'earliestUndelegationTimestamp',
  Id = 'id',
  IsSelfDelegation = 'isSelfDelegation',
  LatestDelegationTimestamp = 'latestDelegationTimestamp',
  Operator = 'operator',
  OperatorTokenBalanceWei = 'operatorTokenBalanceWei',
  OperatorContractVersion = 'operator__contractVersion',
  OperatorCumulativeEarningsWei = 'operator__cumulativeEarningsWei',
  OperatorCumulativeOperatorsCutWei = 'operator__cumulativeOperatorsCutWei',
  OperatorCumulativeProfitsWei = 'operator__cumulativeProfitsWei',
  OperatorDataTokenBalanceWei = 'operator__dataTokenBalanceWei',
  OperatorDelegatorCount = 'operator__delegatorCount',
  OperatorExchangeRate = 'operator__exchangeRate',
  OperatorId = 'operator__id',
  OperatorIsEligibleToVote = 'operator__isEligibleToVote',
  OperatorLatestHeartbeatMetadata = 'operator__latestHeartbeatMetadata',
  OperatorLatestHeartbeatTimestamp = 'operator__latestHeartbeatTimestamp',
  OperatorMetadataJsonString = 'operator__metadataJsonString',
  OperatorOperatorTokenTotalSupplyWei = 'operator__operatorTokenTotalSupplyWei',
  OperatorOperatorsCutFraction = 'operator__operatorsCutFraction',
  OperatorOwner = 'operator__owner',
  OperatorProtectionEndTimestamp = 'operator__protectionEndTimestamp',
  OperatorSlashingsCount = 'operator__slashingsCount',
  OperatorTotalStakeInSponsorshipsWei = 'operator__totalStakeInSponsorshipsWei',
  OperatorValueUpdateBlockNumber = 'operator__valueUpdateBlockNumber',
  OperatorValueUpdateTimestamp = 'operator__valueUpdateTimestamp',
  OperatorValueWithoutEarnings = 'operator__valueWithoutEarnings'
}

export type Delegator = {
  __typename?: 'Delegator';
  cumulativeEarningsWei: Scalars['BigInt']['output'];
  delegations: Array<Delegation>;
  id: Scalars['ID']['output'];
  numberOfDelegations: Scalars['Int']['output'];
  queueEntries: Array<QueueEntry>;
  totalValueDataWei: Scalars['BigInt']['output'];
};


export type DelegatorDelegationsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Delegation_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Delegation_Filter>;
};


export type DelegatorQueueEntriesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<QueueEntry_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<QueueEntry_Filter>;
};

export type DelegatorDailyBucket = {
  __typename?: 'DelegatorDailyBucket';
  cumulativeEarningsWei: Scalars['BigInt']['output'];
  date: Scalars['BigInt']['output'];
  delegator: Delegator;
  id: Scalars['ID']['output'];
  operatorCount: Scalars['Int']['output'];
  totalValueDataWei: Scalars['BigInt']['output'];
};

export type DelegatorDailyBucket_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<DelegatorDailyBucket_Filter>>>;
  cumulativeEarningsWei?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeEarningsWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeEarningsWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeEarningsWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeEarningsWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeEarningsWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeEarningsWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeEarningsWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  date?: InputMaybe<Scalars['BigInt']['input']>;
  date_gt?: InputMaybe<Scalars['BigInt']['input']>;
  date_gte?: InputMaybe<Scalars['BigInt']['input']>;
  date_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  date_lt?: InputMaybe<Scalars['BigInt']['input']>;
  date_lte?: InputMaybe<Scalars['BigInt']['input']>;
  date_not?: InputMaybe<Scalars['BigInt']['input']>;
  date_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  delegator?: InputMaybe<Scalars['String']['input']>;
  delegator_?: InputMaybe<Delegator_Filter>;
  delegator_contains?: InputMaybe<Scalars['String']['input']>;
  delegator_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_ends_with?: InputMaybe<Scalars['String']['input']>;
  delegator_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_gt?: InputMaybe<Scalars['String']['input']>;
  delegator_gte?: InputMaybe<Scalars['String']['input']>;
  delegator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  delegator_lt?: InputMaybe<Scalars['String']['input']>;
  delegator_lte?: InputMaybe<Scalars['String']['input']>;
  delegator_not?: InputMaybe<Scalars['String']['input']>;
  delegator_not_contains?: InputMaybe<Scalars['String']['input']>;
  delegator_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  delegator_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  delegator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  delegator_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_starts_with?: InputMaybe<Scalars['String']['input']>;
  delegator_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  operatorCount?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_gt?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_gte?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  operatorCount_lt?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_lte?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_not?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<DelegatorDailyBucket_Filter>>>;
  totalValueDataWei?: InputMaybe<Scalars['BigInt']['input']>;
  totalValueDataWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalValueDataWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalValueDataWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalValueDataWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalValueDataWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalValueDataWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalValueDataWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum DelegatorDailyBucket_OrderBy {
  CumulativeEarningsWei = 'cumulativeEarningsWei',
  Date = 'date',
  Delegator = 'delegator',
  DelegatorCumulativeEarningsWei = 'delegator__cumulativeEarningsWei',
  DelegatorId = 'delegator__id',
  DelegatorNumberOfDelegations = 'delegator__numberOfDelegations',
  DelegatorTotalValueDataWei = 'delegator__totalValueDataWei',
  Id = 'id',
  OperatorCount = 'operatorCount',
  TotalValueDataWei = 'totalValueDataWei'
}

export type Delegator_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Delegator_Filter>>>;
  cumulativeEarningsWei?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeEarningsWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeEarningsWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeEarningsWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeEarningsWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeEarningsWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeEarningsWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeEarningsWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  delegations_?: InputMaybe<Delegation_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  numberOfDelegations?: InputMaybe<Scalars['Int']['input']>;
  numberOfDelegations_gt?: InputMaybe<Scalars['Int']['input']>;
  numberOfDelegations_gte?: InputMaybe<Scalars['Int']['input']>;
  numberOfDelegations_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  numberOfDelegations_lt?: InputMaybe<Scalars['Int']['input']>;
  numberOfDelegations_lte?: InputMaybe<Scalars['Int']['input']>;
  numberOfDelegations_not?: InputMaybe<Scalars['Int']['input']>;
  numberOfDelegations_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Delegator_Filter>>>;
  queueEntries_?: InputMaybe<QueueEntry_Filter>;
  totalValueDataWei?: InputMaybe<Scalars['BigInt']['input']>;
  totalValueDataWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalValueDataWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalValueDataWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalValueDataWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalValueDataWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalValueDataWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalValueDataWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum Delegator_OrderBy {
  CumulativeEarningsWei = 'cumulativeEarningsWei',
  Delegations = 'delegations',
  Id = 'id',
  NumberOfDelegations = 'numberOfDelegations',
  QueueEntries = 'queueEntries',
  TotalValueDataWei = 'totalValueDataWei'
}

export type Flag = {
  __typename?: 'Flag';
  flagResolutionTimestamp: Scalars['Int']['output'];
  flagger: Operator;
  flaggingTimestamp: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  lastFlagIndex: Scalars['Int']['output'];
  metadata: Scalars['String']['output'];
  protectionEndTimestamp: Scalars['Int']['output'];
  result: Scalars['String']['output'];
  reviewerCount: Scalars['Int']['output'];
  reviewers: Array<Operator>;
  sponsorship: Sponsorship;
  target: Operator;
  targetStakeAtRiskWei: Scalars['BigInt']['output'];
  voteEndTimestamp: Scalars['Int']['output'];
  voteStartTimestamp: Scalars['Int']['output'];
  votes: Array<Vote>;
  votesAgainstKick: Scalars['BigInt']['output'];
  votesForKick: Scalars['BigInt']['output'];
};


export type FlagReviewersArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Operator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Operator_Filter>;
};


export type FlagVotesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Vote_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Vote_Filter>;
};

export type Flag_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Flag_Filter>>>;
  flagResolutionTimestamp?: InputMaybe<Scalars['Int']['input']>;
  flagResolutionTimestamp_gt?: InputMaybe<Scalars['Int']['input']>;
  flagResolutionTimestamp_gte?: InputMaybe<Scalars['Int']['input']>;
  flagResolutionTimestamp_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  flagResolutionTimestamp_lt?: InputMaybe<Scalars['Int']['input']>;
  flagResolutionTimestamp_lte?: InputMaybe<Scalars['Int']['input']>;
  flagResolutionTimestamp_not?: InputMaybe<Scalars['Int']['input']>;
  flagResolutionTimestamp_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  flagger?: InputMaybe<Scalars['String']['input']>;
  flagger_?: InputMaybe<Operator_Filter>;
  flagger_contains?: InputMaybe<Scalars['String']['input']>;
  flagger_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  flagger_ends_with?: InputMaybe<Scalars['String']['input']>;
  flagger_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  flagger_gt?: InputMaybe<Scalars['String']['input']>;
  flagger_gte?: InputMaybe<Scalars['String']['input']>;
  flagger_in?: InputMaybe<Array<Scalars['String']['input']>>;
  flagger_lt?: InputMaybe<Scalars['String']['input']>;
  flagger_lte?: InputMaybe<Scalars['String']['input']>;
  flagger_not?: InputMaybe<Scalars['String']['input']>;
  flagger_not_contains?: InputMaybe<Scalars['String']['input']>;
  flagger_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  flagger_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  flagger_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  flagger_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  flagger_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  flagger_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  flagger_starts_with?: InputMaybe<Scalars['String']['input']>;
  flagger_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  flaggingTimestamp?: InputMaybe<Scalars['Int']['input']>;
  flaggingTimestamp_gt?: InputMaybe<Scalars['Int']['input']>;
  flaggingTimestamp_gte?: InputMaybe<Scalars['Int']['input']>;
  flaggingTimestamp_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  flaggingTimestamp_lt?: InputMaybe<Scalars['Int']['input']>;
  flaggingTimestamp_lte?: InputMaybe<Scalars['Int']['input']>;
  flaggingTimestamp_not?: InputMaybe<Scalars['Int']['input']>;
  flaggingTimestamp_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lastFlagIndex?: InputMaybe<Scalars['Int']['input']>;
  lastFlagIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  lastFlagIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  lastFlagIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastFlagIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  lastFlagIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  lastFlagIndex_not?: InputMaybe<Scalars['Int']['input']>;
  lastFlagIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  metadata?: InputMaybe<Scalars['String']['input']>;
  metadata_contains?: InputMaybe<Scalars['String']['input']>;
  metadata_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadata_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_gt?: InputMaybe<Scalars['String']['input']>;
  metadata_gte?: InputMaybe<Scalars['String']['input']>;
  metadata_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_lt?: InputMaybe<Scalars['String']['input']>;
  metadata_lte?: InputMaybe<Scalars['String']['input']>;
  metadata_not?: InputMaybe<Scalars['String']['input']>;
  metadata_not_contains?: InputMaybe<Scalars['String']['input']>;
  metadata_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadata_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadata_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadata_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Flag_Filter>>>;
  protectionEndTimestamp?: InputMaybe<Scalars['Int']['input']>;
  protectionEndTimestamp_gt?: InputMaybe<Scalars['Int']['input']>;
  protectionEndTimestamp_gte?: InputMaybe<Scalars['Int']['input']>;
  protectionEndTimestamp_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  protectionEndTimestamp_lt?: InputMaybe<Scalars['Int']['input']>;
  protectionEndTimestamp_lte?: InputMaybe<Scalars['Int']['input']>;
  protectionEndTimestamp_not?: InputMaybe<Scalars['Int']['input']>;
  protectionEndTimestamp_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  result?: InputMaybe<Scalars['String']['input']>;
  result_contains?: InputMaybe<Scalars['String']['input']>;
  result_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  result_ends_with?: InputMaybe<Scalars['String']['input']>;
  result_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  result_gt?: InputMaybe<Scalars['String']['input']>;
  result_gte?: InputMaybe<Scalars['String']['input']>;
  result_in?: InputMaybe<Array<Scalars['String']['input']>>;
  result_lt?: InputMaybe<Scalars['String']['input']>;
  result_lte?: InputMaybe<Scalars['String']['input']>;
  result_not?: InputMaybe<Scalars['String']['input']>;
  result_not_contains?: InputMaybe<Scalars['String']['input']>;
  result_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  result_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  result_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  result_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  result_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  result_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  result_starts_with?: InputMaybe<Scalars['String']['input']>;
  result_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  reviewerCount?: InputMaybe<Scalars['Int']['input']>;
  reviewerCount_gt?: InputMaybe<Scalars['Int']['input']>;
  reviewerCount_gte?: InputMaybe<Scalars['Int']['input']>;
  reviewerCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  reviewerCount_lt?: InputMaybe<Scalars['Int']['input']>;
  reviewerCount_lte?: InputMaybe<Scalars['Int']['input']>;
  reviewerCount_not?: InputMaybe<Scalars['Int']['input']>;
  reviewerCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  reviewers?: InputMaybe<Array<Scalars['String']['input']>>;
  reviewers_?: InputMaybe<Operator_Filter>;
  reviewers_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  reviewers_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  reviewers_not?: InputMaybe<Array<Scalars['String']['input']>>;
  reviewers_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  reviewers_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  sponsorship?: InputMaybe<Scalars['String']['input']>;
  sponsorship_?: InputMaybe<Sponsorship_Filter>;
  sponsorship_contains?: InputMaybe<Scalars['String']['input']>;
  sponsorship_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_ends_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_gt?: InputMaybe<Scalars['String']['input']>;
  sponsorship_gte?: InputMaybe<Scalars['String']['input']>;
  sponsorship_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sponsorship_lt?: InputMaybe<Scalars['String']['input']>;
  sponsorship_lte?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_contains?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sponsorship_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_starts_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  target?: InputMaybe<Scalars['String']['input']>;
  targetStakeAtRiskWei?: InputMaybe<Scalars['BigInt']['input']>;
  targetStakeAtRiskWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  targetStakeAtRiskWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  targetStakeAtRiskWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  targetStakeAtRiskWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  targetStakeAtRiskWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  targetStakeAtRiskWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  targetStakeAtRiskWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  target_?: InputMaybe<Operator_Filter>;
  target_contains?: InputMaybe<Scalars['String']['input']>;
  target_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  target_ends_with?: InputMaybe<Scalars['String']['input']>;
  target_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  target_gt?: InputMaybe<Scalars['String']['input']>;
  target_gte?: InputMaybe<Scalars['String']['input']>;
  target_in?: InputMaybe<Array<Scalars['String']['input']>>;
  target_lt?: InputMaybe<Scalars['String']['input']>;
  target_lte?: InputMaybe<Scalars['String']['input']>;
  target_not?: InputMaybe<Scalars['String']['input']>;
  target_not_contains?: InputMaybe<Scalars['String']['input']>;
  target_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  target_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  target_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  target_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  target_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  target_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  target_starts_with?: InputMaybe<Scalars['String']['input']>;
  target_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  voteEndTimestamp?: InputMaybe<Scalars['Int']['input']>;
  voteEndTimestamp_gt?: InputMaybe<Scalars['Int']['input']>;
  voteEndTimestamp_gte?: InputMaybe<Scalars['Int']['input']>;
  voteEndTimestamp_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  voteEndTimestamp_lt?: InputMaybe<Scalars['Int']['input']>;
  voteEndTimestamp_lte?: InputMaybe<Scalars['Int']['input']>;
  voteEndTimestamp_not?: InputMaybe<Scalars['Int']['input']>;
  voteEndTimestamp_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  voteStartTimestamp?: InputMaybe<Scalars['Int']['input']>;
  voteStartTimestamp_gt?: InputMaybe<Scalars['Int']['input']>;
  voteStartTimestamp_gte?: InputMaybe<Scalars['Int']['input']>;
  voteStartTimestamp_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  voteStartTimestamp_lt?: InputMaybe<Scalars['Int']['input']>;
  voteStartTimestamp_lte?: InputMaybe<Scalars['Int']['input']>;
  voteStartTimestamp_not?: InputMaybe<Scalars['Int']['input']>;
  voteStartTimestamp_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  votesAgainstKick?: InputMaybe<Scalars['BigInt']['input']>;
  votesAgainstKick_gt?: InputMaybe<Scalars['BigInt']['input']>;
  votesAgainstKick_gte?: InputMaybe<Scalars['BigInt']['input']>;
  votesAgainstKick_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  votesAgainstKick_lt?: InputMaybe<Scalars['BigInt']['input']>;
  votesAgainstKick_lte?: InputMaybe<Scalars['BigInt']['input']>;
  votesAgainstKick_not?: InputMaybe<Scalars['BigInt']['input']>;
  votesAgainstKick_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  votesForKick?: InputMaybe<Scalars['BigInt']['input']>;
  votesForKick_gt?: InputMaybe<Scalars['BigInt']['input']>;
  votesForKick_gte?: InputMaybe<Scalars['BigInt']['input']>;
  votesForKick_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  votesForKick_lt?: InputMaybe<Scalars['BigInt']['input']>;
  votesForKick_lte?: InputMaybe<Scalars['BigInt']['input']>;
  votesForKick_not?: InputMaybe<Scalars['BigInt']['input']>;
  votesForKick_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  votes_?: InputMaybe<Vote_Filter>;
};

export enum Flag_OrderBy {
  FlagResolutionTimestamp = 'flagResolutionTimestamp',
  Flagger = 'flagger',
  FlaggerContractVersion = 'flagger__contractVersion',
  FlaggerCumulativeEarningsWei = 'flagger__cumulativeEarningsWei',
  FlaggerCumulativeOperatorsCutWei = 'flagger__cumulativeOperatorsCutWei',
  FlaggerCumulativeProfitsWei = 'flagger__cumulativeProfitsWei',
  FlaggerDataTokenBalanceWei = 'flagger__dataTokenBalanceWei',
  FlaggerDelegatorCount = 'flagger__delegatorCount',
  FlaggerExchangeRate = 'flagger__exchangeRate',
  FlaggerId = 'flagger__id',
  FlaggerIsEligibleToVote = 'flagger__isEligibleToVote',
  FlaggerLatestHeartbeatMetadata = 'flagger__latestHeartbeatMetadata',
  FlaggerLatestHeartbeatTimestamp = 'flagger__latestHeartbeatTimestamp',
  FlaggerMetadataJsonString = 'flagger__metadataJsonString',
  FlaggerOperatorTokenTotalSupplyWei = 'flagger__operatorTokenTotalSupplyWei',
  FlaggerOperatorsCutFraction = 'flagger__operatorsCutFraction',
  FlaggerOwner = 'flagger__owner',
  FlaggerProtectionEndTimestamp = 'flagger__protectionEndTimestamp',
  FlaggerSlashingsCount = 'flagger__slashingsCount',
  FlaggerTotalStakeInSponsorshipsWei = 'flagger__totalStakeInSponsorshipsWei',
  FlaggerValueUpdateBlockNumber = 'flagger__valueUpdateBlockNumber',
  FlaggerValueUpdateTimestamp = 'flagger__valueUpdateTimestamp',
  FlaggerValueWithoutEarnings = 'flagger__valueWithoutEarnings',
  FlaggingTimestamp = 'flaggingTimestamp',
  Id = 'id',
  LastFlagIndex = 'lastFlagIndex',
  Metadata = 'metadata',
  ProtectionEndTimestamp = 'protectionEndTimestamp',
  Result = 'result',
  ReviewerCount = 'reviewerCount',
  Reviewers = 'reviewers',
  Sponsorship = 'sponsorship',
  SponsorshipCreator = 'sponsorship__creator',
  SponsorshipCumulativeSponsoring = 'sponsorship__cumulativeSponsoring',
  SponsorshipId = 'sponsorship__id',
  SponsorshipIsRunning = 'sponsorship__isRunning',
  SponsorshipMaxOperators = 'sponsorship__maxOperators',
  SponsorshipMetadata = 'sponsorship__metadata',
  SponsorshipMinOperators = 'sponsorship__minOperators',
  SponsorshipMinimumStakingPeriodSeconds = 'sponsorship__minimumStakingPeriodSeconds',
  SponsorshipOperatorCount = 'sponsorship__operatorCount',
  SponsorshipProjectedInsolvency = 'sponsorship__projectedInsolvency',
  SponsorshipRemainingWei = 'sponsorship__remainingWei',
  SponsorshipRemainingWeiUpdateTimestamp = 'sponsorship__remainingWeiUpdateTimestamp',
  SponsorshipSpotApy = 'sponsorship__spotAPY',
  SponsorshipTotalPayoutWeiPerSec = 'sponsorship__totalPayoutWeiPerSec',
  SponsorshipTotalStakedWei = 'sponsorship__totalStakedWei',
  Target = 'target',
  TargetStakeAtRiskWei = 'targetStakeAtRiskWei',
  TargetContractVersion = 'target__contractVersion',
  TargetCumulativeEarningsWei = 'target__cumulativeEarningsWei',
  TargetCumulativeOperatorsCutWei = 'target__cumulativeOperatorsCutWei',
  TargetCumulativeProfitsWei = 'target__cumulativeProfitsWei',
  TargetDataTokenBalanceWei = 'target__dataTokenBalanceWei',
  TargetDelegatorCount = 'target__delegatorCount',
  TargetExchangeRate = 'target__exchangeRate',
  TargetId = 'target__id',
  TargetIsEligibleToVote = 'target__isEligibleToVote',
  TargetLatestHeartbeatMetadata = 'target__latestHeartbeatMetadata',
  TargetLatestHeartbeatTimestamp = 'target__latestHeartbeatTimestamp',
  TargetMetadataJsonString = 'target__metadataJsonString',
  TargetOperatorTokenTotalSupplyWei = 'target__operatorTokenTotalSupplyWei',
  TargetOperatorsCutFraction = 'target__operatorsCutFraction',
  TargetOwner = 'target__owner',
  TargetProtectionEndTimestamp = 'target__protectionEndTimestamp',
  TargetSlashingsCount = 'target__slashingsCount',
  TargetTotalStakeInSponsorshipsWei = 'target__totalStakeInSponsorshipsWei',
  TargetValueUpdateBlockNumber = 'target__valueUpdateBlockNumber',
  TargetValueUpdateTimestamp = 'target__valueUpdateTimestamp',
  TargetValueWithoutEarnings = 'target__valueWithoutEarnings',
  VoteEndTimestamp = 'voteEndTimestamp',
  VoteStartTimestamp = 'voteStartTimestamp',
  Votes = 'votes',
  VotesAgainstKick = 'votesAgainstKick',
  VotesForKick = 'votesForKick'
}

export type Network = {
  __typename?: 'Network';
  earlyLeaverPenaltyWei: Scalars['BigInt']['output'];
  /** The number of all Operators ever created through the OperatorpFactory that are eligible to vote */
  eligibleVotersCount: Scalars['Int']['output'];
  fishermanRewardFraction: Scalars['BigInt']['output'];
  flagProtectionSeconds: Scalars['Int']['output'];
  flagReviewerCount: Scalars['Int']['output'];
  flagReviewerRewardWei: Scalars['BigInt']['output'];
  flagReviewerSelectionIterations: Scalars['Int']['output'];
  flagStakeWei: Scalars['BigInt']['output'];
  flaggerRewardWei: Scalars['BigInt']['output'];
  /** The number of all Sponsorships ever created through the SponsorshipFactory that are currently funded */
  fundedSponsorshipsCount: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  maxAllowedEarningsFraction: Scalars['BigInt']['output'];
  maxPenaltyPeriodSeconds: Scalars['Int']['output'];
  maxQueueSeconds: Scalars['Int']['output'];
  minEligibleVoterAge: Scalars['Int']['output'];
  minEligibleVoterFractionOfAllStake: Scalars['BigInt']['output'];
  minimumDelegationSeconds: Scalars['Int']['output'];
  minimumDelegationWei: Scalars['BigInt']['output'];
  minimumSelfDelegationFraction: Scalars['BigInt']['output'];
  /** Updated whenever one of flaggerRewardWei | flagReviewerCount | flagReviewerRewardWei | slashingFraction changes */
  minimumStakeWei: Scalars['BigInt']['output'];
  operatorContractOnlyJoinPolicy?: Maybe<Scalars['String']['output']>;
  operatorFactory?: Maybe<Scalars['String']['output']>;
  /** The number of all Operators ever created through the OperatorpFactory */
  operatorsCount: Scalars['Int']['output'];
  protocolFeeBeneficiary: Scalars['String']['output'];
  protocolFeeFraction: Scalars['BigInt']['output'];
  randomOracle?: Maybe<Scalars['String']['output']>;
  reviewPeriodSeconds: Scalars['Int']['output'];
  slashingFraction: Scalars['BigInt']['output'];
  sponsorshipFactory?: Maybe<Scalars['String']['output']>;
  /** The number of all Sponsorships ever created through the SponsorshipFactory */
  sponsorshipsCount: Scalars['Int']['output'];
  streamRegistryAddress?: Maybe<Scalars['String']['output']>;
  /** Total DATA delegated to all operators */
  totalDelegated: Scalars['BigInt']['output'];
  /** Total DATA staked - slashed in all sponsorships */
  totalStake: Scalars['BigInt']['output'];
  /** Total DATA undelegated from all operators */
  totalUndelegated: Scalars['BigInt']['output'];
  trustedForwarder?: Maybe<Scalars['String']['output']>;
  voterRegistry?: Maybe<Scalars['String']['output']>;
  votingPeriodSeconds: Scalars['Int']['output'];
};

export type Network_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Network_Filter>>>;
  earlyLeaverPenaltyWei?: InputMaybe<Scalars['BigInt']['input']>;
  earlyLeaverPenaltyWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  earlyLeaverPenaltyWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  earlyLeaverPenaltyWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  earlyLeaverPenaltyWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  earlyLeaverPenaltyWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  earlyLeaverPenaltyWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  earlyLeaverPenaltyWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  eligibleVotersCount?: InputMaybe<Scalars['Int']['input']>;
  eligibleVotersCount_gt?: InputMaybe<Scalars['Int']['input']>;
  eligibleVotersCount_gte?: InputMaybe<Scalars['Int']['input']>;
  eligibleVotersCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  eligibleVotersCount_lt?: InputMaybe<Scalars['Int']['input']>;
  eligibleVotersCount_lte?: InputMaybe<Scalars['Int']['input']>;
  eligibleVotersCount_not?: InputMaybe<Scalars['Int']['input']>;
  eligibleVotersCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  fishermanRewardFraction?: InputMaybe<Scalars['BigInt']['input']>;
  fishermanRewardFraction_gt?: InputMaybe<Scalars['BigInt']['input']>;
  fishermanRewardFraction_gte?: InputMaybe<Scalars['BigInt']['input']>;
  fishermanRewardFraction_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  fishermanRewardFraction_lt?: InputMaybe<Scalars['BigInt']['input']>;
  fishermanRewardFraction_lte?: InputMaybe<Scalars['BigInt']['input']>;
  fishermanRewardFraction_not?: InputMaybe<Scalars['BigInt']['input']>;
  fishermanRewardFraction_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  flagProtectionSeconds?: InputMaybe<Scalars['Int']['input']>;
  flagProtectionSeconds_gt?: InputMaybe<Scalars['Int']['input']>;
  flagProtectionSeconds_gte?: InputMaybe<Scalars['Int']['input']>;
  flagProtectionSeconds_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  flagProtectionSeconds_lt?: InputMaybe<Scalars['Int']['input']>;
  flagProtectionSeconds_lte?: InputMaybe<Scalars['Int']['input']>;
  flagProtectionSeconds_not?: InputMaybe<Scalars['Int']['input']>;
  flagProtectionSeconds_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  flagReviewerCount?: InputMaybe<Scalars['Int']['input']>;
  flagReviewerCount_gt?: InputMaybe<Scalars['Int']['input']>;
  flagReviewerCount_gte?: InputMaybe<Scalars['Int']['input']>;
  flagReviewerCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  flagReviewerCount_lt?: InputMaybe<Scalars['Int']['input']>;
  flagReviewerCount_lte?: InputMaybe<Scalars['Int']['input']>;
  flagReviewerCount_not?: InputMaybe<Scalars['Int']['input']>;
  flagReviewerCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  flagReviewerRewardWei?: InputMaybe<Scalars['BigInt']['input']>;
  flagReviewerRewardWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  flagReviewerRewardWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  flagReviewerRewardWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  flagReviewerRewardWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  flagReviewerRewardWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  flagReviewerRewardWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  flagReviewerRewardWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  flagReviewerSelectionIterations?: InputMaybe<Scalars['Int']['input']>;
  flagReviewerSelectionIterations_gt?: InputMaybe<Scalars['Int']['input']>;
  flagReviewerSelectionIterations_gte?: InputMaybe<Scalars['Int']['input']>;
  flagReviewerSelectionIterations_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  flagReviewerSelectionIterations_lt?: InputMaybe<Scalars['Int']['input']>;
  flagReviewerSelectionIterations_lte?: InputMaybe<Scalars['Int']['input']>;
  flagReviewerSelectionIterations_not?: InputMaybe<Scalars['Int']['input']>;
  flagReviewerSelectionIterations_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  flagStakeWei?: InputMaybe<Scalars['BigInt']['input']>;
  flagStakeWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  flagStakeWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  flagStakeWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  flagStakeWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  flagStakeWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  flagStakeWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  flagStakeWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  flaggerRewardWei?: InputMaybe<Scalars['BigInt']['input']>;
  flaggerRewardWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  flaggerRewardWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  flaggerRewardWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  flaggerRewardWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  flaggerRewardWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  flaggerRewardWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  flaggerRewardWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  fundedSponsorshipsCount?: InputMaybe<Scalars['Int']['input']>;
  fundedSponsorshipsCount_gt?: InputMaybe<Scalars['Int']['input']>;
  fundedSponsorshipsCount_gte?: InputMaybe<Scalars['Int']['input']>;
  fundedSponsorshipsCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  fundedSponsorshipsCount_lt?: InputMaybe<Scalars['Int']['input']>;
  fundedSponsorshipsCount_lte?: InputMaybe<Scalars['Int']['input']>;
  fundedSponsorshipsCount_not?: InputMaybe<Scalars['Int']['input']>;
  fundedSponsorshipsCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  maxAllowedEarningsFraction?: InputMaybe<Scalars['BigInt']['input']>;
  maxAllowedEarningsFraction_gt?: InputMaybe<Scalars['BigInt']['input']>;
  maxAllowedEarningsFraction_gte?: InputMaybe<Scalars['BigInt']['input']>;
  maxAllowedEarningsFraction_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  maxAllowedEarningsFraction_lt?: InputMaybe<Scalars['BigInt']['input']>;
  maxAllowedEarningsFraction_lte?: InputMaybe<Scalars['BigInt']['input']>;
  maxAllowedEarningsFraction_not?: InputMaybe<Scalars['BigInt']['input']>;
  maxAllowedEarningsFraction_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  maxPenaltyPeriodSeconds?: InputMaybe<Scalars['Int']['input']>;
  maxPenaltyPeriodSeconds_gt?: InputMaybe<Scalars['Int']['input']>;
  maxPenaltyPeriodSeconds_gte?: InputMaybe<Scalars['Int']['input']>;
  maxPenaltyPeriodSeconds_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  maxPenaltyPeriodSeconds_lt?: InputMaybe<Scalars['Int']['input']>;
  maxPenaltyPeriodSeconds_lte?: InputMaybe<Scalars['Int']['input']>;
  maxPenaltyPeriodSeconds_not?: InputMaybe<Scalars['Int']['input']>;
  maxPenaltyPeriodSeconds_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  maxQueueSeconds?: InputMaybe<Scalars['Int']['input']>;
  maxQueueSeconds_gt?: InputMaybe<Scalars['Int']['input']>;
  maxQueueSeconds_gte?: InputMaybe<Scalars['Int']['input']>;
  maxQueueSeconds_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  maxQueueSeconds_lt?: InputMaybe<Scalars['Int']['input']>;
  maxQueueSeconds_lte?: InputMaybe<Scalars['Int']['input']>;
  maxQueueSeconds_not?: InputMaybe<Scalars['Int']['input']>;
  maxQueueSeconds_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  minEligibleVoterAge?: InputMaybe<Scalars['Int']['input']>;
  minEligibleVoterAge_gt?: InputMaybe<Scalars['Int']['input']>;
  minEligibleVoterAge_gte?: InputMaybe<Scalars['Int']['input']>;
  minEligibleVoterAge_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  minEligibleVoterAge_lt?: InputMaybe<Scalars['Int']['input']>;
  minEligibleVoterAge_lte?: InputMaybe<Scalars['Int']['input']>;
  minEligibleVoterAge_not?: InputMaybe<Scalars['Int']['input']>;
  minEligibleVoterAge_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  minEligibleVoterFractionOfAllStake?: InputMaybe<Scalars['BigInt']['input']>;
  minEligibleVoterFractionOfAllStake_gt?: InputMaybe<Scalars['BigInt']['input']>;
  minEligibleVoterFractionOfAllStake_gte?: InputMaybe<Scalars['BigInt']['input']>;
  minEligibleVoterFractionOfAllStake_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  minEligibleVoterFractionOfAllStake_lt?: InputMaybe<Scalars['BigInt']['input']>;
  minEligibleVoterFractionOfAllStake_lte?: InputMaybe<Scalars['BigInt']['input']>;
  minEligibleVoterFractionOfAllStake_not?: InputMaybe<Scalars['BigInt']['input']>;
  minEligibleVoterFractionOfAllStake_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  minimumDelegationSeconds?: InputMaybe<Scalars['Int']['input']>;
  minimumDelegationSeconds_gt?: InputMaybe<Scalars['Int']['input']>;
  minimumDelegationSeconds_gte?: InputMaybe<Scalars['Int']['input']>;
  minimumDelegationSeconds_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  minimumDelegationSeconds_lt?: InputMaybe<Scalars['Int']['input']>;
  minimumDelegationSeconds_lte?: InputMaybe<Scalars['Int']['input']>;
  minimumDelegationSeconds_not?: InputMaybe<Scalars['Int']['input']>;
  minimumDelegationSeconds_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  minimumDelegationWei?: InputMaybe<Scalars['BigInt']['input']>;
  minimumDelegationWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  minimumDelegationWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  minimumDelegationWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  minimumDelegationWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  minimumDelegationWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  minimumDelegationWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  minimumDelegationWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  minimumSelfDelegationFraction?: InputMaybe<Scalars['BigInt']['input']>;
  minimumSelfDelegationFraction_gt?: InputMaybe<Scalars['BigInt']['input']>;
  minimumSelfDelegationFraction_gte?: InputMaybe<Scalars['BigInt']['input']>;
  minimumSelfDelegationFraction_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  minimumSelfDelegationFraction_lt?: InputMaybe<Scalars['BigInt']['input']>;
  minimumSelfDelegationFraction_lte?: InputMaybe<Scalars['BigInt']['input']>;
  minimumSelfDelegationFraction_not?: InputMaybe<Scalars['BigInt']['input']>;
  minimumSelfDelegationFraction_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  minimumStakeWei?: InputMaybe<Scalars['BigInt']['input']>;
  minimumStakeWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  minimumStakeWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  minimumStakeWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  minimumStakeWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  minimumStakeWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  minimumStakeWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  minimumStakeWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  operatorContractOnlyJoinPolicy?: InputMaybe<Scalars['String']['input']>;
  operatorContractOnlyJoinPolicy_contains?: InputMaybe<Scalars['String']['input']>;
  operatorContractOnlyJoinPolicy_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operatorContractOnlyJoinPolicy_ends_with?: InputMaybe<Scalars['String']['input']>;
  operatorContractOnlyJoinPolicy_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operatorContractOnlyJoinPolicy_gt?: InputMaybe<Scalars['String']['input']>;
  operatorContractOnlyJoinPolicy_gte?: InputMaybe<Scalars['String']['input']>;
  operatorContractOnlyJoinPolicy_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operatorContractOnlyJoinPolicy_lt?: InputMaybe<Scalars['String']['input']>;
  operatorContractOnlyJoinPolicy_lte?: InputMaybe<Scalars['String']['input']>;
  operatorContractOnlyJoinPolicy_not?: InputMaybe<Scalars['String']['input']>;
  operatorContractOnlyJoinPolicy_not_contains?: InputMaybe<Scalars['String']['input']>;
  operatorContractOnlyJoinPolicy_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operatorContractOnlyJoinPolicy_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  operatorContractOnlyJoinPolicy_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operatorContractOnlyJoinPolicy_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operatorContractOnlyJoinPolicy_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  operatorContractOnlyJoinPolicy_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operatorContractOnlyJoinPolicy_starts_with?: InputMaybe<Scalars['String']['input']>;
  operatorContractOnlyJoinPolicy_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operatorFactory?: InputMaybe<Scalars['String']['input']>;
  operatorFactory_contains?: InputMaybe<Scalars['String']['input']>;
  operatorFactory_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operatorFactory_ends_with?: InputMaybe<Scalars['String']['input']>;
  operatorFactory_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operatorFactory_gt?: InputMaybe<Scalars['String']['input']>;
  operatorFactory_gte?: InputMaybe<Scalars['String']['input']>;
  operatorFactory_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operatorFactory_lt?: InputMaybe<Scalars['String']['input']>;
  operatorFactory_lte?: InputMaybe<Scalars['String']['input']>;
  operatorFactory_not?: InputMaybe<Scalars['String']['input']>;
  operatorFactory_not_contains?: InputMaybe<Scalars['String']['input']>;
  operatorFactory_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operatorFactory_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  operatorFactory_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operatorFactory_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operatorFactory_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  operatorFactory_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operatorFactory_starts_with?: InputMaybe<Scalars['String']['input']>;
  operatorFactory_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operatorsCount?: InputMaybe<Scalars['Int']['input']>;
  operatorsCount_gt?: InputMaybe<Scalars['Int']['input']>;
  operatorsCount_gte?: InputMaybe<Scalars['Int']['input']>;
  operatorsCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  operatorsCount_lt?: InputMaybe<Scalars['Int']['input']>;
  operatorsCount_lte?: InputMaybe<Scalars['Int']['input']>;
  operatorsCount_not?: InputMaybe<Scalars['Int']['input']>;
  operatorsCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Network_Filter>>>;
  protocolFeeBeneficiary?: InputMaybe<Scalars['String']['input']>;
  protocolFeeBeneficiary_contains?: InputMaybe<Scalars['String']['input']>;
  protocolFeeBeneficiary_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocolFeeBeneficiary_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocolFeeBeneficiary_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocolFeeBeneficiary_gt?: InputMaybe<Scalars['String']['input']>;
  protocolFeeBeneficiary_gte?: InputMaybe<Scalars['String']['input']>;
  protocolFeeBeneficiary_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocolFeeBeneficiary_lt?: InputMaybe<Scalars['String']['input']>;
  protocolFeeBeneficiary_lte?: InputMaybe<Scalars['String']['input']>;
  protocolFeeBeneficiary_not?: InputMaybe<Scalars['String']['input']>;
  protocolFeeBeneficiary_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocolFeeBeneficiary_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocolFeeBeneficiary_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocolFeeBeneficiary_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocolFeeBeneficiary_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocolFeeBeneficiary_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocolFeeBeneficiary_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocolFeeBeneficiary_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocolFeeBeneficiary_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocolFeeFraction?: InputMaybe<Scalars['BigInt']['input']>;
  protocolFeeFraction_gt?: InputMaybe<Scalars['BigInt']['input']>;
  protocolFeeFraction_gte?: InputMaybe<Scalars['BigInt']['input']>;
  protocolFeeFraction_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  protocolFeeFraction_lt?: InputMaybe<Scalars['BigInt']['input']>;
  protocolFeeFraction_lte?: InputMaybe<Scalars['BigInt']['input']>;
  protocolFeeFraction_not?: InputMaybe<Scalars['BigInt']['input']>;
  protocolFeeFraction_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  randomOracle?: InputMaybe<Scalars['String']['input']>;
  randomOracle_contains?: InputMaybe<Scalars['String']['input']>;
  randomOracle_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  randomOracle_ends_with?: InputMaybe<Scalars['String']['input']>;
  randomOracle_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  randomOracle_gt?: InputMaybe<Scalars['String']['input']>;
  randomOracle_gte?: InputMaybe<Scalars['String']['input']>;
  randomOracle_in?: InputMaybe<Array<Scalars['String']['input']>>;
  randomOracle_lt?: InputMaybe<Scalars['String']['input']>;
  randomOracle_lte?: InputMaybe<Scalars['String']['input']>;
  randomOracle_not?: InputMaybe<Scalars['String']['input']>;
  randomOracle_not_contains?: InputMaybe<Scalars['String']['input']>;
  randomOracle_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  randomOracle_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  randomOracle_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  randomOracle_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  randomOracle_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  randomOracle_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  randomOracle_starts_with?: InputMaybe<Scalars['String']['input']>;
  randomOracle_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  reviewPeriodSeconds?: InputMaybe<Scalars['Int']['input']>;
  reviewPeriodSeconds_gt?: InputMaybe<Scalars['Int']['input']>;
  reviewPeriodSeconds_gte?: InputMaybe<Scalars['Int']['input']>;
  reviewPeriodSeconds_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  reviewPeriodSeconds_lt?: InputMaybe<Scalars['Int']['input']>;
  reviewPeriodSeconds_lte?: InputMaybe<Scalars['Int']['input']>;
  reviewPeriodSeconds_not?: InputMaybe<Scalars['Int']['input']>;
  reviewPeriodSeconds_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  slashingFraction?: InputMaybe<Scalars['BigInt']['input']>;
  slashingFraction_gt?: InputMaybe<Scalars['BigInt']['input']>;
  slashingFraction_gte?: InputMaybe<Scalars['BigInt']['input']>;
  slashingFraction_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  slashingFraction_lt?: InputMaybe<Scalars['BigInt']['input']>;
  slashingFraction_lte?: InputMaybe<Scalars['BigInt']['input']>;
  slashingFraction_not?: InputMaybe<Scalars['BigInt']['input']>;
  slashingFraction_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  sponsorshipFactory?: InputMaybe<Scalars['String']['input']>;
  sponsorshipFactory_contains?: InputMaybe<Scalars['String']['input']>;
  sponsorshipFactory_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorshipFactory_ends_with?: InputMaybe<Scalars['String']['input']>;
  sponsorshipFactory_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorshipFactory_gt?: InputMaybe<Scalars['String']['input']>;
  sponsorshipFactory_gte?: InputMaybe<Scalars['String']['input']>;
  sponsorshipFactory_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sponsorshipFactory_lt?: InputMaybe<Scalars['String']['input']>;
  sponsorshipFactory_lte?: InputMaybe<Scalars['String']['input']>;
  sponsorshipFactory_not?: InputMaybe<Scalars['String']['input']>;
  sponsorshipFactory_not_contains?: InputMaybe<Scalars['String']['input']>;
  sponsorshipFactory_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorshipFactory_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  sponsorshipFactory_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorshipFactory_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sponsorshipFactory_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  sponsorshipFactory_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorshipFactory_starts_with?: InputMaybe<Scalars['String']['input']>;
  sponsorshipFactory_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorshipsCount?: InputMaybe<Scalars['Int']['input']>;
  sponsorshipsCount_gt?: InputMaybe<Scalars['Int']['input']>;
  sponsorshipsCount_gte?: InputMaybe<Scalars['Int']['input']>;
  sponsorshipsCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  sponsorshipsCount_lt?: InputMaybe<Scalars['Int']['input']>;
  sponsorshipsCount_lte?: InputMaybe<Scalars['Int']['input']>;
  sponsorshipsCount_not?: InputMaybe<Scalars['Int']['input']>;
  sponsorshipsCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  streamRegistryAddress?: InputMaybe<Scalars['String']['input']>;
  streamRegistryAddress_contains?: InputMaybe<Scalars['String']['input']>;
  streamRegistryAddress_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  streamRegistryAddress_ends_with?: InputMaybe<Scalars['String']['input']>;
  streamRegistryAddress_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  streamRegistryAddress_gt?: InputMaybe<Scalars['String']['input']>;
  streamRegistryAddress_gte?: InputMaybe<Scalars['String']['input']>;
  streamRegistryAddress_in?: InputMaybe<Array<Scalars['String']['input']>>;
  streamRegistryAddress_lt?: InputMaybe<Scalars['String']['input']>;
  streamRegistryAddress_lte?: InputMaybe<Scalars['String']['input']>;
  streamRegistryAddress_not?: InputMaybe<Scalars['String']['input']>;
  streamRegistryAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
  streamRegistryAddress_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  streamRegistryAddress_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  streamRegistryAddress_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  streamRegistryAddress_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  streamRegistryAddress_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  streamRegistryAddress_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  streamRegistryAddress_starts_with?: InputMaybe<Scalars['String']['input']>;
  streamRegistryAddress_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  totalDelegated?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegated_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegated_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegated_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalDelegated_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegated_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegated_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegated_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalStake?: InputMaybe<Scalars['BigInt']['input']>;
  totalStake_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalStake_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalStake_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalStake_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalStake_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalStake_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalStake_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalUndelegated?: InputMaybe<Scalars['BigInt']['input']>;
  totalUndelegated_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalUndelegated_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalUndelegated_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalUndelegated_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalUndelegated_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalUndelegated_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalUndelegated_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  trustedForwarder?: InputMaybe<Scalars['String']['input']>;
  trustedForwarder_contains?: InputMaybe<Scalars['String']['input']>;
  trustedForwarder_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  trustedForwarder_ends_with?: InputMaybe<Scalars['String']['input']>;
  trustedForwarder_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  trustedForwarder_gt?: InputMaybe<Scalars['String']['input']>;
  trustedForwarder_gte?: InputMaybe<Scalars['String']['input']>;
  trustedForwarder_in?: InputMaybe<Array<Scalars['String']['input']>>;
  trustedForwarder_lt?: InputMaybe<Scalars['String']['input']>;
  trustedForwarder_lte?: InputMaybe<Scalars['String']['input']>;
  trustedForwarder_not?: InputMaybe<Scalars['String']['input']>;
  trustedForwarder_not_contains?: InputMaybe<Scalars['String']['input']>;
  trustedForwarder_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  trustedForwarder_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  trustedForwarder_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  trustedForwarder_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  trustedForwarder_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  trustedForwarder_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  trustedForwarder_starts_with?: InputMaybe<Scalars['String']['input']>;
  trustedForwarder_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  voterRegistry?: InputMaybe<Scalars['String']['input']>;
  voterRegistry_contains?: InputMaybe<Scalars['String']['input']>;
  voterRegistry_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  voterRegistry_ends_with?: InputMaybe<Scalars['String']['input']>;
  voterRegistry_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  voterRegistry_gt?: InputMaybe<Scalars['String']['input']>;
  voterRegistry_gte?: InputMaybe<Scalars['String']['input']>;
  voterRegistry_in?: InputMaybe<Array<Scalars['String']['input']>>;
  voterRegistry_lt?: InputMaybe<Scalars['String']['input']>;
  voterRegistry_lte?: InputMaybe<Scalars['String']['input']>;
  voterRegistry_not?: InputMaybe<Scalars['String']['input']>;
  voterRegistry_not_contains?: InputMaybe<Scalars['String']['input']>;
  voterRegistry_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  voterRegistry_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  voterRegistry_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  voterRegistry_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  voterRegistry_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  voterRegistry_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  voterRegistry_starts_with?: InputMaybe<Scalars['String']['input']>;
  voterRegistry_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  votingPeriodSeconds?: InputMaybe<Scalars['Int']['input']>;
  votingPeriodSeconds_gt?: InputMaybe<Scalars['Int']['input']>;
  votingPeriodSeconds_gte?: InputMaybe<Scalars['Int']['input']>;
  votingPeriodSeconds_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  votingPeriodSeconds_lt?: InputMaybe<Scalars['Int']['input']>;
  votingPeriodSeconds_lte?: InputMaybe<Scalars['Int']['input']>;
  votingPeriodSeconds_not?: InputMaybe<Scalars['Int']['input']>;
  votingPeriodSeconds_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export enum Network_OrderBy {
  EarlyLeaverPenaltyWei = 'earlyLeaverPenaltyWei',
  EligibleVotersCount = 'eligibleVotersCount',
  FishermanRewardFraction = 'fishermanRewardFraction',
  FlagProtectionSeconds = 'flagProtectionSeconds',
  FlagReviewerCount = 'flagReviewerCount',
  FlagReviewerRewardWei = 'flagReviewerRewardWei',
  FlagReviewerSelectionIterations = 'flagReviewerSelectionIterations',
  FlagStakeWei = 'flagStakeWei',
  FlaggerRewardWei = 'flaggerRewardWei',
  FundedSponsorshipsCount = 'fundedSponsorshipsCount',
  Id = 'id',
  MaxAllowedEarningsFraction = 'maxAllowedEarningsFraction',
  MaxPenaltyPeriodSeconds = 'maxPenaltyPeriodSeconds',
  MaxQueueSeconds = 'maxQueueSeconds',
  MinEligibleVoterAge = 'minEligibleVoterAge',
  MinEligibleVoterFractionOfAllStake = 'minEligibleVoterFractionOfAllStake',
  MinimumDelegationSeconds = 'minimumDelegationSeconds',
  MinimumDelegationWei = 'minimumDelegationWei',
  MinimumSelfDelegationFraction = 'minimumSelfDelegationFraction',
  MinimumStakeWei = 'minimumStakeWei',
  OperatorContractOnlyJoinPolicy = 'operatorContractOnlyJoinPolicy',
  OperatorFactory = 'operatorFactory',
  OperatorsCount = 'operatorsCount',
  ProtocolFeeBeneficiary = 'protocolFeeBeneficiary',
  ProtocolFeeFraction = 'protocolFeeFraction',
  RandomOracle = 'randomOracle',
  ReviewPeriodSeconds = 'reviewPeriodSeconds',
  SlashingFraction = 'slashingFraction',
  SponsorshipFactory = 'sponsorshipFactory',
  SponsorshipsCount = 'sponsorshipsCount',
  StreamRegistryAddress = 'streamRegistryAddress',
  TotalDelegated = 'totalDelegated',
  TotalStake = 'totalStake',
  TotalUndelegated = 'totalUndelegated',
  TrustedForwarder = 'trustedForwarder',
  VoterRegistry = 'voterRegistry',
  VotingPeriodSeconds = 'votingPeriodSeconds'
}

export type Node = {
  __typename?: 'Node';
  /** date created. This is a timestamp in seconds */
  createdAt?: Maybe<Scalars['BigInt']['output']>;
  /** node ID = address */
  id: Scalars['ID']['output'];
  /** Epoch timestamp of the last time the node metadata was updated */
  lastSeen: Scalars['BigInt']['output'];
  /** Connection metadata, e.g. URL of the node, e.g. http://mynode.com:3000 */
  metadata: Scalars['String']['output'];
  /** Streams for which this node is registered as a storage node in the StreamStorageRegistry */
  storedStreams?: Maybe<Array<Stream>>;
};


export type NodeStoredStreamsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Stream_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Stream_Filter>;
};

export type Node_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Node_Filter>>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lastSeen?: InputMaybe<Scalars['BigInt']['input']>;
  lastSeen_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastSeen_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastSeen_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastSeen_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastSeen_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastSeen_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastSeen_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  metadata?: InputMaybe<Scalars['String']['input']>;
  metadata_contains?: InputMaybe<Scalars['String']['input']>;
  metadata_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadata_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_gt?: InputMaybe<Scalars['String']['input']>;
  metadata_gte?: InputMaybe<Scalars['String']['input']>;
  metadata_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_lt?: InputMaybe<Scalars['String']['input']>;
  metadata_lte?: InputMaybe<Scalars['String']['input']>;
  metadata_not?: InputMaybe<Scalars['String']['input']>;
  metadata_not_contains?: InputMaybe<Scalars['String']['input']>;
  metadata_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadata_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadata_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadata_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Node_Filter>>>;
  storedStreams?: InputMaybe<Array<Scalars['String']['input']>>;
  storedStreams_?: InputMaybe<Stream_Filter>;
  storedStreams_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  storedStreams_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  storedStreams_not?: InputMaybe<Array<Scalars['String']['input']>>;
  storedStreams_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  storedStreams_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
};

export enum Node_OrderBy {
  CreatedAt = 'createdAt',
  Id = 'id',
  LastSeen = 'lastSeen',
  Metadata = 'metadata',
  StoredStreams = 'storedStreams'
}

export type Operator = {
  __typename?: 'Operator';
  /** Version is a bitfield of supported features. Generally, so far, higher version supports lower versions' features, so normal number comparison works. */
  contractVersion: Scalars['BigInt']['output'];
  /** Addresses that can call all owner/admin methods in the Operator contract (owner alone in this list initially) */
  controllers: Array<Scalars['String']['output']>;
  /** Operator earnings (cumulative) from all sponsorships. Includes the operator's share of earnings + delegators earnings */
  cumulativeEarningsWei: Scalars['BigInt']['output'];
  /** Operator's share of the earnings (cumulative) */
  cumulativeOperatorsCutWei: Scalars['BigInt']['output'];
  /** Increase in the Operator's value (cumulative, after fees) */
  cumulativeProfitsWei: Scalars['BigInt']['output'];
  /** DATA held by the operator, not yet staked. Last updated at valueUpdateBlockNumber/Timestamp, might be out of date if new DATA is sent via `ERC20.transfer`. */
  dataTokenBalanceWei: Scalars['BigInt']['output'];
  delegations: Array<Delegation>;
  /** All delegators who have delegated to this operator. Increased when Delegation is created and decreased when Delegation is removed */
  delegatorCount: Scalars['Int']['output'];
  /** DATA/operatortoken exchange rate, equal to valueWithoutEarnings / totalSupply. Operator tokens are worth (exchangeRate * amount) DATA when undelegating. */
  exchangeRate: Scalars['BigDecimal']['output'];
  flagsOpened: Array<Flag>;
  flagsTargeted: Array<Flag>;
  id: Scalars['ID']['output'];
  isEligibleToVote: Scalars['Boolean']['output'];
  /** Connection metadata, to be able to find a node in the Operator's fleet */
  latestHeartbeatMetadata?: Maybe<Scalars['String']['output']>;
  latestHeartbeatTimestamp?: Maybe<Scalars['BigInt']['output']>;
  metadataJsonString: Scalars['String']['output'];
  nodes: Array<Scalars['String']['output']>;
  /** Total number of operator tokens in existence */
  operatorTokenTotalSupplyWei: Scalars['BigInt']['output'];
  operatorsCutFraction: Scalars['BigInt']['output'];
  owner: Scalars['String']['output'];
  protectionEndTimestamp?: Maybe<Scalars['Int']['output']>;
  queueEntries: Array<QueueEntry>;
  raisedFlags: Array<Flag>;
  receivedFlags: Array<Flag>;
  slashingEvents: Array<SlashingEvent>;
  slashingsCount: Scalars['Int']['output'];
  stakes: Array<Stake>;
  stakingEvents: Array<StakingEvent>;
  /** DATA staked into Sponsorship contracts. Last updated at valueUpdateBlockNumber/Timestamp. */
  totalStakeInSponsorshipsWei: Scalars['BigInt']['output'];
  /** Block number when valueWithoutEarnings was updated. */
  valueUpdateBlockNumber: Scalars['BigInt']['output'];
  /** Timestamp in seconds when valueWithoutEarnings was updated. Shows how much the valueWithoutEarnings might be out of date. */
  valueUpdateTimestamp: Scalars['BigInt']['output'];
  /** DATA staked + held by the Operator contract = totalStakeInSponsorshipsWei + dataTokenBalanceWei. Last updated at valueUpdateBlockNumber/Timestamp. */
  valueWithoutEarnings: Scalars['BigInt']['output'];
  votesOnFlags: Array<Vote>;
};


export type OperatorDelegationsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Delegation_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Delegation_Filter>;
};


export type OperatorFlagsOpenedArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Flag_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Flag_Filter>;
};


export type OperatorFlagsTargetedArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Flag_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Flag_Filter>;
};


export type OperatorQueueEntriesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<QueueEntry_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<QueueEntry_Filter>;
};


export type OperatorRaisedFlagsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Flag_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Flag_Filter>;
};


export type OperatorReceivedFlagsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Flag_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Flag_Filter>;
};


export type OperatorSlashingEventsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SlashingEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<SlashingEvent_Filter>;
};


export type OperatorStakesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Stake_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Stake_Filter>;
};


export type OperatorStakingEventsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<StakingEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<StakingEvent_Filter>;
};


export type OperatorVotesOnFlagsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Vote_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Vote_Filter>;
};

export type OperatorDailyBucket = {
  __typename?: 'OperatorDailyBucket';
  /** Sum of the operator's lifetime earnings (including operator's cut) */
  cumulativeEarningsWei: Scalars['BigInt']['output'];
  /** DATA held by the operator, not yet staked (first event in bucket) */
  dataTokenBalanceWei: Scalars['BigInt']['output'];
  /** The day of the bucket. This is a timestamp in seconds */
  date: Scalars['BigInt']['output'];
  /** All delegators joining this operator. Initialized from operator.delegatorCount */
  delegatorCountAtStart: Scalars['Int']['output'];
  /** Delegators that joined today. Updated when Delegation entity is created */
  delegatorCountChange: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  /** Sum of losses today */
  lossesWei: Scalars['BigInt']['output'];
  operator: Operator;
  /** Sum of operator's share of earnings today */
  operatorsCutWei: Scalars['BigInt']['output'];
  /** Sum of earnings today, less operator's share */
  profitsWei: Scalars['BigInt']['output'];
  /** Sum of DATA tokens delegated to this operator today, by all delegators. Updated when Delegated event is fired */
  totalDelegatedWei: Scalars['BigInt']['output'];
  /** DATA staked into Sponsorship contracts (first event in bucket) */
  totalStakeInSponsorshipsWei: Scalars['BigInt']['output'];
  /** Sum of DATA tokens undelegated from this operator today, by all delegators. Updated when Undelegated event is fired */
  totalUndelegatedWei: Scalars['BigInt']['output'];
  /** DATA staked + held by the Operator contract = totalStakeInSponsorshipsWei + dataTokenBalanceWei (first event in bucket) */
  valueWithoutEarnings: Scalars['BigInt']['output'];
};

export type OperatorDailyBucket_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<OperatorDailyBucket_Filter>>>;
  cumulativeEarningsWei?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeEarningsWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeEarningsWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeEarningsWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeEarningsWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeEarningsWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeEarningsWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeEarningsWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dataTokenBalanceWei?: InputMaybe<Scalars['BigInt']['input']>;
  dataTokenBalanceWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  dataTokenBalanceWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  dataTokenBalanceWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dataTokenBalanceWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  dataTokenBalanceWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  dataTokenBalanceWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  dataTokenBalanceWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  date?: InputMaybe<Scalars['BigInt']['input']>;
  date_gt?: InputMaybe<Scalars['BigInt']['input']>;
  date_gte?: InputMaybe<Scalars['BigInt']['input']>;
  date_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  date_lt?: InputMaybe<Scalars['BigInt']['input']>;
  date_lte?: InputMaybe<Scalars['BigInt']['input']>;
  date_not?: InputMaybe<Scalars['BigInt']['input']>;
  date_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  delegatorCountAtStart?: InputMaybe<Scalars['Int']['input']>;
  delegatorCountAtStart_gt?: InputMaybe<Scalars['Int']['input']>;
  delegatorCountAtStart_gte?: InputMaybe<Scalars['Int']['input']>;
  delegatorCountAtStart_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  delegatorCountAtStart_lt?: InputMaybe<Scalars['Int']['input']>;
  delegatorCountAtStart_lte?: InputMaybe<Scalars['Int']['input']>;
  delegatorCountAtStart_not?: InputMaybe<Scalars['Int']['input']>;
  delegatorCountAtStart_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  delegatorCountChange?: InputMaybe<Scalars['Int']['input']>;
  delegatorCountChange_gt?: InputMaybe<Scalars['Int']['input']>;
  delegatorCountChange_gte?: InputMaybe<Scalars['Int']['input']>;
  delegatorCountChange_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  delegatorCountChange_lt?: InputMaybe<Scalars['Int']['input']>;
  delegatorCountChange_lte?: InputMaybe<Scalars['Int']['input']>;
  delegatorCountChange_not?: InputMaybe<Scalars['Int']['input']>;
  delegatorCountChange_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lossesWei?: InputMaybe<Scalars['BigInt']['input']>;
  lossesWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lossesWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lossesWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lossesWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lossesWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lossesWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  lossesWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  operator?: InputMaybe<Scalars['String']['input']>;
  operator_?: InputMaybe<Operator_Filter>;
  operator_contains?: InputMaybe<Scalars['String']['input']>;
  operator_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_ends_with?: InputMaybe<Scalars['String']['input']>;
  operator_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_gt?: InputMaybe<Scalars['String']['input']>;
  operator_gte?: InputMaybe<Scalars['String']['input']>;
  operator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operator_lt?: InputMaybe<Scalars['String']['input']>;
  operator_lte?: InputMaybe<Scalars['String']['input']>;
  operator_not?: InputMaybe<Scalars['String']['input']>;
  operator_not_contains?: InputMaybe<Scalars['String']['input']>;
  operator_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  operator_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  operator_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_starts_with?: InputMaybe<Scalars['String']['input']>;
  operator_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operatorsCutWei?: InputMaybe<Scalars['BigInt']['input']>;
  operatorsCutWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  operatorsCutWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  operatorsCutWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  operatorsCutWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  operatorsCutWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  operatorsCutWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  operatorsCutWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<OperatorDailyBucket_Filter>>>;
  profitsWei?: InputMaybe<Scalars['BigInt']['input']>;
  profitsWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  profitsWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  profitsWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  profitsWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  profitsWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  profitsWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  profitsWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalDelegatedWei?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegatedWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegatedWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegatedWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalDelegatedWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegatedWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegatedWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegatedWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalStakeInSponsorshipsWei?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakeInSponsorshipsWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakeInSponsorshipsWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakeInSponsorshipsWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalStakeInSponsorshipsWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakeInSponsorshipsWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakeInSponsorshipsWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakeInSponsorshipsWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalUndelegatedWei?: InputMaybe<Scalars['BigInt']['input']>;
  totalUndelegatedWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalUndelegatedWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalUndelegatedWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalUndelegatedWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalUndelegatedWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalUndelegatedWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalUndelegatedWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  valueWithoutEarnings?: InputMaybe<Scalars['BigInt']['input']>;
  valueWithoutEarnings_gt?: InputMaybe<Scalars['BigInt']['input']>;
  valueWithoutEarnings_gte?: InputMaybe<Scalars['BigInt']['input']>;
  valueWithoutEarnings_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  valueWithoutEarnings_lt?: InputMaybe<Scalars['BigInt']['input']>;
  valueWithoutEarnings_lte?: InputMaybe<Scalars['BigInt']['input']>;
  valueWithoutEarnings_not?: InputMaybe<Scalars['BigInt']['input']>;
  valueWithoutEarnings_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum OperatorDailyBucket_OrderBy {
  CumulativeEarningsWei = 'cumulativeEarningsWei',
  DataTokenBalanceWei = 'dataTokenBalanceWei',
  Date = 'date',
  DelegatorCountAtStart = 'delegatorCountAtStart',
  DelegatorCountChange = 'delegatorCountChange',
  Id = 'id',
  LossesWei = 'lossesWei',
  Operator = 'operator',
  OperatorContractVersion = 'operator__contractVersion',
  OperatorCumulativeEarningsWei = 'operator__cumulativeEarningsWei',
  OperatorCumulativeOperatorsCutWei = 'operator__cumulativeOperatorsCutWei',
  OperatorCumulativeProfitsWei = 'operator__cumulativeProfitsWei',
  OperatorDataTokenBalanceWei = 'operator__dataTokenBalanceWei',
  OperatorDelegatorCount = 'operator__delegatorCount',
  OperatorExchangeRate = 'operator__exchangeRate',
  OperatorId = 'operator__id',
  OperatorIsEligibleToVote = 'operator__isEligibleToVote',
  OperatorLatestHeartbeatMetadata = 'operator__latestHeartbeatMetadata',
  OperatorLatestHeartbeatTimestamp = 'operator__latestHeartbeatTimestamp',
  OperatorMetadataJsonString = 'operator__metadataJsonString',
  OperatorOperatorTokenTotalSupplyWei = 'operator__operatorTokenTotalSupplyWei',
  OperatorOperatorsCutFraction = 'operator__operatorsCutFraction',
  OperatorOwner = 'operator__owner',
  OperatorProtectionEndTimestamp = 'operator__protectionEndTimestamp',
  OperatorSlashingsCount = 'operator__slashingsCount',
  OperatorTotalStakeInSponsorshipsWei = 'operator__totalStakeInSponsorshipsWei',
  OperatorValueUpdateBlockNumber = 'operator__valueUpdateBlockNumber',
  OperatorValueUpdateTimestamp = 'operator__valueUpdateTimestamp',
  OperatorValueWithoutEarnings = 'operator__valueWithoutEarnings',
  OperatorsCutWei = 'operatorsCutWei',
  ProfitsWei = 'profitsWei',
  TotalDelegatedWei = 'totalDelegatedWei',
  TotalStakeInSponsorshipsWei = 'totalStakeInSponsorshipsWei',
  TotalUndelegatedWei = 'totalUndelegatedWei',
  ValueWithoutEarnings = 'valueWithoutEarnings'
}

export type Operator_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Operator_Filter>>>;
  contractVersion?: InputMaybe<Scalars['BigInt']['input']>;
  contractVersion_gt?: InputMaybe<Scalars['BigInt']['input']>;
  contractVersion_gte?: InputMaybe<Scalars['BigInt']['input']>;
  contractVersion_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  contractVersion_lt?: InputMaybe<Scalars['BigInt']['input']>;
  contractVersion_lte?: InputMaybe<Scalars['BigInt']['input']>;
  contractVersion_not?: InputMaybe<Scalars['BigInt']['input']>;
  contractVersion_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  controllers?: InputMaybe<Array<Scalars['String']['input']>>;
  controllers_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  controllers_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  controllers_not?: InputMaybe<Array<Scalars['String']['input']>>;
  controllers_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  controllers_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  cumulativeEarningsWei?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeEarningsWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeEarningsWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeEarningsWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeEarningsWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeEarningsWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeEarningsWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeEarningsWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeOperatorsCutWei?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeOperatorsCutWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeOperatorsCutWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeOperatorsCutWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeOperatorsCutWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeOperatorsCutWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeOperatorsCutWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeOperatorsCutWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeProfitsWei?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeProfitsWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeProfitsWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeProfitsWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeProfitsWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeProfitsWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeProfitsWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeProfitsWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dataTokenBalanceWei?: InputMaybe<Scalars['BigInt']['input']>;
  dataTokenBalanceWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  dataTokenBalanceWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  dataTokenBalanceWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dataTokenBalanceWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  dataTokenBalanceWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  dataTokenBalanceWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  dataTokenBalanceWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  delegations_?: InputMaybe<Delegation_Filter>;
  delegatorCount?: InputMaybe<Scalars['Int']['input']>;
  delegatorCount_gt?: InputMaybe<Scalars['Int']['input']>;
  delegatorCount_gte?: InputMaybe<Scalars['Int']['input']>;
  delegatorCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  delegatorCount_lt?: InputMaybe<Scalars['Int']['input']>;
  delegatorCount_lte?: InputMaybe<Scalars['Int']['input']>;
  delegatorCount_not?: InputMaybe<Scalars['Int']['input']>;
  delegatorCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  exchangeRate?: InputMaybe<Scalars['BigDecimal']['input']>;
  exchangeRate_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  exchangeRate_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  exchangeRate_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  exchangeRate_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  exchangeRate_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  exchangeRate_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  exchangeRate_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  flagsOpened_?: InputMaybe<Flag_Filter>;
  flagsTargeted_?: InputMaybe<Flag_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  isEligibleToVote?: InputMaybe<Scalars['Boolean']['input']>;
  isEligibleToVote_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isEligibleToVote_not?: InputMaybe<Scalars['Boolean']['input']>;
  isEligibleToVote_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  latestHeartbeatMetadata?: InputMaybe<Scalars['String']['input']>;
  latestHeartbeatMetadata_contains?: InputMaybe<Scalars['String']['input']>;
  latestHeartbeatMetadata_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  latestHeartbeatMetadata_ends_with?: InputMaybe<Scalars['String']['input']>;
  latestHeartbeatMetadata_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  latestHeartbeatMetadata_gt?: InputMaybe<Scalars['String']['input']>;
  latestHeartbeatMetadata_gte?: InputMaybe<Scalars['String']['input']>;
  latestHeartbeatMetadata_in?: InputMaybe<Array<Scalars['String']['input']>>;
  latestHeartbeatMetadata_lt?: InputMaybe<Scalars['String']['input']>;
  latestHeartbeatMetadata_lte?: InputMaybe<Scalars['String']['input']>;
  latestHeartbeatMetadata_not?: InputMaybe<Scalars['String']['input']>;
  latestHeartbeatMetadata_not_contains?: InputMaybe<Scalars['String']['input']>;
  latestHeartbeatMetadata_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  latestHeartbeatMetadata_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  latestHeartbeatMetadata_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  latestHeartbeatMetadata_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  latestHeartbeatMetadata_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  latestHeartbeatMetadata_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  latestHeartbeatMetadata_starts_with?: InputMaybe<Scalars['String']['input']>;
  latestHeartbeatMetadata_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  latestHeartbeatTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  latestHeartbeatTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  latestHeartbeatTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  latestHeartbeatTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  latestHeartbeatTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  latestHeartbeatTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  latestHeartbeatTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  latestHeartbeatTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  metadataJsonString?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_contains?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_gt?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_gte?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadataJsonString_lt?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_lte?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_not?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_not_contains?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadataJsonString_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  nodes?: InputMaybe<Array<Scalars['String']['input']>>;
  nodes_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  nodes_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  nodes_not?: InputMaybe<Array<Scalars['String']['input']>>;
  nodes_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  nodes_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  operatorTokenTotalSupplyWei?: InputMaybe<Scalars['BigInt']['input']>;
  operatorTokenTotalSupplyWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  operatorTokenTotalSupplyWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  operatorTokenTotalSupplyWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  operatorTokenTotalSupplyWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  operatorTokenTotalSupplyWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  operatorTokenTotalSupplyWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  operatorTokenTotalSupplyWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  operatorsCutFraction?: InputMaybe<Scalars['BigInt']['input']>;
  operatorsCutFraction_gt?: InputMaybe<Scalars['BigInt']['input']>;
  operatorsCutFraction_gte?: InputMaybe<Scalars['BigInt']['input']>;
  operatorsCutFraction_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  operatorsCutFraction_lt?: InputMaybe<Scalars['BigInt']['input']>;
  operatorsCutFraction_lte?: InputMaybe<Scalars['BigInt']['input']>;
  operatorsCutFraction_not?: InputMaybe<Scalars['BigInt']['input']>;
  operatorsCutFraction_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Operator_Filter>>>;
  owner?: InputMaybe<Scalars['String']['input']>;
  owner_contains?: InputMaybe<Scalars['String']['input']>;
  owner_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_gt?: InputMaybe<Scalars['String']['input']>;
  owner_gte?: InputMaybe<Scalars['String']['input']>;
  owner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_lt?: InputMaybe<Scalars['String']['input']>;
  owner_lte?: InputMaybe<Scalars['String']['input']>;
  owner_not?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protectionEndTimestamp?: InputMaybe<Scalars['Int']['input']>;
  protectionEndTimestamp_gt?: InputMaybe<Scalars['Int']['input']>;
  protectionEndTimestamp_gte?: InputMaybe<Scalars['Int']['input']>;
  protectionEndTimestamp_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  protectionEndTimestamp_lt?: InputMaybe<Scalars['Int']['input']>;
  protectionEndTimestamp_lte?: InputMaybe<Scalars['Int']['input']>;
  protectionEndTimestamp_not?: InputMaybe<Scalars['Int']['input']>;
  protectionEndTimestamp_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  queueEntries_?: InputMaybe<QueueEntry_Filter>;
  raisedFlags_?: InputMaybe<Flag_Filter>;
  receivedFlags_?: InputMaybe<Flag_Filter>;
  slashingEvents_?: InputMaybe<SlashingEvent_Filter>;
  slashingsCount?: InputMaybe<Scalars['Int']['input']>;
  slashingsCount_gt?: InputMaybe<Scalars['Int']['input']>;
  slashingsCount_gte?: InputMaybe<Scalars['Int']['input']>;
  slashingsCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  slashingsCount_lt?: InputMaybe<Scalars['Int']['input']>;
  slashingsCount_lte?: InputMaybe<Scalars['Int']['input']>;
  slashingsCount_not?: InputMaybe<Scalars['Int']['input']>;
  slashingsCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  stakes_?: InputMaybe<Stake_Filter>;
  stakingEvents_?: InputMaybe<StakingEvent_Filter>;
  totalStakeInSponsorshipsWei?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakeInSponsorshipsWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakeInSponsorshipsWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakeInSponsorshipsWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalStakeInSponsorshipsWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakeInSponsorshipsWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakeInSponsorshipsWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakeInSponsorshipsWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  valueUpdateBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  valueUpdateBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  valueUpdateBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  valueUpdateBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  valueUpdateBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  valueUpdateBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  valueUpdateBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  valueUpdateBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  valueUpdateTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  valueUpdateTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  valueUpdateTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  valueUpdateTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  valueUpdateTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  valueUpdateTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  valueUpdateTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  valueUpdateTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  valueWithoutEarnings?: InputMaybe<Scalars['BigInt']['input']>;
  valueWithoutEarnings_gt?: InputMaybe<Scalars['BigInt']['input']>;
  valueWithoutEarnings_gte?: InputMaybe<Scalars['BigInt']['input']>;
  valueWithoutEarnings_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  valueWithoutEarnings_lt?: InputMaybe<Scalars['BigInt']['input']>;
  valueWithoutEarnings_lte?: InputMaybe<Scalars['BigInt']['input']>;
  valueWithoutEarnings_not?: InputMaybe<Scalars['BigInt']['input']>;
  valueWithoutEarnings_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  votesOnFlags_?: InputMaybe<Vote_Filter>;
};

export enum Operator_OrderBy {
  ContractVersion = 'contractVersion',
  Controllers = 'controllers',
  CumulativeEarningsWei = 'cumulativeEarningsWei',
  CumulativeOperatorsCutWei = 'cumulativeOperatorsCutWei',
  CumulativeProfitsWei = 'cumulativeProfitsWei',
  DataTokenBalanceWei = 'dataTokenBalanceWei',
  Delegations = 'delegations',
  DelegatorCount = 'delegatorCount',
  ExchangeRate = 'exchangeRate',
  FlagsOpened = 'flagsOpened',
  FlagsTargeted = 'flagsTargeted',
  Id = 'id',
  IsEligibleToVote = 'isEligibleToVote',
  LatestHeartbeatMetadata = 'latestHeartbeatMetadata',
  LatestHeartbeatTimestamp = 'latestHeartbeatTimestamp',
  MetadataJsonString = 'metadataJsonString',
  Nodes = 'nodes',
  OperatorTokenTotalSupplyWei = 'operatorTokenTotalSupplyWei',
  OperatorsCutFraction = 'operatorsCutFraction',
  Owner = 'owner',
  ProtectionEndTimestamp = 'protectionEndTimestamp',
  QueueEntries = 'queueEntries',
  RaisedFlags = 'raisedFlags',
  ReceivedFlags = 'receivedFlags',
  SlashingEvents = 'slashingEvents',
  SlashingsCount = 'slashingsCount',
  Stakes = 'stakes',
  StakingEvents = 'stakingEvents',
  TotalStakeInSponsorshipsWei = 'totalStakeInSponsorshipsWei',
  ValueUpdateBlockNumber = 'valueUpdateBlockNumber',
  ValueUpdateTimestamp = 'valueUpdateTimestamp',
  ValueWithoutEarnings = 'valueWithoutEarnings',
  VotesOnFlags = 'votesOnFlags'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Project = {
  __typename?: 'Project';
  /** Increases when various actions are triggered (e.g. purchase, stake, unstake). Used to generate unique ids */
  counter?: Maybe<Scalars['Int']['output']>;
  /** date created. This is a timestamp in seconds */
  createdAt?: Maybe<Scalars['BigInt']['output']>;
  /** List of domain ids for the chains from which this project can be purchased */
  domainIds: Array<Scalars['BigInt']['output']>;
  /** project id = bytes32 */
  id: Scalars['ID']['output'];
  /** Flags a project as being a data union, true iff 'isDataUnion' field is set to 'true' in the metadata JSON */
  isDataUnion?: Maybe<Scalars['Boolean']['output']>;
  /** Project metadata JSON */
  metadata: Scalars['String']['output'];
  /** The minimum amount of seconds for which a subscription can be extended. This is a normal int value (not wei) */
  minimumSubscriptionSeconds: Scalars['BigInt']['output'];
  /** Payment details for the chains where the project can be purchased: mapping (uint32 => PaymentDetailsByChain) */
  paymentDetails: Array<ProjectPaymentDetails>;
  /** Permissions mapping (bytes32 => Permission) */
  permissions: Array<ProjectPermission>;
  /** Marketplace purchases */
  purchases: Array<ProjectPurchase>;
  /** Incremented/decremented when Stake/Unstake events are fired. It may not always be 1:1 with the stake (with future implementations) */
  score: Scalars['BigInt']['output'];
  /** Total tokens staked in the project by all stakers */
  stakedWei: Scalars['BigInt']['output'];
  /** Streams added to the project */
  streams: Array<Scalars['String']['output']>;
  /** Subscriptions mapping (address => TimeBasedSubscription) */
  subscriptions: Array<ProjectSubscription>;
  /** date updated. This is a timestamp in seconds */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
};


export type ProjectPaymentDetailsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectPaymentDetails_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProjectPaymentDetails_Filter>;
};


export type ProjectPermissionsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectPermission_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProjectPermission_Filter>;
};


export type ProjectPurchasesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectPurchase_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProjectPurchase_Filter>;
};


export type ProjectSubscriptionsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectSubscription_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProjectSubscription_Filter>;
};

export type ProjectPaymentDetails = {
  __typename?: 'ProjectPaymentDetails';
  /** Ethereum address, account where the payment is directed to for project purchases */
  beneficiary: Scalars['Bytes']['output'];
  /** The domainId of the chain where the project can be purchased. It's a unique id assigned by hyperlane to each chain */
  domainId?: Maybe<Scalars['BigInt']['output']>;
  /** payment details id = projectId + '-' + domainId */
  id: Scalars['ID']['output'];
  /** Project price per second. This is a DATA-wei denominated amount (10^18th of DATA token). */
  pricePerSecond?: Maybe<Scalars['BigInt']['output']>;
  /** Ethereum address, the token in which the payment goes to project beneficiary */
  pricingTokenAddress: Scalars['Bytes']['output'];
  /** Target project this payment details applies to */
  project: Project;
};

export type ProjectPaymentDetails_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ProjectPaymentDetails_Filter>>>;
  beneficiary?: InputMaybe<Scalars['Bytes']['input']>;
  beneficiary_contains?: InputMaybe<Scalars['Bytes']['input']>;
  beneficiary_gt?: InputMaybe<Scalars['Bytes']['input']>;
  beneficiary_gte?: InputMaybe<Scalars['Bytes']['input']>;
  beneficiary_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  beneficiary_lt?: InputMaybe<Scalars['Bytes']['input']>;
  beneficiary_lte?: InputMaybe<Scalars['Bytes']['input']>;
  beneficiary_not?: InputMaybe<Scalars['Bytes']['input']>;
  beneficiary_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  beneficiary_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  domainId?: InputMaybe<Scalars['BigInt']['input']>;
  domainId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  domainId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  domainId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  domainId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  domainId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  domainId_not?: InputMaybe<Scalars['BigInt']['input']>;
  domainId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<ProjectPaymentDetails_Filter>>>;
  pricePerSecond?: InputMaybe<Scalars['BigInt']['input']>;
  pricePerSecond_gt?: InputMaybe<Scalars['BigInt']['input']>;
  pricePerSecond_gte?: InputMaybe<Scalars['BigInt']['input']>;
  pricePerSecond_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pricePerSecond_lt?: InputMaybe<Scalars['BigInt']['input']>;
  pricePerSecond_lte?: InputMaybe<Scalars['BigInt']['input']>;
  pricePerSecond_not?: InputMaybe<Scalars['BigInt']['input']>;
  pricePerSecond_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pricingTokenAddress?: InputMaybe<Scalars['Bytes']['input']>;
  pricingTokenAddress_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pricingTokenAddress_gt?: InputMaybe<Scalars['Bytes']['input']>;
  pricingTokenAddress_gte?: InputMaybe<Scalars['Bytes']['input']>;
  pricingTokenAddress_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pricingTokenAddress_lt?: InputMaybe<Scalars['Bytes']['input']>;
  pricingTokenAddress_lte?: InputMaybe<Scalars['Bytes']['input']>;
  pricingTokenAddress_not?: InputMaybe<Scalars['Bytes']['input']>;
  pricingTokenAddress_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pricingTokenAddress_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  project?: InputMaybe<Scalars['String']['input']>;
  project_?: InputMaybe<Project_Filter>;
  project_contains?: InputMaybe<Scalars['String']['input']>;
  project_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_gt?: InputMaybe<Scalars['String']['input']>;
  project_gte?: InputMaybe<Scalars['String']['input']>;
  project_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_lt?: InputMaybe<Scalars['String']['input']>;
  project_lte?: InputMaybe<Scalars['String']['input']>;
  project_not?: InputMaybe<Scalars['String']['input']>;
  project_not_contains?: InputMaybe<Scalars['String']['input']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum ProjectPaymentDetails_OrderBy {
  Beneficiary = 'beneficiary',
  DomainId = 'domainId',
  Id = 'id',
  PricePerSecond = 'pricePerSecond',
  PricingTokenAddress = 'pricingTokenAddress',
  Project = 'project',
  ProjectCounter = 'project__counter',
  ProjectCreatedAt = 'project__createdAt',
  ProjectId = 'project__id',
  ProjectIsDataUnion = 'project__isDataUnion',
  ProjectMetadata = 'project__metadata',
  ProjectMinimumSubscriptionSeconds = 'project__minimumSubscriptionSeconds',
  ProjectScore = 'project__score',
  ProjectStakedWei = 'project__stakedWei',
  ProjectUpdatedAt = 'project__updatedAt'
}

export type ProjectPermission = {
  __typename?: 'ProjectPermission';
  /** canBuy permission enables a user to buy the project */
  canBuy?: Maybe<Scalars['Boolean']['output']>;
  /** canDelete permission allows deleting the project from the ProjectRegistry */
  canDelete?: Maybe<Scalars['Boolean']['output']>;
  /** canEdit permission enables changing the project's fields */
  canEdit?: Maybe<Scalars['Boolean']['output']>;
  /** canGrant permission allows granting and revoking permissions to this project */
  canGrant?: Maybe<Scalars['Boolean']['output']>;
  /** permission id = projectId + '-' + userAddress */
  id: Scalars['ID']['output'];
  /** Target project this permission applies to */
  project: Project;
  /** Ethereum address, owner of this permission */
  userAddress: Scalars['Bytes']['output'];
};

export type ProjectPermission_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ProjectPermission_Filter>>>;
  canBuy?: InputMaybe<Scalars['Boolean']['input']>;
  canBuy_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canBuy_not?: InputMaybe<Scalars['Boolean']['input']>;
  canBuy_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canDelete?: InputMaybe<Scalars['Boolean']['input']>;
  canDelete_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canDelete_not?: InputMaybe<Scalars['Boolean']['input']>;
  canDelete_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canEdit?: InputMaybe<Scalars['Boolean']['input']>;
  canEdit_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canEdit_not?: InputMaybe<Scalars['Boolean']['input']>;
  canEdit_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canGrant?: InputMaybe<Scalars['Boolean']['input']>;
  canGrant_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canGrant_not?: InputMaybe<Scalars['Boolean']['input']>;
  canGrant_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<ProjectPermission_Filter>>>;
  project?: InputMaybe<Scalars['String']['input']>;
  project_?: InputMaybe<Project_Filter>;
  project_contains?: InputMaybe<Scalars['String']['input']>;
  project_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_gt?: InputMaybe<Scalars['String']['input']>;
  project_gte?: InputMaybe<Scalars['String']['input']>;
  project_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_lt?: InputMaybe<Scalars['String']['input']>;
  project_lte?: InputMaybe<Scalars['String']['input']>;
  project_not?: InputMaybe<Scalars['String']['input']>;
  project_not_contains?: InputMaybe<Scalars['String']['input']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  userAddress?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_contains?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_gt?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_gte?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  userAddress_lt?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_lte?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_not?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum ProjectPermission_OrderBy {
  CanBuy = 'canBuy',
  CanDelete = 'canDelete',
  CanEdit = 'canEdit',
  CanGrant = 'canGrant',
  Id = 'id',
  Project = 'project',
  ProjectCounter = 'project__counter',
  ProjectCreatedAt = 'project__createdAt',
  ProjectId = 'project__id',
  ProjectIsDataUnion = 'project__isDataUnion',
  ProjectMetadata = 'project__metadata',
  ProjectMinimumSubscriptionSeconds = 'project__minimumSubscriptionSeconds',
  ProjectScore = 'project__score',
  ProjectStakedWei = 'project__stakedWei',
  ProjectUpdatedAt = 'project__updatedAt',
  UserAddress = 'userAddress'
}

export type ProjectPurchase = {
  __typename?: 'ProjectPurchase';
  /** The amount of tokens paid to marketplace for project subscription */
  fee: Scalars['BigInt']['output'];
  /** project purchase id = projectId + '-' + subscriberAddress + '-' + counter */
  id: Scalars['ID']['output'];
  /** The amount of tokens paid to beneficiary for project subscription */
  price: Scalars['BigInt']['output'];
  /** Target project this purchase is for */
  project: Project;
  /** purchase date. This is a timestamp in seconds */
  purchasedAt?: Maybe<Scalars['BigInt']['output']>;
  /** Ethereum address, the account initiating the project purchase */
  subscriber: Scalars['Bytes']['output'];
  /** The amount of seconds by which the subscription is extended */
  subscriptionSeconds: Scalars['BigInt']['output'];
};

export type ProjectPurchase_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ProjectPurchase_Filter>>>;
  fee?: InputMaybe<Scalars['BigInt']['input']>;
  fee_gt?: InputMaybe<Scalars['BigInt']['input']>;
  fee_gte?: InputMaybe<Scalars['BigInt']['input']>;
  fee_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  fee_lt?: InputMaybe<Scalars['BigInt']['input']>;
  fee_lte?: InputMaybe<Scalars['BigInt']['input']>;
  fee_not?: InputMaybe<Scalars['BigInt']['input']>;
  fee_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<ProjectPurchase_Filter>>>;
  price?: InputMaybe<Scalars['BigInt']['input']>;
  price_gt?: InputMaybe<Scalars['BigInt']['input']>;
  price_gte?: InputMaybe<Scalars['BigInt']['input']>;
  price_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  price_lt?: InputMaybe<Scalars['BigInt']['input']>;
  price_lte?: InputMaybe<Scalars['BigInt']['input']>;
  price_not?: InputMaybe<Scalars['BigInt']['input']>;
  price_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  project?: InputMaybe<Scalars['String']['input']>;
  project_?: InputMaybe<Project_Filter>;
  project_contains?: InputMaybe<Scalars['String']['input']>;
  project_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_gt?: InputMaybe<Scalars['String']['input']>;
  project_gte?: InputMaybe<Scalars['String']['input']>;
  project_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_lt?: InputMaybe<Scalars['String']['input']>;
  project_lte?: InputMaybe<Scalars['String']['input']>;
  project_not?: InputMaybe<Scalars['String']['input']>;
  project_not_contains?: InputMaybe<Scalars['String']['input']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  purchasedAt?: InputMaybe<Scalars['BigInt']['input']>;
  purchasedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  purchasedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  purchasedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  purchasedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  purchasedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  purchasedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  purchasedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  subscriber?: InputMaybe<Scalars['Bytes']['input']>;
  subscriber_contains?: InputMaybe<Scalars['Bytes']['input']>;
  subscriber_gt?: InputMaybe<Scalars['Bytes']['input']>;
  subscriber_gte?: InputMaybe<Scalars['Bytes']['input']>;
  subscriber_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  subscriber_lt?: InputMaybe<Scalars['Bytes']['input']>;
  subscriber_lte?: InputMaybe<Scalars['Bytes']['input']>;
  subscriber_not?: InputMaybe<Scalars['Bytes']['input']>;
  subscriber_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  subscriber_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  subscriptionSeconds?: InputMaybe<Scalars['BigInt']['input']>;
  subscriptionSeconds_gt?: InputMaybe<Scalars['BigInt']['input']>;
  subscriptionSeconds_gte?: InputMaybe<Scalars['BigInt']['input']>;
  subscriptionSeconds_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  subscriptionSeconds_lt?: InputMaybe<Scalars['BigInt']['input']>;
  subscriptionSeconds_lte?: InputMaybe<Scalars['BigInt']['input']>;
  subscriptionSeconds_not?: InputMaybe<Scalars['BigInt']['input']>;
  subscriptionSeconds_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum ProjectPurchase_OrderBy {
  Fee = 'fee',
  Id = 'id',
  Price = 'price',
  Project = 'project',
  ProjectCounter = 'project__counter',
  ProjectCreatedAt = 'project__createdAt',
  ProjectId = 'project__id',
  ProjectIsDataUnion = 'project__isDataUnion',
  ProjectMetadata = 'project__metadata',
  ProjectMinimumSubscriptionSeconds = 'project__minimumSubscriptionSeconds',
  ProjectScore = 'project__score',
  ProjectStakedWei = 'project__stakedWei',
  ProjectUpdatedAt = 'project__updatedAt',
  PurchasedAt = 'purchasedAt',
  Subscriber = 'subscriber',
  SubscriptionSeconds = 'subscriptionSeconds'
}

export type ProjectStakeByUser = {
  __typename?: 'ProjectStakeByUser';
  /** stake id = projectId + '-' + userAddress */
  id: Scalars['ID']['output'];
  /** Target project this stake is for */
  project: Project;
  /** Ethereum address, the account initiating the stake */
  user: Scalars['Bytes']['output'];
  /** All tokens staked by a given user */
  userStake: Scalars['BigInt']['output'];
};

export type ProjectStakeByUser_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ProjectStakeByUser_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<ProjectStakeByUser_Filter>>>;
  project?: InputMaybe<Scalars['String']['input']>;
  project_?: InputMaybe<Project_Filter>;
  project_contains?: InputMaybe<Scalars['String']['input']>;
  project_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_gt?: InputMaybe<Scalars['String']['input']>;
  project_gte?: InputMaybe<Scalars['String']['input']>;
  project_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_lt?: InputMaybe<Scalars['String']['input']>;
  project_lte?: InputMaybe<Scalars['String']['input']>;
  project_not?: InputMaybe<Scalars['String']['input']>;
  project_not_contains?: InputMaybe<Scalars['String']['input']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Scalars['Bytes']['input']>;
  userStake?: InputMaybe<Scalars['BigInt']['input']>;
  userStake_gt?: InputMaybe<Scalars['BigInt']['input']>;
  userStake_gte?: InputMaybe<Scalars['BigInt']['input']>;
  userStake_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  userStake_lt?: InputMaybe<Scalars['BigInt']['input']>;
  userStake_lte?: InputMaybe<Scalars['BigInt']['input']>;
  userStake_not?: InputMaybe<Scalars['BigInt']['input']>;
  userStake_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  user_contains?: InputMaybe<Scalars['Bytes']['input']>;
  user_gt?: InputMaybe<Scalars['Bytes']['input']>;
  user_gte?: InputMaybe<Scalars['Bytes']['input']>;
  user_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  user_lt?: InputMaybe<Scalars['Bytes']['input']>;
  user_lte?: InputMaybe<Scalars['Bytes']['input']>;
  user_not?: InputMaybe<Scalars['Bytes']['input']>;
  user_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum ProjectStakeByUser_OrderBy {
  Id = 'id',
  Project = 'project',
  ProjectCounter = 'project__counter',
  ProjectCreatedAt = 'project__createdAt',
  ProjectId = 'project__id',
  ProjectIsDataUnion = 'project__isDataUnion',
  ProjectMetadata = 'project__metadata',
  ProjectMinimumSubscriptionSeconds = 'project__minimumSubscriptionSeconds',
  ProjectScore = 'project__score',
  ProjectStakedWei = 'project__stakedWei',
  ProjectUpdatedAt = 'project__updatedAt',
  User = 'user',
  UserStake = 'userStake'
}

export type ProjectStakingDayBucket = {
  __typename?: 'ProjectStakingDayBucket';
  /** The day of the bucket */
  date: Scalars['BigInt']['output'];
  /** bucket id = projectId + '-' + date */
  id: Scalars['ID']['output'];
  /** Target project this stake is for */
  project: Project;
  /** The amount of tokens staked when the bucket starts */
  stakeAtStart: Scalars['BigInt']['output'];
  /** The amount of tokens staked/unstaked on this day */
  stakeChange: Scalars['BigInt']['output'];
  /** The amount of tokens staked on this day */
  stakingsWei: Scalars['BigInt']['output'];
  /** The amount of tokens unstaked on this day */
  unstakingsWei: Scalars['BigInt']['output'];
};

export type ProjectStakingDayBucket_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ProjectStakingDayBucket_Filter>>>;
  date?: InputMaybe<Scalars['BigInt']['input']>;
  date_gt?: InputMaybe<Scalars['BigInt']['input']>;
  date_gte?: InputMaybe<Scalars['BigInt']['input']>;
  date_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  date_lt?: InputMaybe<Scalars['BigInt']['input']>;
  date_lte?: InputMaybe<Scalars['BigInt']['input']>;
  date_not?: InputMaybe<Scalars['BigInt']['input']>;
  date_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<ProjectStakingDayBucket_Filter>>>;
  project?: InputMaybe<Scalars['String']['input']>;
  project_?: InputMaybe<Project_Filter>;
  project_contains?: InputMaybe<Scalars['String']['input']>;
  project_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_gt?: InputMaybe<Scalars['String']['input']>;
  project_gte?: InputMaybe<Scalars['String']['input']>;
  project_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_lt?: InputMaybe<Scalars['String']['input']>;
  project_lte?: InputMaybe<Scalars['String']['input']>;
  project_not?: InputMaybe<Scalars['String']['input']>;
  project_not_contains?: InputMaybe<Scalars['String']['input']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stakeAtStart?: InputMaybe<Scalars['BigInt']['input']>;
  stakeAtStart_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stakeAtStart_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stakeAtStart_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakeAtStart_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stakeAtStart_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stakeAtStart_not?: InputMaybe<Scalars['BigInt']['input']>;
  stakeAtStart_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakeChange?: InputMaybe<Scalars['BigInt']['input']>;
  stakeChange_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stakeChange_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stakeChange_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakeChange_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stakeChange_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stakeChange_not?: InputMaybe<Scalars['BigInt']['input']>;
  stakeChange_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakingsWei?: InputMaybe<Scalars['BigInt']['input']>;
  stakingsWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stakingsWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stakingsWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakingsWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stakingsWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stakingsWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  stakingsWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unstakingsWei?: InputMaybe<Scalars['BigInt']['input']>;
  unstakingsWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  unstakingsWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  unstakingsWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unstakingsWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  unstakingsWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  unstakingsWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  unstakingsWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum ProjectStakingDayBucket_OrderBy {
  Date = 'date',
  Id = 'id',
  Project = 'project',
  ProjectCounter = 'project__counter',
  ProjectCreatedAt = 'project__createdAt',
  ProjectId = 'project__id',
  ProjectIsDataUnion = 'project__isDataUnion',
  ProjectMetadata = 'project__metadata',
  ProjectMinimumSubscriptionSeconds = 'project__minimumSubscriptionSeconds',
  ProjectScore = 'project__score',
  ProjectStakedWei = 'project__stakedWei',
  ProjectUpdatedAt = 'project__updatedAt',
  StakeAtStart = 'stakeAtStart',
  StakeChange = 'stakeChange',
  StakingsWei = 'stakingsWei',
  UnstakingsWei = 'unstakingsWei'
}

export type ProjectSubscription = {
  __typename?: 'ProjectSubscription';
  /** Subscription expiration time. This is a timestamp in seconds */
  endTimestamp?: Maybe<Scalars['BigInt']['output']>;
  /** subscription id = projectId + '-' + subscriberAddress */
  id: Scalars['ID']['output'];
  /** Target project this permission applies to */
  project: Project;
  /** Ethereum address, owner of this subscription */
  userAddress: Scalars['Bytes']['output'];
};

export type ProjectSubscription_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ProjectSubscription_Filter>>>;
  endTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  endTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<ProjectSubscription_Filter>>>;
  project?: InputMaybe<Scalars['String']['input']>;
  project_?: InputMaybe<Project_Filter>;
  project_contains?: InputMaybe<Scalars['String']['input']>;
  project_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_gt?: InputMaybe<Scalars['String']['input']>;
  project_gte?: InputMaybe<Scalars['String']['input']>;
  project_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_lt?: InputMaybe<Scalars['String']['input']>;
  project_lte?: InputMaybe<Scalars['String']['input']>;
  project_not?: InputMaybe<Scalars['String']['input']>;
  project_not_contains?: InputMaybe<Scalars['String']['input']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  userAddress?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_contains?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_gt?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_gte?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  userAddress_lt?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_lte?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_not?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum ProjectSubscription_OrderBy {
  EndTimestamp = 'endTimestamp',
  Id = 'id',
  Project = 'project',
  ProjectCounter = 'project__counter',
  ProjectCreatedAt = 'project__createdAt',
  ProjectId = 'project__id',
  ProjectIsDataUnion = 'project__isDataUnion',
  ProjectMetadata = 'project__metadata',
  ProjectMinimumSubscriptionSeconds = 'project__minimumSubscriptionSeconds',
  ProjectScore = 'project__score',
  ProjectStakedWei = 'project__stakedWei',
  ProjectUpdatedAt = 'project__updatedAt',
  UserAddress = 'userAddress'
}

export type Project_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Project_Filter>>>;
  counter?: InputMaybe<Scalars['Int']['input']>;
  counter_gt?: InputMaybe<Scalars['Int']['input']>;
  counter_gte?: InputMaybe<Scalars['Int']['input']>;
  counter_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  counter_lt?: InputMaybe<Scalars['Int']['input']>;
  counter_lte?: InputMaybe<Scalars['Int']['input']>;
  counter_not?: InputMaybe<Scalars['Int']['input']>;
  counter_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  domainIds?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  domainIds_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  domainIds_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  domainIds_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  domainIds_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  domainIds_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  isDataUnion?: InputMaybe<Scalars['Boolean']['input']>;
  isDataUnion_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isDataUnion_not?: InputMaybe<Scalars['Boolean']['input']>;
  isDataUnion_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  metadata?: InputMaybe<Scalars['String']['input']>;
  metadata_contains?: InputMaybe<Scalars['String']['input']>;
  metadata_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadata_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_gt?: InputMaybe<Scalars['String']['input']>;
  metadata_gte?: InputMaybe<Scalars['String']['input']>;
  metadata_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_lt?: InputMaybe<Scalars['String']['input']>;
  metadata_lte?: InputMaybe<Scalars['String']['input']>;
  metadata_not?: InputMaybe<Scalars['String']['input']>;
  metadata_not_contains?: InputMaybe<Scalars['String']['input']>;
  metadata_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadata_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadata_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadata_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  minimumSubscriptionSeconds?: InputMaybe<Scalars['BigInt']['input']>;
  minimumSubscriptionSeconds_gt?: InputMaybe<Scalars['BigInt']['input']>;
  minimumSubscriptionSeconds_gte?: InputMaybe<Scalars['BigInt']['input']>;
  minimumSubscriptionSeconds_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  minimumSubscriptionSeconds_lt?: InputMaybe<Scalars['BigInt']['input']>;
  minimumSubscriptionSeconds_lte?: InputMaybe<Scalars['BigInt']['input']>;
  minimumSubscriptionSeconds_not?: InputMaybe<Scalars['BigInt']['input']>;
  minimumSubscriptionSeconds_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Project_Filter>>>;
  paymentDetails?: InputMaybe<Array<Scalars['String']['input']>>;
  paymentDetails_?: InputMaybe<ProjectPaymentDetails_Filter>;
  paymentDetails_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  paymentDetails_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  paymentDetails_not?: InputMaybe<Array<Scalars['String']['input']>>;
  paymentDetails_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  paymentDetails_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  permissions?: InputMaybe<Array<Scalars['String']['input']>>;
  permissions_?: InputMaybe<ProjectPermission_Filter>;
  permissions_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  permissions_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  permissions_not?: InputMaybe<Array<Scalars['String']['input']>>;
  permissions_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  permissions_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  purchases?: InputMaybe<Array<Scalars['String']['input']>>;
  purchases_?: InputMaybe<ProjectPurchase_Filter>;
  purchases_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  purchases_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  purchases_not?: InputMaybe<Array<Scalars['String']['input']>>;
  purchases_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  purchases_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  score?: InputMaybe<Scalars['BigInt']['input']>;
  score_gt?: InputMaybe<Scalars['BigInt']['input']>;
  score_gte?: InputMaybe<Scalars['BigInt']['input']>;
  score_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  score_lt?: InputMaybe<Scalars['BigInt']['input']>;
  score_lte?: InputMaybe<Scalars['BigInt']['input']>;
  score_not?: InputMaybe<Scalars['BigInt']['input']>;
  score_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakedWei?: InputMaybe<Scalars['BigInt']['input']>;
  stakedWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stakedWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stakedWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakedWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stakedWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stakedWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  stakedWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  streams?: InputMaybe<Array<Scalars['String']['input']>>;
  streams_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  streams_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  streams_not?: InputMaybe<Array<Scalars['String']['input']>>;
  streams_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  streams_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  subscriptions?: InputMaybe<Array<Scalars['String']['input']>>;
  subscriptions_?: InputMaybe<ProjectSubscription_Filter>;
  subscriptions_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  subscriptions_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  subscriptions_not?: InputMaybe<Array<Scalars['String']['input']>>;
  subscriptions_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  subscriptions_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum Project_OrderBy {
  Counter = 'counter',
  CreatedAt = 'createdAt',
  DomainIds = 'domainIds',
  Id = 'id',
  IsDataUnion = 'isDataUnion',
  Metadata = 'metadata',
  MinimumSubscriptionSeconds = 'minimumSubscriptionSeconds',
  PaymentDetails = 'paymentDetails',
  Permissions = 'permissions',
  Purchases = 'purchases',
  Score = 'score',
  StakedWei = 'stakedWei',
  Streams = 'streams',
  Subscriptions = 'subscriptions',
  UpdatedAt = 'updatedAt'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  delegation?: Maybe<Delegation>;
  delegations: Array<Delegation>;
  delegator?: Maybe<Delegator>;
  delegatorDailyBucket?: Maybe<DelegatorDailyBucket>;
  delegatorDailyBuckets: Array<DelegatorDailyBucket>;
  delegators: Array<Delegator>;
  flag?: Maybe<Flag>;
  flags: Array<Flag>;
  network?: Maybe<Network>;
  networks: Array<Network>;
  node?: Maybe<Node>;
  nodes: Array<Node>;
  operator?: Maybe<Operator>;
  operatorDailyBucket?: Maybe<OperatorDailyBucket>;
  operatorDailyBuckets: Array<OperatorDailyBucket>;
  operators: Array<Operator>;
  project?: Maybe<Project>;
  projectPaymentDetails?: Maybe<ProjectPaymentDetails>;
  projectPaymentDetails_collection: Array<ProjectPaymentDetails>;
  projectPermission?: Maybe<ProjectPermission>;
  projectPermissions: Array<ProjectPermission>;
  projectPurchase?: Maybe<ProjectPurchase>;
  projectPurchases: Array<ProjectPurchase>;
  projectSearch: Array<Project>;
  projectStakeByUser?: Maybe<ProjectStakeByUser>;
  projectStakeByUsers: Array<ProjectStakeByUser>;
  projectStakingDayBucket?: Maybe<ProjectStakingDayBucket>;
  projectStakingDayBuckets: Array<ProjectStakingDayBucket>;
  projectSubscription?: Maybe<ProjectSubscription>;
  projectSubscriptions: Array<ProjectSubscription>;
  projects: Array<Project>;
  queueEntries: Array<QueueEntry>;
  queueEntry?: Maybe<QueueEntry>;
  slashingEvent?: Maybe<SlashingEvent>;
  slashingEvents: Array<SlashingEvent>;
  sponsoringEvent?: Maybe<SponsoringEvent>;
  sponsoringEvents: Array<SponsoringEvent>;
  sponsorship?: Maybe<Sponsorship>;
  sponsorshipDailyBucket?: Maybe<SponsorshipDailyBucket>;
  sponsorshipDailyBuckets: Array<SponsorshipDailyBucket>;
  sponsorships: Array<Sponsorship>;
  stake?: Maybe<Stake>;
  stakes: Array<Stake>;
  stakingEvent?: Maybe<StakingEvent>;
  stakingEvents: Array<StakingEvent>;
  stream?: Maybe<Stream>;
  streamPermission?: Maybe<StreamPermission>;
  streamPermissions: Array<StreamPermission>;
  streams: Array<Stream>;
  vote?: Maybe<Vote>;
  votes: Array<Vote>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryDelegationArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDelegationsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Delegation_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Delegation_Filter>;
};


export type QueryDelegatorArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDelegatorDailyBucketArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDelegatorDailyBucketsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DelegatorDailyBucket_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DelegatorDailyBucket_Filter>;
};


export type QueryDelegatorsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Delegator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Delegator_Filter>;
};


export type QueryFlagArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryFlagsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Flag_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Flag_Filter>;
};


export type QueryNetworkArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryNetworksArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Network_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Network_Filter>;
};


export type QueryNodeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryNodesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Node_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Node_Filter>;
};


export type QueryOperatorArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryOperatorDailyBucketArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryOperatorDailyBucketsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OperatorDailyBucket_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OperatorDailyBucket_Filter>;
};


export type QueryOperatorsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Operator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Operator_Filter>;
};


export type QueryProjectArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryProjectPaymentDetailsArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryProjectPaymentDetails_CollectionArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectPaymentDetails_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProjectPaymentDetails_Filter>;
};


export type QueryProjectPermissionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryProjectPermissionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectPermission_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProjectPermission_Filter>;
};


export type QueryProjectPurchaseArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryProjectPurchasesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectPurchase_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProjectPurchase_Filter>;
};


export type QueryProjectSearchArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  text: Scalars['String']['input'];
  where?: InputMaybe<Project_Filter>;
};


export type QueryProjectStakeByUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryProjectStakeByUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectStakeByUser_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProjectStakeByUser_Filter>;
};


export type QueryProjectStakingDayBucketArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryProjectStakingDayBucketsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectStakingDayBucket_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProjectStakingDayBucket_Filter>;
};


export type QueryProjectSubscriptionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryProjectSubscriptionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectSubscription_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProjectSubscription_Filter>;
};


export type QueryProjectsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Project_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Project_Filter>;
};


export type QueryQueueEntriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<QueueEntry_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<QueueEntry_Filter>;
};


export type QueryQueueEntryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySlashingEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySlashingEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SlashingEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SlashingEvent_Filter>;
};


export type QuerySponsoringEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySponsoringEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SponsoringEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SponsoringEvent_Filter>;
};


export type QuerySponsorshipArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySponsorshipDailyBucketArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySponsorshipDailyBucketsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SponsorshipDailyBucket_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SponsorshipDailyBucket_Filter>;
};


export type QuerySponsorshipsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Sponsorship_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Sponsorship_Filter>;
};


export type QueryStakeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryStakesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Stake_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Stake_Filter>;
};


export type QueryStakingEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryStakingEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<StakingEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StakingEvent_Filter>;
};


export type QueryStreamArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryStreamPermissionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryStreamPermissionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<StreamPermission_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StreamPermission_Filter>;
};


export type QueryStreamsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Stream_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Stream_Filter>;
};


export type QueryVoteArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryVotesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Vote_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Vote_Filter>;
};

export type QueueEntry = {
  __typename?: 'QueueEntry';
  amount: Scalars['BigInt']['output'];
  date: Scalars['BigInt']['output'];
  delegator: Delegator;
  id: Scalars['ID']['output'];
  operator: Operator;
};

export type QueueEntry_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<QueueEntry_Filter>>>;
  date?: InputMaybe<Scalars['BigInt']['input']>;
  date_gt?: InputMaybe<Scalars['BigInt']['input']>;
  date_gte?: InputMaybe<Scalars['BigInt']['input']>;
  date_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  date_lt?: InputMaybe<Scalars['BigInt']['input']>;
  date_lte?: InputMaybe<Scalars['BigInt']['input']>;
  date_not?: InputMaybe<Scalars['BigInt']['input']>;
  date_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  delegator?: InputMaybe<Scalars['String']['input']>;
  delegator_?: InputMaybe<Delegator_Filter>;
  delegator_contains?: InputMaybe<Scalars['String']['input']>;
  delegator_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_ends_with?: InputMaybe<Scalars['String']['input']>;
  delegator_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_gt?: InputMaybe<Scalars['String']['input']>;
  delegator_gte?: InputMaybe<Scalars['String']['input']>;
  delegator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  delegator_lt?: InputMaybe<Scalars['String']['input']>;
  delegator_lte?: InputMaybe<Scalars['String']['input']>;
  delegator_not?: InputMaybe<Scalars['String']['input']>;
  delegator_not_contains?: InputMaybe<Scalars['String']['input']>;
  delegator_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  delegator_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  delegator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  delegator_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_starts_with?: InputMaybe<Scalars['String']['input']>;
  delegator_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  operator?: InputMaybe<Scalars['String']['input']>;
  operator_?: InputMaybe<Operator_Filter>;
  operator_contains?: InputMaybe<Scalars['String']['input']>;
  operator_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_ends_with?: InputMaybe<Scalars['String']['input']>;
  operator_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_gt?: InputMaybe<Scalars['String']['input']>;
  operator_gte?: InputMaybe<Scalars['String']['input']>;
  operator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operator_lt?: InputMaybe<Scalars['String']['input']>;
  operator_lte?: InputMaybe<Scalars['String']['input']>;
  operator_not?: InputMaybe<Scalars['String']['input']>;
  operator_not_contains?: InputMaybe<Scalars['String']['input']>;
  operator_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  operator_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  operator_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_starts_with?: InputMaybe<Scalars['String']['input']>;
  operator_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<QueueEntry_Filter>>>;
};

export enum QueueEntry_OrderBy {
  Amount = 'amount',
  Date = 'date',
  Delegator = 'delegator',
  DelegatorCumulativeEarningsWei = 'delegator__cumulativeEarningsWei',
  DelegatorId = 'delegator__id',
  DelegatorNumberOfDelegations = 'delegator__numberOfDelegations',
  DelegatorTotalValueDataWei = 'delegator__totalValueDataWei',
  Id = 'id',
  Operator = 'operator',
  OperatorContractVersion = 'operator__contractVersion',
  OperatorCumulativeEarningsWei = 'operator__cumulativeEarningsWei',
  OperatorCumulativeOperatorsCutWei = 'operator__cumulativeOperatorsCutWei',
  OperatorCumulativeProfitsWei = 'operator__cumulativeProfitsWei',
  OperatorDataTokenBalanceWei = 'operator__dataTokenBalanceWei',
  OperatorDelegatorCount = 'operator__delegatorCount',
  OperatorExchangeRate = 'operator__exchangeRate',
  OperatorId = 'operator__id',
  OperatorIsEligibleToVote = 'operator__isEligibleToVote',
  OperatorLatestHeartbeatMetadata = 'operator__latestHeartbeatMetadata',
  OperatorLatestHeartbeatTimestamp = 'operator__latestHeartbeatTimestamp',
  OperatorMetadataJsonString = 'operator__metadataJsonString',
  OperatorOperatorTokenTotalSupplyWei = 'operator__operatorTokenTotalSupplyWei',
  OperatorOperatorsCutFraction = 'operator__operatorsCutFraction',
  OperatorOwner = 'operator__owner',
  OperatorProtectionEndTimestamp = 'operator__protectionEndTimestamp',
  OperatorSlashingsCount = 'operator__slashingsCount',
  OperatorTotalStakeInSponsorshipsWei = 'operator__totalStakeInSponsorshipsWei',
  OperatorValueUpdateBlockNumber = 'operator__valueUpdateBlockNumber',
  OperatorValueUpdateTimestamp = 'operator__valueUpdateTimestamp',
  OperatorValueWithoutEarnings = 'operator__valueWithoutEarnings'
}

export type SlashingEvent = {
  __typename?: 'SlashingEvent';
  amount: Scalars['BigInt']['output'];
  date: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  operator: Operator;
  sponsorship: Sponsorship;
};

export type SlashingEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<SlashingEvent_Filter>>>;
  date?: InputMaybe<Scalars['BigInt']['input']>;
  date_gt?: InputMaybe<Scalars['BigInt']['input']>;
  date_gte?: InputMaybe<Scalars['BigInt']['input']>;
  date_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  date_lt?: InputMaybe<Scalars['BigInt']['input']>;
  date_lte?: InputMaybe<Scalars['BigInt']['input']>;
  date_not?: InputMaybe<Scalars['BigInt']['input']>;
  date_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  operator?: InputMaybe<Scalars['String']['input']>;
  operator_?: InputMaybe<Operator_Filter>;
  operator_contains?: InputMaybe<Scalars['String']['input']>;
  operator_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_ends_with?: InputMaybe<Scalars['String']['input']>;
  operator_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_gt?: InputMaybe<Scalars['String']['input']>;
  operator_gte?: InputMaybe<Scalars['String']['input']>;
  operator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operator_lt?: InputMaybe<Scalars['String']['input']>;
  operator_lte?: InputMaybe<Scalars['String']['input']>;
  operator_not?: InputMaybe<Scalars['String']['input']>;
  operator_not_contains?: InputMaybe<Scalars['String']['input']>;
  operator_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  operator_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  operator_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_starts_with?: InputMaybe<Scalars['String']['input']>;
  operator_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<SlashingEvent_Filter>>>;
  sponsorship?: InputMaybe<Scalars['String']['input']>;
  sponsorship_?: InputMaybe<Sponsorship_Filter>;
  sponsorship_contains?: InputMaybe<Scalars['String']['input']>;
  sponsorship_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_ends_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_gt?: InputMaybe<Scalars['String']['input']>;
  sponsorship_gte?: InputMaybe<Scalars['String']['input']>;
  sponsorship_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sponsorship_lt?: InputMaybe<Scalars['String']['input']>;
  sponsorship_lte?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_contains?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sponsorship_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_starts_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum SlashingEvent_OrderBy {
  Amount = 'amount',
  Date = 'date',
  Id = 'id',
  Operator = 'operator',
  OperatorContractVersion = 'operator__contractVersion',
  OperatorCumulativeEarningsWei = 'operator__cumulativeEarningsWei',
  OperatorCumulativeOperatorsCutWei = 'operator__cumulativeOperatorsCutWei',
  OperatorCumulativeProfitsWei = 'operator__cumulativeProfitsWei',
  OperatorDataTokenBalanceWei = 'operator__dataTokenBalanceWei',
  OperatorDelegatorCount = 'operator__delegatorCount',
  OperatorExchangeRate = 'operator__exchangeRate',
  OperatorId = 'operator__id',
  OperatorIsEligibleToVote = 'operator__isEligibleToVote',
  OperatorLatestHeartbeatMetadata = 'operator__latestHeartbeatMetadata',
  OperatorLatestHeartbeatTimestamp = 'operator__latestHeartbeatTimestamp',
  OperatorMetadataJsonString = 'operator__metadataJsonString',
  OperatorOperatorTokenTotalSupplyWei = 'operator__operatorTokenTotalSupplyWei',
  OperatorOperatorsCutFraction = 'operator__operatorsCutFraction',
  OperatorOwner = 'operator__owner',
  OperatorProtectionEndTimestamp = 'operator__protectionEndTimestamp',
  OperatorSlashingsCount = 'operator__slashingsCount',
  OperatorTotalStakeInSponsorshipsWei = 'operator__totalStakeInSponsorshipsWei',
  OperatorValueUpdateBlockNumber = 'operator__valueUpdateBlockNumber',
  OperatorValueUpdateTimestamp = 'operator__valueUpdateTimestamp',
  OperatorValueWithoutEarnings = 'operator__valueWithoutEarnings',
  Sponsorship = 'sponsorship',
  SponsorshipCreator = 'sponsorship__creator',
  SponsorshipCumulativeSponsoring = 'sponsorship__cumulativeSponsoring',
  SponsorshipId = 'sponsorship__id',
  SponsorshipIsRunning = 'sponsorship__isRunning',
  SponsorshipMaxOperators = 'sponsorship__maxOperators',
  SponsorshipMetadata = 'sponsorship__metadata',
  SponsorshipMinOperators = 'sponsorship__minOperators',
  SponsorshipMinimumStakingPeriodSeconds = 'sponsorship__minimumStakingPeriodSeconds',
  SponsorshipOperatorCount = 'sponsorship__operatorCount',
  SponsorshipProjectedInsolvency = 'sponsorship__projectedInsolvency',
  SponsorshipRemainingWei = 'sponsorship__remainingWei',
  SponsorshipRemainingWeiUpdateTimestamp = 'sponsorship__remainingWeiUpdateTimestamp',
  SponsorshipSpotApy = 'sponsorship__spotAPY',
  SponsorshipTotalPayoutWeiPerSec = 'sponsorship__totalPayoutWeiPerSec',
  SponsorshipTotalStakedWei = 'sponsorship__totalStakedWei'
}

export type SponsoringEvent = {
  __typename?: 'SponsoringEvent';
  amount: Scalars['BigInt']['output'];
  date: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  sponsor: Scalars['String']['output'];
  sponsorship: Sponsorship;
};

export type SponsoringEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<SponsoringEvent_Filter>>>;
  date?: InputMaybe<Scalars['BigInt']['input']>;
  date_gt?: InputMaybe<Scalars['BigInt']['input']>;
  date_gte?: InputMaybe<Scalars['BigInt']['input']>;
  date_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  date_lt?: InputMaybe<Scalars['BigInt']['input']>;
  date_lte?: InputMaybe<Scalars['BigInt']['input']>;
  date_not?: InputMaybe<Scalars['BigInt']['input']>;
  date_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<SponsoringEvent_Filter>>>;
  sponsor?: InputMaybe<Scalars['String']['input']>;
  sponsor_contains?: InputMaybe<Scalars['String']['input']>;
  sponsor_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsor_ends_with?: InputMaybe<Scalars['String']['input']>;
  sponsor_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsor_gt?: InputMaybe<Scalars['String']['input']>;
  sponsor_gte?: InputMaybe<Scalars['String']['input']>;
  sponsor_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sponsor_lt?: InputMaybe<Scalars['String']['input']>;
  sponsor_lte?: InputMaybe<Scalars['String']['input']>;
  sponsor_not?: InputMaybe<Scalars['String']['input']>;
  sponsor_not_contains?: InputMaybe<Scalars['String']['input']>;
  sponsor_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsor_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  sponsor_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsor_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sponsor_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  sponsor_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsor_starts_with?: InputMaybe<Scalars['String']['input']>;
  sponsor_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship?: InputMaybe<Scalars['String']['input']>;
  sponsorship_?: InputMaybe<Sponsorship_Filter>;
  sponsorship_contains?: InputMaybe<Scalars['String']['input']>;
  sponsorship_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_ends_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_gt?: InputMaybe<Scalars['String']['input']>;
  sponsorship_gte?: InputMaybe<Scalars['String']['input']>;
  sponsorship_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sponsorship_lt?: InputMaybe<Scalars['String']['input']>;
  sponsorship_lte?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_contains?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sponsorship_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_starts_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum SponsoringEvent_OrderBy {
  Amount = 'amount',
  Date = 'date',
  Id = 'id',
  Sponsor = 'sponsor',
  Sponsorship = 'sponsorship',
  SponsorshipCreator = 'sponsorship__creator',
  SponsorshipCumulativeSponsoring = 'sponsorship__cumulativeSponsoring',
  SponsorshipId = 'sponsorship__id',
  SponsorshipIsRunning = 'sponsorship__isRunning',
  SponsorshipMaxOperators = 'sponsorship__maxOperators',
  SponsorshipMetadata = 'sponsorship__metadata',
  SponsorshipMinOperators = 'sponsorship__minOperators',
  SponsorshipMinimumStakingPeriodSeconds = 'sponsorship__minimumStakingPeriodSeconds',
  SponsorshipOperatorCount = 'sponsorship__operatorCount',
  SponsorshipProjectedInsolvency = 'sponsorship__projectedInsolvency',
  SponsorshipRemainingWei = 'sponsorship__remainingWei',
  SponsorshipRemainingWeiUpdateTimestamp = 'sponsorship__remainingWeiUpdateTimestamp',
  SponsorshipSpotApy = 'sponsorship__spotAPY',
  SponsorshipTotalPayoutWeiPerSec = 'sponsorship__totalPayoutWeiPerSec',
  SponsorshipTotalStakedWei = 'sponsorship__totalStakedWei'
}

export type Sponsorship = {
  __typename?: 'Sponsorship';
  /** who deployed the Sponsorship contract */
  creator: Scalars['String']['output'];
  /** how much DATA has entered or travelled through this contract */
  cumulativeSponsoring: Scalars['BigInt']['output'];
  /** what the operators think about each other: 'flag' means an operator proposes another operator be kicked out */
  flags: Array<Flag>;
  /** id = sponsorship address */
  id: Scalars['ID']['output'];
  /** are there enough operators? Is this sponsorship paying? */
  isRunning: Scalars['Boolean']['output'];
  /** how many stakers are accepted (if MaxOperatorsJoinPolicy is used) */
  maxOperators?: Maybe<Scalars['Int']['output']>;
  /** connection metadata */
  metadata?: Maybe<Scalars['String']['output']>;
  /** how many stakers are required so that Sponsorship isRunning(), i.e. starts paying */
  minOperators?: Maybe<Scalars['Int']['output']>;
  /** how long you have to stay staked, or else you get slashed when you forceUnstake */
  minimumStakingPeriodSeconds: Scalars['BigInt']['output'];
  /** how many operators are staked right now */
  operatorCount: Scalars['Int']['output'];
  /** when will the contract run out of DATA if more is not added */
  projectedInsolvency?: Maybe<Scalars['BigInt']['output']>;
  /** how much DATA is there still in this contract */
  remainingWei: Scalars['BigInt']['output'];
  /** timestamp when remainingWei was last updated */
  remainingWeiUpdateTimestamp?: Maybe<Scalars['BigInt']['output']>;
  slashingEvents: Array<SlashingEvent>;
  sponsoringEvents: Array<SponsoringEvent>;
  /** how much 'ROI' you could make by staking, extrapolated from current payments */
  spotAPY: Scalars['BigDecimal']['output'];
  /** who has staked how much */
  stakes: Array<Stake>;
  stakingEvents: Array<StakingEvent>;
  /** sponsored stream */
  stream?: Maybe<Stream>;
  /** how much is split between staked operators per second, weighted by their stake */
  totalPayoutWeiPerSec: Scalars['BigInt']['output'];
  /** how much stake in total is sharing on the sponsorship revenue */
  totalStakedWei: Scalars['BigInt']['output'];
};


export type SponsorshipFlagsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Flag_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Flag_Filter>;
};


export type SponsorshipSlashingEventsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SlashingEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<SlashingEvent_Filter>;
};


export type SponsorshipSponsoringEventsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SponsoringEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<SponsoringEvent_Filter>;
};


export type SponsorshipStakesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Stake_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Stake_Filter>;
};


export type SponsorshipStakingEventsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<StakingEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<StakingEvent_Filter>;
};

export type SponsorshipDailyBucket = {
  __typename?: 'SponsorshipDailyBucket';
  date: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  operatorCount: Scalars['Int']['output'];
  projectedInsolvency?: Maybe<Scalars['BigInt']['output']>;
  remainingWei: Scalars['BigInt']['output'];
  sponsorship: Sponsorship;
  spotAPY: Scalars['BigDecimal']['output'];
  totalStakedWei: Scalars['BigInt']['output'];
};

export type SponsorshipDailyBucket_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SponsorshipDailyBucket_Filter>>>;
  date?: InputMaybe<Scalars['BigInt']['input']>;
  date_gt?: InputMaybe<Scalars['BigInt']['input']>;
  date_gte?: InputMaybe<Scalars['BigInt']['input']>;
  date_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  date_lt?: InputMaybe<Scalars['BigInt']['input']>;
  date_lte?: InputMaybe<Scalars['BigInt']['input']>;
  date_not?: InputMaybe<Scalars['BigInt']['input']>;
  date_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  operatorCount?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_gt?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_gte?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  operatorCount_lt?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_lte?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_not?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<SponsorshipDailyBucket_Filter>>>;
  projectedInsolvency?: InputMaybe<Scalars['BigInt']['input']>;
  projectedInsolvency_gt?: InputMaybe<Scalars['BigInt']['input']>;
  projectedInsolvency_gte?: InputMaybe<Scalars['BigInt']['input']>;
  projectedInsolvency_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  projectedInsolvency_lt?: InputMaybe<Scalars['BigInt']['input']>;
  projectedInsolvency_lte?: InputMaybe<Scalars['BigInt']['input']>;
  projectedInsolvency_not?: InputMaybe<Scalars['BigInt']['input']>;
  projectedInsolvency_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  remainingWei?: InputMaybe<Scalars['BigInt']['input']>;
  remainingWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  remainingWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  remainingWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  remainingWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  remainingWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  remainingWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  remainingWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  sponsorship?: InputMaybe<Scalars['String']['input']>;
  sponsorship_?: InputMaybe<Sponsorship_Filter>;
  sponsorship_contains?: InputMaybe<Scalars['String']['input']>;
  sponsorship_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_ends_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_gt?: InputMaybe<Scalars['String']['input']>;
  sponsorship_gte?: InputMaybe<Scalars['String']['input']>;
  sponsorship_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sponsorship_lt?: InputMaybe<Scalars['String']['input']>;
  sponsorship_lte?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_contains?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sponsorship_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_starts_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  spotAPY?: InputMaybe<Scalars['BigDecimal']['input']>;
  spotAPY_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  spotAPY_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  spotAPY_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  spotAPY_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  spotAPY_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  spotAPY_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  spotAPY_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalStakedWei?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakedWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakedWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakedWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalStakedWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakedWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakedWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakedWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum SponsorshipDailyBucket_OrderBy {
  Date = 'date',
  Id = 'id',
  OperatorCount = 'operatorCount',
  ProjectedInsolvency = 'projectedInsolvency',
  RemainingWei = 'remainingWei',
  Sponsorship = 'sponsorship',
  SponsorshipCreator = 'sponsorship__creator',
  SponsorshipCumulativeSponsoring = 'sponsorship__cumulativeSponsoring',
  SponsorshipId = 'sponsorship__id',
  SponsorshipIsRunning = 'sponsorship__isRunning',
  SponsorshipMaxOperators = 'sponsorship__maxOperators',
  SponsorshipMetadata = 'sponsorship__metadata',
  SponsorshipMinOperators = 'sponsorship__minOperators',
  SponsorshipMinimumStakingPeriodSeconds = 'sponsorship__minimumStakingPeriodSeconds',
  SponsorshipOperatorCount = 'sponsorship__operatorCount',
  SponsorshipProjectedInsolvency = 'sponsorship__projectedInsolvency',
  SponsorshipRemainingWei = 'sponsorship__remainingWei',
  SponsorshipRemainingWeiUpdateTimestamp = 'sponsorship__remainingWeiUpdateTimestamp',
  SponsorshipSpotApy = 'sponsorship__spotAPY',
  SponsorshipTotalPayoutWeiPerSec = 'sponsorship__totalPayoutWeiPerSec',
  SponsorshipTotalStakedWei = 'sponsorship__totalStakedWei',
  SpotApy = 'spotAPY',
  TotalStakedWei = 'totalStakedWei'
}

export type Sponsorship_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Sponsorship_Filter>>>;
  creator?: InputMaybe<Scalars['String']['input']>;
  creator_contains?: InputMaybe<Scalars['String']['input']>;
  creator_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  creator_ends_with?: InputMaybe<Scalars['String']['input']>;
  creator_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  creator_gt?: InputMaybe<Scalars['String']['input']>;
  creator_gte?: InputMaybe<Scalars['String']['input']>;
  creator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  creator_lt?: InputMaybe<Scalars['String']['input']>;
  creator_lte?: InputMaybe<Scalars['String']['input']>;
  creator_not?: InputMaybe<Scalars['String']['input']>;
  creator_not_contains?: InputMaybe<Scalars['String']['input']>;
  creator_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  creator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  creator_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  creator_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  creator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  creator_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  creator_starts_with?: InputMaybe<Scalars['String']['input']>;
  creator_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  cumulativeSponsoring?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeSponsoring_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeSponsoring_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeSponsoring_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeSponsoring_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeSponsoring_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeSponsoring_not?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeSponsoring_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  flags_?: InputMaybe<Flag_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  isRunning?: InputMaybe<Scalars['Boolean']['input']>;
  isRunning_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isRunning_not?: InputMaybe<Scalars['Boolean']['input']>;
  isRunning_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  maxOperators?: InputMaybe<Scalars['Int']['input']>;
  maxOperators_gt?: InputMaybe<Scalars['Int']['input']>;
  maxOperators_gte?: InputMaybe<Scalars['Int']['input']>;
  maxOperators_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  maxOperators_lt?: InputMaybe<Scalars['Int']['input']>;
  maxOperators_lte?: InputMaybe<Scalars['Int']['input']>;
  maxOperators_not?: InputMaybe<Scalars['Int']['input']>;
  maxOperators_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  metadata?: InputMaybe<Scalars['String']['input']>;
  metadata_contains?: InputMaybe<Scalars['String']['input']>;
  metadata_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadata_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_gt?: InputMaybe<Scalars['String']['input']>;
  metadata_gte?: InputMaybe<Scalars['String']['input']>;
  metadata_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_lt?: InputMaybe<Scalars['String']['input']>;
  metadata_lte?: InputMaybe<Scalars['String']['input']>;
  metadata_not?: InputMaybe<Scalars['String']['input']>;
  metadata_not_contains?: InputMaybe<Scalars['String']['input']>;
  metadata_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadata_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadata_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadata_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  minOperators?: InputMaybe<Scalars['Int']['input']>;
  minOperators_gt?: InputMaybe<Scalars['Int']['input']>;
  minOperators_gte?: InputMaybe<Scalars['Int']['input']>;
  minOperators_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  minOperators_lt?: InputMaybe<Scalars['Int']['input']>;
  minOperators_lte?: InputMaybe<Scalars['Int']['input']>;
  minOperators_not?: InputMaybe<Scalars['Int']['input']>;
  minOperators_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  minimumStakingPeriodSeconds?: InputMaybe<Scalars['BigInt']['input']>;
  minimumStakingPeriodSeconds_gt?: InputMaybe<Scalars['BigInt']['input']>;
  minimumStakingPeriodSeconds_gte?: InputMaybe<Scalars['BigInt']['input']>;
  minimumStakingPeriodSeconds_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  minimumStakingPeriodSeconds_lt?: InputMaybe<Scalars['BigInt']['input']>;
  minimumStakingPeriodSeconds_lte?: InputMaybe<Scalars['BigInt']['input']>;
  minimumStakingPeriodSeconds_not?: InputMaybe<Scalars['BigInt']['input']>;
  minimumStakingPeriodSeconds_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  operatorCount?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_gt?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_gte?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  operatorCount_lt?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_lte?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_not?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Sponsorship_Filter>>>;
  projectedInsolvency?: InputMaybe<Scalars['BigInt']['input']>;
  projectedInsolvency_gt?: InputMaybe<Scalars['BigInt']['input']>;
  projectedInsolvency_gte?: InputMaybe<Scalars['BigInt']['input']>;
  projectedInsolvency_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  projectedInsolvency_lt?: InputMaybe<Scalars['BigInt']['input']>;
  projectedInsolvency_lte?: InputMaybe<Scalars['BigInt']['input']>;
  projectedInsolvency_not?: InputMaybe<Scalars['BigInt']['input']>;
  projectedInsolvency_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  remainingWei?: InputMaybe<Scalars['BigInt']['input']>;
  remainingWeiUpdateTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  remainingWeiUpdateTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  remainingWeiUpdateTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  remainingWeiUpdateTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  remainingWeiUpdateTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  remainingWeiUpdateTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  remainingWeiUpdateTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  remainingWeiUpdateTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  remainingWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  remainingWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  remainingWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  remainingWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  remainingWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  remainingWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  remainingWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  slashingEvents_?: InputMaybe<SlashingEvent_Filter>;
  sponsoringEvents_?: InputMaybe<SponsoringEvent_Filter>;
  spotAPY?: InputMaybe<Scalars['BigDecimal']['input']>;
  spotAPY_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  spotAPY_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  spotAPY_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  spotAPY_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  spotAPY_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  spotAPY_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  spotAPY_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  stakes_?: InputMaybe<Stake_Filter>;
  stakingEvents_?: InputMaybe<StakingEvent_Filter>;
  stream?: InputMaybe<Scalars['String']['input']>;
  stream_?: InputMaybe<Stream_Filter>;
  stream_contains?: InputMaybe<Scalars['String']['input']>;
  stream_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  stream_ends_with?: InputMaybe<Scalars['String']['input']>;
  stream_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stream_gt?: InputMaybe<Scalars['String']['input']>;
  stream_gte?: InputMaybe<Scalars['String']['input']>;
  stream_in?: InputMaybe<Array<Scalars['String']['input']>>;
  stream_lt?: InputMaybe<Scalars['String']['input']>;
  stream_lte?: InputMaybe<Scalars['String']['input']>;
  stream_not?: InputMaybe<Scalars['String']['input']>;
  stream_not_contains?: InputMaybe<Scalars['String']['input']>;
  stream_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  stream_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  stream_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stream_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  stream_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  stream_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stream_starts_with?: InputMaybe<Scalars['String']['input']>;
  stream_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  totalPayoutWeiPerSec?: InputMaybe<Scalars['BigInt']['input']>;
  totalPayoutWeiPerSec_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalPayoutWeiPerSec_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalPayoutWeiPerSec_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalPayoutWeiPerSec_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalPayoutWeiPerSec_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalPayoutWeiPerSec_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalPayoutWeiPerSec_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalStakedWei?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakedWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakedWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakedWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalStakedWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakedWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakedWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakedWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum Sponsorship_OrderBy {
  Creator = 'creator',
  CumulativeSponsoring = 'cumulativeSponsoring',
  Flags = 'flags',
  Id = 'id',
  IsRunning = 'isRunning',
  MaxOperators = 'maxOperators',
  Metadata = 'metadata',
  MinOperators = 'minOperators',
  MinimumStakingPeriodSeconds = 'minimumStakingPeriodSeconds',
  OperatorCount = 'operatorCount',
  ProjectedInsolvency = 'projectedInsolvency',
  RemainingWei = 'remainingWei',
  RemainingWeiUpdateTimestamp = 'remainingWeiUpdateTimestamp',
  SlashingEvents = 'slashingEvents',
  SponsoringEvents = 'sponsoringEvents',
  SpotApy = 'spotAPY',
  Stakes = 'stakes',
  StakingEvents = 'stakingEvents',
  Stream = 'stream',
  StreamCreatedAt = 'stream__createdAt',
  StreamId = 'stream__id',
  StreamMetadata = 'stream__metadata',
  StreamUpdatedAt = 'stream__updatedAt',
  TotalPayoutWeiPerSec = 'totalPayoutWeiPerSec',
  TotalStakedWei = 'totalStakedWei'
}

export type Stake = {
  __typename?: 'Stake';
  amountWei: Scalars['BigInt']['output'];
  earningsWei: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  joinTimestamp: Scalars['Int']['output'];
  lockedWei: Scalars['BigInt']['output'];
  minimumStakeWei: Scalars['BigInt']['output'];
  operator: Operator;
  sponsorship: Sponsorship;
  updateTimestamp: Scalars['Int']['output'];
};

export type Stake_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amountWei?: InputMaybe<Scalars['BigInt']['input']>;
  amountWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amountWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amountWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amountWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amountWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amountWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  amountWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Stake_Filter>>>;
  earningsWei?: InputMaybe<Scalars['BigInt']['input']>;
  earningsWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  earningsWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  earningsWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  earningsWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  earningsWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  earningsWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  earningsWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  joinTimestamp?: InputMaybe<Scalars['Int']['input']>;
  joinTimestamp_gt?: InputMaybe<Scalars['Int']['input']>;
  joinTimestamp_gte?: InputMaybe<Scalars['Int']['input']>;
  joinTimestamp_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  joinTimestamp_lt?: InputMaybe<Scalars['Int']['input']>;
  joinTimestamp_lte?: InputMaybe<Scalars['Int']['input']>;
  joinTimestamp_not?: InputMaybe<Scalars['Int']['input']>;
  joinTimestamp_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lockedWei?: InputMaybe<Scalars['BigInt']['input']>;
  lockedWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lockedWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lockedWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lockedWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lockedWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lockedWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  lockedWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  minimumStakeWei?: InputMaybe<Scalars['BigInt']['input']>;
  minimumStakeWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  minimumStakeWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  minimumStakeWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  minimumStakeWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  minimumStakeWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  minimumStakeWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  minimumStakeWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  operator?: InputMaybe<Scalars['String']['input']>;
  operator_?: InputMaybe<Operator_Filter>;
  operator_contains?: InputMaybe<Scalars['String']['input']>;
  operator_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_ends_with?: InputMaybe<Scalars['String']['input']>;
  operator_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_gt?: InputMaybe<Scalars['String']['input']>;
  operator_gte?: InputMaybe<Scalars['String']['input']>;
  operator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operator_lt?: InputMaybe<Scalars['String']['input']>;
  operator_lte?: InputMaybe<Scalars['String']['input']>;
  operator_not?: InputMaybe<Scalars['String']['input']>;
  operator_not_contains?: InputMaybe<Scalars['String']['input']>;
  operator_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  operator_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  operator_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_starts_with?: InputMaybe<Scalars['String']['input']>;
  operator_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Stake_Filter>>>;
  sponsorship?: InputMaybe<Scalars['String']['input']>;
  sponsorship_?: InputMaybe<Sponsorship_Filter>;
  sponsorship_contains?: InputMaybe<Scalars['String']['input']>;
  sponsorship_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_ends_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_gt?: InputMaybe<Scalars['String']['input']>;
  sponsorship_gte?: InputMaybe<Scalars['String']['input']>;
  sponsorship_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sponsorship_lt?: InputMaybe<Scalars['String']['input']>;
  sponsorship_lte?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_contains?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sponsorship_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_starts_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  updateTimestamp?: InputMaybe<Scalars['Int']['input']>;
  updateTimestamp_gt?: InputMaybe<Scalars['Int']['input']>;
  updateTimestamp_gte?: InputMaybe<Scalars['Int']['input']>;
  updateTimestamp_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  updateTimestamp_lt?: InputMaybe<Scalars['Int']['input']>;
  updateTimestamp_lte?: InputMaybe<Scalars['Int']['input']>;
  updateTimestamp_not?: InputMaybe<Scalars['Int']['input']>;
  updateTimestamp_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export enum Stake_OrderBy {
  AmountWei = 'amountWei',
  EarningsWei = 'earningsWei',
  Id = 'id',
  JoinTimestamp = 'joinTimestamp',
  LockedWei = 'lockedWei',
  MinimumStakeWei = 'minimumStakeWei',
  Operator = 'operator',
  OperatorContractVersion = 'operator__contractVersion',
  OperatorCumulativeEarningsWei = 'operator__cumulativeEarningsWei',
  OperatorCumulativeOperatorsCutWei = 'operator__cumulativeOperatorsCutWei',
  OperatorCumulativeProfitsWei = 'operator__cumulativeProfitsWei',
  OperatorDataTokenBalanceWei = 'operator__dataTokenBalanceWei',
  OperatorDelegatorCount = 'operator__delegatorCount',
  OperatorExchangeRate = 'operator__exchangeRate',
  OperatorId = 'operator__id',
  OperatorIsEligibleToVote = 'operator__isEligibleToVote',
  OperatorLatestHeartbeatMetadata = 'operator__latestHeartbeatMetadata',
  OperatorLatestHeartbeatTimestamp = 'operator__latestHeartbeatTimestamp',
  OperatorMetadataJsonString = 'operator__metadataJsonString',
  OperatorOperatorTokenTotalSupplyWei = 'operator__operatorTokenTotalSupplyWei',
  OperatorOperatorsCutFraction = 'operator__operatorsCutFraction',
  OperatorOwner = 'operator__owner',
  OperatorProtectionEndTimestamp = 'operator__protectionEndTimestamp',
  OperatorSlashingsCount = 'operator__slashingsCount',
  OperatorTotalStakeInSponsorshipsWei = 'operator__totalStakeInSponsorshipsWei',
  OperatorValueUpdateBlockNumber = 'operator__valueUpdateBlockNumber',
  OperatorValueUpdateTimestamp = 'operator__valueUpdateTimestamp',
  OperatorValueWithoutEarnings = 'operator__valueWithoutEarnings',
  Sponsorship = 'sponsorship',
  SponsorshipCreator = 'sponsorship__creator',
  SponsorshipCumulativeSponsoring = 'sponsorship__cumulativeSponsoring',
  SponsorshipId = 'sponsorship__id',
  SponsorshipIsRunning = 'sponsorship__isRunning',
  SponsorshipMaxOperators = 'sponsorship__maxOperators',
  SponsorshipMetadata = 'sponsorship__metadata',
  SponsorshipMinOperators = 'sponsorship__minOperators',
  SponsorshipMinimumStakingPeriodSeconds = 'sponsorship__minimumStakingPeriodSeconds',
  SponsorshipOperatorCount = 'sponsorship__operatorCount',
  SponsorshipProjectedInsolvency = 'sponsorship__projectedInsolvency',
  SponsorshipRemainingWei = 'sponsorship__remainingWei',
  SponsorshipRemainingWeiUpdateTimestamp = 'sponsorship__remainingWeiUpdateTimestamp',
  SponsorshipSpotApy = 'sponsorship__spotAPY',
  SponsorshipTotalPayoutWeiPerSec = 'sponsorship__totalPayoutWeiPerSec',
  SponsorshipTotalStakedWei = 'sponsorship__totalStakedWei',
  UpdateTimestamp = 'updateTimestamp'
}

export type StakingEvent = {
  __typename?: 'StakingEvent';
  amount: Scalars['BigInt']['output'];
  date: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  operator: Operator;
  sponsorship: Sponsorship;
};

export type StakingEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<StakingEvent_Filter>>>;
  date?: InputMaybe<Scalars['BigInt']['input']>;
  date_gt?: InputMaybe<Scalars['BigInt']['input']>;
  date_gte?: InputMaybe<Scalars['BigInt']['input']>;
  date_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  date_lt?: InputMaybe<Scalars['BigInt']['input']>;
  date_lte?: InputMaybe<Scalars['BigInt']['input']>;
  date_not?: InputMaybe<Scalars['BigInt']['input']>;
  date_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  operator?: InputMaybe<Scalars['String']['input']>;
  operator_?: InputMaybe<Operator_Filter>;
  operator_contains?: InputMaybe<Scalars['String']['input']>;
  operator_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_ends_with?: InputMaybe<Scalars['String']['input']>;
  operator_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_gt?: InputMaybe<Scalars['String']['input']>;
  operator_gte?: InputMaybe<Scalars['String']['input']>;
  operator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operator_lt?: InputMaybe<Scalars['String']['input']>;
  operator_lte?: InputMaybe<Scalars['String']['input']>;
  operator_not?: InputMaybe<Scalars['String']['input']>;
  operator_not_contains?: InputMaybe<Scalars['String']['input']>;
  operator_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  operator_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  operator_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_starts_with?: InputMaybe<Scalars['String']['input']>;
  operator_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<StakingEvent_Filter>>>;
  sponsorship?: InputMaybe<Scalars['String']['input']>;
  sponsorship_?: InputMaybe<Sponsorship_Filter>;
  sponsorship_contains?: InputMaybe<Scalars['String']['input']>;
  sponsorship_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_ends_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_gt?: InputMaybe<Scalars['String']['input']>;
  sponsorship_gte?: InputMaybe<Scalars['String']['input']>;
  sponsorship_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sponsorship_lt?: InputMaybe<Scalars['String']['input']>;
  sponsorship_lte?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_contains?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sponsorship_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_starts_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum StakingEvent_OrderBy {
  Amount = 'amount',
  Date = 'date',
  Id = 'id',
  Operator = 'operator',
  OperatorContractVersion = 'operator__contractVersion',
  OperatorCumulativeEarningsWei = 'operator__cumulativeEarningsWei',
  OperatorCumulativeOperatorsCutWei = 'operator__cumulativeOperatorsCutWei',
  OperatorCumulativeProfitsWei = 'operator__cumulativeProfitsWei',
  OperatorDataTokenBalanceWei = 'operator__dataTokenBalanceWei',
  OperatorDelegatorCount = 'operator__delegatorCount',
  OperatorExchangeRate = 'operator__exchangeRate',
  OperatorId = 'operator__id',
  OperatorIsEligibleToVote = 'operator__isEligibleToVote',
  OperatorLatestHeartbeatMetadata = 'operator__latestHeartbeatMetadata',
  OperatorLatestHeartbeatTimestamp = 'operator__latestHeartbeatTimestamp',
  OperatorMetadataJsonString = 'operator__metadataJsonString',
  OperatorOperatorTokenTotalSupplyWei = 'operator__operatorTokenTotalSupplyWei',
  OperatorOperatorsCutFraction = 'operator__operatorsCutFraction',
  OperatorOwner = 'operator__owner',
  OperatorProtectionEndTimestamp = 'operator__protectionEndTimestamp',
  OperatorSlashingsCount = 'operator__slashingsCount',
  OperatorTotalStakeInSponsorshipsWei = 'operator__totalStakeInSponsorshipsWei',
  OperatorValueUpdateBlockNumber = 'operator__valueUpdateBlockNumber',
  OperatorValueUpdateTimestamp = 'operator__valueUpdateTimestamp',
  OperatorValueWithoutEarnings = 'operator__valueWithoutEarnings',
  Sponsorship = 'sponsorship',
  SponsorshipCreator = 'sponsorship__creator',
  SponsorshipCumulativeSponsoring = 'sponsorship__cumulativeSponsoring',
  SponsorshipId = 'sponsorship__id',
  SponsorshipIsRunning = 'sponsorship__isRunning',
  SponsorshipMaxOperators = 'sponsorship__maxOperators',
  SponsorshipMetadata = 'sponsorship__metadata',
  SponsorshipMinOperators = 'sponsorship__minOperators',
  SponsorshipMinimumStakingPeriodSeconds = 'sponsorship__minimumStakingPeriodSeconds',
  SponsorshipOperatorCount = 'sponsorship__operatorCount',
  SponsorshipProjectedInsolvency = 'sponsorship__projectedInsolvency',
  SponsorshipRemainingWei = 'sponsorship__remainingWei',
  SponsorshipRemainingWeiUpdateTimestamp = 'sponsorship__remainingWeiUpdateTimestamp',
  SponsorshipSpotApy = 'sponsorship__spotAPY',
  SponsorshipTotalPayoutWeiPerSec = 'sponsorship__totalPayoutWeiPerSec',
  SponsorshipTotalStakedWei = 'sponsorship__totalStakedWei'
}

export type Stream = {
  __typename?: 'Stream';
  /** date created. This is a timestamp in seconds */
  createdAt?: Maybe<Scalars['BigInt']['output']>;
  /** stream ID = 'creator address'/'path' where path can be any string */
  id: Scalars['ID']['output'];
  /** Stream metadata JSON */
  metadata: Scalars['String']['output'];
  /** Permissions that each Ethereum address owns to this stream */
  permissions?: Maybe<Array<StreamPermission>>;
  sponsorships?: Maybe<Array<Sponsorship>>;
  /** Nodes the have been registered as storage nodes to this stream in the StreamStorageRegistry */
  storageNodes?: Maybe<Array<Node>>;
  /** date updated. This is a timestamp in seconds */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
};


export type StreamPermissionsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<StreamPermission_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<StreamPermission_Filter>;
};


export type StreamSponsorshipsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Sponsorship_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Sponsorship_Filter>;
};


export type StreamStorageNodesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Node_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Node_Filter>;
};

export type StreamPermission = {
  __typename?: 'StreamPermission';
  /** canDelete permission allows deleting the stream from the StreamRegistry */
  canDelete?: Maybe<Scalars['Boolean']['output']>;
  /** Edit permission enables changing the stream's metadata */
  canEdit?: Maybe<Scalars['Boolean']['output']>;
  /** grant permission allows granting and revoking permissions to this stream */
  canGrant?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  /** publishExpiration timestamp tells until what time this address may publish data to the stream */
  publishExpiration?: Maybe<Scalars['BigInt']['output']>;
  /** Target stream this permission applies to */
  stream?: Maybe<Stream>;
  /** subscribeExpires timestamp tells until what time this address may subscribe to the stream */
  subscribeExpiration?: Maybe<Scalars['BigInt']['output']>;
  /** [DEPRECATED] Ethereum address, owner of this permission; only if permission granting didn't use *forUserId functions */
  userAddress: Scalars['Bytes']['output'];
  /** Ethereum address or other ID, owner of this permission */
  userId: Scalars['Bytes']['output'];
};

export type StreamPermission_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<StreamPermission_Filter>>>;
  canDelete?: InputMaybe<Scalars['Boolean']['input']>;
  canDelete_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canDelete_not?: InputMaybe<Scalars['Boolean']['input']>;
  canDelete_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canEdit?: InputMaybe<Scalars['Boolean']['input']>;
  canEdit_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canEdit_not?: InputMaybe<Scalars['Boolean']['input']>;
  canEdit_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canGrant?: InputMaybe<Scalars['Boolean']['input']>;
  canGrant_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canGrant_not?: InputMaybe<Scalars['Boolean']['input']>;
  canGrant_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<StreamPermission_Filter>>>;
  publishExpiration?: InputMaybe<Scalars['BigInt']['input']>;
  publishExpiration_gt?: InputMaybe<Scalars['BigInt']['input']>;
  publishExpiration_gte?: InputMaybe<Scalars['BigInt']['input']>;
  publishExpiration_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  publishExpiration_lt?: InputMaybe<Scalars['BigInt']['input']>;
  publishExpiration_lte?: InputMaybe<Scalars['BigInt']['input']>;
  publishExpiration_not?: InputMaybe<Scalars['BigInt']['input']>;
  publishExpiration_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stream?: InputMaybe<Scalars['String']['input']>;
  stream_?: InputMaybe<Stream_Filter>;
  stream_contains?: InputMaybe<Scalars['String']['input']>;
  stream_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  stream_ends_with?: InputMaybe<Scalars['String']['input']>;
  stream_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stream_gt?: InputMaybe<Scalars['String']['input']>;
  stream_gte?: InputMaybe<Scalars['String']['input']>;
  stream_in?: InputMaybe<Array<Scalars['String']['input']>>;
  stream_lt?: InputMaybe<Scalars['String']['input']>;
  stream_lte?: InputMaybe<Scalars['String']['input']>;
  stream_not?: InputMaybe<Scalars['String']['input']>;
  stream_not_contains?: InputMaybe<Scalars['String']['input']>;
  stream_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  stream_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  stream_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stream_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  stream_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  stream_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stream_starts_with?: InputMaybe<Scalars['String']['input']>;
  stream_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  subscribeExpiration?: InputMaybe<Scalars['BigInt']['input']>;
  subscribeExpiration_gt?: InputMaybe<Scalars['BigInt']['input']>;
  subscribeExpiration_gte?: InputMaybe<Scalars['BigInt']['input']>;
  subscribeExpiration_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  subscribeExpiration_lt?: InputMaybe<Scalars['BigInt']['input']>;
  subscribeExpiration_lte?: InputMaybe<Scalars['BigInt']['input']>;
  subscribeExpiration_not?: InputMaybe<Scalars['BigInt']['input']>;
  subscribeExpiration_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  userAddress?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_contains?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_gt?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_gte?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  userAddress_lt?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_lte?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_not?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  userId?: InputMaybe<Scalars['Bytes']['input']>;
  userId_contains?: InputMaybe<Scalars['Bytes']['input']>;
  userId_gt?: InputMaybe<Scalars['Bytes']['input']>;
  userId_gte?: InputMaybe<Scalars['Bytes']['input']>;
  userId_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  userId_lt?: InputMaybe<Scalars['Bytes']['input']>;
  userId_lte?: InputMaybe<Scalars['Bytes']['input']>;
  userId_not?: InputMaybe<Scalars['Bytes']['input']>;
  userId_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  userId_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum StreamPermission_OrderBy {
  CanDelete = 'canDelete',
  CanEdit = 'canEdit',
  CanGrant = 'canGrant',
  Id = 'id',
  PublishExpiration = 'publishExpiration',
  Stream = 'stream',
  StreamCreatedAt = 'stream__createdAt',
  StreamId = 'stream__id',
  StreamMetadata = 'stream__metadata',
  StreamUpdatedAt = 'stream__updatedAt',
  SubscribeExpiration = 'subscribeExpiration',
  UserAddress = 'userAddress',
  UserId = 'userId'
}

export type Stream_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Stream_Filter>>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  metadata?: InputMaybe<Scalars['String']['input']>;
  metadata_contains?: InputMaybe<Scalars['String']['input']>;
  metadata_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadata_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_gt?: InputMaybe<Scalars['String']['input']>;
  metadata_gte?: InputMaybe<Scalars['String']['input']>;
  metadata_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_lt?: InputMaybe<Scalars['String']['input']>;
  metadata_lte?: InputMaybe<Scalars['String']['input']>;
  metadata_not?: InputMaybe<Scalars['String']['input']>;
  metadata_not_contains?: InputMaybe<Scalars['String']['input']>;
  metadata_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadata_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadata_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadata_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Stream_Filter>>>;
  permissions_?: InputMaybe<StreamPermission_Filter>;
  sponsorships_?: InputMaybe<Sponsorship_Filter>;
  storageNodes_?: InputMaybe<Node_Filter>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum Stream_OrderBy {
  CreatedAt = 'createdAt',
  Id = 'id',
  Metadata = 'metadata',
  Permissions = 'permissions',
  Sponsorships = 'sponsorships',
  StorageNodes = 'storageNodes',
  UpdatedAt = 'updatedAt'
}

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  delegation?: Maybe<Delegation>;
  delegations: Array<Delegation>;
  delegator?: Maybe<Delegator>;
  delegatorDailyBucket?: Maybe<DelegatorDailyBucket>;
  delegatorDailyBuckets: Array<DelegatorDailyBucket>;
  delegators: Array<Delegator>;
  flag?: Maybe<Flag>;
  flags: Array<Flag>;
  network?: Maybe<Network>;
  networks: Array<Network>;
  node?: Maybe<Node>;
  nodes: Array<Node>;
  operator?: Maybe<Operator>;
  operatorDailyBucket?: Maybe<OperatorDailyBucket>;
  operatorDailyBuckets: Array<OperatorDailyBucket>;
  operators: Array<Operator>;
  project?: Maybe<Project>;
  projectPaymentDetails?: Maybe<ProjectPaymentDetails>;
  projectPaymentDetails_collection: Array<ProjectPaymentDetails>;
  projectPermission?: Maybe<ProjectPermission>;
  projectPermissions: Array<ProjectPermission>;
  projectPurchase?: Maybe<ProjectPurchase>;
  projectPurchases: Array<ProjectPurchase>;
  projectStakeByUser?: Maybe<ProjectStakeByUser>;
  projectStakeByUsers: Array<ProjectStakeByUser>;
  projectStakingDayBucket?: Maybe<ProjectStakingDayBucket>;
  projectStakingDayBuckets: Array<ProjectStakingDayBucket>;
  projectSubscription?: Maybe<ProjectSubscription>;
  projectSubscriptions: Array<ProjectSubscription>;
  projects: Array<Project>;
  queueEntries: Array<QueueEntry>;
  queueEntry?: Maybe<QueueEntry>;
  slashingEvent?: Maybe<SlashingEvent>;
  slashingEvents: Array<SlashingEvent>;
  sponsoringEvent?: Maybe<SponsoringEvent>;
  sponsoringEvents: Array<SponsoringEvent>;
  sponsorship?: Maybe<Sponsorship>;
  sponsorshipDailyBucket?: Maybe<SponsorshipDailyBucket>;
  sponsorshipDailyBuckets: Array<SponsorshipDailyBucket>;
  sponsorships: Array<Sponsorship>;
  stake?: Maybe<Stake>;
  stakes: Array<Stake>;
  stakingEvent?: Maybe<StakingEvent>;
  stakingEvents: Array<StakingEvent>;
  stream?: Maybe<Stream>;
  streamPermission?: Maybe<StreamPermission>;
  streamPermissions: Array<StreamPermission>;
  streams: Array<Stream>;
  vote?: Maybe<Vote>;
  votes: Array<Vote>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionDelegationArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDelegationsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Delegation_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Delegation_Filter>;
};


export type SubscriptionDelegatorArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDelegatorDailyBucketArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDelegatorDailyBucketsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DelegatorDailyBucket_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DelegatorDailyBucket_Filter>;
};


export type SubscriptionDelegatorsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Delegator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Delegator_Filter>;
};


export type SubscriptionFlagArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionFlagsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Flag_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Flag_Filter>;
};


export type SubscriptionNetworkArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionNetworksArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Network_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Network_Filter>;
};


export type SubscriptionNodeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionNodesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Node_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Node_Filter>;
};


export type SubscriptionOperatorArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionOperatorDailyBucketArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionOperatorDailyBucketsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OperatorDailyBucket_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OperatorDailyBucket_Filter>;
};


export type SubscriptionOperatorsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Operator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Operator_Filter>;
};


export type SubscriptionProjectArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionProjectPaymentDetailsArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionProjectPaymentDetails_CollectionArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectPaymentDetails_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProjectPaymentDetails_Filter>;
};


export type SubscriptionProjectPermissionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionProjectPermissionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectPermission_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProjectPermission_Filter>;
};


export type SubscriptionProjectPurchaseArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionProjectPurchasesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectPurchase_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProjectPurchase_Filter>;
};


export type SubscriptionProjectStakeByUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionProjectStakeByUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectStakeByUser_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProjectStakeByUser_Filter>;
};


export type SubscriptionProjectStakingDayBucketArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionProjectStakingDayBucketsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectStakingDayBucket_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProjectStakingDayBucket_Filter>;
};


export type SubscriptionProjectSubscriptionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionProjectSubscriptionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectSubscription_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProjectSubscription_Filter>;
};


export type SubscriptionProjectsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Project_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Project_Filter>;
};


export type SubscriptionQueueEntriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<QueueEntry_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<QueueEntry_Filter>;
};


export type SubscriptionQueueEntryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSlashingEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSlashingEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SlashingEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SlashingEvent_Filter>;
};


export type SubscriptionSponsoringEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSponsoringEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SponsoringEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SponsoringEvent_Filter>;
};


export type SubscriptionSponsorshipArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSponsorshipDailyBucketArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSponsorshipDailyBucketsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SponsorshipDailyBucket_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SponsorshipDailyBucket_Filter>;
};


export type SubscriptionSponsorshipsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Sponsorship_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Sponsorship_Filter>;
};


export type SubscriptionStakeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionStakesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Stake_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Stake_Filter>;
};


export type SubscriptionStakingEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionStakingEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<StakingEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StakingEvent_Filter>;
};


export type SubscriptionStreamArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionStreamPermissionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionStreamPermissionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<StreamPermission_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StreamPermission_Filter>;
};


export type SubscriptionStreamsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Stream_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Stream_Filter>;
};


export type SubscriptionVoteArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionVotesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Vote_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Vote_Filter>;
};

export type Vote = {
  __typename?: 'Vote';
  flag: Flag;
  id: Scalars['ID']['output'];
  timestamp: Scalars['Int']['output'];
  votedKick: Scalars['Boolean']['output'];
  voter: Operator;
  voterWeight: Scalars['BigInt']['output'];
};

export type Vote_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Vote_Filter>>>;
  flag?: InputMaybe<Scalars['String']['input']>;
  flag_?: InputMaybe<Flag_Filter>;
  flag_contains?: InputMaybe<Scalars['String']['input']>;
  flag_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  flag_ends_with?: InputMaybe<Scalars['String']['input']>;
  flag_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  flag_gt?: InputMaybe<Scalars['String']['input']>;
  flag_gte?: InputMaybe<Scalars['String']['input']>;
  flag_in?: InputMaybe<Array<Scalars['String']['input']>>;
  flag_lt?: InputMaybe<Scalars['String']['input']>;
  flag_lte?: InputMaybe<Scalars['String']['input']>;
  flag_not?: InputMaybe<Scalars['String']['input']>;
  flag_not_contains?: InputMaybe<Scalars['String']['input']>;
  flag_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  flag_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  flag_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  flag_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  flag_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  flag_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  flag_starts_with?: InputMaybe<Scalars['String']['input']>;
  flag_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Vote_Filter>>>;
  timestamp?: InputMaybe<Scalars['Int']['input']>;
  timestamp_gt?: InputMaybe<Scalars['Int']['input']>;
  timestamp_gte?: InputMaybe<Scalars['Int']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']['input']>;
  timestamp_lte?: InputMaybe<Scalars['Int']['input']>;
  timestamp_not?: InputMaybe<Scalars['Int']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  votedKick?: InputMaybe<Scalars['Boolean']['input']>;
  votedKick_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  votedKick_not?: InputMaybe<Scalars['Boolean']['input']>;
  votedKick_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  voter?: InputMaybe<Scalars['String']['input']>;
  voterWeight?: InputMaybe<Scalars['BigInt']['input']>;
  voterWeight_gt?: InputMaybe<Scalars['BigInt']['input']>;
  voterWeight_gte?: InputMaybe<Scalars['BigInt']['input']>;
  voterWeight_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  voterWeight_lt?: InputMaybe<Scalars['BigInt']['input']>;
  voterWeight_lte?: InputMaybe<Scalars['BigInt']['input']>;
  voterWeight_not?: InputMaybe<Scalars['BigInt']['input']>;
  voterWeight_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  voter_?: InputMaybe<Operator_Filter>;
  voter_contains?: InputMaybe<Scalars['String']['input']>;
  voter_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  voter_ends_with?: InputMaybe<Scalars['String']['input']>;
  voter_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  voter_gt?: InputMaybe<Scalars['String']['input']>;
  voter_gte?: InputMaybe<Scalars['String']['input']>;
  voter_in?: InputMaybe<Array<Scalars['String']['input']>>;
  voter_lt?: InputMaybe<Scalars['String']['input']>;
  voter_lte?: InputMaybe<Scalars['String']['input']>;
  voter_not?: InputMaybe<Scalars['String']['input']>;
  voter_not_contains?: InputMaybe<Scalars['String']['input']>;
  voter_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  voter_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  voter_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  voter_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  voter_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  voter_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  voter_starts_with?: InputMaybe<Scalars['String']['input']>;
  voter_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Vote_OrderBy {
  Flag = 'flag',
  FlagFlagResolutionTimestamp = 'flag__flagResolutionTimestamp',
  FlagFlaggingTimestamp = 'flag__flaggingTimestamp',
  FlagId = 'flag__id',
  FlagLastFlagIndex = 'flag__lastFlagIndex',
  FlagMetadata = 'flag__metadata',
  FlagProtectionEndTimestamp = 'flag__protectionEndTimestamp',
  FlagResult = 'flag__result',
  FlagReviewerCount = 'flag__reviewerCount',
  FlagTargetStakeAtRiskWei = 'flag__targetStakeAtRiskWei',
  FlagVoteEndTimestamp = 'flag__voteEndTimestamp',
  FlagVoteStartTimestamp = 'flag__voteStartTimestamp',
  FlagVotesAgainstKick = 'flag__votesAgainstKick',
  FlagVotesForKick = 'flag__votesForKick',
  Id = 'id',
  Timestamp = 'timestamp',
  VotedKick = 'votedKick',
  Voter = 'voter',
  VoterWeight = 'voterWeight',
  VoterContractVersion = 'voter__contractVersion',
  VoterCumulativeEarningsWei = 'voter__cumulativeEarningsWei',
  VoterCumulativeOperatorsCutWei = 'voter__cumulativeOperatorsCutWei',
  VoterCumulativeProfitsWei = 'voter__cumulativeProfitsWei',
  VoterDataTokenBalanceWei = 'voter__dataTokenBalanceWei',
  VoterDelegatorCount = 'voter__delegatorCount',
  VoterExchangeRate = 'voter__exchangeRate',
  VoterId = 'voter__id',
  VoterIsEligibleToVote = 'voter__isEligibleToVote',
  VoterLatestHeartbeatMetadata = 'voter__latestHeartbeatMetadata',
  VoterLatestHeartbeatTimestamp = 'voter__latestHeartbeatTimestamp',
  VoterMetadataJsonString = 'voter__metadataJsonString',
  VoterOperatorTokenTotalSupplyWei = 'voter__operatorTokenTotalSupplyWei',
  VoterOperatorsCutFraction = 'voter__operatorsCutFraction',
  VoterOwner = 'voter__owner',
  VoterProtectionEndTimestamp = 'voter__protectionEndTimestamp',
  VoterSlashingsCount = 'voter__slashingsCount',
  VoterTotalStakeInSponsorshipsWei = 'voter__totalStakeInSponsorshipsWei',
  VoterValueUpdateBlockNumber = 'voter__valueUpdateBlockNumber',
  VoterValueUpdateTimestamp = 'voter__valueUpdateTimestamp',
  VoterValueWithoutEarnings = 'voter__valueWithoutEarnings'
}

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']['output']>;
  /** The block number */
  number: Scalars['Int']['output'];
  /** The hash of the parent block */
  parentHash?: Maybe<Scalars['Bytes']['output']>;
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']['output']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String']['output'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean']['output'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

export type StakeFieldsFragment = { __typename?: 'Stake', amountWei: any, earningsWei: any, lockedWei: any, joinTimestamp: number, operator: { __typename?: 'Operator', id: string, metadataJsonString: string } };

export type OperatorFieldsFragment = { __typename?: 'Operator', id: string, delegatorCount: number, valueWithoutEarnings: any, totalStakeInSponsorshipsWei: any, dataTokenBalanceWei: any, operatorTokenTotalSupplyWei: any, metadataJsonString: string, owner: string, nodes: Array<string>, cumulativeProfitsWei: any, cumulativeOperatorsCutWei: any, operatorsCutFraction: any, contractVersion: any, exchangeRate: any, controllers: Array<string>, stakes: Array<{ __typename?: 'Stake', amountWei: any, earningsWei: any, lockedWei: any, joinTimestamp: number, sponsorship: { __typename?: 'Sponsorship', id: string, metadata?: string | null, isRunning: boolean, totalPayoutWeiPerSec: any, operatorCount: number, minOperators?: number | null, maxOperators?: number | null, totalStakedWei: any, remainingWei: any, remainingWeiUpdateTimestamp?: any | null, projectedInsolvency?: any | null, cumulativeSponsoring: any, minimumStakingPeriodSeconds: any, creator: string, spotAPY: any, stream?: { __typename?: 'Stream', id: string, metadata: string } | null, stakes: Array<{ __typename?: 'Stake', amountWei: any, earningsWei: any, lockedWei: any, joinTimestamp: number, operator: { __typename?: 'Operator', id: string, metadataJsonString: string } }> }, operator: { __typename?: 'Operator', id: string, metadataJsonString: string } }>, delegations: Array<{ __typename?: 'Delegation', operatorTokenBalanceWei: any, latestDelegationTimestamp: number, earliestUndelegationTimestamp: number, id: string, delegator: { __typename?: 'Delegator', id: string } }>, slashingEvents: Array<{ __typename?: 'SlashingEvent', amount: any, date: any, sponsorship: { __typename?: 'Sponsorship', id: string, stream?: { __typename?: 'Stream', id: string } | null } }>, queueEntries: Array<{ __typename?: 'QueueEntry', amount: any, date: any, id: string, delegator: { __typename?: 'Delegator', id: string } }> };

export type GetAllOperatorsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  searchQuery?: InputMaybe<Scalars['ID']['input']>;
  orderBy?: InputMaybe<Operator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
}>;


export type GetAllOperatorsQuery = { __typename?: 'Query', operators: Array<{ __typename?: 'Operator', id: string, delegatorCount: number, valueWithoutEarnings: any, totalStakeInSponsorshipsWei: any, dataTokenBalanceWei: any, operatorTokenTotalSupplyWei: any, metadataJsonString: string, owner: string, nodes: Array<string>, cumulativeProfitsWei: any, cumulativeOperatorsCutWei: any, operatorsCutFraction: any, contractVersion: any, exchangeRate: any, controllers: Array<string>, stakes: Array<{ __typename?: 'Stake', amountWei: any, earningsWei: any, lockedWei: any, joinTimestamp: number, sponsorship: { __typename?: 'Sponsorship', id: string, metadata?: string | null, isRunning: boolean, totalPayoutWeiPerSec: any, operatorCount: number, minOperators?: number | null, maxOperators?: number | null, totalStakedWei: any, remainingWei: any, remainingWeiUpdateTimestamp?: any | null, projectedInsolvency?: any | null, cumulativeSponsoring: any, minimumStakingPeriodSeconds: any, creator: string, spotAPY: any, stream?: { __typename?: 'Stream', id: string, metadata: string } | null, stakes: Array<{ __typename?: 'Stake', amountWei: any, earningsWei: any, lockedWei: any, joinTimestamp: number, operator: { __typename?: 'Operator', id: string, metadataJsonString: string } }> }, operator: { __typename?: 'Operator', id: string, metadataJsonString: string } }>, delegations: Array<{ __typename?: 'Delegation', operatorTokenBalanceWei: any, latestDelegationTimestamp: number, earliestUndelegationTimestamp: number, id: string, delegator: { __typename?: 'Delegator', id: string } }>, slashingEvents: Array<{ __typename?: 'SlashingEvent', amount: any, date: any, sponsorship: { __typename?: 'Sponsorship', id: string, stream?: { __typename?: 'Stream', id: string } | null } }>, queueEntries: Array<{ __typename?: 'QueueEntry', amount: any, date: any, id: string, delegator: { __typename?: 'Delegator', id: string } }> }> };

export type SearchOperatorsByMetadataQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  orderBy?: InputMaybe<Operator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
}>;


export type SearchOperatorsByMetadataQuery = { __typename?: 'Query', operators: Array<{ __typename?: 'Operator', id: string, delegatorCount: number, valueWithoutEarnings: any, totalStakeInSponsorshipsWei: any, dataTokenBalanceWei: any, operatorTokenTotalSupplyWei: any, metadataJsonString: string, owner: string, nodes: Array<string>, cumulativeProfitsWei: any, cumulativeOperatorsCutWei: any, operatorsCutFraction: any, contractVersion: any, exchangeRate: any, controllers: Array<string>, stakes: Array<{ __typename?: 'Stake', amountWei: any, earningsWei: any, lockedWei: any, joinTimestamp: number, sponsorship: { __typename?: 'Sponsorship', id: string, metadata?: string | null, isRunning: boolean, totalPayoutWeiPerSec: any, operatorCount: number, minOperators?: number | null, maxOperators?: number | null, totalStakedWei: any, remainingWei: any, remainingWeiUpdateTimestamp?: any | null, projectedInsolvency?: any | null, cumulativeSponsoring: any, minimumStakingPeriodSeconds: any, creator: string, spotAPY: any, stream?: { __typename?: 'Stream', id: string, metadata: string } | null, stakes: Array<{ __typename?: 'Stake', amountWei: any, earningsWei: any, lockedWei: any, joinTimestamp: number, operator: { __typename?: 'Operator', id: string, metadataJsonString: string } }> }, operator: { __typename?: 'Operator', id: string, metadataJsonString: string } }>, delegations: Array<{ __typename?: 'Delegation', operatorTokenBalanceWei: any, latestDelegationTimestamp: number, earliestUndelegationTimestamp: number, id: string, delegator: { __typename?: 'Delegator', id: string } }>, slashingEvents: Array<{ __typename?: 'SlashingEvent', amount: any, date: any, sponsorship: { __typename?: 'Sponsorship', id: string, stream?: { __typename?: 'Stream', id: string } | null } }>, queueEntries: Array<{ __typename?: 'QueueEntry', amount: any, date: any, id: string, delegator: { __typename?: 'Delegator', id: string } }> }> };

export type GetOperatorByIdQueryVariables = Exact<{
  operatorId: Scalars['ID']['input'];
  minBlockNumber?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetOperatorByIdQuery = { __typename?: 'Query', operator?: { __typename?: 'Operator', id: string, delegatorCount: number, valueWithoutEarnings: any, totalStakeInSponsorshipsWei: any, dataTokenBalanceWei: any, operatorTokenTotalSupplyWei: any, metadataJsonString: string, owner: string, nodes: Array<string>, cumulativeProfitsWei: any, cumulativeOperatorsCutWei: any, operatorsCutFraction: any, contractVersion: any, exchangeRate: any, controllers: Array<string>, stakes: Array<{ __typename?: 'Stake', amountWei: any, earningsWei: any, lockedWei: any, joinTimestamp: number, sponsorship: { __typename?: 'Sponsorship', id: string, metadata?: string | null, isRunning: boolean, totalPayoutWeiPerSec: any, operatorCount: number, minOperators?: number | null, maxOperators?: number | null, totalStakedWei: any, remainingWei: any, remainingWeiUpdateTimestamp?: any | null, projectedInsolvency?: any | null, cumulativeSponsoring: any, minimumStakingPeriodSeconds: any, creator: string, spotAPY: any, stream?: { __typename?: 'Stream', id: string, metadata: string } | null, stakes: Array<{ __typename?: 'Stake', amountWei: any, earningsWei: any, lockedWei: any, joinTimestamp: number, operator: { __typename?: 'Operator', id: string, metadataJsonString: string } }> }, operator: { __typename?: 'Operator', id: string, metadataJsonString: string } }>, delegations: Array<{ __typename?: 'Delegation', operatorTokenBalanceWei: any, latestDelegationTimestamp: number, earliestUndelegationTimestamp: number, id: string, delegator: { __typename?: 'Delegator', id: string } }>, slashingEvents: Array<{ __typename?: 'SlashingEvent', amount: any, date: any, sponsorship: { __typename?: 'Sponsorship', id: string, stream?: { __typename?: 'Stream', id: string } | null } }>, queueEntries: Array<{ __typename?: 'QueueEntry', amount: any, date: any, id: string, delegator: { __typename?: 'Delegator', id: string } }> } | null };

export type GetOperatorsByDelegationQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  delegator: Scalars['String']['input'];
  orderBy?: InputMaybe<Operator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
}>;


export type GetOperatorsByDelegationQuery = { __typename?: 'Query', operators: Array<{ __typename?: 'Operator', id: string, delegatorCount: number, valueWithoutEarnings: any, totalStakeInSponsorshipsWei: any, dataTokenBalanceWei: any, operatorTokenTotalSupplyWei: any, metadataJsonString: string, owner: string, nodes: Array<string>, cumulativeProfitsWei: any, cumulativeOperatorsCutWei: any, operatorsCutFraction: any, contractVersion: any, exchangeRate: any, controllers: Array<string>, stakes: Array<{ __typename?: 'Stake', amountWei: any, earningsWei: any, lockedWei: any, joinTimestamp: number, sponsorship: { __typename?: 'Sponsorship', id: string, metadata?: string | null, isRunning: boolean, totalPayoutWeiPerSec: any, operatorCount: number, minOperators?: number | null, maxOperators?: number | null, totalStakedWei: any, remainingWei: any, remainingWeiUpdateTimestamp?: any | null, projectedInsolvency?: any | null, cumulativeSponsoring: any, minimumStakingPeriodSeconds: any, creator: string, spotAPY: any, stream?: { __typename?: 'Stream', id: string, metadata: string } | null, stakes: Array<{ __typename?: 'Stake', amountWei: any, earningsWei: any, lockedWei: any, joinTimestamp: number, operator: { __typename?: 'Operator', id: string, metadataJsonString: string } }> }, operator: { __typename?: 'Operator', id: string, metadataJsonString: string } }>, delegations: Array<{ __typename?: 'Delegation', operatorTokenBalanceWei: any, latestDelegationTimestamp: number, earliestUndelegationTimestamp: number, id: string, delegator: { __typename?: 'Delegator', id: string } }>, slashingEvents: Array<{ __typename?: 'SlashingEvent', amount: any, date: any, sponsorship: { __typename?: 'Sponsorship', id: string, stream?: { __typename?: 'Stream', id: string } | null } }>, queueEntries: Array<{ __typename?: 'QueueEntry', amount: any, date: any, id: string, delegator: { __typename?: 'Delegator', id: string } }> }> };

export type GetOperatorsByDelegationAndIdQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  delegator: Scalars['String']['input'];
  operatorId: Scalars['ID']['input'];
  orderBy?: InputMaybe<Operator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
}>;


export type GetOperatorsByDelegationAndIdQuery = { __typename?: 'Query', operators: Array<{ __typename?: 'Operator', id: string, delegatorCount: number, valueWithoutEarnings: any, totalStakeInSponsorshipsWei: any, dataTokenBalanceWei: any, operatorTokenTotalSupplyWei: any, metadataJsonString: string, owner: string, nodes: Array<string>, cumulativeProfitsWei: any, cumulativeOperatorsCutWei: any, operatorsCutFraction: any, contractVersion: any, exchangeRate: any, controllers: Array<string>, stakes: Array<{ __typename?: 'Stake', amountWei: any, earningsWei: any, lockedWei: any, joinTimestamp: number, sponsorship: { __typename?: 'Sponsorship', id: string, metadata?: string | null, isRunning: boolean, totalPayoutWeiPerSec: any, operatorCount: number, minOperators?: number | null, maxOperators?: number | null, totalStakedWei: any, remainingWei: any, remainingWeiUpdateTimestamp?: any | null, projectedInsolvency?: any | null, cumulativeSponsoring: any, minimumStakingPeriodSeconds: any, creator: string, spotAPY: any, stream?: { __typename?: 'Stream', id: string, metadata: string } | null, stakes: Array<{ __typename?: 'Stake', amountWei: any, earningsWei: any, lockedWei: any, joinTimestamp: number, operator: { __typename?: 'Operator', id: string, metadataJsonString: string } }> }, operator: { __typename?: 'Operator', id: string, metadataJsonString: string } }>, delegations: Array<{ __typename?: 'Delegation', operatorTokenBalanceWei: any, latestDelegationTimestamp: number, earliestUndelegationTimestamp: number, id: string, delegator: { __typename?: 'Delegator', id: string } }>, slashingEvents: Array<{ __typename?: 'SlashingEvent', amount: any, date: any, sponsorship: { __typename?: 'Sponsorship', id: string, stream?: { __typename?: 'Stream', id: string } | null } }>, queueEntries: Array<{ __typename?: 'QueueEntry', amount: any, date: any, id: string, delegator: { __typename?: 'Delegator', id: string } }> }> };

export type GetOperatorsByDelegationAndMetadataQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  delegator: Scalars['String']['input'];
  searchQuery: Scalars['String']['input'];
  orderBy?: InputMaybe<Operator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
}>;


export type GetOperatorsByDelegationAndMetadataQuery = { __typename?: 'Query', operators: Array<{ __typename?: 'Operator', id: string, delegatorCount: number, valueWithoutEarnings: any, totalStakeInSponsorshipsWei: any, dataTokenBalanceWei: any, operatorTokenTotalSupplyWei: any, metadataJsonString: string, owner: string, nodes: Array<string>, cumulativeProfitsWei: any, cumulativeOperatorsCutWei: any, operatorsCutFraction: any, contractVersion: any, exchangeRate: any, controllers: Array<string>, stakes: Array<{ __typename?: 'Stake', amountWei: any, earningsWei: any, lockedWei: any, joinTimestamp: number, sponsorship: { __typename?: 'Sponsorship', id: string, metadata?: string | null, isRunning: boolean, totalPayoutWeiPerSec: any, operatorCount: number, minOperators?: number | null, maxOperators?: number | null, totalStakedWei: any, remainingWei: any, remainingWeiUpdateTimestamp?: any | null, projectedInsolvency?: any | null, cumulativeSponsoring: any, minimumStakingPeriodSeconds: any, creator: string, spotAPY: any, stream?: { __typename?: 'Stream', id: string, metadata: string } | null, stakes: Array<{ __typename?: 'Stake', amountWei: any, earningsWei: any, lockedWei: any, joinTimestamp: number, operator: { __typename?: 'Operator', id: string, metadataJsonString: string } }> }, operator: { __typename?: 'Operator', id: string, metadataJsonString: string } }>, delegations: Array<{ __typename?: 'Delegation', operatorTokenBalanceWei: any, latestDelegationTimestamp: number, earliestUndelegationTimestamp: number, id: string, delegator: { __typename?: 'Delegator', id: string } }>, slashingEvents: Array<{ __typename?: 'SlashingEvent', amount: any, date: any, sponsorship: { __typename?: 'Sponsorship', id: string, stream?: { __typename?: 'Stream', id: string } | null } }>, queueEntries: Array<{ __typename?: 'QueueEntry', amount: any, date: any, id: string, delegator: { __typename?: 'Delegator', id: string } }> }> };

export type GetOperatorByOwnerAddressQueryVariables = Exact<{
  owner: Scalars['String']['input'];
  minBlockNumber?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetOperatorByOwnerAddressQuery = { __typename?: 'Query', operators: Array<{ __typename?: 'Operator', id: string, delegatorCount: number, valueWithoutEarnings: any, totalStakeInSponsorshipsWei: any, dataTokenBalanceWei: any, operatorTokenTotalSupplyWei: any, metadataJsonString: string, owner: string, nodes: Array<string>, cumulativeProfitsWei: any, cumulativeOperatorsCutWei: any, operatorsCutFraction: any, contractVersion: any, exchangeRate: any, controllers: Array<string>, stakes: Array<{ __typename?: 'Stake', amountWei: any, earningsWei: any, lockedWei: any, joinTimestamp: number, sponsorship: { __typename?: 'Sponsorship', id: string, metadata?: string | null, isRunning: boolean, totalPayoutWeiPerSec: any, operatorCount: number, minOperators?: number | null, maxOperators?: number | null, totalStakedWei: any, remainingWei: any, remainingWeiUpdateTimestamp?: any | null, projectedInsolvency?: any | null, cumulativeSponsoring: any, minimumStakingPeriodSeconds: any, creator: string, spotAPY: any, stream?: { __typename?: 'Stream', id: string, metadata: string } | null, stakes: Array<{ __typename?: 'Stake', amountWei: any, earningsWei: any, lockedWei: any, joinTimestamp: number, operator: { __typename?: 'Operator', id: string, metadataJsonString: string } }> }, operator: { __typename?: 'Operator', id: string, metadataJsonString: string } }>, delegations: Array<{ __typename?: 'Delegation', operatorTokenBalanceWei: any, latestDelegationTimestamp: number, earliestUndelegationTimestamp: number, id: string, delegator: { __typename?: 'Delegator', id: string } }>, slashingEvents: Array<{ __typename?: 'SlashingEvent', amount: any, date: any, sponsorship: { __typename?: 'Sponsorship', id: string, stream?: { __typename?: 'Stream', id: string } | null } }>, queueEntries: Array<{ __typename?: 'QueueEntry', amount: any, date: any, id: string, delegator: { __typename?: 'Delegator', id: string } }> }> };

export type GetOperatorsByOwnerOrControllerAddressQueryVariables = Exact<{
  owner: Scalars['String']['input'];
  minBlockNumber?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetOperatorsByOwnerOrControllerAddressQuery = { __typename?: 'Query', operators: Array<{ __typename?: 'Operator', id: string, delegatorCount: number, valueWithoutEarnings: any, totalStakeInSponsorshipsWei: any, dataTokenBalanceWei: any, operatorTokenTotalSupplyWei: any, metadataJsonString: string, owner: string, nodes: Array<string>, cumulativeProfitsWei: any, cumulativeOperatorsCutWei: any, operatorsCutFraction: any, contractVersion: any, exchangeRate: any, controllers: Array<string>, stakes: Array<{ __typename?: 'Stake', amountWei: any, earningsWei: any, lockedWei: any, joinTimestamp: number, sponsorship: { __typename?: 'Sponsorship', id: string, metadata?: string | null, isRunning: boolean, totalPayoutWeiPerSec: any, operatorCount: number, minOperators?: number | null, maxOperators?: number | null, totalStakedWei: any, remainingWei: any, remainingWeiUpdateTimestamp?: any | null, projectedInsolvency?: any | null, cumulativeSponsoring: any, minimumStakingPeriodSeconds: any, creator: string, spotAPY: any, stream?: { __typename?: 'Stream', id: string, metadata: string } | null, stakes: Array<{ __typename?: 'Stake', amountWei: any, earningsWei: any, lockedWei: any, joinTimestamp: number, operator: { __typename?: 'Operator', id: string, metadataJsonString: string } }> }, operator: { __typename?: 'Operator', id: string, metadataJsonString: string } }>, delegations: Array<{ __typename?: 'Delegation', operatorTokenBalanceWei: any, latestDelegationTimestamp: number, earliestUndelegationTimestamp: number, id: string, delegator: { __typename?: 'Delegator', id: string } }>, slashingEvents: Array<{ __typename?: 'SlashingEvent', amount: any, date: any, sponsorship: { __typename?: 'Sponsorship', id: string, stream?: { __typename?: 'Stream', id: string } | null } }>, queueEntries: Array<{ __typename?: 'QueueEntry', amount: any, date: any, id: string, delegator: { __typename?: 'Delegator', id: string } }> }> };

export type SponsorshipFieldsFragment = { __typename?: 'Sponsorship', id: string, metadata?: string | null, isRunning: boolean, totalPayoutWeiPerSec: any, operatorCount: number, minOperators?: number | null, maxOperators?: number | null, totalStakedWei: any, remainingWei: any, remainingWeiUpdateTimestamp?: any | null, projectedInsolvency?: any | null, cumulativeSponsoring: any, minimumStakingPeriodSeconds: any, creator: string, spotAPY: any, stream?: { __typename?: 'Stream', id: string, metadata: string } | null, stakes: Array<{ __typename?: 'Stake', amountWei: any, earningsWei: any, lockedWei: any, joinTimestamp: number, operator: { __typename?: 'Operator', id: string, metadataJsonString: string } }> };

export type GetAllSponsorshipsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  searchQuery: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  orderBy?: InputMaybe<Sponsorship_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  whereFilters?: InputMaybe<Sponsorship_Filter>;
}>;


export type GetAllSponsorshipsQuery = { __typename?: 'Query', sponsorships: Array<{ __typename?: 'Sponsorship', id: string, metadata?: string | null, isRunning: boolean, totalPayoutWeiPerSec: any, operatorCount: number, minOperators?: number | null, maxOperators?: number | null, totalStakedWei: any, remainingWei: any, remainingWeiUpdateTimestamp?: any | null, projectedInsolvency?: any | null, cumulativeSponsoring: any, minimumStakingPeriodSeconds: any, creator: string, spotAPY: any, stream?: { __typename?: 'Stream', id: string, metadata: string } | null, stakes: Array<{ __typename?: 'Stake', amountWei: any, earningsWei: any, lockedWei: any, joinTimestamp: number, operator: { __typename?: 'Operator', id: string, metadataJsonString: string } }> }> };

export type GetSponsorshipsByCreatorQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  searchQuery: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  creator: Scalars['String']['input'];
  orderBy?: InputMaybe<Sponsorship_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  whereFilters?: InputMaybe<Sponsorship_Filter>;
}>;


export type GetSponsorshipsByCreatorQuery = { __typename?: 'Query', sponsorships: Array<{ __typename?: 'Sponsorship', id: string, metadata?: string | null, isRunning: boolean, totalPayoutWeiPerSec: any, operatorCount: number, minOperators?: number | null, maxOperators?: number | null, totalStakedWei: any, remainingWei: any, remainingWeiUpdateTimestamp?: any | null, projectedInsolvency?: any | null, cumulativeSponsoring: any, minimumStakingPeriodSeconds: any, creator: string, spotAPY: any, stream?: { __typename?: 'Stream', id: string, metadata: string } | null, stakes: Array<{ __typename?: 'Stake', amountWei: any, earningsWei: any, lockedWei: any, joinTimestamp: number, operator: { __typename?: 'Operator', id: string, metadataJsonString: string } }> }> };

export type GetSponsorshipByIdQueryVariables = Exact<{
  sponsorshipId: Scalars['ID']['input'];
  minBlockNumber?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetSponsorshipByIdQuery = { __typename?: 'Query', sponsorship?: { __typename?: 'Sponsorship', id: string, metadata?: string | null, isRunning: boolean, totalPayoutWeiPerSec: any, operatorCount: number, minOperators?: number | null, maxOperators?: number | null, totalStakedWei: any, remainingWei: any, remainingWeiUpdateTimestamp?: any | null, projectedInsolvency?: any | null, cumulativeSponsoring: any, minimumStakingPeriodSeconds: any, creator: string, spotAPY: any, stream?: { __typename?: 'Stream', id: string, metadata: string } | null, stakes: Array<{ __typename?: 'Stake', amountWei: any, earningsWei: any, lockedWei: any, joinTimestamp: number, operator: { __typename?: 'Operator', id: string, metadataJsonString: string } }> } | null };

export type GetSponsorshipByStreamIdQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Sponsorship_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  streamId: Scalars['String']['input'];
  whereFilters?: InputMaybe<Sponsorship_Filter>;
}>;


export type GetSponsorshipByStreamIdQuery = { __typename?: 'Query', sponsorships: Array<{ __typename?: 'Sponsorship', id: string, metadata?: string | null, isRunning: boolean, totalPayoutWeiPerSec: any, operatorCount: number, minOperators?: number | null, maxOperators?: number | null, totalStakedWei: any, remainingWei: any, remainingWeiUpdateTimestamp?: any | null, projectedInsolvency?: any | null, cumulativeSponsoring: any, minimumStakingPeriodSeconds: any, creator: string, spotAPY: any, stream?: { __typename?: 'Stream', id: string, metadata: string } | null, stakes: Array<{ __typename?: 'Stake', amountWei: any, earningsWei: any, lockedWei: any, joinTimestamp: number, operator: { __typename?: 'Operator', id: string, metadataJsonString: string } }> }> };

export type ProjectFieldsFragment = { __typename?: 'Project', id: string, domainIds: Array<any>, score: any, metadata: string, streams: Array<string>, minimumSubscriptionSeconds: any, createdAt?: any | null, updatedAt?: any | null, isDataUnion?: boolean | null, paymentDetails: Array<{ __typename?: 'ProjectPaymentDetails', domainId?: any | null, beneficiary: any, pricingTokenAddress: any, pricePerSecond?: any | null }>, subscriptions: Array<{ __typename?: 'ProjectSubscription', userAddress: any, endTimestamp?: any | null }>, permissions: Array<{ __typename?: 'ProjectPermission', userAddress: any, canBuy?: boolean | null, canDelete?: boolean | null, canEdit?: boolean | null, canGrant?: boolean | null }>, purchases: Array<{ __typename?: 'ProjectPurchase', subscriber: any, subscriptionSeconds: any, price: any, fee: any, purchasedAt?: any | null }> };

export type GetProjectQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  minBlockNumber?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetProjectQuery = { __typename?: 'Query', project?: { __typename?: 'Project', id: string, domainIds: Array<any>, score: any, metadata: string, streams: Array<string>, minimumSubscriptionSeconds: any, createdAt?: any | null, updatedAt?: any | null, isDataUnion?: boolean | null, paymentDetails: Array<{ __typename?: 'ProjectPaymentDetails', domainId?: any | null, beneficiary: any, pricingTokenAddress: any, pricePerSecond?: any | null }>, subscriptions: Array<{ __typename?: 'ProjectSubscription', userAddress: any, endTimestamp?: any | null }>, permissions: Array<{ __typename?: 'ProjectPermission', userAddress: any, canBuy?: boolean | null, canDelete?: boolean | null, canEdit?: boolean | null, canGrant?: boolean | null }>, purchases: Array<{ __typename?: 'ProjectPurchase', subscriber: any, subscriptionSeconds: any, price: any, fee: any, purchasedAt?: any | null }> } | null };

export type GetProjectsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Project_Filter>;
}>;


export type GetProjectsQuery = { __typename?: 'Query', projects: Array<{ __typename?: 'Project', id: string, domainIds: Array<any>, score: any, metadata: string, streams: Array<string>, minimumSubscriptionSeconds: any, createdAt?: any | null, updatedAt?: any | null, isDataUnion?: boolean | null, paymentDetails: Array<{ __typename?: 'ProjectPaymentDetails', domainId?: any | null, beneficiary: any, pricingTokenAddress: any, pricePerSecond?: any | null }>, subscriptions: Array<{ __typename?: 'ProjectSubscription', userAddress: any, endTimestamp?: any | null }>, permissions: Array<{ __typename?: 'ProjectPermission', userAddress: any, canBuy?: boolean | null, canDelete?: boolean | null, canEdit?: boolean | null, canGrant?: boolean | null }>, purchases: Array<{ __typename?: 'ProjectPurchase', subscriber: any, subscriptionSeconds: any, price: any, fee: any, purchasedAt?: any | null }> }> };

export type GetProjectsByTextQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  text: Scalars['String']['input'];
  where?: InputMaybe<Project_Filter>;
}>;


export type GetProjectsByTextQuery = { __typename?: 'Query', projectSearch: Array<{ __typename?: 'Project', id: string, domainIds: Array<any>, score: any, metadata: string, streams: Array<string>, minimumSubscriptionSeconds: any, createdAt?: any | null, updatedAt?: any | null, isDataUnion?: boolean | null, paymentDetails: Array<{ __typename?: 'ProjectPaymentDetails', domainId?: any | null, beneficiary: any, pricingTokenAddress: any, pricePerSecond?: any | null }>, subscriptions: Array<{ __typename?: 'ProjectSubscription', userAddress: any, endTimestamp?: any | null }>, permissions: Array<{ __typename?: 'ProjectPermission', userAddress: any, canBuy?: boolean | null, canDelete?: boolean | null, canEdit?: boolean | null, canGrant?: boolean | null }>, purchases: Array<{ __typename?: 'ProjectPurchase', subscriber: any, subscriptionSeconds: any, price: any, fee: any, purchasedAt?: any | null }> }> };

export type GetProjectSubscriptionsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetProjectSubscriptionsQuery = { __typename?: 'Query', project?: { __typename?: 'Project', subscriptions: Array<{ __typename?: 'ProjectSubscription', userAddress: any, endTimestamp?: any | null }> } | null };

export type StreamFieldsFragment = { __typename?: 'Stream', id: string, metadata: string, permissions?: Array<{ __typename?: 'StreamPermission', id: string, canGrant?: boolean | null, canEdit?: boolean | null, canDelete?: boolean | null, userId: any, subscribeExpiration?: any | null, publishExpiration?: any | null }> | null };

export type GetStreamByIdQueryVariables = Exact<{
  streamId: Scalars['ID']['input'];
}>;


export type GetStreamByIdQuery = { __typename?: 'Query', stream?: { __typename?: 'Stream', id: string, metadata: string, permissions?: Array<{ __typename?: 'StreamPermission', id: string, canGrant?: boolean | null, canEdit?: boolean | null, canDelete?: boolean | null, userId: any, subscribeExpiration?: any | null, publishExpiration?: any | null }> | null } | null };

export type GetPagedStreamsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Stream_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Stream_Filter>;
}>;


export type GetPagedStreamsQuery = { __typename?: 'Query', streams: Array<{ __typename?: 'Stream', id: string, metadata: string, permissions?: Array<{ __typename?: 'StreamPermission', id: string, canGrant?: boolean | null, canEdit?: boolean | null, canDelete?: boolean | null, userId: any, subscribeExpiration?: any | null, publishExpiration?: any | null }> | null }> };

export type SponsorshipDailyBucketFieldsFragment = { __typename?: 'SponsorshipDailyBucket', id: string, operatorCount: number, projectedInsolvency?: any | null, spotAPY: any, totalStakedWei: any, remainingWei: any, date: any, sponsorship: { __typename?: 'Sponsorship', id: string } };

export type GetSponsorshipDailyBucketsQueryVariables = Exact<{
  where: SponsorshipDailyBucket_Filter;
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetSponsorshipDailyBucketsQuery = { __typename?: 'Query', sponsorshipDailyBuckets: Array<{ __typename?: 'SponsorshipDailyBucket', id: string, operatorCount: number, projectedInsolvency?: any | null, spotAPY: any, totalStakedWei: any, remainingWei: any, date: any, sponsorship: { __typename?: 'Sponsorship', id: string } }> };

export type SponsoringEventFieldsFragment = { __typename?: 'SponsoringEvent', id: string, amount: any, date: any, sponsor: string };

export type GetSponsoringEventsQueryVariables = Exact<{
  sponsorshipId: Scalars['ID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetSponsoringEventsQuery = { __typename?: 'Query', sponsoringEvents: Array<{ __typename?: 'SponsoringEvent', id: string, amount: any, date: any, sponsor: string }> };

export type OperatorDailyBucketFieldsFragment = { __typename?: 'OperatorDailyBucket', date: any, id: string, dataTokenBalanceWei: any, delegatorCountChange: number, delegatorCountAtStart: number, lossesWei: any, operatorsCutWei: any, valueWithoutEarnings: any, profitsWei: any, cumulativeEarningsWei: any, totalDelegatedWei: any, totalUndelegatedWei: any, totalStakeInSponsorshipsWei: any };

export type GetOperatorDailyBucketsQueryVariables = Exact<{
  where: OperatorDailyBucket_Filter;
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetOperatorDailyBucketsQuery = { __typename?: 'Query', operatorDailyBuckets: Array<{ __typename?: 'OperatorDailyBucket', date: any, id: string, dataTokenBalanceWei: any, delegatorCountChange: number, delegatorCountAtStart: number, lossesWei: any, operatorsCutWei: any, valueWithoutEarnings: any, profitsWei: any, cumulativeEarningsWei: any, totalDelegatedWei: any, totalUndelegatedWei: any, totalStakeInSponsorshipsWei: any }> };

export type DelegatorDailyBucketFieldsFragment = { __typename?: 'DelegatorDailyBucket', id: string, totalValueDataWei: any, date: any, cumulativeEarningsWei: any, operatorCount: number };

export type GetDelegatorDailyBucketsQueryVariables = Exact<{
  where: DelegatorDailyBucket_Filter;
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetDelegatorDailyBucketsQuery = { __typename?: 'Query', delegatorDailyBuckets: Array<{ __typename?: 'DelegatorDailyBucket', id: string, totalValueDataWei: any, date: any, cumulativeEarningsWei: any, operatorCount: number }> };

export type GetMetadataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMetadataQuery = { __typename?: 'Query', _meta?: { __typename?: '_Meta_', block: { __typename?: '_Block_', hash?: any | null, number: number, timestamp?: number | null } } | null };

export type GetNetworkStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNetworkStatsQuery = { __typename?: 'Query', networks: Array<{ __typename?: 'Network', totalStake: any, operatorsCount: number, sponsorshipsCount: number }> };

export const StakeFieldsFragmentDoc = gql`
    fragment StakeFields on Stake {
  operator {
    id
    metadataJsonString
  }
  amountWei
  earningsWei
  lockedWei
  joinTimestamp
}
    `;
export const SponsorshipFieldsFragmentDoc = gql`
    fragment SponsorshipFields on Sponsorship {
  id
  stream {
    id
    metadata
  }
  metadata
  isRunning
  totalPayoutWeiPerSec
  stakes(first: 1000, orderBy: amountWei, orderDirection: desc) {
    ...StakeFields
  }
  operatorCount
  minOperators
  maxOperators
  totalStakedWei
  remainingWei
  remainingWeiUpdateTimestamp
  projectedInsolvency
  cumulativeSponsoring
  minimumStakingPeriodSeconds
  creator
  spotAPY
}
    ${StakeFieldsFragmentDoc}`;
export const OperatorFieldsFragmentDoc = gql`
    fragment OperatorFields on Operator {
  id
  stakes(first: 1000) {
    ...StakeFields
    sponsorship {
      ...SponsorshipFields
    }
  }
  delegations(first: 1000) {
    delegator {
      id
    }
    operatorTokenBalanceWei
    latestDelegationTimestamp
    earliestUndelegationTimestamp
    id
  }
  slashingEvents(first: 1000) {
    amount
    date
    sponsorship {
      id
      stream {
        id
      }
    }
  }
  queueEntries(first: 1000) {
    amount
    date
    delegator {
      id
    }
    id
  }
  delegatorCount
  valueWithoutEarnings
  totalStakeInSponsorshipsWei
  dataTokenBalanceWei
  operatorTokenTotalSupplyWei
  metadataJsonString
  owner
  nodes
  cumulativeProfitsWei
  cumulativeOperatorsCutWei
  operatorsCutFraction
  contractVersion
  exchangeRate
  controllers
}
    ${StakeFieldsFragmentDoc}
${SponsorshipFieldsFragmentDoc}`;
export const ProjectFieldsFragmentDoc = gql`
    fragment ProjectFields on Project {
  id
  domainIds
  score
  metadata
  streams
  minimumSubscriptionSeconds
  createdAt
  updatedAt
  isDataUnion
  paymentDetails {
    domainId
    beneficiary
    pricingTokenAddress
    pricePerSecond
  }
  subscriptions {
    userAddress
    endTimestamp
  }
  permissions {
    userAddress
    canBuy
    canDelete
    canEdit
    canGrant
  }
  purchases {
    subscriber
    subscriptionSeconds
    price
    fee
    purchasedAt
  }
}
    `;
export const StreamFieldsFragmentDoc = gql`
    fragment StreamFields on Stream {
  id
  metadata
  permissions {
    id
    canGrant
    canEdit
    canDelete
    userId
    subscribeExpiration
    publishExpiration
  }
}
    `;
export const SponsorshipDailyBucketFieldsFragmentDoc = gql`
    fragment SponsorshipDailyBucketFields on SponsorshipDailyBucket {
  id
  operatorCount
  projectedInsolvency
  spotAPY
  totalStakedWei
  remainingWei
  date
  sponsorship {
    id
  }
}
    `;
export const SponsoringEventFieldsFragmentDoc = gql`
    fragment SponsoringEventFields on SponsoringEvent {
  id
  amount
  date
  sponsor
}
    `;
export const OperatorDailyBucketFieldsFragmentDoc = gql`
    fragment OperatorDailyBucketFields on OperatorDailyBucket {
  date
  id
  dataTokenBalanceWei
  delegatorCountChange
  delegatorCountAtStart
  lossesWei
  operatorsCutWei
  valueWithoutEarnings
  profitsWei
  cumulativeEarningsWei
  totalDelegatedWei
  totalUndelegatedWei
  totalStakeInSponsorshipsWei
}
    `;
export const DelegatorDailyBucketFieldsFragmentDoc = gql`
    fragment DelegatorDailyBucketFields on DelegatorDailyBucket {
  id
  totalValueDataWei
  date
  cumulativeEarningsWei
  operatorCount
}
    `;
export const GetAllOperatorsDocument = gql`
    query getAllOperators($first: Int, $skip: Int, $searchQuery: ID, $orderBy: Operator_orderBy, $orderDirection: OrderDirection) {
  operators(
    first: $first
    skip: $skip
    orderBy: $orderBy
    orderDirection: $orderDirection
  ) {
    ...OperatorFields
  }
}
    ${OperatorFieldsFragmentDoc}`;
export type GetAllOperatorsQueryResult = Apollo.QueryResult<GetAllOperatorsQuery, GetAllOperatorsQueryVariables>;
export const SearchOperatorsByMetadataDocument = gql`
    query searchOperatorsByMetadata($first: Int, $skip: Int, $searchQuery: String, $id: ID!, $orderBy: Operator_orderBy, $orderDirection: OrderDirection) {
  operators(
    first: $first
    skip: $skip
    where: {or: [{id: $id}, {metadataJsonString_contains_nocase: $searchQuery}, {stakes_: {sponsorship_contains_nocase: $searchQuery}}]}
    orderBy: $orderBy
    orderDirection: $orderDirection
  ) {
    ...OperatorFields
  }
}
    ${OperatorFieldsFragmentDoc}`;
export type SearchOperatorsByMetadataQueryResult = Apollo.QueryResult<SearchOperatorsByMetadataQuery, SearchOperatorsByMetadataQueryVariables>;
export const GetOperatorByIdDocument = gql`
    query getOperatorById($operatorId: ID!, $minBlockNumber: Int = 0) {
  operator(id: $operatorId, block: {number_gte: $minBlockNumber}) {
    ...OperatorFields
  }
}
    ${OperatorFieldsFragmentDoc}`;
export type GetOperatorByIdQueryResult = Apollo.QueryResult<GetOperatorByIdQuery, GetOperatorByIdQueryVariables>;
export const GetOperatorsByDelegationDocument = gql`
    query getOperatorsByDelegation($first: Int, $skip: Int, $delegator: String!, $orderBy: Operator_orderBy, $orderDirection: OrderDirection) {
  operators(
    first: $first
    skip: $skip
    where: {delegations_: {delegator: $delegator}}
    orderBy: $orderBy
    orderDirection: $orderDirection
  ) {
    ...OperatorFields
  }
}
    ${OperatorFieldsFragmentDoc}`;
export type GetOperatorsByDelegationQueryResult = Apollo.QueryResult<GetOperatorsByDelegationQuery, GetOperatorsByDelegationQueryVariables>;
export const GetOperatorsByDelegationAndIdDocument = gql`
    query getOperatorsByDelegationAndId($first: Int, $skip: Int, $delegator: String!, $operatorId: ID!, $orderBy: Operator_orderBy, $orderDirection: OrderDirection) {
  operators(
    first: $first
    skip: $skip
    where: {delegations_: {delegator: $delegator}, id: $operatorId}
    orderBy: $orderBy
    orderDirection: $orderDirection
  ) {
    ...OperatorFields
  }
}
    ${OperatorFieldsFragmentDoc}`;
export type GetOperatorsByDelegationAndIdQueryResult = Apollo.QueryResult<GetOperatorsByDelegationAndIdQuery, GetOperatorsByDelegationAndIdQueryVariables>;
export const GetOperatorsByDelegationAndMetadataDocument = gql`
    query getOperatorsByDelegationAndMetadata($first: Int, $skip: Int, $delegator: String!, $searchQuery: String!, $orderBy: Operator_orderBy, $orderDirection: OrderDirection) {
  operators(
    first: $first
    skip: $skip
    where: {delegations_: {delegator: $delegator}, metadataJsonString_contains_nocase: $searchQuery}
    orderBy: $orderBy
    orderDirection: $orderDirection
  ) {
    ...OperatorFields
  }
}
    ${OperatorFieldsFragmentDoc}`;
export type GetOperatorsByDelegationAndMetadataQueryResult = Apollo.QueryResult<GetOperatorsByDelegationAndMetadataQuery, GetOperatorsByDelegationAndMetadataQueryVariables>;
export const GetOperatorByOwnerAddressDocument = gql`
    query getOperatorByOwnerAddress($owner: String!, $minBlockNumber: Int = 0) {
  operators(
    first: 1
    block: {number_gte: $minBlockNumber}
    where: {owner: $owner}
  ) {
    ...OperatorFields
  }
}
    ${OperatorFieldsFragmentDoc}`;
export type GetOperatorByOwnerAddressQueryResult = Apollo.QueryResult<GetOperatorByOwnerAddressQuery, GetOperatorByOwnerAddressQueryVariables>;
export const GetOperatorsByOwnerOrControllerAddressDocument = gql`
    query getOperatorsByOwnerOrControllerAddress($owner: String!, $minBlockNumber: Int = 0) {
  operators(
    block: {number_gte: $minBlockNumber}
    where: {or: [{owner: $owner}, {controllers_contains_nocase: [$owner]}]}
  ) {
    ...OperatorFields
  }
}
    ${OperatorFieldsFragmentDoc}`;
export type GetOperatorsByOwnerOrControllerAddressQueryResult = Apollo.QueryResult<GetOperatorsByOwnerOrControllerAddressQuery, GetOperatorsByOwnerOrControllerAddressQueryVariables>;
export const GetAllSponsorshipsDocument = gql`
    query getAllSponsorships($first: Int, $skip: Int, $searchQuery: String!, $id: ID!, $orderBy: Sponsorship_orderBy, $orderDirection: OrderDirection, $whereFilters: Sponsorship_filter) {
  sponsorships(
    first: $first
    skip: $skip
    where: {and: [$whereFilters, {or: [{stream_contains_nocase: $searchQuery}, {id: $id}, {stakes_: {operator_contains_nocase: $searchQuery}}]}]}
    orderBy: $orderBy
    orderDirection: $orderDirection
  ) {
    ...SponsorshipFields
  }
}
    ${SponsorshipFieldsFragmentDoc}`;
export type GetAllSponsorshipsQueryResult = Apollo.QueryResult<GetAllSponsorshipsQuery, GetAllSponsorshipsQueryVariables>;
export const GetSponsorshipsByCreatorDocument = gql`
    query getSponsorshipsByCreator($first: Int, $skip: Int, $searchQuery: String!, $id: ID!, $creator: String!, $orderBy: Sponsorship_orderBy, $orderDirection: OrderDirection, $whereFilters: Sponsorship_filter) {
  sponsorships(
    first: $first
    skip: $skip
    where: {and: [$whereFilters, {creator: $creator}, {or: [{stream_contains_nocase: $searchQuery}, {id: $id}, {stakes_: {operator_contains_nocase: $searchQuery}}]}]}
    orderBy: $orderBy
    orderDirection: $orderDirection
  ) {
    ...SponsorshipFields
  }
}
    ${SponsorshipFieldsFragmentDoc}`;
export type GetSponsorshipsByCreatorQueryResult = Apollo.QueryResult<GetSponsorshipsByCreatorQuery, GetSponsorshipsByCreatorQueryVariables>;
export const GetSponsorshipByIdDocument = gql`
    query getSponsorshipById($sponsorshipId: ID!, $minBlockNumber: Int = 0) {
  sponsorship(id: $sponsorshipId, block: {number_gte: $minBlockNumber}) {
    ...SponsorshipFields
  }
}
    ${SponsorshipFieldsFragmentDoc}`;
export type GetSponsorshipByIdQueryResult = Apollo.QueryResult<GetSponsorshipByIdQuery, GetSponsorshipByIdQueryVariables>;
export const GetSponsorshipByStreamIdDocument = gql`
    query getSponsorshipByStreamId($first: Int, $skip: Int, $orderBy: Sponsorship_orderBy, $orderDirection: OrderDirection, $streamId: String!, $whereFilters: Sponsorship_filter) {
  sponsorships(
    first: $first
    skip: $skip
    where: {and: [$whereFilters, {stream_contains_nocase: $streamId}]}
    orderBy: $orderBy
    orderDirection: $orderDirection
  ) {
    ...SponsorshipFields
  }
}
    ${SponsorshipFieldsFragmentDoc}`;
export type GetSponsorshipByStreamIdQueryResult = Apollo.QueryResult<GetSponsorshipByStreamIdQuery, GetSponsorshipByStreamIdQueryVariables>;
export const GetProjectDocument = gql`
    query getProject($id: ID!, $minBlockNumber: Int = 0) {
  project(id: $id, block: {number_gte: $minBlockNumber}) {
    ...ProjectFields
  }
}
    ${ProjectFieldsFragmentDoc}`;
export type GetProjectQueryResult = Apollo.QueryResult<GetProjectQuery, GetProjectQueryVariables>;
export const GetProjectsDocument = gql`
    query getProjects($first: Int, $skip: Int, $where: Project_filter) {
  projects(
    first: $first
    skip: $skip
    orderBy: score
    orderDirection: desc
    where: $where
  ) {
    ...ProjectFields
  }
}
    ${ProjectFieldsFragmentDoc}`;
export type GetProjectsQueryResult = Apollo.QueryResult<GetProjectsQuery, GetProjectsQueryVariables>;
export const GetProjectsByTextDocument = gql`
    query getProjectsByText($first: Int, $skip: Int, $text: String!, $where: Project_filter) {
  projectSearch(first: $first, skip: $skip, text: $text, where: $where) {
    ...ProjectFields
  }
}
    ${ProjectFieldsFragmentDoc}`;
export type GetProjectsByTextQueryResult = Apollo.QueryResult<GetProjectsByTextQuery, GetProjectsByTextQueryVariables>;
export const GetProjectSubscriptionsDocument = gql`
    query getProjectSubscriptions($id: ID!) {
  project(id: $id) {
    subscriptions {
      userAddress
      endTimestamp
    }
  }
}
    `;
export type GetProjectSubscriptionsQueryResult = Apollo.QueryResult<GetProjectSubscriptionsQuery, GetProjectSubscriptionsQueryVariables>;
export const GetStreamByIdDocument = gql`
    query getStreamById($streamId: ID!) {
  stream(id: $streamId) {
    ...StreamFields
  }
}
    ${StreamFieldsFragmentDoc}`;
export type GetStreamByIdQueryResult = Apollo.QueryResult<GetStreamByIdQuery, GetStreamByIdQueryVariables>;
export const GetPagedStreamsDocument = gql`
    query getPagedStreams($first: Int, $orderBy: Stream_orderBy, $orderDirection: OrderDirection, $where: Stream_filter) {
  streams(
    first: $first
    orderBy: $orderBy
    orderDirection: $orderDirection
    where: $where
  ) {
    ...StreamFields
  }
}
    ${StreamFieldsFragmentDoc}`;
export type GetPagedStreamsQueryResult = Apollo.QueryResult<GetPagedStreamsQuery, GetPagedStreamsQueryVariables>;
export const GetSponsorshipDailyBucketsDocument = gql`
    query getSponsorshipDailyBuckets($where: SponsorshipDailyBucket_filter!, $first: Int, $skip: Int) {
  sponsorshipDailyBuckets(first: $first, skip: $skip, where: $where) {
    ...SponsorshipDailyBucketFields
  }
}
    ${SponsorshipDailyBucketFieldsFragmentDoc}`;
export type GetSponsorshipDailyBucketsQueryResult = Apollo.QueryResult<GetSponsorshipDailyBucketsQuery, GetSponsorshipDailyBucketsQueryVariables>;
export const GetSponsoringEventsDocument = gql`
    query getSponsoringEvents($sponsorshipId: ID!, $first: Int, $skip: Int) {
  sponsoringEvents(
    where: {sponsorship_: {id: $sponsorshipId}}
    first: $first
    skip: $skip
    orderBy: date
    orderDirection: desc
  ) {
    ...SponsoringEventFields
  }
}
    ${SponsoringEventFieldsFragmentDoc}`;
export type GetSponsoringEventsQueryResult = Apollo.QueryResult<GetSponsoringEventsQuery, GetSponsoringEventsQueryVariables>;
export const GetOperatorDailyBucketsDocument = gql`
    query getOperatorDailyBuckets($where: OperatorDailyBucket_filter!, $first: Int, $skip: Int) {
  operatorDailyBuckets(first: $first, skip: $skip, where: $where) {
    ...OperatorDailyBucketFields
  }
}
    ${OperatorDailyBucketFieldsFragmentDoc}`;
export type GetOperatorDailyBucketsQueryResult = Apollo.QueryResult<GetOperatorDailyBucketsQuery, GetOperatorDailyBucketsQueryVariables>;
export const GetDelegatorDailyBucketsDocument = gql`
    query getDelegatorDailyBuckets($where: DelegatorDailyBucket_filter!, $first: Int, $skip: Int) {
  delegatorDailyBuckets(first: $first, skip: $skip, where: $where) {
    ...DelegatorDailyBucketFields
  }
}
    ${DelegatorDailyBucketFieldsFragmentDoc}`;
export type GetDelegatorDailyBucketsQueryResult = Apollo.QueryResult<GetDelegatorDailyBucketsQuery, GetDelegatorDailyBucketsQueryVariables>;
export const GetMetadataDocument = gql`
    query getMetadata {
  _meta {
    block {
      hash
      number
      timestamp
    }
  }
}
    `;
export type GetMetadataQueryResult = Apollo.QueryResult<GetMetadataQuery, GetMetadataQueryVariables>;
export const GetNetworkStatsDocument = gql`
    query getNetworkStats {
  networks(first: 1) {
    totalStake
    operatorsCount
    sponsorshipsCount
  }
}
    `;
export type GetNetworkStatsQueryResult = Apollo.QueryResult<GetNetworkStatsQuery, GetNetworkStatsQueryVariables>;