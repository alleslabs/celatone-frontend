import type { BoxProps } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";

import type { Option } from "lib/types";

import { SelectInputBase } from "./forms";

enum RelationType {
  ALL = "ALL",
  RELATED = "RELATED",
  SIGNING = "SIGNING",
}

const relationOptions = [
  {
    disabled: false,
    label: "All",
    value: RelationType.ALL,
  },
  {
    disabled: false,
    label: "Signing Address",
    value: RelationType.SIGNING,
  },
  {
    disabled: false,
    label: "Related Address",
    value: RelationType.RELATED,
  },
];

interface TxRelationSelectionProps extends BoxProps {
  setValue: (value: Option<boolean>) => void;
  size?: object | string;
  value: Option<boolean>;
}

export const TxRelationSelection = ({
  setValue,
  size = "lg",
  value,
  ...props
}: TxRelationSelectionProps) => {
  let initialValue;
  switch (value) {
    case true:
      initialValue = RelationType.SIGNING;
      break;
    case undefined:
      initialValue = RelationType.ALL;
      break;
    default:
      initialValue = RelationType.RELATED;
  }

  return (
    <Box {...props}>
      <SelectInputBase
        initialSelected={initialValue}
        size={size}
        formLabel="Filter by Relation"
        onChange={(newValue: RelationType) =>
          setValue(
            newValue === RelationType.ALL
              ? undefined
              : newValue === RelationType.SIGNING
          )
        }
        options={relationOptions}
      />
    </Box>
  );
};
