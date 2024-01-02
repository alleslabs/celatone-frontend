import { Grid } from "@chakra-ui/react";

import type { IconKeys } from "../icon";
import type { PermissionFilterValue } from "lib/hooks";

import { SelectInput } from "./SelectInput";

interface PermissionOption {
  label: string;
  value: PermissionFilterValue;
  disabled: boolean;
  icon: IconKeys;
  iconColor: string;
}

interface FilterByPermissionProps {
  setPermissionValue: (newVal: PermissionFilterValue) => void;
  initialSelected: string;
  labelBgColor?: string;
  maxWidth?: string;
}

const options: PermissionOption[] = [
  {
    label: "All",
    value: "all",
    disabled: false,
    icon: "check",
    iconColor: "gray.600",
  },
  {
    label: "Can Instantiate without proposal",
    value: "without-proposal",
    disabled: false,
    icon: "instantiate",
    iconColor: "gray.600",
  },
  {
    label: "Instantiate through proposal only",
    value: "with-proposal",
    disabled: false,
    icon: "vote",
    iconColor: "gray.600",
  },
];

export const FilterByPermission = ({
  setPermissionValue,
  initialSelected,
  labelBgColor = "background.main",
  maxWidth = "360px",
}: FilterByPermissionProps) => (
  <Grid columnGap={4} w="full" maxW={{ md: maxWidth }}>
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
