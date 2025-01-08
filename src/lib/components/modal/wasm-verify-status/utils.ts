import type { Nullable, WasmVerifyInfoBase } from "lib/types";

enum ProcessStepState {
  COMPLETED = "Completed",
  FAILED = "Failed",
  IN_PROGRESS = "In Progress",
  PENDING = "Pending",
}

interface ProcessStep {
  errorMsg?: string;
  label: string;
  state: ProcessStepState;
  timestamp?: Date;
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
  verificationInfo: WasmVerifyInfoBase
): ProcessStep[] => {
  const step1 = {
    label: "Getting Source Code",
    ...getProcessStep(
      verificationInfo.downloadedTimestamp,
      verificationInfo.errorMessage
    ),
  };
  const step2 = {
    label: "Compiling Source Code",
    ...getProcessStep(
      verificationInfo.compiledTimestamp,
      verificationInfo.errorMessage,
      step1.state
    ),
  };
  const step3 = {
    label: "Comparing The Code Hash",
    ...getProcessStep(
      verificationInfo.comparedTimestamp,
      verificationInfo.errorMessage,
      step2.state
    ),
  };
  const step4 = {
    label: "Verification Completed",
    state:
      step3.state === ProcessStepState.COMPLETED
        ? ProcessStepState.COMPLETED
        : ProcessStepState.PENDING,
  };

  return [step1, step2, step3, step4];
};
