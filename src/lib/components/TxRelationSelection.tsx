import type { LayoutProps } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";

import type { Option } from "lib/types";

import { SelectInput } from "./forms";

enum RelationType {
  ALL = "ALL",
  SIGNING = "SIGNING",
  RELATED = "RELATED",
}

const RelationOptions = [
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

interface TxRelationSelectionProps {
  setValue: (value: Option<boolean>) => void;
  boxWidth?: LayoutProps["width"];
}

export const TxRelationSelection = ({
  setValue,
  boxWidth = "full",
}: TxRelationSelectionProps) => (
  <Box width={boxWidth}>
    <SelectInput
      formLabel="Filter by Relations"
      options={RelationOptions}
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
