import { LabelText } from "lib/components/LabelText";
import { EvmVerifyInfo } from "lib/services/types";

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
