export enum ValidatorOrder {
  Commission = "commission",
  Moniker = "moniker",
  Uptime = "uptime",
  VotingPower = "voting_power",
}

export interface ValidatorCounts {
  activeCount: number;
  inactiveCount: number;
}
