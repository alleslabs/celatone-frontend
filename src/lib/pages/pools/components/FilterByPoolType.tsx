import { Grid } from "@chakra-ui/react";

import {
  BALANCER_ICON,
  CLP_ICON,
  COSMWASM_ICON,
  STABLESWAP_ICON,
} from "../constant";
import { AmpEvent, trackUseFilter } from "lib/amplitude";
import { SelectInput } from "lib/components/forms";
import type { PoolTypeFilter } from "lib/types";
import { PoolType } from "lib/types";

interface PoolTypeOption {
  label: string;
  value: PoolTypeFilter;
  image?: string;
  disabled: boolean;
}

interface FilterByPoolTypeProps {
  setPoolTypeValue: (newVal: PoolTypeFilter) => void;
  initialSelected: string;
  labelBgColor?: string;
}

const options: PoolTypeOption[] = [
  {
    label: "All Pools",
    value: PoolType.ALL,
    disabled: false,
  },
  {
    label: "Balancer Pools",
    value: PoolType.BALANCER,
    image: BALANCER_ICON,
    disabled: false,
  },
  {
    label: "StableSwap Pools",
    value: PoolType.STABLESWAP,
    image: STABLESWAP_ICON,
    disabled: false,
  },
  {
    label: "Concentrated Liquidity Pools",
    value: PoolType.CL,
    image: CLP_ICON,
    disabled: false,
  },
  {
    label: "CosmWasm Pools",
    value: PoolType.COSMWASM,
    image: COSMWASM_ICON,
    disabled: false,
  },
];

export const FilterByPoolType = ({
  setPoolTypeValue,
  initialSelected,
  labelBgColor = "background.main",
}: FilterByPoolTypeProps) => (
  <Grid columnGap="16px" w="full" maxW="360px">
    <SelectInput<PoolTypeFilter>
      formLabel="Filter by Pool Type"
      options={options}
      onChange={(newVal) => {
        trackUseFilter(AmpEvent.USE_FILTER_POOL_TYPE, [newVal], newVal);
        setPoolTypeValue(newVal);
      }}
      initialSelected={initialSelected}
      labelBgColor={labelBgColor}
    />
  </Grid>
);
