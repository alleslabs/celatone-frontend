import { Flex, Heading } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import type { AbiFormData, GenericTypeParam } from "lib/types";

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
    <Flex gap={4} direction="column">
      <Heading as="h6" variant="h6" color="text.main">
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
            index={index}
            constraints={constraints}
            control={control}
          />
        );
      })}
    </Flex>
  );
};
