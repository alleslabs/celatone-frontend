import { Button, Grid } from "@chakra-ui/react";

import { CustomIcon } from "../icon/CustomIcon";

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
}: AssetInputProps) => {
  return (
    <Grid templateColumns="130px 1fr auto" columnGap="16px" w="full" mb="16px">
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
        <CustomIcon
          name="delete"
          color={disableDelete ? "pebble.600" : "text.dark"}
        />
      </Button>
    </Grid>
  );
};
