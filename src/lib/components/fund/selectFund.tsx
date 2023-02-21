import { Box, Button } from "@chakra-ui/react";
import type { Coin } from "@cosmjs/stargate";
import { useMemo } from "react";
import type { Control, UseFormSetValue } from "react-hook-form";
import { useFieldArray } from "react-hook-form";

import { useNativeTokensInfo } from "lib/app-provider";
import { AssetInput, ControllerInput } from "lib/components/forms";
import type { AttachFundsState } from "lib/types";

interface SelectFundProps {
  control: Control<AttachFundsState>;
  setValue: UseFormSetValue<AttachFundsState>;
  assetsSelect: Coin[];
}
export const SelectFund = ({
  control,
  setValue,
  assetsSelect,
}: SelectFundProps) => {
  const nativeTokensInfo = useNativeTokensInfo();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "assetsSelect",
  });

  const selectedAssets = assetsSelect.map((asset) => asset.denom);

  const assetOptions = useMemo(
    () =>
      nativeTokensInfo.map((asset) => ({
        label: asset.symbol,
        value: asset.base,
        disabled: selectedAssets.includes(asset.base),
      })),
    [nativeTokensInfo, selectedAssets]
  );

  const rules = {
    pattern: {
      value: /^[0-9]+([.][0-9]{0,6})?$/i,
      message: 'Invalid amount. e.g. "100.00"',
    },
  };

  return (
    <Box>
      {fields.map((field, idx) => (
        <AssetInput
          key={field.id}
          disableDelete={fields.length <= 1}
          onDelete={() => remove(idx)}
          setCurrencyValue={(newVal: string) =>
            setValue(`assetsSelect.${idx}.denom`, newVal)
          }
          assetOptions={assetOptions}
          initialSelected={field.denom}
          amountInput={
            <ControllerInput
              name={`assetsSelect.${idx}.amount`}
              control={control}
              label="Amount"
              variant="floating"
              type="number"
              rules={rules}
            />
          }
        />
      ))}
      <Button
        variant="outline-primary"
        mt="32px"
        mx="auto"
        onClick={() => append({ denom: "", amount: "" })}
        disabled={assetOptions.length === selectedAssets.length}
      >
        Add More Asset
      </Button>
    </Box>
  );
};
