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
    mb={4}
    w="full"
    columnGap={4}
    position="relative"
    templateColumns="140px 1fr auto"
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
        value={value}
        components={{
          MenuList: AssetInputMenuList,
          NoOptionsMessage: AssetInputNoOptionsMessage,
          Option: AssetInputOption,
        }}
        formatOptionLabel={AssetInputFormatOptionLabel}
        menuPortalTarget={document.body}
        onChange={(newValue) => {
          if (!newValue) return;
          setCurrencyValue(newValue.value.id);
        }}
        options={assetOptions}
        placeholder="Select Asset"
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
      <CustomIcon name="delete" boxSize={3} />
    </Button>
  </Grid>
);
