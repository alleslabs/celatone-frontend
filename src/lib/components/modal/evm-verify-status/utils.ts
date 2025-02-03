import { EvmVerifyInfo } from "lib/services/types";
import type { Option } from "lib/types";

enum ProcessStepState {
  PENDING = "Pending",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  FAILED = "Failed",
}

interface ProcessStep {
  label: string;
  state: ProcessStepState;
  timestamp?: Date;
  errorMsg?: string;
}

const getProcessStep = (
  date: Option<Date>,
  errorMsg: Option<string>,
  prevStepState?: ProcessStepState
) => {
  if (
    prevStepState === ProcessStepState.FAILED ||
    prevStepState === ProcessStepState.PENDING ||
    prevStepState === ProcessStepState.IN_PROGRESS
  )
    return {
      state: ProcessStepState.PENDING,
    };

  if (date)
    return {
      timestamp: date,
      state: ProcessStepState.COMPLETED,
    };

  if (errorMsg)
    return {
      state: ProcessStepState.FAILED,
      errorMsg,
    };

  return {
    state: ProcessStepState.IN_PROGRESS,
  };
};

export const getProcessSteps = (
  evmVerifyInfo: EvmVerifyInfo
): ProcessStep[] => {
  const step1 = {
    label: "Submitted Source Code",
    ...getProcessStep(
      evmVerifyInfo.submittedTimestamp,
      evmVerifyInfo.errorMessage
    ),
  };
  const step2 = {
    label: "Verifying",
    ...getProcessStep(
      evmVerifyInfo.verifiedTimestamp,
      evmVerifyInfo.errorMessage,
      step1.state
    ),
  };
  const step3 = {
    label: "Verification Completed",
    state:
      step2.state === ProcessStepState.COMPLETED
        ? ProcessStepState.COMPLETED
        : ProcessStepState.PENDING,
  };

  return [step1, step2, step3];
};
