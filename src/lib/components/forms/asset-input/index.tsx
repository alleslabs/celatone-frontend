import type { SystemStyleObject } from "@chakra-ui/react";
import { Box, Button, Grid, Text } from "@chakra-ui/react";
import { Select } from "chakra-react-select";

import { CustomIcon } from "../../icon";
import type { AssetOption } from "lib/types";

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
  initialSelected?: string;
}

const styles = {
  container: (provided: SystemStyleObject) => ({
    ...provided,
    width: "100%",
  }),
  valueContainer: (provided: SystemStyleObject) => ({
    ...provided,
    pl: 3,
    pr: 0,
  }),
  dropdownIndicator: (provided: SystemStyleObject) => ({
    ...provided,
    px: 2,
    color: "gray.600",
  }),
  placeholder: (provided: SystemStyleObject) => ({
    ...provided,
    color: "gray.500",
    fontSize: "14px",
    whiteSpace: "nowrap",
  }),
  menu: (provided: SystemStyleObject) => ({
    ...provided,
    width: "427px",
  }),
};

export const AssetInput = ({
  disableDelete,
  onDelete,
  setCurrencyValue,
  amountInput: AmountInput,
  assetOptions,
  initialSelected,
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
      <Select
        size="lg"
        placeholder="Select Asset"
        options={assetOptions}
        defaultValue={assetOptions.find(
          (item) => item.value === initialSelected
        )}
        onChange={(value) => {
          const currentValue = (value as AssetOption).value;
          setCurrencyValue(currentValue);
        }}
        formatOptionLabel={AssetInputFormatOptionLabel}
        menuPosition="fixed"
        menuPortalTarget={document.body}
        chakraStyles={styles}
        components={{
          Option: AssetInputOption,
          MenuList: AssetInputMenuList,
          NoOptionsMessage: AssetInputNoOptionsMessage,
        }}
        filterOption={(
          candidate: { label: string; value: string },
          input: string
        ) => {
          if (input) {
            return candidate.label.toLowerCase().includes(input.toLowerCase());
          }

          return true;
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
