import type { EvmVerifyInfo, Option } from "lib/types";

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
      state: ProcessStepState.COMPLETED,
      timestamp: date,
    };

  if (errorMsg)
    return {
      errorMsg,
      state: ProcessStepState.FAILED,
    };

  return {
    state: ProcessStepState.IN_PROGRESS,
  };
};

export const getProcessSteps = (
  evmVerifyInfo: EvmVerifyInfo
): ProcessStep[] => {
  const step1 = {
    label: "Submitted source code",
    ...getProcessStep(
      evmVerifyInfo.submittedTimestamp,
      evmVerifyInfo.error?.message
    ),
  };
  const step2 = {
    label: "Verifying",
    ...getProcessStep(
      evmVerifyInfo.verifiedTimestamp,
      evmVerifyInfo.error?.message,
      step1.state
    ),
  };
  const step3 = {
    label: "Verification completed",
    state:
      step2.state === ProcessStepState.COMPLETED
        ? ProcessStepState.COMPLETED
        : ProcessStepState.PENDING,
  };

  return [step1, step2, step3];
};
