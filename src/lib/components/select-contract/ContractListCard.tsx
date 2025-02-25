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
import type { ContractListInfo } from "lib/stores/contract";
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
      as={Button}
      variant="gray-solid"
      h="75px"
      onClick={() => handleListSelect(item.slug)}
      isDisabled={isDisabled}
      gap={4}
      w="full"
      alignItems="center"
      justifyContent="flex-start"
    >
      <CustomIcon
        name={getListIcon(item.name)}
        boxSize="24px"
        color="gray.600"
      />
      <Flex
        flexDirection="column"
        alignItems="start"
        gap={1}
        w="full"
        maxW="calc(100% - 108px)"
      >
        <Flex alignItems="center" gap={2} w="full">
          <Text
            variant="body1"
            textColor={isDisabled ? "text.disabled" : "text.main"}
            fontWeight={700}
            textOverflow="ellipsis"
            overflow="hidden"
          >
            {item.name}
          </Text>
          <Badge>{item.contracts.length}</Badge>
        </Flex>
        {!isInstantiatedByMe && (
          <Text
            variant="body3"
            textColor={isDisabled ? "text.disabled" : "text.dark"}
          >
            Updated {dateFromNow(item.lastUpdated)}
          </Text>
        )}
      </Flex>
      {!isReadOnly && item.isInfoEditable && (
        <Menu>
          <MenuButton
            m={0}
            size="sm"
            h="full"
            variant="ghost-gray"
            as={Button}
            onClick={(e) => e.stopPropagation()}
          >
            <CustomIcon name="more" color="gray.600" />
          </MenuButton>
          <MenuList zIndex={10} onClick={(e) => e.stopPropagation()}>
            <EditListNameModal
              list={{ label: item.name, value: item.slug }}
              menuItemProps={{
                icon: <CustomIcon name="edit" color="gray.600" />,
                children: "Edit list name",
              }}
            />
            <RemoveListModal
              list={{ label: item.name, value: item.slug }}
              menuItemProps={{
                icon: <CustomIcon name="delete" color="error.light" />,
                children: "Remove list",
              }}
            />
          </MenuList>
        </Menu>
      )}
    </Flex>
  );
};
