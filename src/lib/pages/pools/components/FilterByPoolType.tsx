import type { PoolTypeFilter } from "lib/types";

import { Grid } from "@chakra-ui/react";
import { AmpEvent, trackUseFilter } from "lib/amplitude";
import { SelectInputBase } from "lib/components/forms";
import {
  BalancerPoolIcon,
  ClpIcon,
  CosmWasmPoolIcon,
  StableSwapIcon,
} from "lib/icon";
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
    disabled: false,
    label: "All pools",
    value: PoolType.ALL,
  },
  {
    disabled: false,
    image: <BalancerPoolIcon boxSize={5} />,
    label: "Balancer pools",
    value: PoolType.BALANCER,
  },
  {
    disabled: false,
    image: <StableSwapIcon boxSize={5} />,
    label: "StableSwap pools",
    value: PoolType.STABLESWAP,
  },
  {
    disabled: false,
    image: <ClpIcon boxSize={5} />,
    label: "Concentrated liquidity pools",
    value: PoolType.CL,
  },
  {
    disabled: false,
    image: <CosmWasmPoolIcon boxSize={5} />,
    label: "CosmWasm pools",
    value: PoolType.COSMWASM,
  },
];

export const FilterByPoolType = ({
  initialSelected,
  labelBgColor = "background.main",
  setPoolTypeValue,
}: FilterByPoolTypeProps) => (
  <Grid columnGap="16px" maxW="360px" w="full">
    <SelectInputBase<PoolTypeFilter>
      formLabel="Filter by pool type"
      initialSelected={initialSelected}
      labelBgColor={labelBgColor}
      options={options}
      onChange={(newVal) => {
        trackUseFilter(AmpEvent.USE_FILTER_POOL_TYPE, [newVal], newVal);
        setPoolTypeValue(newVal);
      }}
    />
  </Grid>
);
