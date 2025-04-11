import type { AbiFormData, Nullable } from "lib/types";
import type { FormState } from "react-hook-form";

import { Flex, Heading, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

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
    clearErrors,
    formState: { errors, isValid },
  } = useForm<Record<string, Nullable<string>>>({
    defaultValues: initialData,
    mode: "all",
    delayError: 500,
  });

  useEffect(() => {
    trigger();
  }, [trigger]);

  useEffect(
    () => {
      const validating: [string, string][] = isValid
        ? []
        : [["form", "not-valid"]];
      propsOnErrors?.([...formatErrors(errors), ...validating]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(errors), isValid]
  );

  return (
    <Flex direction="column" gap={4}>
      <Heading as="h6" color="text.main" variant="h6">
        args
      </Heading>
      {!params.length ? (
        <Flex
          alignItems="center"
          border="1px solid"
          borderColor="gray.700"
          borderRadius="8px"
          direction="column"
          gap={4}
          p="24px 8px"
        >
          <Text color="text.dark" variant="body2">
            This function does not require any inputs.
          </Text>
        </Flex>
      ) : (
        params.map((param, index) => {
          control.register(`${index}`, {
            onChange: () => {
              clearErrors(`${index}`);
              propsOnChange?.(getValues());
            },
          });
          return (
            <ArgFieldTemplate
              key={param + index.toString()}
              control={control}
              index={index}
              param={param}
            />
          );
        })
      )}
    </Flex>
  );
};
