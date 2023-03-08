import { Grid } from "@chakra-ui/react";

import type { IconKeys } from "../icon";
import type { PermissionFilterValue } from "lib/hooks";

import { SelectInput } from "./SelectInput";

interface PermissionOption {
  label: string;
  value: PermissionFilterValue;
  disabled: boolean;
  icon?: IconKeys;
  iconColor: string;
}

interface FilterByPermissionProps {
  setPermissionValue: (newVal: PermissionFilterValue) => void;
  initialSelected: string;
}

const options: PermissionOption[] = [
  {
    label: "All",
    value: "all",
    disabled: false,
    icon: "check",
    iconColor: "text.dark",
  },
  {
    label: "Can Instantiate without proposal",
    value: "without-proposal",
    disabled: false,
    icon: "instantiate",
    iconColor: "text.dark",
  },
  {
    label: "Instantiate through proposal only",
    value: "with-proposal",
    disabled: false,
    icon: "vote",
    iconColor: "text.dark",
  },
];

export const FilterByPermission = ({
  setPermissionValue,
  initialSelected,
}: FilterByPermissionProps) => (
  <Grid columnGap="16px" w="full" mb="16px" maxW="360px">
    <SelectInput<PermissionFilterValue>
      formLabel="Filter by Instantiate Permission"
      options={options}
      onChange={setPermissionValue}
      placeholder="Select"
      initialSelected={initialSelected}
    />
  </Grid>
);
