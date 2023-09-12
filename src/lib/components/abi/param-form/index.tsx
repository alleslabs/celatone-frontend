import { Flex, Heading } from "@chakra-ui/react";
import { useEffect } from "react";
import type { FormState } from "react-hook-form";
import { useForm } from "react-hook-form";

import { ParamField } from "./ParamField";

interface ParamFormProps {
  title?: string;
  params: string[];
  initialData: Record<string, string>;
  propsOnChange?: (data: Record<string, string>) => void;
  propsOnErrors?: (errors: [string, string][]) => void;
  isReadOnly?: boolean;
}

const formatErrors = (
  errors: FormState<Record<string, string>>["errors"]
): [string, string][] =>
  Object.entries(errors).map(([field, error]) => [
    field,
    error?.message ?? "invalid input",
  ]);

export const ParamForm = ({
  title = "args",
  params,
  initialData,
  propsOnChange,
  propsOnErrors,
  isReadOnly = false,
}: ParamFormProps) => {
  const {
    trigger,
    control,
    getValues,
    formState: { errors },
  } = useForm<Record<string, string>>({
    defaultValues: initialData,
    mode: "all",
  });

  useEffect(() => {
    trigger();
  }, [trigger]);

  return (
    <Flex direction="column" gap={4}>
      <Heading variant="h6" as="h6" color="text.main">
        {title}
      </Heading>
      {params.map((param, index) => {
        control.register(`${index}`, {
          onChange: () => {
            propsOnChange?.(getValues());
            propsOnErrors?.(formatErrors(errors));
          },
        });
        return (
          <ParamField
            key={param + index.toString()}
            index={index}
            param={param}
            control={control}
            error={errors[`${index}`]?.message}
            isReadOnly={isReadOnly}
          />
        );
      })}
    </Flex>
  );
};
