import { Flex } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import type { ExposedFunction } from "lib/types";

import { ParamForm } from "./param-form";
import { TypeForm } from "./type-form";

export interface AbiFormData {
  typeArgs: Record<string, string>;
  args: Record<string, string>;
}

interface AbiFormProps {
  fn: ExposedFunction;
  initialData: AbiFormData;
  propsOnChange?: (data: AbiFormData) => void;
  propsOnErrors?: (errors: [string, string][]) => void;
}

export const AbiForm = ({
  fn,
  initialData,
  propsOnChange,
  propsOnErrors,
}: AbiFormProps) => {
  const { setValue, watch, getValues } = useForm<AbiFormData>({
    defaultValues: initialData,
    mode: "all",
  });
  const { typeArgs, args } = watch();

  return (
    <Flex direction="column" gap={4}>
      {Object.keys(typeArgs).length > 0 && (
        <TypeForm
          genericTypeParams={fn.generic_type_params}
          initialData={typeArgs}
          propsOnChange={(value) => {
            setValue("typeArgs", value);
            propsOnChange?.(getValues());
          }}
        />
      )}
      {Object.keys(args).length > 0 && (
        <ParamForm
          params={fn.params}
          initialData={args}
          propsOnChange={(value, errors) => {
            setValue("args", value);
            propsOnChange?.(getValues());
            propsOnErrors?.(errors);
          }}
        />
      )}
    </Flex>
  );
};
