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
  initialSelected?: string;
  labelBgColor?: string;
}

export const AssetInput = ({
  disableDelete,
  onDelete,
  setCurrencyValue,
  amountInput: AmountInput,
  assetOptions,
  initialSelected,
  labelBgColor,
}: AssetInputProps) => (
  <Grid templateColumns="130px 1fr auto" columnGap={4} w="full" mb={4}>
    <SelectInput
      formLabel="Asset"
      options={assetOptions}
      onChange={setCurrencyValue}
      placeholder="Select"
      initialSelected={initialSelected}
      labelBgColor={labelBgColor}
    />
    {AmountInput}
    <Button
      w="56px"
      h="56px"
      variant="outline-gray"
      size="lg"
      isDisabled={disableDelete}
      onClick={onDelete}
      p={0}
    >
      <CustomIcon name="delete" boxSize={3} />
    </Button>
  </Grid>
);
