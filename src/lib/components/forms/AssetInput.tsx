import { Box, Button, Flex, Grid, InputGroup, Text } from "@chakra-ui/react";
import type {
  GroupBase,
  MenuListProps,
  OptionProps,
} from "chakra-react-select";
import { components, Select } from "chakra-react-select";

import { CustomIcon } from "../icon";
import { TokenImageRender, TokenImageRenderWithCache } from "../token";
import { getTokenLabel } from "lib/utils";

export interface AssetOption {
  label: string;
  value: string;
  isDisabled: boolean;
  [key: string]: string | boolean;
}

interface AssetInputProps {
  disableDelete: boolean;
  onDelete: () => void;
  setCurrencyValue: (newVal: string) => void;
  amountInput: JSX.Element;
  assetOptions: AssetOption[];
  initialSelected?: string;
}

const Option = (props: OptionProps<AssetOption>) => {
  const { data } = props;
  const textMainColor = data.isDisabled ? "text.disabled" : "text.main";
  return (
    <Box
      sx={{
        "> div": {
          background: "gray.900",
          "&:hover": {
            background: "gray.800",
          },
        },
      }}
    >
      <components.Option {...props}>
        <Flex justifyContent="space-between" alignItems="center">
          <Flex gap={2} alignItems="center">
            <Box opacity={data.isDisabled ? 0.6 : 1}>
              <TokenImageRenderWithCache
                src={String(data.logo)}
                alt={getTokenLabel(String(data.id), data.label)}
                width={24}
                height={24}
              />
            </Box>
            <Text variant="body2" color={textMainColor}>
              {data.label}
            </Text>
          </Flex>
          <Flex direction="column" alignItems="flex-end">
            <Text variant="body2" color={textMainColor}>
              {data.formatted || "0.000000"}
            </Text>
            <Text
              variant="body3"
              color={data.isDisabled ? "text.disabled" : "text.dark"}
            >
              {`(${data.price || "$0.00"})`}
            </Text>
          </Flex>
        </Flex>
      </components.Option>
    </Box>
  );
};

const MenuList = (
  props: MenuListProps<AssetOption, boolean, GroupBase<AssetOption>>
) => {
  const { children } = props;
  return (
    <Box backgroundColor="gray.900" borderRadius="8px" overflow="hidden">
      <components.MenuList {...props}>
        <Flex justifyContent="space-between" px={3} py={4}>
          <Text variant="body3" color="text.dark">
            Token Name
          </Text>
          <Text variant="body3" color="text.dark">
            Balance
          </Text>
        </Flex>
        {children}
      </components.MenuList>
    </Box>
  );
};

const FormatOptionLabel = (data: AssetOption) => {
  const { logo, label, id } = data;

  return (
    <Flex gap={2} alignItems="center">
      <TokenImageRender
        logo={String(logo)}
        alt={getTokenLabel(String(id), label)}
        boxSize={6}
      />
      <Text variant="body2" color="text.main">
        {label}
      </Text>
    </Flex>
  );
};

export const AssetInput = ({
  disableDelete,
  onDelete,
  setCurrencyValue,
  amountInput: AmountInput,
  assetOptions,
  initialSelected,
}: AssetInputProps) => {
  return (
    <Grid
      templateColumns="140px 1fr auto"
      position="relative"
      columnGap={4}
      w="full"
      mb={4}
    >
      <InputGroup
        zIndex={1}
        sx={{
          "& .form-label": {
            fontSize: "12px",
            color: "text.dark",
            backgroundColor: "background.main",
            letterSpacing: "0.15px",
            position: "absolute",
            ml: 3,
            px: 1,
            zIndex: 2,
            top: -2,
          },
        }}
      >
        <div className="form-label">Asset</div>
        <Select
          size="lg"
          placeholder="Select Asset"
          options={assetOptions}
          defaultValue={assetOptions.find(
            (item) => item.value === initialSelected
          )}
          onChange={(selected) =>
            setCurrencyValue((selected as AssetOption).value)
          }
          formatOptionLabel={FormatOptionLabel}
          chakraStyles={{
            container: (provided) => ({
              ...provided,
              width: "100%",
            }),
            valueContainer: (provided) => ({
              ...provided,
              pl: 3,
              pr: 0,
            }),
            dropdownIndicator: (provided) => ({
              ...provided,
              px: 2,
              color: "gray.600",
            }),
            placeholder: (provided) => ({
              ...provided,
              color: "gray.500",
              fontSize: "14px",
              whiteSpace: "nowrap",
            }),
            menu: (provided) => ({
              ...provided,
              width: "427px",
            }),
          }}
          components={{
            Option,
            MenuList,
          }}
        />
      </InputGroup>
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
};
