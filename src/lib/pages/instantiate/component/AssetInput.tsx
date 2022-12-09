import { Button, Grid, Icon } from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";

import { SelectInput } from "lib/components/forms";

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
        formLabel="Currency"
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
        <Icon
          as={MdDelete}
          fontSize="18px"
          color={disableDelete ? "divider.main" : "text.dark"}
        />
      </Button>
    </Grid>
  );
};
