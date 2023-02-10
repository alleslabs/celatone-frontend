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
        w="full"
      >
        {isEditCellOpen ? (
          <Flex
            direction="column"
            position="absolute"
            zIndex="sticky"
            top="-32px"
            left="-16px"
            bg="pebble.800"
            p={3}
            borderRadius="8px"
            onClick={(e) => e.stopPropagation()}
            ref={editCellRef}
          >
            <Flex alignItems="center" gap={1}>
              <Input
                size="sm"
                value={inputValue}
                onChange={handleChange}
                width="full"
                minW="472px"
                minH="40px"
                maxLength={maxLength}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  else if (e.key === "Escape") handleCancel();
                }}
              />
              <Button size="sm" onClick={handleSave} variant="ghost-gray">
                <Icon boxSize={6} as={MdCheck} color="success.main" />
              </Button>
              <Button onClick={handleCancel} size="sm" variant="ghost-gray">
                <Icon boxSize={6} as={MdClose} color="error.light" />
              </Button>
            </Flex>
            <Text fontSize="body3" color="text.dark" ml={4} mt={2}>
              Your input will be stored in this device only.
            </Text>
          </Flex>
        ) : (
          <Flex
            position="relative"
            w="fit-content"
            maxW="full"
            align="center"
            gap={2}
            onClick={(e) => e.stopPropagation()}
          >
            <Text
              variant="body2"
              className="ellipsis"
              maxW="full"
              fontWeight={isShowInputValue ? "600" : "400"}
              color={isShowInputValue ? "text.main" : "text.dark"}
              onMouseOver={handleMouseEnterText}
              ref={textRef}
            >
              {isShowInputValue ? inputValue : defaultValue}
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
