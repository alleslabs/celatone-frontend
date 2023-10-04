import { Flex } from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import type { AbiFormData, ExposedFunction } from "lib/types";

import { ArgsForm } from "./args-form";
import { TypesForm } from "./types-form";

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
  const { setValue, watch, getValues, reset } = useForm<AbiFormData>({
    defaultValues: initialData,
    mode: "all",
  });
  const { typeArgs, args } = watch();

  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  return (
    <Flex direction="column" gap={4} w="full">
      {Object.keys(typeArgs).length > 0 && (
        <TypesForm
          genericTypeParams={fn.generic_type_params}
          initialData={typeArgs}
          propsOnChange={(value) => {
            setValue("typeArgs", value);
            propsOnChange?.(getValues());
          }}
        />
      )}
      {Object.keys(args).length > 0 && (
        <ArgsForm
          params={fn.params}
          initialData={args}
          propsOnChange={(value) => {
            setValue("args", value);
            propsOnChange?.(getValues());
          }}
          propsOnErrors={propsOnErrors}
        />
      )}
    </Flex>
  );
};
