import type { ReactNode } from "react";

import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import type { IconKeys } from "../icon";

import { CustomIcon } from "../icon";

const ITEM_HEIGHT = 56;

interface SelectInputProps<T extends string> {
  formLabel?: string;
  options: {
    label: string;
    value: T;
    disabled: boolean;
    icon?: IconKeys;
    iconColor?: string;
    image?: JSX.Element;
  }[];
  onChange: (newVal: T) => void;
  placeholder?: string;
  initialSelected?: string;
  hasDivider?: boolean;
  helperTextComponent?: ReactNode;
  labelBgColor?: string;
  popoverBgColor?: string;
  size?: string | object;
  disableMaxH?: boolean;
  isRequired?: boolean;
}

interface SelectItemProps {
  children: NonNullable<ReactNode>;
  onSelect?: () => void;
  disabled: boolean;
}

const SelectItem = ({ children, onSelect, disabled }: SelectItemProps) => (
  <Flex
    _disabled={{ opacity: 0.4, pointerEvents: "none" }}
    _hover={{ bg: "gray.800" }}
    aria-disabled={disabled}
    color="text.main"
    cursor="pointer"
    gap={2}
    px={4}
    py={2}
    transition="all 0.25s ease-in-out"
    onClick={onSelect}
  >
    {children}
  </Flex>
);

export const SelectInputBase = <T extends string>({
  formLabel,
  options,
  onChange,
  placeholder = "",
  initialSelected,
  hasDivider = false,
  helperTextComponent,
  labelBgColor = "background.main",
  popoverBgColor = "gray.900",
  size = "lg",
  disableMaxH = false,
  isRequired,
}: SelectInputProps<T>) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selected, setSelected] = useState("");

  const selectedOption = options.find((item) => item.label === selected);

  useEffect(() => {
    if (!initialSelected) return;

    setSelected(
      options.find((item) => item.value === initialSelected)?.label ?? ""
    );
  }, [initialSelected, options]);

  return (
    <Popover
      isOpen={isOpen}
      placement="bottom-start"
      returnFocusOnClose={false}
      strategy="fixed"
      onClose={onClose}
      onOpen={onOpen}
    >
      <PopoverTrigger>
        <InputGroup
          sx={{
            "&[aria-expanded=true]": {
              "> input": {
                border: "2px solid",
                borderColor: "primary.dark",
              },
            },
            "& .form-label": {
              fontSize: "12px",
              color: "text.dark",
              letterSpacing: "0.15px",
              position: "absolute",
              ml: 3,
              px: 1,
              zIndex: 2,
              bg: labelBgColor,
              top: -2,

              "::after": {
                content: isRequired ? '"* (Required)"' : '""',
                color: "error.main",
                ml: 1,
              },
            },
          }}
        >
          {formLabel && <div className="form-label">{formLabel}</div>}
          {selectedOption?.image && (
            <InputLeftElement h="full" ml={1} pointerEvents="none">
              {selectedOption.image}
            </InputLeftElement>
          )}
          {selectedOption?.icon && (
            <InputLeftElement h="full" ml={1} pointerEvents="none">
              <CustomIcon
                color={selectedOption.iconColor}
                name={selectedOption.icon}
              />
            </InputLeftElement>
          )}
          <Input
            color={selected ? "text.main" : "text.dark"}
            fontSize="14px"
            pl={selectedOption?.icon || selectedOption?.image ? 10 : 4}
            size={size}
            textAlign="start"
            type="button"
            value={selected || placeholder}
            ref={inputRef}
          />
          <InputRightElement h="full" pointerEvents="none">
            <CustomIcon color="gray.600" name="chevron-down" />
          </InputRightElement>
        </InputGroup>
      </PopoverTrigger>
      <PopoverContent
        _focusVisible={{
          outline: "none",
        }}
        bg={popoverBgColor}
        border="unset"
        borderRadius="8px"
        maxH={disableMaxH ? undefined : `${ITEM_HEIGHT * 4}px`}
        overflow="scroll"
        sx={{
          "> div:not(:last-of-type)": {
            borderBottom: hasDivider && "1px solid",
            borderBottomColor: hasDivider && "gray.700",
          },
        }}
        w={inputRef.current?.clientWidth}
      >
        {options.map(({ label, value, disabled, icon, iconColor, image }) => (
          <SelectItem
            key={value}
            disabled={disabled}
            onSelect={() => {
              setSelected(label);
              onChange(value);
              onClose();
            }}
          >
            <Flex alignItems="center" gap={2}>
              <Flex alignItems="center">{image}</Flex>
              {icon && <CustomIcon color={iconColor} name={icon} />}
              {label}
            </Flex>
          </SelectItem>
        ))}
        {helperTextComponent && (
          <Flex
            align="center"
            borderTop={!hasDivider ? "1px solid" : "none"}
            borderTopColor="gray.700"
            h={`${ITEM_HEIGHT}px`}
            px={4}
          >
            {helperTextComponent}
          </Flex>
        )}
      </PopoverContent>
    </Popover>
  );
};
