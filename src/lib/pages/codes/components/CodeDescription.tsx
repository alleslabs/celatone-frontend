import { Flex, Text, Icon, Input, Button, useToast } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useState } from "react";
import { MdMode, MdCheckCircle, MdCheck, MdClose } from "react-icons/md";

import { MAX_CODE_DESCRIPTION_LENGTH } from "lib/data";
import { useCodeStore, useUserKey } from "lib/hooks";

/** This component is duplicated by ContractNameCell
 * So, we will abstract it later
 */
interface CodeDescriptionProps {
  codeId: number;
  description?: string;
}

export const CodeDescription = ({
  codeId,
  description,
}: CodeDescriptionProps) => {
  const toast = useToast();
  const { updateCodeInfo } = useCodeStore();
  const userKey = useUserKey();

  const [inputValue, setInputValue] = useState(description);
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
  const handleCancel = () => {
    setIsEdit(false);
    setInputValue(description);
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newVal = event.target.value;
    setInputValue(newVal);
  };

  const showName = isHoverText && (inputValue ?? "").length > 20;
  const handleSave = () => {
    updateCodeInfo(userKey, codeId, { description: inputValue });

    setIsEdit(false);
    toast({
      title: "Changed description successfully!",
      status: "success",
      duration: 5000,
      isClosable: false,
      position: "bottom-right",
      icon: (
        <Icon
          as={MdCheckCircle}
          color="success.main"
          boxSize="6"
          display="flex"
          alignItems="center"
        />
      ),
    });
  };

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
            maxLength={MAX_CODE_DESCRIPTION_LENGTH}
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
            {/* TODO change to css */}
            <Text
              variant="body2"
              overflow="hidden"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
              maxW="150px"
              color={inputValue ? "text.main" : "text.dark"}
            >
              {inputValue ?? "No Description"}
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
          <Icon
            opacity={isHover ? 1 : 0}
            as={MdMode}
            color="gray.600"
            boxSize="4"
            cursor="pointer"
            onClick={handleEdit}
          />
        </Flex>
      )}
    </Flex>
  );
};
