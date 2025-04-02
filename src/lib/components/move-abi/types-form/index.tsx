import type { AbiFormData, GenericTypeParam } from "lib/types";

import { Flex, Heading } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import { TypeFieldInput } from "./TypeFieldInput";

interface TypesFormProps {
  genericTypeParams: GenericTypeParam[];
  initialData: AbiFormData["typeArgs"];
  propsOnChange?: (data: AbiFormData["typeArgs"]) => void;
}

export const TypesForm = ({
  genericTypeParams,
  initialData,
  propsOnChange,
}: TypesFormProps) => {
  const { control, getValues } = useForm<Record<string, string>>({
    defaultValues: initialData,
    mode: "all",
  });

  return (
    <Flex direction="column" gap={4}>
      <Heading as="h6" color="text.main" variant="h6">
        type_args
      </Heading>
      {genericTypeParams.map(({ constraints }, index) => {
        control.register(`${index}`, {
          onChange: () => {
            propsOnChange?.(getValues());
          },
        });
        return (
          <TypeFieldInput
            key={constraints.join() + index.toString()}
            constraints={constraints}
            control={control}
            index={index}
          />
        );
      })}
    </Flex>
  );
};
