import type { BoxProps } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";

import type { Option } from "lib/types";

import { SelectInput } from "./forms";

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
    label: "Signing Address",
    value: RelationType.SIGNING,
    disabled: false,
  },
  {
    label: "Related Address",
    value: RelationType.RELATED,
    disabled: false,
  },
];

interface TxRelationSelectionProps extends BoxProps {
  setValue: (value: Option<boolean>) => void;
  size?: string | object;
}

export const TxRelationSelection = ({
  setValue,
  size = "lg",
  ...props
}: TxRelationSelectionProps) => (
  <Box {...props}>
    <SelectInput
      formLabel="Filter by Relations"
      size={size}
      options={relationOptions}
      onChange={(value: RelationType) =>
        setValue(
          value === RelationType.ALL
            ? undefined
            : value === RelationType.SIGNING
        )
      }
      initialSelected={RelationType.ALL}
    />
  </Box>
);
