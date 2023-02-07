import { InfoIcon } from "@chakra-ui/icons";
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
  onSave?: (value?: string) => void;
}
export const EditableCell = ({
  initialValue = "",
  defaultValue,
  maxLength,
  tooltip,
  onSave,
}: EditableCellProps) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [isHover, setIsHover] = useState(false);
  const [isHoverText, setIsHoverText] = useState(false);

  const ref = useRef(null);
  const [isEditCellOpen, setIsEditCellOpen] = useState(false);
  useOutsideClick({
    ref,
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

  // TODO: reconsider 20
  const showName = isHoverText && inputValue.trim().length > 20;
  const isShowInputValue = inputValue.trim().length;

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
      >
        {isEditCellOpen ? (
          <Flex
            ref={ref}
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
            alignItems="center"
            gap={2}
            onClick={(e) => e.stopPropagation()}
          >
            <Flex
              position="relative"
              onMouseOver={handleMouseEnterText}
              onMouseOut={handleMouseOutText}
            >
              <Text
                variant="body2"
                className="ellipsis"
                maxW="150px"
                fontWeight={isShowInputValue ? "600" : "400"}
                color={isShowInputValue ? "text.main" : "text.dark"}
              >
                {isShowInputValue ? inputValue : defaultValue}{" "}
              </Text>
              {showName && (
                <Text
                  variant="body2"
                  top="-16px"
                  left="-16px"
                  borderRadius="8px"
                  bg="pebble.800"
                  whiteSpace="nowrap"
                  p={4}
                  position="absolute"
                  zIndex="1"
                >
                  {inputValue}
                </Text>
              )}
            </Flex>
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
