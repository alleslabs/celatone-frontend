import { Flex, Heading } from "@chakra-ui/react";
import { useEffect } from "react";
import type { FormState } from "react-hook-form";
import { useForm } from "react-hook-form";

import type { AbiFormData, Option } from "lib/types";

import { ArgFieldTemplate } from "./field";

interface ArgsFormProps {
  params: string[];
  initialData: AbiFormData["args"];
  propsOnChange?: (data: AbiFormData["args"]) => void;
  propsOnErrors?: (errors: [string, string][]) => void;
}

const formatErrors = (
  errors: FormState<Record<string, string>>["errors"]
): [string, string][] =>
  Object.entries(errors).map(([field, error]) => [
    field,
    error?.message ?? "invalid input",
  ]);

export const ArgsForm = ({
  params,
  initialData,
  propsOnChange,
  propsOnErrors,
}: ArgsFormProps) => {
  const {
    trigger,
    control,
    getValues,
    formState: { errors },
  } = useForm<Record<string, Option<string>>>({
    defaultValues: initialData,
    mode: "all",
  });

  useEffect(() => {
    trigger();
  }, [trigger]);

  useEffect(
    () => propsOnErrors?.(formatErrors(errors)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(errors), propsOnErrors]
  );

  return (
    <Flex direction="column" gap={4}>
      <Heading variant="h6" as="h6" color="text.main">
        args
      </Heading>
      {params.map((param, index) => {
        control.register(`${index}`, {
          onChange: () => propsOnChange?.(getValues()),
        });
        return (
          <ArgFieldTemplate
            key={param + index.toString()}
            index={index}
            param={param}
            control={control}
            error={errors[`${index}`]?.message}
          />
        );
      })}
    </Flex>
  );
};
