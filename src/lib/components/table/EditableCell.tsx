import { InfoIcon } from "@chakra-ui/icons";
import type { TextProps } from "@chakra-ui/react";
import {
  Flex,
  Text,
  Icon,
  Input,
  Button,
  Tooltip,
  useOutsideClick,
} from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useRef, useState } from "react";
import { MdMode, MdCheck, MdClose } from "react-icons/md";

interface EditableCellProps {
  initialValue?: string;
  defaultValue: string;
  maxLength: number;
  tooltip?: string;
  isReadOnly?: boolean;
  onSave?: (value?: string) => void;
}

const getInputValueTextProps = (
  isShowInputValue: boolean,
  inputValue: string,
  defaultValue: string
): Pick<TextProps, "fontWeight" | "color" | "children"> => {
  if (isShowInputValue) {
    return { fontWeight: 600, color: "text.main", children: inputValue };
  }
  return { fontWeight: 400, color: "text.dark", children: defaultValue };
};

export const EditableCell = ({
  initialValue = "",
  defaultValue,
  maxLength,
  tooltip,
  isReadOnly,
  onSave,
}: EditableCellProps) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [isHover, setIsHover] = useState(false);
  const [isHoverText, setIsHoverText] = useState(false);

  const editCellRef = useRef(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isEditCellOpen, setIsEditCellOpen] = useState(false);
  useOutsideClick({
    ref: editCellRef,
    handler: () => {
      setIsEditCellOpen(false);
    },
  });

  const handleMouseEnter = () => {
    setIsHover(true);
  };
  const handleMouseOut = () => {
    setIsHover(false);
  };
  const handleMouseEnterText = () => {
    setIsHoverText(true);
  };
  const handleMouseOutText = () => {
    setIsHoverText(false);
  };
  const handleEdit = () => {
    setIsEditCellOpen(true);
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newVal = event.target.value;
    setInputValue(newVal.trimStart());
  };
  const handleCancel = () => {
    setIsEditCellOpen(false);
    setInputValue(initialValue);
  };

  const handleSave = () => {
    setIsEditCellOpen(false);
    onSave?.(inputValue);
  };

  const isShowInputValue = Boolean(inputValue.trim().length);
  const showName =
    isHoverText &&
    isShowInputValue &&
    Number(textRef.current?.scrollWidth) > Number(textRef.current?.clientWidth);

  return (
    <>
      {isEditCellOpen && (
        <Flex
          position="absolute"
          left={0}
          top={0}
          bg="transparent"
          width="full"
          height="full"
          onClick={(e) => {
            e.stopPropagation();
            setIsEditCellOpen(false);
          }}
          zIndex={1}
        />
      )}
      <Flex
        gap={1}
        onMouseOver={handleMouseEnter}
        onMouseOut={handleMouseOut}
        position="relative"
        zIndex={2}
        w="full"
      >
        {isEditCellOpen ? (
          <Flex
            ref={editCellRef}
            alignItems="center"
            gap={1}
            position="absolute"
            top="-28px"
            left="-16px"
            bg="pebble.800"
            p={3}
            borderRadius="8px"
            zIndex="sticky"
            onClick={(e) => e.stopPropagation()}
          >
            <Input
              size="sm"
              value={inputValue}
              onChange={handleChange}
              width="full"
              minWidth="300px"
              maxLength={maxLength}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                else if (e.key === "Escape") handleCancel();
              }}
            />
            <Button size="sm" onClick={handleSave} variant="ghost-gray">
              <Icon as={MdCheck} color="success.main" />
            </Button>
            <Button onClick={handleCancel} size="sm" variant="ghost-gray">
              <Icon as={MdClose} color="error.light" />
            </Button>
          </Flex>
        ) : (
          <Flex
            position="relative"
            w="fit-content"
            maxW="full"
            align="center"
            gap={2}
            onClick={(e) => {
              if (!isReadOnly) e.stopPropagation();
            }}
          >
            <Text
              variant="body2"
              className="ellipsis"
              maxW="full"
              onMouseOver={handleMouseEnterText}
              ref={textRef}
              {...getInputValueTextProps(
                isShowInputValue,
                inputValue,
                defaultValue
              )}
            />
            {showName && (
              <Text
                variant="body2"
                top="-16px"
                left="-16px"
                borderRadius="8px"
                bg={isReadOnly ? "pebble.700" : "pebble.800"}
                whiteSpace="nowrap"
                p={4}
                position="absolute"
                zIndex="1"
                onMouseOut={handleMouseOutText}
              >
                {inputValue}
              </Text>
            )}
            {!!tooltip && (
              <Tooltip
                hasArrow
                label={tooltip}
                placement="top"
                bg="honeydew.darker"
                arrowSize={8}
              >
                <InfoIcon color="pebble.600" boxSize="14px" cursor="pointer" />
              </Tooltip>
            )}
            {!!onSave && (
              <Icon
                opacity={isHover ? 1 : 0}
                as={MdMode}
                color="pebble.600"
                boxSize="4"
                cursor="pointer"
                onClick={handleEdit}
              />
            )}
          </Flex>
        )}
      </Flex>
    </>
  );
};
