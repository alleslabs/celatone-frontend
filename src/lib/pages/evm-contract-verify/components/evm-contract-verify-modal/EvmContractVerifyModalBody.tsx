import { useEffect, useState } from "react";
import type { Control } from "react-hook-form";

import { EvmContractVerifyFailedModal } from "./EvmContractVerifyFailedModal";
import { EvmContractVerifyLoadingModal } from "./EvmContractVerifyLoadingModal";
import { EvmContractVerifySuccessModal } from "./EvmContractVerifySuccessModal";
import { EvmContractVerifyForm } from "lib/services/types";

interface EvmContractVerifyModalBodyProps {
  isError: boolean;
  isLoading: boolean;
  onClose: () => void;
  control: Control<EvmContractVerifyForm>;
}

export const EvmContractVerifyModalBody = ({
  isError,
  isLoading,
  onClose,
  control,
}: EvmContractVerifyModalBodyProps) => {
  const [fakeLoading, setFakeLoading] = useState(false);

  useEffect(() => {
    setFakeLoading(true);

    const timeoutId = setTimeout(() => {
      setFakeLoading((newFakeLoading) => !newFakeLoading);
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  if (isError) return <EvmContractVerifyFailedModal onClose={onClose} />;

  return isLoading || fakeLoading ? (
    <EvmContractVerifyLoadingModal />
  ) : (
    <EvmContractVerifySuccessModal control={control} />
  );
};
