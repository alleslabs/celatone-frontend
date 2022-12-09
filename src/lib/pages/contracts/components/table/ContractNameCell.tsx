import { Flex, Text, Icon, Input, Button, Tooltip } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useState } from "react";
import { MdMode, MdInfo, MdCheck, MdClose } from "react-icons/md";

import { useHandleContractSave } from "lib/hooks/useHandleSave";
import type { ContractInfo } from "lib/stores/contract";

interface ContractNameProps {
  contractInfo: ContractInfo;
  isReadOnly?: boolean;
}
export const ContractName = ({
  contractInfo,
  isReadOnly = false,
}: ContractNameProps) => {
  const [value, setValue] = useState(contractInfo.name ?? contractInfo.label);
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
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setValue(event.target.value);

  const showName = isHoverText && value.length > 20;
  const handleSave = useHandleContractSave({
    title: "Changed name successfully!",
    address: contractInfo.address,
    instantiator: contractInfo.instantiator,
    label: contractInfo.label,
    created: contractInfo.created,
    name: value,
    actions: () => {
      if (value.trim().length === 0) setValue(contractInfo.label);
      setIsEdit(false);
    },
  });

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
            value={value}
            onChange={handleChange}
            width="full"
            minWidth="300px"
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
              color={value ? "text.main" : "text.dark"}
            >
              {value}
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
                {value}
              </Text>
            )}
          </Flex>
          {!!contractInfo.description && (
            <Tooltip
              hasArrow
              label={contractInfo.description}
              bg="primary.dark"
              placement="top"
            >
              <Flex alignItems="center">
                <Icon
                  as={MdInfo}
                  color="gray.600"
                  boxSize="4"
                  cursor="pointer"
                />
              </Flex>
            </Tooltip>
          )}
          {!isReadOnly && (
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
