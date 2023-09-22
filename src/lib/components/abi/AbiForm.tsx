import { Flex, Heading } from "@chakra-ui/react";
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
  const { setValue, watch, getValues } = useForm<AbiFormData>({
    defaultValues: initialData,
    mode: "all",
  });
  const { typeArgs, args } = watch();

  return (
    <Flex direction="column" gap={4}>
      {Object.keys(typeArgs).length > 0 && (
        <Flex direction="column" gap={4}>
          <Heading variant="h6" as="h6" color="text.main">
            type_args
          </Heading>
          <TypesForm
            genericTypeParams={fn.generic_type_params}
            initialData={typeArgs}
            propsOnChange={(value) => {
              setValue("typeArgs", value);
              propsOnChange?.(getValues());
            }}
          />
        </Flex>
      )}
      {Object.keys(args).length > 0 && (
        <Flex direction="column" gap={4}>
          <Heading variant="h6" as="h6" color="text.main">
            args
          </Heading>
          <ArgsForm
            params={fn.params}
            initialData={args}
            propsOnChange={(value) => {
              setValue("args", value);
              propsOnChange?.(getValues());
            }}
            propsOnErrors={propsOnErrors}
          />
        </Flex>
      )}
    </Flex>
  );
};
