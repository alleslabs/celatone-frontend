import { Button, Grid } from "@chakra-ui/react";

import { CustomIcon } from "../icon";

import { SelectInput } from "./SelectInput";

interface AssetOptions {
  label: string;
  value: string;
  disabled: boolean;
}

interface AssetInputProps {
  disableDelete: boolean;
  onDelete: () => void;
  setCurrencyValue: (newVal: string) => void;
  amountInput: JSX.Element;
  assetOptions: AssetOptions[];
  initialSelected: string;
}

export const AssetInput = ({
  disableDelete,
  onDelete,
  setCurrencyValue,
  amountInput: AmountInput,
  assetOptions,
  initialSelected,
}: AssetInputProps) => (
  <Grid templateColumns="130px 1fr auto" columnGap={4} w="full" mb={4}>
    <SelectInput
      formLabel="Asset"
      options={assetOptions}
      onChange={setCurrencyValue}
      placeholder="Select"
      initialSelected={initialSelected}
    />
    {AmountInput}
    <Button
      w="56px"
      h="56px"
      variant="outline-gray"
      size="lg"
      disabled={disableDelete}
      onClick={onDelete}
    >
      <CustomIcon name="delete" />
    </Button>
  </Grid>
);
