import { Grid } from "@chakra-ui/react";

import { AmpEvent, trackUseFilter } from "lib/amplitude";
import { SelectInput } from "lib/components/forms";
import {
  BalancerPoolIcon,
  ClpIcon,
  CosmWasmPoolIcon,
  StableSwapIcon,
} from "lib/icon";
import type { PoolTypeFilter } from "lib/types";
import { PoolType } from "lib/types";

interface PoolTypeOption {
  label: string;
  value: PoolTypeFilter;
  image?: JSX.Element;
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
    image: <BalancerPoolIcon boxSize={5} />,
    disabled: false,
  },
  {
    label: "StableSwap Pools",
    value: PoolType.STABLESWAP,
    image: <StableSwapIcon boxSize={5} />,
    disabled: false,
  },
  {
    label: "Concentrated Liquidity Pools",
    value: PoolType.CL,
    image: <ClpIcon boxSize={5} />,
    disabled: false,
  },
  {
    label: "CosmWasm Pools",
    value: PoolType.COSMWASM,
    image: <CosmWasmPoolIcon boxSize={5} />,
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
