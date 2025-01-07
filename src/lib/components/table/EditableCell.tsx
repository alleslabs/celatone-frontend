import type { TextProps } from "@chakra-ui/react";
import { Button, Flex, Input, Text, useOutsideClick } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";

import { CustomIcon } from "../icon";
import { Tooltip } from "../Tooltip";
import { useMobile } from "lib/app-provider";

interface EditableCellProps {
  defaultValue: string;
  initialValue?: string;
  isReadOnly?: boolean;
  maxLength: number;
  onSave?: (value?: string) => void;
  tooltip?: string;
}

const getInputValueTextProps = (
  isShowInputValue: boolean,
  inputValue: string,
  defaultValue: string
): Pick<TextProps, "children" | "color" | "fontWeight"> => {
  if (isShowInputValue) {
    return { children: inputValue, color: "text.main", fontWeight: 600 };
  }
  return { children: defaultValue, color: "text.dark", fontWeight: 400 };
};

export const EditableCell = ({
  defaultValue,
  initialValue = "",
  isReadOnly,
  maxLength,
  onSave,
  tooltip,
}: EditableCellProps) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [isHover, setIsHover] = useState(false);
  const [isHoverText, setIsHoverText] = useState(false);

  const editCellRef = useRef(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isEditCellOpen, setIsEditCellOpen] = useState(false);
  useOutsideClick({
    handler: () => {
      setIsEditCellOpen(false);
    },
    ref: editCellRef,
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

  const isMobile = useMobile();
  return (
    <>
      {isEditCellOpen && (
        <Flex
          width="full"
          bg="transparent"
          height="full"
          left={0}
          zIndex={1}
          onClick={(e) => {
            e.stopPropagation();
            setIsEditCellOpen(false);
          }}
          position="absolute"
          top={0}
        />
      )}
      <Flex
        gap={1}
        w="full"
        onMouseOut={handleMouseOut}
        onMouseOver={handleMouseEnter}
        position="relative"
      >
        {isEditCellOpen ? (
          <Flex
            bg="gray.800"
            left="-16px"
            p={3}
            zIndex="sticky"
            borderRadius="8px"
            direction="column"
            onClick={(e) => e.stopPropagation()}
            position="absolute"
            top="-32px"
            ref={editCellRef}
          >
            <Flex alignItems="center" gap={1}>
              <Input
                width="full"
                maxLength={maxLength}
                minH="40px"
                minW="472px"
                size="sm"
                value={inputValue}
                autoFocus
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  else if (e.key === "Escape") handleCancel();
                }}
              />
              <Button size="sm" variant="ghost" onClick={handleSave}>
                <CustomIcon name="check" color="success.main" />
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancel}>
                <CustomIcon name="close" color="error.light" />
              </Button>
            </Flex>
            <Text ml={4} mt={2} color="text.dark" fontSize="body3">
              Your input will be stored in this device only.
            </Text>
          </Flex>
        ) : (
          <Flex
            align="center"
            gap={2}
            maxW="full"
            w="fit-content"
            onClick={(e) => {
              if (!isReadOnly) e.stopPropagation();
            }}
            position="relative"
          >
            <Text
              className="ellipsis"
              maxW="full"
              variant="body2"
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
                bg={isReadOnly ? "gray.700" : "gray.800"}
                left="-16px"
                p={4}
                variant="body2"
                whiteSpace="nowrap"
                zIndex="1"
                borderRadius="8px"
                onMouseOut={handleMouseOutText}
                position="absolute"
                top="-16px"
              >
                {inputValue}
              </Text>
            )}
            {!isMobile && !!tooltip && (
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
                onClick={handleEdit}
                opacity={isHover ? 1 : 0}
              >
                <CustomIcon name="edit" boxSize={3} color="gray.600" />
              </Flex>
            )}
          </Flex>
        )}
      </Flex>
    </>
  );
};
