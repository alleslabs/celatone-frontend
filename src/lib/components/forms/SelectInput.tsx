import {
  Input,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useDisclosure,
  useOutsideClick,
  Flex,
  InputLeftElement,
} from "@chakra-ui/react";
import type { MutableRefObject, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import type { IconKeys } from "../icon";
import { CustomIcon } from "../icon";
import type { Option } from "lib/types";

const ITEM_HEIGHT = 56;

interface SelectInputProps<T extends string> {
  formLabel?: string;
  options: {
    label: string;
    value: T;
    disabled: boolean;
    icon?: IconKeys;
    iconColor?: string;
  }[];
  onChange: (newVal: T) => void;
  placeholder?: string;
  initialSelected: string;
  hasDivider?: boolean;
  helperTextComponent?: ReactNode;
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
    _hover={{ bg: "pebble.800" }}
    transition="all .25s ease-in-out"
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
}: SelectInputProps<T>) => {
  const optionRef = useRef() as MutableRefObject<HTMLElement>;
  const inputRef = useRef() as MutableRefObject<HTMLInputElement>;
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selected, setSelected] = useState(
    () => options.find((item) => item.value === initialSelected)?.label ?? ""
  );
  const [inputRefWidth, setInputRefWidth] = useState<Option<number>>();
  useOutsideClick({
    ref: optionRef,
    handler: () => isOpen && onClose(),
  });
  const selectedOption = options.find((item) => item.label === selected);

  useEffect(() => {
    if (inputRef.current) {
      setInputRefWidth(inputRef.current.clientWidth);
    }
  }, [inputRef]);

  useEffect(() => {
    if (options.every((option) => !option.disabled)) {
      setSelected(
        () =>
          options.find((item) => item.value === initialSelected)?.label ?? ""
      );
    }
  }, [initialSelected, options]);

  return (
    <Popover placement="bottom-start" isOpen={isOpen}>
      <PopoverTrigger>
        <InputGroup
          onClick={onOpen}
          sx={{
            "&[aria-expanded=true]": {
              "> input": {
                border: "2px solid",
                borderColor: "lilac.main",
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
              bg: "background.main",
              top: -2,
            },
          }}
        >
          <div className="form-label">{formLabel}</div>
          {selectedOption?.icon && (
            <InputLeftElement pointerEvents="none" h="full" ml="1">
              <CustomIcon
                name={selectedOption.icon}
                color={selectedOption.iconColor}
              />
            </InputLeftElement>
          )}
          <Input
            ref={inputRef}
            size="lg"
            textAlign="start"
            type="button"
            value={selected || placeholder}
            fontSize="14px"
            color={selected ? "text.main" : "text.dark"}
            pl={selectedOption?.icon ? 9 : 4}
          />
          <InputRightElement pointerEvents="none" h="full">
            <CustomIcon name="chevron-down" />
          </InputRightElement>
        </InputGroup>
      </PopoverTrigger>
      <PopoverContent
        ref={optionRef}
        border="unset"
        bg="pebble.900"
        w={inputRefWidth}
        maxH={`${ITEM_HEIGHT * 4}px`}
        overflow="scroll"
        borderRadius="8px"
        _focusVisible={{
          outline: "none",
        }}
        sx={{
          "> div:not(:last-of-type)": {
            borderBottom: hasDivider && "1px solid",
            borderBottomColor: hasDivider && "pebble.700",
          },
        }}
      >
        {options.map(({ label, value, disabled, icon, iconColor }) => (
          <SelectItem
            key={value}
            onSelect={() => {
              setSelected(label);
              onChange(value);
              onClose();
            }}
            disabled={disabled}
          >
            {icon && <CustomIcon name={icon} color={iconColor} />}
            {label}
          </SelectItem>
        ))}
        {helperTextComponent && (
          <Flex
            px={4}
            h={`${ITEM_HEIGHT}px`}
            align="center"
            borderTop={!hasDivider ? "1px solid" : "none"}
            borderTopColor="pebble.700"
          >
            {helperTextComponent}
          </Flex>
        )}
      </PopoverContent>
    </Popover>
  );
};
