import type { JsonFragmentType } from "ethers";
import type { FieldPath, FieldValues } from "react-hook-form";

import { Flex } from "@chakra-ui/react";
import { useWatch } from "react-hook-form";

import type { FieldProps } from "./types";

import { getTypeDimensions } from "../utils";
import { FieldTemplate } from "./FieldTemplate";
import { TypeLabel } from "./TypeLabel";

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
            isRequired={!isDisabled}
            label={subfieldLabel}
            type={subfieldType}
          >
            <FieldTemplate
              control={control}
              dimensions={getTypeDimensions(subfieldType)}
              isDisabled={isDisabled}
              label={subfieldLabel}
              name={`${name}.${index}` as FieldPath<T>}
              type={subfieldType}
              {...rest}
            />
          </TypeLabel>
        );
      })}
    </Flex>
  );
};
