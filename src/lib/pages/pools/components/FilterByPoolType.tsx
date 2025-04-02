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
    label: "All pools",
    value: PoolType.ALL,
    disabled: false,
  },
  {
    label: "Balancer pools",
    value: PoolType.BALANCER,
    image: <BalancerPoolIcon boxSize={5} />,
    disabled: false,
  },
  {
    label: "StableSwap pools",
    value: PoolType.STABLESWAP,
    image: <StableSwapIcon boxSize={5} />,
    disabled: false,
  },
  {
    label: "Concentrated liquidity pools",
    value: PoolType.CL,
    image: <ClpIcon boxSize={5} />,
    disabled: false,
  },
  {
    label: "CosmWasm pools",
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
    <SelectInputBase<PoolTypeFilter>
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
