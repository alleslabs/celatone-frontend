import {
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Box,
  useDisclosure,
  useOutsideClick,
} from "@chakra-ui/react";
import type { MutableRefObject, ReactNode } from "react";
import { useRef, useState } from "react";
import { MdArrowDropDown } from "react-icons/md";

const ITEM_HEIGHT = 57;

interface SelectInputProps {
  formLabel?: string;
  options: { label: string; value: string; disabled: boolean }[];
  onChange: (newVal: string) => void;
  placeholder?: string;
  initialSelected: string;
}

interface SelectItemProps {
  children: NonNullable<ReactNode>;
  onSelect?: () => void;
  disabled: boolean;
}

const SelectItem = ({ children, onSelect, disabled }: SelectItemProps) => {
  return (
    <Box
      p={4}
      onClick={onSelect}
      color="text.main"
      transition="all .2s"
      cursor="pointer"
      aria-disabled={disabled}
      _hover={{ bg: "gray.800" }}
      _disabled={{ opacity: 0.4, pointerEvents: "none" }}
    >
      {children}
    </Box>
  );
};

export const SelectInput = ({
  formLabel,
  options,
  onChange,
  placeholder = "",
  initialSelected,
}: SelectInputProps) => {
  const optionRef = useRef() as MutableRefObject<HTMLElement>;
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [selected, setSelected] = useState(
    () => options.find((asset) => asset.value === initialSelected)?.label ?? ""
  );

  useOutsideClick({
    ref: optionRef,
    handler: () => isOpen && onClose(),
  });

  return (
    <Popover placement="bottom-start" isOpen={isOpen}>
      <PopoverTrigger>
        <InputGroup
          onClick={onOpen}
          sx={{
            "&[aria-expanded=true]": {
              "> input": {
                border: "2px solid",
                borderColor: "primary.main",
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
          <Input
            size="lg"
            textAlign="start"
            type="button"
            value={selected || placeholder}
            fontSize="14px"
            color={selected ? "text.main" : "text.dark"}
          />
          <InputRightElement pointerEvents="none" h="full">
            <Icon as={MdArrowDropDown} color="text.dark" fontSize="24px" />
          </InputRightElement>
        </InputGroup>
      </PopoverTrigger>
      <PopoverContent
        ref={optionRef}
        border="unset"
        bg="gray.900"
        w="200px"
        maxH={`${ITEM_HEIGHT * 4}px`}
        overflow="scroll"
        borderRadius="4px"
        _focusVisible={{
          outline: "none",
        }}
        sx={{
          "> div:not(:last-of-type)": {
            borderBottom: "1px solid",
            borderBottomColor: "divider.main",
          },
        }}
      >
        {options.map(({ label, value, disabled }) => (
          <SelectItem
            key={value}
            onSelect={() => {
              setSelected(label);
              onChange(value);
              onClose();
            }}
            disabled={disabled}
          >
            {label}
          </SelectItem>
        ))}
      </PopoverContent>
    </Popover>
  );
};
