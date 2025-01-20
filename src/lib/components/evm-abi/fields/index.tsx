import { Control, FieldValues, Path } from "react-hook-form";
import { TupleField } from "./TupleField";
import { JsonFragmentType } from "ethers";
import { BaseField } from "./BaseField";
import { TypeLabel } from "./TypeLabel";
import { useEvmParams } from "lib/services/evm";
import { useAssetInfos } from "lib/services/assetService";
import { getTokenLabel } from "lib/utils";

interface FormFieldsProps<T extends FieldValues> {
  control: Control<T>;
  components: ReadonlyArray<JsonFragmentType>;
  isPayable: boolean;
}

export const FormFields = <T extends FieldValues>({
  control,
  components,
  isPayable,
}: FormFieldsProps<T>) => {
  const { data: evmParamsData } = useEvmParams();
  const { data: assetInfos } = useAssetInfos({
    withPrices: true,
  });

  const feeDenom = evmParamsData?.params.feeDenom;
  const feeLabel = feeDenom
    ? getTokenLabel(feeDenom, assetInfos?.[feeDenom].symbol)
    : undefined;

  return (
    <>
      <TupleField
        control={control}
        name={"inputs" as Path<T>}
        components={components}
        withoutBorder
      />
      {isPayable && (
        <TypeLabel
          label={`Send native${feeLabel ? ` ${feeLabel}` : ""}`}
          type="uint256"
        >
          <BaseField
            control={control}
            name={"payableAmount" as Path<T>}
            type="uint256"
          />
        </TypeLabel>
      )}
    </>
  );
};
