import { CURR_THEME } from "env";

export const colors = {
  ...CURR_THEME.colors,
  overlay: {
    transaction: "rgba(217, 217, 217, 0.16)",
    block: "rgba(32, 135, 255, 0.16)",
    validator: "rgba(255, 157, 189, 0.16)",
    proposal: "rgba(74, 194, 255, 0.16)",
    code: "rgba(161, 255, 88, 0.16)",
    contract: "rgba(124, 118, 255, 0.16)",
    module: "rgba(124, 118, 255, 0.16)",
    account: "rgba(105, 255, 255, 0.16)",
    pool: "rgba(255, 159, 129, 0.16)",
    nft: "rgba(255, 233, 119, 0.16)",
  },
};
