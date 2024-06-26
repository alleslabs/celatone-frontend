import { Button, Flex, Text } from "@chakra-ui/react";
import type { Coin } from "@cosmjs/stargate";
import type { BigSource } from "big.js";
import { useMemo } from "react";
import type { Control, UseFormSetValue } from "react-hook-form";
import { useFieldArray } from "react-hook-form";

import { TokenImageRender } from "../token";
import { useCurrentChain } from "lib/app-provider";
import type { AssetOptions } from "lib/components/forms";
import { AssetInput, ControllerInput } from "lib/components/forms";
import { useAssetInfoList, useAssetInfos } from "lib/services/assetService";
import { useBalances } from "lib/services/bank";
import type {
  AssetInfo,
  AssetInfos,
  BechAddr20,
  Option,
  Token,
  U,
  USD,
} from "lib/types";
import {
  coinToTokenWithValue,
  formatPrice,
  formatUTokenWithPrecision,
  getTokenLabel,
} from "lib/utils";

import { ASSETS_SELECT } from "./data";
import type { AttachFundsState } from "./types";

interface SelectFundProps {
  control: Control<AttachFundsState>;
  setValue: UseFormSetValue<AttachFundsState>;
  assetsSelect: Coin[];
  labelBgColor?: string;
}

const SelectFundAssetBalance = ({
  asset,
  assetInfos,
  balance,
}: {
  asset: AssetInfo;
  assetInfos: Option<AssetInfos>;
  balance?: Coin;
}) => {
  const token = coinToTokenWithValue(
    asset.id,
    balance?.amount ?? "0",
    assetInfos,
    undefined
  );

  const formatted = formatUTokenWithPrecision(
    token.amount as U<Token<BigSource>>,
    token.precision ?? 0,
    true,
    token.amount.toNumber() > 999 ? 6 : undefined
  );

  const price = formatPrice(token.value as USD<BigSource>);

  return (
    <Flex direction="column" alignItems="flex-end">
      <Text variant="body2">{formatted || "0.000000"}</Text>
      <Text variant="body3" color="text.dark">
        {`(${price})`}
      </Text>
    </Flex>
  );
};

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

  const assetOptions = useMemo(() => {
    const assetInfosInBalance: AssetOptions[] = [];
    const assetInfosNotInBalance: AssetOptions[] = [];

    const balanceMap = balances?.reduce((acc, balance) => {
      acc.set(balance.denom, balance);
      return acc;
    }, new Map());

    assetInfos.forEach((asset) => {
      if (balanceMap?.has(asset.id)) {
        assetInfosInBalance.push({
          label: asset.symbol,
          value: asset.id,
          disabled: selectedAssets.includes(asset.id),
          image: (
            <TokenImageRender
              logo={asset.logo}
              alt={getTokenLabel(asset.id, asset.symbol)}
              boxSize={6}
            />
          ),
          trailingNode: (
            <SelectFundAssetBalance
              asset={asset}
              balance={balanceMap.get(asset.id)}
              assetInfos={assetInfosWithPrices}
            />
          ),
        });
      } else {
        assetInfosNotInBalance.push({
          label: asset.symbol,
          value: asset.id,
          disabled: true,
          image: (
            <TokenImageRender
              logo={asset.logo}
              alt={getTokenLabel(asset.id, asset.symbol)}
              boxSize={6}
            />
          ),
          trailingNode: (
            <SelectFundAssetBalance
              asset={asset}
              assetInfos={assetInfosWithPrices}
            />
          ),
        });
      }
    });

    return [...assetInfosInBalance, ...assetInfosNotInBalance];
  }, [assetInfos, balances, selectedAssets, assetInfosWithPrices]);

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
          initialSelected={field.denom}
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
