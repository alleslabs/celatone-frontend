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
import type { MutableRefObject, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import type { IconKeys } from "../icon";
import { CustomIcon } from "../icon";

const ITEM_HEIGHT = 56;

interface SelectInputProps<T extends string> {
  disableMaxH?: boolean;
  formLabel?: string;
  hasDivider?: boolean;
  helperTextComponent?: ReactNode;
  initialSelected?: string;
  isRequired?: boolean;
  labelBgColor?: string;
  onChange: (newVal: T) => void;
  options: {
    disabled: boolean;
    icon?: IconKeys;
    iconColor?: string;
    image?: JSX.Element;
    label: string;
    value: T;
  }[];
  placeholder?: string;
  popoverBgColor?: string;
  size?: object | string;
}

interface SelectItemProps {
  children: NonNullable<ReactNode>;
  disabled: boolean;
  onSelect?: () => void;
}

const SelectItem = ({ children, disabled, onSelect }: SelectItemProps) => (
  <Flex
    _disabled={{ opacity: 0.4, pointerEvents: "none" }}
    aria-disabled={disabled}
    gap={2}
    px={4}
    py={2}
    _hover={{ bg: "gray.800" }}
    color="text.main"
    cursor="pointer"
    onClick={onSelect}
    transition="all 0.25s ease-in-out"
  >
    {children}
  </Flex>
);

export const SelectInputBase = <T extends string>({
  disableMaxH = false,
  formLabel,
  hasDivider = false,
  helperTextComponent,
  initialSelected,
  isRequired,
  labelBgColor = "background.main",
  onChange,
  options,
  placeholder = "",
  popoverBgColor = "gray.900",
  size = "lg",
}: SelectInputProps<T>) => {
  const inputRef = useRef() as MutableRefObject<HTMLInputElement>;
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
      strategy="fixed"
      onClose={onClose}
      onOpen={onOpen}
      returnFocusOnClose={false}
    >
      <PopoverTrigger>
        <InputGroup
          sx={{
            "& .form-label": {
              "::after": {
                color: "error.main",
                content: isRequired ? '"* (Required)"' : '""',
                ml: 1,
              },
              bg: labelBgColor,
              color: "text.dark",
              fontSize: "12px",
              letterSpacing: "0.15px",
              ml: 3,
              position: "absolute",
              px: 1,
              top: -2,

              zIndex: 2,
            },
            "&[aria-expanded=true]": {
              "> input": {
                border: "2px solid",
                borderColor: "primary.dark",
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
                name={selectedOption.icon}
                color={selectedOption.iconColor}
              />
            </InputLeftElement>
          )}
          <Input
            pl={selectedOption?.icon || selectedOption?.image ? 10 : 4}
            size={size}
            textAlign="start"
            type="button"
            value={selected || placeholder}
            color={selected ? "text.main" : "text.dark"}
            fontSize="14px"
            ref={inputRef}
          />
          <InputRightElement h="full" pointerEvents="none">
            <CustomIcon name="chevron-down" color="gray.600" />
          </InputRightElement>
        </InputGroup>
      </PopoverTrigger>
      <PopoverContent
        bg={popoverBgColor}
        maxH={disableMaxH ? undefined : `${ITEM_HEIGHT * 4}px`}
        sx={{
          "> div:not(:last-of-type)": {
            borderBottom: hasDivider && "1px solid",
            borderBottomColor: hasDivider && "gray.700",
          },
        }}
        w={inputRef.current?.clientWidth}
        _focusVisible={{
          outline: "none",
        }}
        border="unset"
        borderRadius="8px"
        overflow="scroll"
      >
        {options.map(({ disabled, icon, iconColor, image, label, value }) => (
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
              {icon && <CustomIcon name={icon} color={iconColor} />}
              {label}
            </Flex>
          </SelectItem>
        ))}
        {helperTextComponent && (
          <Flex
            align="center"
            h={`${ITEM_HEIGHT}px`}
            px={4}
            borderTop={!hasDivider ? "1px solid" : "none"}
            borderTopColor="gray.700"
          >
            {helperTextComponent}
          </Flex>
        )}
      </PopoverContent>
    </Popover>
  );
};
