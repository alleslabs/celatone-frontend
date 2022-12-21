import { InfoIcon } from "@chakra-ui/icons";
import { Flex, Text, Icon, Input, Button, Tooltip } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useState } from "react";
import { MdMode, MdCheck, MdClose } from "react-icons/md";

interface EditableCellProps {
  initialValue?: string;
  defaultValue: string;
  maxLength: number;
  tooltip?: string;
  onSave?: (value?: string) => void;
}
export const EditableCell = ({
  initialValue,
  defaultValue,
  maxLength,
  tooltip,
  onSave,
}: EditableCellProps) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [isHover, setIsHover] = useState(false);
  const [isHoverText, setIsHoverText] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

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
    setIsEdit(true);
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newVal = event.target.value;
    setInputValue(newVal);
  };
  const handleCancel = () => {
    setIsEdit(false);
    setInputValue(initialValue);
  };
  const handleSave = () => {
    setIsEdit(false);
    onSave?.(inputValue);
  };

  // TODO: reconsider 20
  const showName = isHoverText && (inputValue ?? "").length > 20;
  return (
    <Flex
      gap={1}
      onMouseOver={handleMouseEnter}
      onMouseOut={handleMouseOut}
      position="relative"
    >
      {isEdit ? (
        <Flex
          alignItems="center"
          gap={1}
          position="absolute"
          top="-28px"
          left="-16px"
          bg="gray.800"
          p={3}
          borderRadius="md"
          zIndex="sticky"
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
        <Flex alignItems="center" gap={2}>
          <Flex
            position="relative"
            onMouseOver={handleMouseEnterText}
            onMouseOut={handleMouseOutText}
          >
            <Text
              variant="body2"
              className="ellipsis"
              maxW="150px"
              fontWeight={inputValue ? "600" : "400"}
              color={inputValue ? "text.main" : "text.dark"}
            >
              {inputValue ?? defaultValue}
            </Text>
            {showName && (
              <Text
                variant="body2"
                top="-16px"
                left="-16px"
                borderRadius="md"
                bg="gray.800"
                p={4}
                position="absolute"
                zIndex="1"
              >
                {inputValue}
              </Text>
            )}
          </Flex>
          {!!tooltip && (
            <Tooltip hasArrow label={tooltip} bg="primary.dark" placement="top">
              <InfoIcon color="gray.600" boxSize="14px" cursor="pointer" />
            </Tooltip>
          )}
          {!!onSave && (
            <Icon
              opacity={isHover ? 1 : 0}
              as={MdMode}
              color="gray.600"
              boxSize="4"
              cursor="pointer"
              onClick={handleEdit}
            />
          )}
        </Flex>
      )}
    </Flex>
  );
};
