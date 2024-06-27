import { Button, Text } from "@chakra-ui/react";
import type { Coin } from "@cosmjs/stargate";
import type { BigSource } from "big.js";
import { sortBy } from "lodash";
import { useCallback, useMemo } from "react";
import type { Control, UseFormSetValue } from "react-hook-form";
import { useFieldArray } from "react-hook-form";

import { useCurrentChain } from "lib/app-provider";
import type { AssetOption } from "lib/components/forms";
import { AssetInput, ControllerInput } from "lib/components/forms";
import { useAssetInfoList, useAssetInfos } from "lib/services/assetService";
import { useBalances } from "lib/services/bank";
import type { BechAddr20, Token, U, USD } from "lib/types";
import {
  coinToTokenWithValue,
  formatPrice,
  formatUTokenWithPrecision,
} from "lib/utils";

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
  const { address } = useCurrentChain();
  const { data: balances } = useBalances(address as BechAddr20);
  const { data: assetInfos = [] } = useAssetInfoList({ assetType: "native" });
  const { data: assetInfosWithPrices } = useAssetInfos({ withPrices: true });
  const { fields, append, remove } = useFieldArray({
    control,
    name: ASSETS_SELECT,
  });

  const selectedAssets = assetsSelect.map((asset) => asset.denom);
  const assetInfosMap = assetInfos?.reduce((acc, asset) => {
    acc.set(asset.id, asset);
    return acc;
  }, new Map());
  const balanceMap = balances?.reduce((acc, balance) => {
    acc.set(balance.denom, balance);
    return acc;
  }, new Map());

  const handleGetFormattedBalance = useCallback(
    (balance: Coin, denom: string) => {
      const token = coinToTokenWithValue(
        denom,
        balance?.amount ?? "0",
        assetInfosWithPrices,
        undefined
      );

      const formatted = formatUTokenWithPrecision(
        token.amount as U<Token<BigSource>>,
        token.precision ?? 0,
        true,
        token.amount.toNumber() > 999 ? 6 : undefined
      );

      const price = formatPrice(token.value as USD<BigSource>);

      return { formatted, price };
    },
    [assetInfosWithPrices]
  );

  const assetOptions = useMemo(() => {
    const assetInfosInBalance: AssetOption[] = [];
    const assetInfosNotInBalance: AssetOption[] = [];

    sortBy(assetInfos, ["symbol"]).forEach((asset) => {
      const balance = balanceMap?.get(asset.id) ?? undefined;

      const { formatted, price } = handleGetFormattedBalance(balance, asset.id);

      if (balanceMap?.has(asset.id)) {
        assetInfosInBalance.push({
          label: asset.symbol,
          value: asset.id,
          formatted,
          price,
          logo: asset.logo,
          isDisabled: selectedAssets.includes(asset.id),
        });
      } else {
        assetInfosNotInBalance.push({
          label: asset.symbol,
          value: asset.id,
          logo: asset.logo,
          isDisabled: true,
        });
      }
    });

    return [...assetInfosInBalance, ...assetInfosNotInBalance];
  }, [assetInfos, balanceMap, selectedAssets, handleGetFormattedBalance]);

  const handleControllerInputProps = useCallback(
    (idx: number) => {
      if (!assetsSelect[idx]) return {};

      const { formatted } = handleGetFormattedBalance(
        balanceMap?.get(selectedAssets[idx]),
        selectedAssets[idx]
      );
      const isSelected = balanceMap?.get(selectedAssets[idx]);
      const overBalance = Number(assetsSelect[idx].amount) > Number(formatted);

      return {
        helperAction: !overBalance && isSelected && (
          <Text variant="body3" color="text.dark" w="100%">
            Balance: {formatted}
          </Text>
        ),
        cta: !overBalance &&
          isSelected && {
            label: "MAX",
            onClick: (changeValue: (value: string) => void) => {
              changeValue?.(formatted);
            },
          },
        error:
          isSelected && overBalance
            ? `Not enough ${assetInfosMap.get(selectedAssets[idx])?.symbol} in your wallet`
            : undefined,
      };
    },
    [
      assetsSelect,
      balanceMap,
      selectedAssets,
      assetInfosMap,
      handleGetFormattedBalance,
    ]
  );

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
          initialSelected={field.denom}
          amountInput={
            <ControllerInput
              {...handleControllerInputProps(idx)}
              name={`${ASSETS_SELECT}.${idx}.amount`}
              control={control}
              label="Amount"
              variant="fixed-floating"
              type="number"
              labelBgColor={labelBgColor}
              placeholder="0.00"
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
