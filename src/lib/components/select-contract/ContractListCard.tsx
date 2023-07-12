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
      variant="gray-solid"
      gap={4}
      h="75px"
      onClick={() => handleListSelect(item.slug)}
      isDisabled={isDisabled}
    >
      <CustomIcon
        name={getListIcon(item.name)}
        boxSize="24px"
        color="gray.600"
      />
      <Flex flexDirection="column" alignItems="start" gap={1}>
        <Flex alignItems="center" gap={2}>
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
        {isInstantiatedByMe && (
          <Text
            variant="body3"
            textColor={isDisabled ? "text.disabled" : "text.dark"}
          >
            Updated {dateFromNow(item.lastUpdated)}
          </Text>
        )}
      </Flex>
      <Spacer />
      {!isReadOnly && (
        <Menu>
          <MenuButton
            m={0}
            h="full"
            variant="ghost-gray"
            as={Button}
            onClick={(e) => e.stopPropagation()}
          >
            <CustomIcon name="more" color="gray.600" />
          </MenuButton>
          <MenuList>
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
