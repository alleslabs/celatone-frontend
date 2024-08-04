import type {
  Control,
  FieldErrors,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";

import type { AddNetworkManualForm } from "../types";

import GasFeeDetails from "./GasFeeDetails";
import { NetworkDetails } from "./NetworkDetails";
import { WalletRegistry } from "./WalletRegistry";

interface AddNetworkFormProps {
  currentStep: number;
  control: Control<AddNetworkManualForm>;
  errors: FieldErrors<AddNetworkManualForm>;
  setValue: UseFormSetValue<AddNetworkManualForm>;
  trigger: UseFormTrigger<AddNetworkManualForm>;
}

export const AddNetworkForm = ({
  currentStep,
  control,
  errors,
  setValue,
  trigger,
}: AddNetworkFormProps) => {
  if (currentStep === 0)
    return <NetworkDetails control={control} errors={errors} />;

  if (currentStep === 1)
    return (
      <GasFeeDetails
        control={control}
        errors={errors}
        setValue={setValue}
        trigger={trigger}
      />
    );

  return <WalletRegistry control={control} errors={errors} />;
};
