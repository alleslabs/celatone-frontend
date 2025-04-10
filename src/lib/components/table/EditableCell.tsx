import type { TextProps } from "@chakra-ui/react";
import type { ChangeEvent, RefObject } from "react";

import { Button, Flex, Input, Text, useOutsideClick } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { useEffect, useRef, useState } from "react";

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

  const editCellRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isEditCellOpen, setIsEditCellOpen] = useState(false);
  useOutsideClick({
    ref: editCellRef as RefObject<HTMLDivElement>,
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

  const isMobile = useMobile();
  return (
    <>
      {isEditCellOpen && (
        <Flex
          bg="transparent"
          height="full"
          left={0}
          position="absolute"
          top={0}
          width="full"
          zIndex={1}
          onClick={(e) => {
            e.stopPropagation();
            setIsEditCellOpen(false);
          }}
        />
      )}
      <Flex
        gap={1}
        position="relative"
        w="full"
        onMouseOut={handleMouseOut}
        onMouseOver={handleMouseEnter}
      >
        {isEditCellOpen ? (
          <Flex
            bg="gray.800"
            borderRadius="8px"
            direction="column"
            left="-16px"
            p={3}
            position="absolute"
            top="-32px"
            zIndex="sticky"
            onClick={(e) => e.stopPropagation()}
            ref={editCellRef}
          >
            <Flex alignItems="center" gap={1}>
              <Input
                autoFocus
                maxLength={maxLength}
                minH="40px"
                minW="472px"
                size="sm"
                value={inputValue}
                width="full"
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  else if (e.key === "Escape") handleCancel();
                }}
              />
              <Button size="sm" variant="ghost" onClick={handleSave}>
                <CustomIcon color="success.main" name="check" />
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancel}>
                <CustomIcon color="error.light" name="close" />
              </Button>
            </Flex>
            <Text color="text.dark" fontSize="body3" ml={4} mt={2}>
              Your input will be stored in this device only.
            </Text>
          </Flex>
        ) : (
          <Flex
            align="center"
            gap={2}
            maxW="full"
            position="relative"
            w="fit-content"
            onClick={(e) => {
              if (!isReadOnly) e.stopPropagation();
            }}
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
                borderRadius="8px"
                left="-16px"
                p={4}
                position="absolute"
                top="-16px"
                variant="body2"
                whiteSpace="nowrap"
                zIndex="1"
                onMouseOut={handleMouseOutText}
              >
                {inputValue}
              </Text>
            )}
            {!isMobile && !!tooltip && (
              <Tooltip label={tooltip}>
                <p>
                  <CustomIcon
                    boxSize="12px"
                    cursor="pointer"
                    name="info-circle"
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
                <CustomIcon boxSize={3} color="gray.600" name="edit" />
              </Flex>
            )}
          </Flex>
        )}
      </Flex>
    </>
  );
};
