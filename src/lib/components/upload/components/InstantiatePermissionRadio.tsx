import { Text, Box, Radio, RadioGroup, Button } from "@chakra-ui/react";
import type { Control, UseFormSetValue } from "react-hook-form";
import { useController, useFieldArray, useWatch } from "react-hook-form";

import { CustomIcon } from "lib/components/icon";
import type { Addr, UploadSectionState } from "lib/types";
import { AccessType } from "lib/types";

import { AddressPermissionInput } from "./AddressPermissionInput";

interface InstantiatePermissionRadioProps {
  control: Control<UploadSectionState>;
  setValue: UseFormSetValue<UploadSectionState>;
}

interface PermissionRadioProps {
  isSelected: boolean;
  value: AccessType;
  text: string;
}

const PermissionRadio = ({ isSelected, value, text }: PermissionRadioProps) => (
  <Radio value={value} py={2} width="100%" size="lg">
    <Text fontWeight={isSelected ? "600" : "400"}>{text} </Text>
  </Radio>
);

export const InstantiatePermissionRadio = ({
  control,
  setValue,
}: InstantiatePermissionRadioProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "addresses",
  });

  const [permission, addresses] = useWatch({
    control,
    name: ["permission", "addresses"],
  });

  const {
    formState: { errors },
  } = useController({
    control,
    name: "addresses",
  });

  return (
    <RadioGroup
      name="instantiatePermission"
      onChange={(nextValue: string) => {
        const value = parseInt(nextValue, 10);
        setValue("permission", value);
      }}
      value={permission}
    >
      <Box>
        <PermissionRadio
          isSelected={permission === AccessType.ACCESS_TYPE_EVERYBODY}
          value={AccessType.ACCESS_TYPE_EVERYBODY}
          text="Anyone can instantiate (Everybody)"
        />
        <PermissionRadio
          isSelected={permission === AccessType.ACCESS_TYPE_NOBODY}
          value={AccessType.ACCESS_TYPE_NOBODY}
          text="Instantiate through governance only (Nobody)"
        />
        <Box>
          <PermissionRadio
            isSelected={permission === AccessType.ACCESS_TYPE_ANY_OF_ADDRESSES}
            value={AccessType.ACCESS_TYPE_ANY_OF_ADDRESSES}
            text="Only a set of addresses can instantiate (AnyOfAddresses)"
          />
          {permission === AccessType.ACCESS_TYPE_ANY_OF_ADDRESSES && (
            <Box>
              {fields.map((_, idx) => (
                <AddressPermissionInput
                  index={idx}
                  control={control}
                  fields={fields}
                  addresses={addresses}
                  remove={remove}
                  name={`addresses.${idx}.address`}
                  setValue={(value: Addr) =>
                    setValue(`addresses.${idx}.address`, value)
                  }
                  error={errors.addresses?.[idx]?.address?.message}
                />
              ))}
              <Button
                variant="outline-primary"
                mt={3}
                mx="auto"
                onClick={() => append({ address: "" as Addr })}
                leftIcon={<CustomIcon name="plus" color="violet.light" />}
              >
                Add More Address
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </RadioGroup>
  );
};
