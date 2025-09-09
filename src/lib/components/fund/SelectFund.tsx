import type { Coin } from "@cosmjs/stargate";
import type { BigSource } from "big.js";
import type { AssetOption, Token, U, USD } from "lib/types";
import type { Control, UseFormSetValue } from "react-hook-form";

import { Button, Text } from "@chakra-ui/react";
import { useCurrentChain } from "lib/app-provider";
import { AssetInput, ControllerInput } from "lib/components/forms";
import { useAssetInfosByType } from "lib/services/assetService";
import { useBalances } from "lib/services/bank";
import {
  coinToTokenWithValue,
  formatPrice,
  formatUTokenWithPrecision,
  toToken,
} from "lib/utils";
import { sortBy } from "lodash";
import { useCallback, useMemo } from "react";
import { useFieldArray } from "react-hook-form";

import type { AttachFundsState } from "./types";

import { ASSETS_SELECT } from "./data";

interface SelectFundProps {
  assetsSelect: Coin[];
  control: Control<AttachFundsState>;
  labelBgColor?: string;
  setValue: UseFormSetValue<AttachFundsState>;
}

/**
 * @remarks amount in assetsSelect is an amount before multiplying precision, the multiplication will be done before sending transaction
 */
export const SelectFund = ({
  assetsSelect,
  control,
  labelBgColor,
  setValue,
}: SelectFundProps) => {
  const { address } = useCurrentChain();
  const { data: balances } = useBalances(address, !!address);
  const { data: assetInfos } = useAssetInfosByType({
    assetType: "native",
  });
  const { append, fields, remove } = useFieldArray({
    control,
    name: ASSETS_SELECT,
  });

  const selectedAssets = assetsSelect.map((asset) => asset.denom);

  const balanceMap = balances?.reduce((acc, balance) => {
    acc.set(balance.denom, balance);
    return acc;
  }, new Map());

  const handleGetFormattedBalance = useCallback(
    (balance: Coin, denom: string) => {
      const token = coinToTokenWithValue(
        denom,
        balance?.amount ?? "0",
        assetInfos,
        undefined
      );

      const formatted = formatUTokenWithPrecision({
        amount: token.amount as U<Token<BigSource>>,
        decimalPoints: token.amount.toNumber() > 999 ? 6 : undefined,
        isSuffix: true,
        precision: token.precision ?? 0,
      });

      const raw = toToken(token.amount, token.precision ?? 0).toNumber();

      const price = formatPrice(token.value as USD<BigSource>);

      return { formatted, price, raw };
    },
    [assetInfos]
  );

  const assetOptions = useMemo(() => {
    const assetInfosInBalance: AssetOption[] = [];
    const assetInfosNotInBalance: AssetOption[] = [];

    sortBy(assetInfos, ["symbol"]).forEach((asset) => {
      const balance = balanceMap?.get(asset.id) ?? undefined;

      const { formatted, price } = handleGetFormattedBalance(balance, asset.id);

      if (balanceMap?.has(asset.id)) {
        assetInfosInBalance.push({
          isDisabled: selectedAssets.includes(asset.id),
          label: asset.symbol,
          value: {
            formatted,
            id: asset.id,
            logo: asset.logo,
            price,
          },
        });
      } else {
        assetInfosNotInBalance.push({
          isDisabled: true,
          label: asset.symbol,
          value: {
            id: asset.id,
            logo: asset.logo,
          },
        });
      }
    });

    return [...assetInfosInBalance, ...assetInfosNotInBalance];
  }, [assetInfos, balanceMap, selectedAssets, handleGetFormattedBalance]);

  const handleControllerInputProps = useCallback(
    (idx: number) => {
      if (!assetsSelect[idx]) return {};

      const { formatted, raw } = handleGetFormattedBalance(
        balanceMap?.get(selectedAssets[idx]),
        selectedAssets[idx]
      );
      const isSelected = balanceMap?.get(selectedAssets[idx]);
      const overBalance = Number(assetsSelect[idx].amount) > raw;

      return {
        cta: isSelected && {
          label: "MAX",
          onClick: (changeValue: (value: string) => void) => {
            changeValue?.(raw.toString());
          },
        },
        error:
          isSelected && overBalance
            ? `Not enough ${assetInfos?.[selectedAssets[idx]]?.symbol} in your wallet`
            : undefined,
        helperText: isSelected && (
          <Text color="text.dark" variant="body3" w="100%">
            Balance: {formatted}
          </Text>
        ),
      };
    },
    [
      assetInfos,
      assetsSelect,
      balanceMap,
      handleGetFormattedBalance,
      selectedAssets,
    ]
  );

  return (
    <>
      {fields.map((field, idx) => (
        <AssetInput
          key={field.id}
          amountInput={
            <ControllerInput
              {...handleControllerInputProps(idx)}
              control={control}
              label="Amount"
              labelBgColor={labelBgColor}
              name={`${ASSETS_SELECT}.${idx}.amount`}
              placeholder="0.00"
              type="decimal"
              variant="fixed-floating"
            />
          }
          assetOptions={assetOptions}
          disableDelete={fields.length <= 1}
          setCurrencyValue={(newVal: string) =>
            setValue(`${ASSETS_SELECT}.${idx}.denom`, newVal)
          }
          value={assetOptions.find((option) => option.value.id === field.denom)}
          onDelete={() => remove(idx)}
        />
      ))}
      <Button
        isDisabled={assetOptions.length === selectedAssets.length}
        mb={5}
        mt={8}
        mx="auto"
        variant="outline-primary"
        onClick={() => append({ amount: "", denom: "" })}
      >
        Add more asset
      </Button>
    </>
  );
};
