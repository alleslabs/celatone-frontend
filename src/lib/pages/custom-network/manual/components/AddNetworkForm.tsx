import type {
  Control,
  FieldErrors,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";

import type { AddNetworkManualForm } from "../../types";

import GasFeeDetails from "./GasFeeDetails";
import { NetworkDetails } from "./NetworkDetails";
import { WalletRegistry } from "./WalletRegistry";

interface AddNetworkFormProps {
  currentStepIndex: number;
  control: Control<AddNetworkManualForm>;
  errors: FieldErrors<AddNetworkManualForm>;
  setValue: UseFormSetValue<AddNetworkManualForm>;
  trigger: UseFormTrigger<AddNetworkManualForm>;
}

export const AddNetworkForm = ({
  currentStepIndex,
  control,
  errors,
  setValue,
  trigger,
}: AddNetworkFormProps) => {
  if (currentStepIndex === 0)
    return <NetworkDetails control={control} errors={errors} />;

  if (currentStepIndex === 1)
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
