import { Grid } from "@chakra-ui/react";

import type { IconKeys } from "../icon";
import type { PermissionFilterValue } from "lib/hooks";

import { SelectInputBase } from "./SelectInputBase";

interface FilterByPermissionProps {
  initialSelected: string;
  labelBgColor?: string;
  maxWidth?: string;
  setPermissionValue: (newVal: PermissionFilterValue) => void;
}

interface PermissionOption {
  disabled: boolean;
  icon: IconKeys;
  iconColor: string;
  label: string;
  value: PermissionFilterValue;
}

const options: PermissionOption[] = [
  {
    disabled: false,
    icon: "check",
    iconColor: "gray.600",
    label: "All",
    value: "all",
  },
  {
    disabled: false,
    icon: "instantiate",
    iconColor: "gray.600",
    label: "Can Instantiate without proposal",
    value: "without-proposal",
  },
  {
    disabled: false,
    icon: "vote",
    iconColor: "gray.600",
    label: "Instantiate through proposal only",
    value: "with-proposal",
  },
];

export const FilterByPermission = ({
  initialSelected,
  labelBgColor = "background.main",
  maxWidth = "360px",
  setPermissionValue,
}: FilterByPermissionProps) => (
  <Grid maxW={{ md: maxWidth }} w="full" columnGap={4}>
    <SelectInputBase<PermissionFilterValue>
      initialSelected={initialSelected}
      formLabel="Filter by Instantiate Permission"
      labelBgColor={labelBgColor}
      onChange={setPermissionValue}
      options={options}
      placeholder="Select"
    />
  </Grid>
);
