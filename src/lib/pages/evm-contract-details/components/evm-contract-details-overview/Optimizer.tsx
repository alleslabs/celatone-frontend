import { LabelText } from "lib/components/LabelText";
import type { EvmVerifyInfo } from "lib/types";

interface OptimizerProps {
  evmVerifyInfo: EvmVerifyInfo;
}

export const Optimizer = ({ evmVerifyInfo: { optimizer } }: OptimizerProps) => {
  if (typeof optimizer === "string") {
    return <LabelText label="Optimization">{optimizer}</LabelText>;
  }

  return (
    <LabelText label="Optimization enabled">
      {optimizer
        ? optimizer.enabled
          ? `Yes with ${optimizer.runs} runs`
          : "No"
        : "N/A"}
    </LabelText>
  );
};
