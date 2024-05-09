export enum ValidatorOrder {
  Moniker = "moniker",
  VotingPower = "voting_power",
  Uptime = "uptime",
  Commission = "commission",
}

export interface ValidatorCounts {
  activeCount: number;
  inactiveCount: number;
}
