import { JsonFragmentType } from "ethers";
import { JsonDataType } from "lib/types";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { FormFields } from "./fields";
import { getComponentsDefaultValues } from "./utils";
import { cloneDeep } from "lodash";

interface EvmAbiFormProps {
  types: ReadonlyArray<JsonFragmentType>;
  isPayable: boolean;
  initialData?: JsonDataType[];
  propsOnChange?: (data: JsonDataType[]) => void;
  isDisabled?: boolean;
}

export const EvmAbiForm = ({
  types,
  isPayable,
  initialData,
  propsOnChange,
  isDisabled,
}: EvmAbiFormProps) => {
  const defaultValues = useMemo(
    () => initialData ?? getComponentsDefaultValues(types),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(initialData)]
  );

  const { control, reset, watch } = useForm<{
    inputs: JsonDataType[];
    payableAmount: string;
  }>({
    defaultValues: { inputs: defaultValues, payableAmount: "" },
    mode: "all",
  });
  const { inputs } = watch();

  useEffect(() => {
    reset({ inputs: defaultValues });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(defaultValues), reset]);

  useEffect(() => {
    propsOnChange?.(cloneDeep(inputs));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(inputs), propsOnChange]);

  return (
    <FormFields
      control={control}
      components={types}
      isPayable={isPayable}
      isDisabled={isDisabled}
    />
  );
};
