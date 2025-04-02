import type { EvmVerifyInfo } from "lib/types";

import { LabelText } from "lib/components/LabelText";

interface OptimizerProps {
  evmVerifyInfo: EvmVerifyInfo;
}

export const Optimizer = ({ evmVerifyInfo: { optimizer } }: OptimizerProps) => {
  if (typeof optimizer === "string") {
    return <LabelText label="Optimization">{optimizer}</LabelText>;
  }

  return (
    <LabelText label="Optimization Enabled">
      {optimizer
        ? optimizer.enabled
          ? `Yes with ${optimizer.runs} runs`
          : "No"
        : "N/A"}
    </LabelText>
  );
};
