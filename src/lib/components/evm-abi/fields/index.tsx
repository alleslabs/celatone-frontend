import type { Control, FieldValues, Path } from "react-hook-form";
import { TupleField } from "./TupleField";
import type { JsonFragmentType } from "ethers";
import { BaseField } from "./BaseField";
import { TypeLabel } from "./TypeLabel";
import { useEvmParams } from "lib/services/evm";
import { useAssetInfos } from "lib/services/assetService";
import { getTokenLabel } from "lib/utils";
import { Text } from "@chakra-ui/react";

interface FormFieldsProps<T extends FieldValues> {
  control: Control<T>;
  components: ReadonlyArray<JsonFragmentType>;
  isPayable: boolean;
  isDisabled?: boolean;
}

export const FormFields = <T extends FieldValues>({
  control,
  components,
  isPayable,
  isDisabled,
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
          control={control}
          name={"inputs" as Path<T>}
          components={components}
          isDisabled={isDisabled}
          withoutBorder
        />
      ) : (
        <Text
          variant="body2"
          textColor="text.disabled"
          fontWeight={500}
          bgColor="gray.800"
          w="full"
          py={4}
          borderRadius="4px"
          textAlign="center"
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
