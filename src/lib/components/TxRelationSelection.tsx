import type { BoxProps } from "@chakra-ui/react";
import type { Option } from "lib/types";

import { Box } from "@chakra-ui/react";

import { SelectInputBase } from "./forms";

enum RelationType {
  ALL = "ALL",
  SIGNING = "SIGNING",
  RELATED = "RELATED",
}

const relationOptions = [
  {
    label: "All",
    value: RelationType.ALL,
    disabled: false,
  },
  {
    label: "Signing address",
    value: RelationType.SIGNING,
    disabled: false,
  },
  {
    label: "Related address",
    value: RelationType.RELATED,
    disabled: false,
  },
];

interface TxRelationSelectionProps extends BoxProps {
  value: Option<boolean>;
  setValue: (value: Option<boolean>) => void;
  size?: string | object;
}

export const TxRelationSelection = ({
  value,
  setValue,
  size = "lg",
  ...props
}: TxRelationSelectionProps) => {
  let initialValue;
  switch (value) {
    case undefined:
      initialValue = RelationType.ALL;
      break;
    case true:
      initialValue = RelationType.SIGNING;
      break;
    default:
      initialValue = RelationType.RELATED;
  }

  return (
    <Box {...props}>
      <SelectInputBase
        formLabel="Filter by relation"
        size={size}
        options={relationOptions}
        size={size}
        onChange={(newValue: RelationType) =>
          setValue(
            newValue === RelationType.ALL
              ? undefined
              : newValue === RelationType.SIGNING
          )
        }
      />
    </Box>
  );
};
