import type { Control } from "react-hook-form";

import { useEffect, useState } from "react";

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
