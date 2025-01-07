import { Grid } from "@chakra-ui/react";

import { AmpEvent, trackUseFilter } from "lib/amplitude";
import { SelectInputBase } from "lib/components/forms";
import {
  BalancerPoolIcon,
  ClpIcon,
  CosmWasmPoolIcon,
  StableSwapIcon,
} from "lib/icon";
import type { PoolTypeFilter } from "lib/types";
import { PoolType } from "lib/types";

interface FilterByPoolTypeProps {
  initialSelected: string;
  labelBgColor?: string;
  setPoolTypeValue: (newVal: PoolTypeFilter) => void;
}

interface PoolTypeOption {
  disabled: boolean;
  image?: JSX.Element;
  label: string;
  value: PoolTypeFilter;
}

const options: PoolTypeOption[] = [
  {
    disabled: false,
    label: "All Pools",
    value: PoolType.ALL,
  },
  {
    disabled: false,
    image: <BalancerPoolIcon boxSize={5} />,
    label: "Balancer Pools",
    value: PoolType.BALANCER,
  },
  {
    disabled: false,
    image: <StableSwapIcon boxSize={5} />,
    label: "StableSwap Pools",
    value: PoolType.STABLESWAP,
  },
  {
    disabled: false,
    image: <ClpIcon boxSize={5} />,
    label: "Concentrated Liquidity Pools",
    value: PoolType.CL,
  },
  {
    disabled: false,
    image: <CosmWasmPoolIcon boxSize={5} />,
    label: "CosmWasm Pools",
    value: PoolType.COSMWASM,
  },
];

export const FilterByPoolType = ({
  initialSelected,
  labelBgColor = "background.main",
  setPoolTypeValue,
}: FilterByPoolTypeProps) => (
  <Grid maxW="360px" w="full" columnGap="16px">
    <SelectInputBase<PoolTypeFilter>
      initialSelected={initialSelected}
      formLabel="Filter by Pool Type"
      labelBgColor={labelBgColor}
      onChange={(newVal) => {
        trackUseFilter(AmpEvent.USE_FILTER_POOL_TYPE, [newVal], newVal);
        setPoolTypeValue(newVal);
      }}
      options={options}
    />
  </Grid>
);
