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
  const { setValue, getValues } = useForm<Record<string, string>>({
    defaultValues: initialData,
    mode: "all",
  });

  const handleOnChange = (index: number) => {
    return (fieldInput: string) => {
      setValue(`${index}`, fieldInput);
      propsOnChange?.(getValues());
    };
  };

  return (
    <Flex direction="column" gap={4}>
      <Heading variant="h6" as="h6" color="text.main">
        type_args
      </Heading>
      {genericTypeParams.map(({ constraints }, index) => (
        <TypeFieldInput
          key={constraints.join() + index.toString()}
          index={index}
          constraints={constraints}
          value={initialData[index]}
          onChange={handleOnChange(index)}
        />
      ))}
    </Flex>
  );
};
