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
  amountInput: JSX.Element;
  assetOptions: AssetOption[];
  disableDelete: boolean;
  onDelete: () => void;
  setCurrencyValue: (newVal: string) => void;
  value: Option<AssetOption>;
}

export const AssetInput = ({
  amountInput: AmountInput,
  assetOptions,
  disableDelete,
  onDelete,
  setCurrencyValue,
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
          backgroundColor: "background.main",
          color: "text.dark",
          fontSize: "12px",
          letterSpacing: "0.15px",
          ml: 3,
          position: "absolute",
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
          MenuList: AssetInputMenuList,
          NoOptionsMessage: AssetInputNoOptionsMessage,
          Option: AssetInputOption,
        }}
        formatOptionLabel={AssetInputFormatOptionLabel}
        menuPortalTarget={document.body}
        options={assetOptions}
        placeholder="Select asset"
        value={value}
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
