import type { JsonFragmentType } from "ethers";
import type { JsonDataType } from "lib/types";

import { cloneDeep } from "lodash";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { FormFields } from "./fields";
import { getComponentsDefaultValues } from "./utils";

interface EvmAbiFormProps {
  types: ReadonlyArray<JsonFragmentType>;
  isPayable?: boolean;
  initialData?: JsonDataType[];
  propsOnChangeInputs?: (data: JsonDataType[]) => void;
  propsOnChangeValue?: (value: string) => void;
  isDisabled?: boolean;
}

export const EvmAbiForm = ({
  initialData,
  isDisabled,
  isPayable = false,
  propsOnChangeInputs,
  propsOnChangeValue,
  types,
}: EvmAbiFormProps) => {
  const defaultValues = useMemo(
    () => initialData ?? getComponentsDefaultValues(types),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(initialData), types]
  );

  const { control, reset, watch } = useForm<{
    inputs: JsonDataType[];
    value: string;
  }>({
    defaultValues: { inputs: defaultValues, value: "" },
    mode: "all",
  });
  const { inputs, value } = watch();

  useEffect(() => {
    reset({ inputs: defaultValues, value: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(defaultValues), reset]);

  useEffect(() => {
    propsOnChangeInputs?.(cloneDeep(inputs));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(inputs), propsOnChangeInputs]);

  useEffect(() => {
    propsOnChangeValue?.(value);
  }, [value, propsOnChangeValue]);

  return (
    <FormFields
      components={types}
      control={control}
      isDisabled={isDisabled}
      isPayable={isPayable}
    />
  );
};
