import {
  Badge,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  Text,
} from "@chakra-ui/react";

import { CustomIcon } from "../icon";
import { EditListNameModal, RemoveListModal } from "lib/components/modal";
import { INSTANTIATED_LIST_NAME } from "lib/data";
import type { ContractListInfo } from "lib/stores/contract";
import { dateFromNow, formatSlugName, getListIcon } from "lib/utils";

interface ContractListCardProps {
  handleListSelect: (value: string) => void;
  isReadOnly: boolean;
  item: ContractListInfo;
}

export const ContractListCard = ({
  handleListSelect,
  isReadOnly,
  item,
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
      variant="gray-solid"
      w="full"
      justifyContent="flex-start"
      onClick={() => handleListSelect(item.slug)}
    >
      <CustomIcon
        name={getListIcon(item.name)}
        boxSize="24px"
        color="gray.600"
      />
      <Flex
        alignItems="start"
        gap={1}
        maxW="calc(100% - 108px)"
        w="full"
        flexDirection="column"
      >
        <Flex alignItems="center" gap={2} w="full">
          <Text
            variant="body1"
            fontWeight={700}
            overflow="hidden"
            textColor={isDisabled ? "text.disabled" : "text.main"}
            textOverflow="ellipsis"
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
            as={Button}
            h="full"
            m={0}
            size="sm"
            variant="ghost-gray"
            onClick={(e) => e.stopPropagation()}
          >
            <CustomIcon name="more" color="gray.600" />
          </MenuButton>
          <MenuList zIndex={10} onClick={(e) => e.stopPropagation()}>
            <EditListNameModal
              list={{ label: item.name, value: item.slug }}
              menuItemProps={{
                children: "Edit list name",
                icon: <CustomIcon name="edit" color="gray.600" />,
              }}
            />
            <RemoveListModal
              list={{ label: item.name, value: item.slug }}
              menuItemProps={{
                children: "Remove list",
                icon: <CustomIcon name="delete" color="error.light" />,
              }}
            />
          </MenuList>
        </Menu>
      )}
    </Flex>
  );
};
