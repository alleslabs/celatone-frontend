import type { ContractListInfo } from "lib/stores/contract";

import {
  Badge,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { EditListNameModal, RemoveListModal } from "lib/components/modal";
import { INSTANTIATED_LIST_NAME } from "lib/data";
import { dateFromNow, formatSlugName, getListIcon } from "lib/utils";

import { CustomIcon } from "../icon";

interface ContractListCardProps {
  item: ContractListInfo;
  handleListSelect: (value: string) => void;
  isReadOnly: boolean;
}

export const ContractListCard = ({
  item,
  handleListSelect,
  isReadOnly,
}: ContractListCardProps) => {
  const isInstantiatedByMe =
    item.slug === formatSlugName(INSTANTIATED_LIST_NAME);
  const isDisabled =
    isReadOnly && !isInstantiatedByMe && !item.contracts.length;

  return (
    <Flex
      alignItems="center"
      as={Button}
      gap={4}
      h="75px"
      isDisabled={isDisabled}
      justifyContent="flex-start"
      variant="gray-solid"
      w="full"
      onClick={() => handleListSelect(item.slug)}
    >
      <CustomIcon
        boxSize="24px"
        color="gray.600"
        name={getListIcon(item.name)}
      />
      <Flex
        alignItems="start"
        flexDirection="column"
        gap={1}
        maxW="calc(100% - 108px)"
        w="full"
      >
        <Flex alignItems="center" gap={2} w="full">
          <Text
            fontWeight={700}
            overflow="hidden"
            textColor={isDisabled ? "text.disabled" : "text.main"}
            textOverflow="ellipsis"
            variant="body1"
          >
            {item.name}
          </Text>
          <Badge>{item.contracts.length}</Badge>
        </Flex>
        {!isInstantiatedByMe && (
          <Text
            textColor={isDisabled ? "text.disabled" : "text.dark"}
            variant="body3"
          >
            Updated {dateFromNow(item.lastUpdated)}
          </Text>
        )}
      </Flex>
      {!isReadOnly && item.isInfoEditable && (
        <Menu>
          <MenuButton
            as={Button}
            h="full"
            m={0}
            size="sm"
            variant="ghost-gray"
            onClick={(e) => e.stopPropagation()}
          >
            <CustomIcon color="gray.600" name="more" />
          </MenuButton>
          <MenuList zIndex={10} onClick={(e) => e.stopPropagation()}>
            <EditListNameModal
              list={{ label: item.name, value: item.slug }}
              menuItemProps={{
                icon: <CustomIcon color="gray.600" name="edit" />,
                children: "Edit list name",
              }}
            />
            <RemoveListModal
              list={{ label: item.name, value: item.slug }}
              menuItemProps={{
                icon: <CustomIcon color="error.light" name="delete" />,
                children: "Remove list",
              }}
            />
          </MenuList>
        </Menu>
      )}
    </Flex>
  );
};
