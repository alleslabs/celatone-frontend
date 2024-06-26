import { Button, Flex, Grid, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { CustomIcon } from "../icon";

import { SelectInput } from "./SelectInput";

export interface AssetOptions {
  label: string;
  value: string;
  disabled: boolean;
  image?: ReactNode;
  trailingNode?: ReactNode;
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

const AssetInputDropdownHeader = () => (
  <Flex minWidth={427} justifyContent="space-between" px={3} py={4}>
    <Text variant="body3" color="text.dark">
      Token Name
    </Text>
    <Text variant="body3" color="text.dark">
      Balance
    </Text>
  </Flex>
);

export const AssetInput = ({
  disableDelete,
  onDelete,
  setCurrencyValue,
  amountInput: AmountInput,
  assetOptions,
  initialSelected,
  labelBgColor,
}: AssetInputProps) => (
  <Grid templateColumns="140px 1fr auto" columnGap={4} w="full" mb={4}>
    <SelectInput
      formLabel="Asset"
      options={assetOptions}
      onChange={setCurrencyValue}
      placeholder="Select Asset"
      initialSelected={initialSelected}
      labelBgColor={labelBgColor}
      headerComponent={<AssetInputDropdownHeader />}
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
