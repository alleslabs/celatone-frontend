import { Grid } from "@chakra-ui/react";

import type { IconKeys } from "../icon";
import type { PermissionFilterValue } from "lib/hooks";

import { SelectInput } from "./SelectInput";

interface PermissionOption {
  label: string;
  value: PermissionFilterValue;
  disabled: boolean;
  icon?: IconKeys;
}

interface FilterByPermissionProps {
  setPermissionValue: (newVal: PermissionFilterValue) => void;
  initialSelected: string;
  labelBgColor?: string;
}

const options: PermissionOption[] = [
  {
    label: "All",
    value: "all",
    disabled: false,
    icon: "check",
  },
  {
    label: "Can Instantiate without proposal",
    value: "without-proposal",
    disabled: false,
    icon: "instantiate",
  },
  {
    label: "Instantiate through proposal only",
    value: "with-proposal",
    disabled: false,
    icon: "vote",
  },
];

export const FilterByPermission = ({
  setPermissionValue,
  initialSelected,
  labelBgColor = "background.main",
}: FilterByPermissionProps) => (
  <Grid columnGap={4} w="full" mb={4} maxW="360px">
    <SelectInput<PermissionFilterValue>
      formLabel="Filter by Instantiate Permission"
      options={options}
      onChange={setPermissionValue}
      placeholder="Select"
      initialSelected={initialSelected}
      labelBgColor={labelBgColor}
    />
  </Grid>
);
