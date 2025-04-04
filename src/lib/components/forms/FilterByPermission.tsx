import { Grid } from "@chakra-ui/react";

import type { PermissionFilterValue } from "lib/hooks";

import { SelectInputBase } from "./SelectInputBase";
import type { IconKeys } from "../icon";

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
    label: "Can instantiate without proposal",
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
    <SelectInputBase<PermissionFilterValue>
      formLabel="Filter by instantiate permission"
      options={options}
      onChange={setPermissionValue}
      placeholder="Select"
      initialSelected={initialSelected}
      labelBgColor={labelBgColor}
    />
  </Grid>
);
