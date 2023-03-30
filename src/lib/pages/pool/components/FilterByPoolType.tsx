import { Grid } from "@chakra-ui/react";

import { SelectInput } from "lib/components/forms";

export type PoolTypeFilterValue = "all" | "balancer" | "stableswap";

interface PoolTypeOption {
  label: string;
  value: PoolTypeFilterValue;
  image?: string;
  disabled: boolean;
}

interface FilterByPoolTypeProps {
  setPoolTypeValue: (newVal: PoolTypeFilterValue) => void;
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
    image: "https://assets.alleslabs.dev/webapp-assets/pool/pool-balancer.svg",
    disabled: false,
  },
  {
    label: "StableSwap Pools",
    value: "stableswap",
    image:
      "https://assets.alleslabs.dev/webapp-assets/pool/pool-stableswap.svg",
    disabled: false,
  },
];

export const FilterByPoolType = ({
  setPoolTypeValue,
  initialSelected,
  labelBgColor = "background.main",
}: FilterByPoolTypeProps) => (
  <Grid columnGap="16px" w="full" maxW="360px">
    <SelectInput<PoolTypeFilterValue>
      formLabel="Filter by Pool Type"
      options={options}
      onChange={setPoolTypeValue}
      placeholder="Select"
      initialSelected={initialSelected}
      labelBgColor={labelBgColor}
    />
  </Grid>
);
