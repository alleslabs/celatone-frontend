import { Grid } from "@chakra-ui/react";
import type { IconType } from "react-icons";
import { MdCheck, MdHowToVote, MdPerson } from "react-icons/md";

import type { PermissionFilterValue } from "lib/hooks";

import { SelectInput } from "./SelectInput";

interface PermissionOption {
  label: string;
  value: PermissionFilterValue;
  disabled: boolean;
  icon?: IconType;
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
    icon: MdCheck,
    iconColor: "gray.600",
  },
  {
    label: "Can Instantiate without proposal",
    value: "without-proposal",
    disabled: false,
    icon: MdPerson,
    iconColor: "primary.main",
  },
  {
    label: "Instantiate through proposal only",
    value: "with-proposal",
    disabled: false,
    icon: MdHowToVote,
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
