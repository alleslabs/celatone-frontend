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
    <>
      {genericTypeParams.map(({ constraints }, index) => (
        <TypeFieldInput
          key={constraints.join() + index.toString()}
          index={index}
          constraints={constraints}
          value={initialData[index]}
          onChange={handleOnChange(index)}
        />
      ))}
    </>
  );
};
