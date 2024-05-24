import { Button } from "@chakra-ui/react";
import type { Coin } from "@cosmjs/stargate";
import { useMemo } from "react";
import type { Control, UseFormSetValue } from "react-hook-form";
import { useFieldArray } from "react-hook-form";

import { AssetInput, ControllerInput } from "lib/components/forms";
import { useAssetInfoList } from "lib/services/assetService";

import { ASSETS_SELECT } from "./data";
import type { AttachFundsState } from "./types";

interface SelectFundProps {
  control: Control<AttachFundsState>;
  setValue: UseFormSetValue<AttachFundsState>;
  assetsSelect: Coin[];
  labelBgColor?: string;
}

/**
 * @remarks amount in assetsSelect is an amount before multiplying precision, the multiplication will be done before sending transaction
 */
export const SelectFund = ({
  control,
  setValue,
  assetsSelect,
  labelBgColor,
}: SelectFundProps) => {
  const { data: assetInfos = [] } = useAssetInfoList({ assetType: "native" });
  const { fields, append, remove } = useFieldArray({
    control,
    name: ASSETS_SELECT,
  });

  const selectedAssets = assetsSelect.map((asset) => asset.denom);

  const assetOptions = useMemo(
    () =>
      assetInfos.map((asset) => ({
        label: asset.symbol,
        value: asset.id,
        disabled: selectedAssets.includes(asset.id),
      })),
    [assetInfos, selectedAssets]
  );

  const rules = {
    pattern: {
      value: /^[0-9]+([.][0-9]{0,6})?$/i,
      message: 'Invalid amount. e.g. "100.00"',
    },
  };

  return (
    <>
      {fields.map((field, idx) => (
        <AssetInput
          key={field.id}
          disableDelete={fields.length <= 1}
          onDelete={() => remove(idx)}
          setCurrencyValue={(newVal: string) =>
            setValue(`${ASSETS_SELECT}.${idx}.denom`, newVal)
          }
          assetOptions={assetOptions}
          labelBgColor={labelBgColor}
          amountInput={
            <ControllerInput
              name={`${ASSETS_SELECT}.${idx}.amount`}
              control={control}
              label="Amount"
              variant="fixed-floating"
              type="number"
              rules={rules}
              labelBgColor={labelBgColor}
            />
          }
        />
      ))}
      <Button
        variant="outline-primary"
        mt={8}
        mb={5}
        mx="auto"
        onClick={() => append({ denom: "", amount: "" })}
        isDisabled={assetOptions.length === selectedAssets.length}
      >
        Add More Asset
      </Button>
    </>
  );
};
