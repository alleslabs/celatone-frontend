import type { SystemStyleObject } from "@chakra-ui/react";
import type { AssetOption, AssetOptionValue, Option } from "lib/types";

import { Box, Button, Grid, Text } from "@chakra-ui/react";

import { CustomIcon } from "../../icon";
import { SelectInput } from "../SelectInput";
import { AssetInputFormatOptionLabel } from "./AssetInputFormatOptionLabel";
import { AssetInputMenuList } from "./AssetInputMenuList";
import { AssetInputNoOptionsMessage } from "./AssetInputNoOptionsMessage";
import { AssetInputOption } from "./AssetInputOption";

interface AssetInputProps {
  disableDelete: boolean;
  onDelete: () => void;
  setCurrencyValue: (newVal: string) => void;
  amountInput: JSX.Element;
  assetOptions: AssetOption[];
  value: Option<AssetOption>;
}

export const AssetInput = ({
  disableDelete,
  onDelete,
  setCurrencyValue,
  amountInput: AmountInput,
  assetOptions,
  value,
}: AssetInputProps) => (
  <Grid
    columnGap={4}
    mb={4}
    position="relative"
    templateColumns="140px 1fr auto"
    w="full"
  >
    <Box
      sx={{
        "& .form-label": {
          fontSize: "12px",
          color: "text.dark",
          backgroundColor: "background.main",
          letterSpacing: "0.15px",
          position: "absolute",
          ml: 3,
          px: 1,
          top: -2,
          zIndex: 1,
        },
      }}
    >
      <Text className="form-label">Asset</Text>
      <SelectInput<AssetOptionValue>
        chakraStyles={{
          menu: (provided: SystemStyleObject) => ({
            ...provided,
            width: "427px",
          }),
        }}
        components={{
          Option: AssetInputOption,
          MenuList: AssetInputMenuList,
          NoOptionsMessage: AssetInputNoOptionsMessage,
        }}
        components={{
          Option: AssetInputOption,
          MenuList: AssetInputMenuList,
          NoOptionsMessage: AssetInputNoOptionsMessage,
        }}
        formatOptionLabel={AssetInputFormatOptionLabel}
        formatOptionLabel={AssetInputFormatOptionLabel}
        menuPortalTarget={document.body}
        menuPortalTarget={document.body}
        options={assetOptions}
        options={assetOptions}
        placeholder="Select asset"
        placeholder="Select Asset"
        value={value}
        value={value}
        onChange={(newValue) => {
          if (!newValue) return;
          setCurrencyValue(newValue.value.id);
        }}
        onChange={(newValue) => {
          if (!newValue) return;
          setCurrencyValue(newValue.value.id);
        }}
      />
    </Box>
    {AmountInput}
    <Button
      h="56px"
      isDisabled={disableDelete}
      p={0}
      size="lg"
      variant="outline-gray"
      w="56px"
      onClick={onDelete}
    >
      <CustomIcon boxSize={3} name="delete" />
    </Button>
  </Grid>
);
