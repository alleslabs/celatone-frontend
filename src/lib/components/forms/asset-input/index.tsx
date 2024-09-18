import type { SystemStyleObject } from "@chakra-ui/react";
import { Box, Button, Grid, Text } from "@chakra-ui/react";

import { CustomIcon } from "../../icon";
import { SelectInput } from "../SelectInput";
import type { AssetOption, AssetOptionValue, Option } from "lib/types";

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
    templateColumns="140px 1fr auto"
    position="relative"
    columnGap={4}
    w="full"
    mb={4}
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
        placeholder="Select Asset"
        options={assetOptions}
        menuPortalTarget={document.body}
        value={value}
        onChange={(newValue) => {
          if (!newValue) return;
          setCurrencyValue(newValue.value.id);
        }}
        formatOptionLabel={AssetInputFormatOptionLabel}
        components={{
          Option: AssetInputOption,
          MenuList: AssetInputMenuList,
          NoOptionsMessage: AssetInputNoOptionsMessage,
        }}
        chakraStyles={{
          menu: (provided: SystemStyleObject) => ({
            ...provided,
            width: "427px",
          }),
        }}
      />
    </Box>
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
