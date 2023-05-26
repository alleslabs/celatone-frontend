import {
  Flex,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  Spacer,
  Badge,
} from "@chakra-ui/react";

import { CustomIcon } from "../icon";
import { EditListNameModal, RemoveListModal } from "lib/components/modal";
import { INSTANTIATED_LIST_NAME } from "lib/data";
import type { ContractListInfo } from "lib/stores/contract";
import { dateFromNow, formatSlugName, getListIcon } from "lib/utils";

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
    item.slug !== formatSlugName(INSTANTIATED_LIST_NAME);
  const isDisabled = isReadOnly && isInstantiatedByMe && !item.contracts.length;

  return (
    <Flex
      as={Button}
      gap={4}
      h="75px"
      onClick={() => handleListSelect(item.slug)}
      bg="pebble.800"
      _hover={{ bg: "pebble.700" }}
      _disabled={{
        bg: "pebble.800",
        _hover: { bg: "pebble.800" },
      }}
      isDisabled={isDisabled}
    >
      <CustomIcon name={getListIcon(item.name)} boxSize="24px" />
      <Flex flexDirection="column" alignItems="start" gap={1}>
        <Flex alignItems="center" gap={2}>
          <Text
            variant="body1"
            textColor={isDisabled ? "text.disabled" : "text.main"}
            fontWeight="600"
            textOverflow="ellipsis"
            overflow="hidden"
          >
            {item.name}
          </Text>
          <Badge variant="gray" color="text.main">
            {item.contracts.length}
          </Badge>
        </Flex>
        {isInstantiatedByMe && (
          <Text variant="body3" color="text.dark">
            Updated {dateFromNow(item.lastUpdated)}
          </Text>
        )}
      </Flex>
      <Spacer />
      {!isReadOnly && (
        <Menu>
          <MenuButton m="0" h="full" variant="ghost-gray" as={Button}>
            <CustomIcon name="more" />
          </MenuButton>
          <MenuList>
            <EditListNameModal
              list={{ label: item.name, value: item.slug }}
              menuItemProps={{
                icon: <CustomIcon name="edit" />,
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
