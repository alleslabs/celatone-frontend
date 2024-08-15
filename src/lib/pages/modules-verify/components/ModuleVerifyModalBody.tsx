import type { Control } from "react-hook-form";

import type { ModuleVerifyForm } from "../types";

import { ModuleVerifyFailedModal } from "./ModuleVerifyFailedModal";
import { ModuleVerifyLoadingModal } from "./ModuleVerifyLoadingModal";
import { ModuleVerifySuccessModal } from "./ModuleVerifySuccessModal";

interface ModuleVerifyModalBodyProps {
  isError: boolean;
  isLoading: boolean;
  onClose: () => void;
  control: Control<ModuleVerifyForm>;
}

export const ModuleVerifyModalBody = ({
  isError,
  isLoading,
  onClose,
  control,
}: ModuleVerifyModalBodyProps) => {
  if (isLoading) return <ModuleVerifyLoadingModal />;
  if (isError) return <ModuleVerifyFailedModal onClose={onClose} />;

  return <ModuleVerifySuccessModal onClose={onClose} control={control} />;
};
