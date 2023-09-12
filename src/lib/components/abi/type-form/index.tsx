import { Flex, Heading } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import type { GenericTypeParam } from "lib/types";

import { TypeFieldInput } from "./TypeFieldInput";

interface TypeFormProps {
  genericTypeParams: GenericTypeParam[];
  initialData: Record<string, string>;
  propsOnChange?: (data: Record<string, string>) => void;
}

export const TypeForm = ({
  genericTypeParams,
  initialData,
  propsOnChange,
}: TypeFormProps) => {
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
          value={initialData[index]}
          constraints={constraints}
          onChange={handleOnChange(index)}
        />
      ))}
    </Flex>
  );
};
