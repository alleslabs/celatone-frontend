import type { TextProps } from "@chakra-ui/react";
import { Flex, Text, Input, Button, useOutsideClick } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useRef, useState, useEffect } from "react";

import { CustomIcon } from "../icon";
import { Tooltip } from "../Tooltip";

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

  useEffect(() => setInputValue(initialValue), [initialValue]);

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
            bg="gray.800"
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
              <Button size="sm" onClick={handleSave} variant="ghost">
                <CustomIcon name="check" color="success.main" />
              </Button>
              <Button onClick={handleCancel} size="sm" variant="ghost">
                <CustomIcon name="close" color="error.light" />
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
            onClick={(e) => {
              if (!isReadOnly) e.stopPropagation();
            }}
          >
            <Text
              variant="body2"
              className="ellipsis"
              maxW="full"
              onClick={(e) => e.stopPropagation()}
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
                bg={isReadOnly ? "gray.700" : "gray.800"}
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
              <Tooltip label={tooltip}>
                <p>
                  <CustomIcon
                    name="info-circle"
                    boxSize="12px"
                    cursor="pointer"
                  />
                </p>
              </Tooltip>
            )}
            {!!onSave && !isReadOnly && (
              <Flex
                cursor="pointer"
                opacity={isHover ? 1 : 0}
                onClick={handleEdit}
              >
                <CustomIcon name="edit" color="gray.600" boxSize={3} />
              </Flex>
            )}
          </Flex>
        )}
      </Flex>
    </>
  );
};
