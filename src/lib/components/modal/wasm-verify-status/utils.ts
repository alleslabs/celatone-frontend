import type { Nullable, WasmVerifyInfoBase } from "lib/types";

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
  date: Nullable<Date>,
  errorMsg: Nullable<string>,
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
  verificationInfo: WasmVerifyInfoBase
): ProcessStep[] => {
  const step1 = {
    label: "Getting source code",
    ...getProcessStep(
      verificationInfo.downloadedTimestamp,
      verificationInfo.errorMessage
    ),
  };
  const step2 = {
    label: "Compiling source code",
    ...getProcessStep(
      verificationInfo.compiledTimestamp,
      verificationInfo.errorMessage,
      step1.state
    ),
  };
  const step3 = {
    label: "Comparing the code hash",
    ...getProcessStep(
      verificationInfo.comparedTimestamp,
      verificationInfo.errorMessage,
      step2.state
    ),
  };
  const step4 = {
    label: "Verification completed",
    state:
      step3.state === ProcessStepState.COMPLETED
        ? ProcessStepState.COMPLETED
        : ProcessStepState.PENDING,
  };

  return [step1, step2, step3, step4];
};
