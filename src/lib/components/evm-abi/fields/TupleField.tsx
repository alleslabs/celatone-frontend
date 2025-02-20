import { Flex } from "@chakra-ui/react";
import type { JsonFragmentType } from "ethers";
import type { FieldPath, FieldValues } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { getTypeDimensions } from "../utils";
import { FieldTemplate } from "./FieldTemplate";
import { TypeLabel } from "./TypeLabel";
import type { FieldProps } from "./types";

interface TupleFieldProps<T extends FieldValues> extends FieldProps<T> {
  components: ReadonlyArray<JsonFragmentType>;
  withoutBorder?: boolean;
}

export const TupleField = <T extends FieldValues>({
  name,
  control,
  components,
  isDisabled,
  withoutBorder,
}: TupleFieldProps<T>) => {
  const values = useWatch<T>({
    control,
    name,
  });

  return (
    <Flex
      direction="column"
      gap={2}
      w="full"
      {...(!withoutBorder && {
        p: 4,
        border: "1px solid var(--chakra-colors-gray-700)",
        borderRadius: "8px",
      })}
    >
      {(values as unknown[]).map((_, index) => {
        const {
          name: subfieldLabel,
          type: subfieldType,
          ...rest
        } = components[index];

        return (
          <TypeLabel
            key={`${subfieldType}-${index}`}
            label={subfieldLabel}
            type={subfieldType}
            isRequired={!isDisabled}
          >
            <FieldTemplate
              name={`${name}.${index}` as FieldPath<T>}
              control={control}
              type={subfieldType}
              label={subfieldLabel}
              dimensions={getTypeDimensions(subfieldType)}
              isDisabled={isDisabled}
              {...rest}
            />
          </TypeLabel>
        );
      })}
    </Flex>
  );
};
