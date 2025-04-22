import type { JsonFragmentType } from "ethers";
import type { Control, FieldValues, Path } from "react-hook-form";

import { Text } from "@chakra-ui/react";
import { useAssetInfos } from "lib/services/assetService";
import { useEvmParams } from "lib/services/evm";
import { getTokenLabel } from "lib/utils";

import { BaseField } from "./BaseField";
import { TupleField } from "./TupleField";
import { TypeLabel } from "./TypeLabel";

interface FormFieldsProps<T extends FieldValues> {
  components: ReadonlyArray<JsonFragmentType>;
  control: Control<T>;
  isDisabled?: boolean;
  isPayable: boolean;
}

export const FormFields = <T extends FieldValues>({
  components,
  control,
  isDisabled,
  isPayable,
}: FormFieldsProps<T>) => {
  const { data: evmParamsData } = useEvmParams();
  const { data: assetInfos } = useAssetInfos({
    withPrices: true,
  });

  const feeDenom = evmParamsData?.params.feeDenom;
  const feeLabel = feeDenom
    ? getTokenLabel(feeDenom, assetInfos?.[feeDenom]?.symbol)
    : undefined;

  return (
    <>
      {components.length > 0 ? (
        <TupleField
          components={components}
          control={control}
          isDisabled={isDisabled}
          name={"inputs" as Path<T>}
          withoutBorder
        />
      ) : (
        <Text
          bgColor="gray.800"
          borderRadius="4px"
          fontWeight={500}
          py={4}
          textAlign="center"
          textColor="text.disabled"
          variant="body2"
          w="full"
        >
          Empty {isDisabled ? "Output" : "Input"}
        </Text>
      )}
      {isPayable && (
        <TypeLabel
          label={`Send native${feeLabel ? ` ${feeLabel}` : ""}`}
          type="uint256"
        >
          <BaseField
            control={control}
            name={"value" as Path<T>}
            type="uint256"
          />
        </TypeLabel>
      )}
    </>
  );
};
