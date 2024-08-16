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
    px={4}
    py={2}
    onClick={onSelect}
    color="text.main"
    cursor="pointer"
    gap={2}
    aria-disabled={disabled}
    _hover={{ bg: "gray.800" }}
    transition="all 0.25s ease-in-out"
    _disabled={{ opacity: 0.4, pointerEvents: "none" }}
  >
    {children}
  </Flex>
);

export const SelectInput = <T extends string>({
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
      placement="bottom-start"
      strategy="fixed"
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      returnFocusOnClose={false}
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
            <InputLeftElement pointerEvents="none" h="full" ml={1}>
              {selectedOption.image}
            </InputLeftElement>
          )}
          {selectedOption?.icon && (
            <InputLeftElement pointerEvents="none" h="full" ml={1}>
              <CustomIcon
                name={selectedOption.icon}
                color={selectedOption.iconColor}
              />
            </InputLeftElement>
          )}
          <Input
            ref={inputRef}
            size={size}
            textAlign="start"
            type="button"
            value={selected || placeholder}
            fontSize="14px"
            color={selected ? "text.main" : "text.dark"}
            pl={selectedOption?.icon || selectedOption?.image ? 10 : 4}
          />
          <InputRightElement pointerEvents="none" h="full">
            <CustomIcon name="chevron-down" color="gray.600" />
          </InputRightElement>
        </InputGroup>
      </PopoverTrigger>
      <PopoverContent
        border="unset"
        bg={popoverBgColor}
        w={inputRef.current?.clientWidth}
        maxH={disableMaxH ? undefined : `${ITEM_HEIGHT * 4}px`}
        borderRadius="8px"
        _focusVisible={{
          outline: "none",
        }}
        sx={{
          "> div:not(:last-of-type)": {
            borderBottom: hasDivider && "1px solid",
            borderBottomColor: hasDivider && "gray.700",
          },
        }}
        overflow="scroll"
      >
        {options.map(({ label, value, disabled, icon, iconColor, image }) => (
          <SelectItem
            key={value}
            onSelect={() => {
              setSelected(label);
              onChange(value);
              onClose();
            }}
            disabled={disabled}
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
            px={4}
            h={`${ITEM_HEIGHT}px`}
            align="center"
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
