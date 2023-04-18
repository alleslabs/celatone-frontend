import { Grid } from "@chakra-ui/react";

import { BalancerIcon, StableswapIcon } from "../constant";
import { SelectInput } from "lib/components/forms";
import type { PoolTypeFilter } from "lib/types";

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
    value: "all",
    disabled: false,
  },
  {
    label: "Balancer Pools",
    value: "balancer",
    image: BalancerIcon,
    disabled: false,
  },
  {
    label: "StableSwap Pools",
    value: "stableswap",
    image: StableswapIcon,
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
      onChange={setPoolTypeValue}
      placeholder="Select"
      initialSelected={initialSelected}
      labelBgColor={labelBgColor}
    />
  </Grid>
);
