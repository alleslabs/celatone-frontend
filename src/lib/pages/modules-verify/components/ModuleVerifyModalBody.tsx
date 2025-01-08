import { useEffect, useState } from "react";
import type { Control } from "react-hook-form";

import type { ModuleVerifyForm } from "../types";

import { ModuleVerifyFailedModal } from "./ModuleVerifyFailedModal";
import { ModuleVerifyLoadingModal } from "./ModuleVerifyLoadingModal";
import { ModuleVerifySuccessModal } from "./ModuleVerifySuccessModal";

interface ModuleVerifyModalBodyProps {
  control: Control<ModuleVerifyForm>;
  isError: boolean;
  isLoading: boolean;
  onClose: () => void;
}

export const ModuleVerifyModalBody = ({
  control,
  isError,
  isLoading,
  onClose,
}: ModuleVerifyModalBodyProps) => {
  const [fakeLoading, setFakeLoading] = useState(false);

  useEffect(() => {
    setFakeLoading(true);

    const timeoutId = setTimeout(() => {
      setFakeLoading((newFakeLoading) => !newFakeLoading);
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  if (isError) return <ModuleVerifyFailedModal onClose={onClose} />;

  return isLoading || fakeLoading ? (
    <ModuleVerifyLoadingModal />
  ) : (
    <ModuleVerifySuccessModal control={control} onClose={onClose} />
  );
};
