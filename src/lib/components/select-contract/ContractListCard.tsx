import {
  Flex,
  Button,
  Tag,
  Text,
  LinkBox,
  LinkOverlay,
  Menu,
  MenuButton,
  MenuList,
  Spacer,
} from "@chakra-ui/react";

import { CustomIcon } from "../icon";
import { EditListNameModal, RemoveListModal } from "lib/components/modal";
import { getListIcon, INSTANTIATED_LIST_NAME } from "lib/data";
import type { ContractListInfo } from "lib/stores/contract";
import { dateFromNow, formatSlugName } from "lib/utils";

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
  const showLastUpdated = item.slug !== formatSlugName(INSTANTIATED_LIST_NAME);

  return (
    <LinkBox cursor="pointer">
      <Flex
        p="4"
        alignItems="center"
        bg="pebble.800"
        _hover={{ bg: "pebble.700" }}
        borderRadius="8px"
        transition="all .25s ease-in-out"
        gap="4"
        h="75px"
      >
        <CustomIcon name={getListIcon(item.name)} boxSize="24px" />
        <Flex flexDirection="column">
          <Flex alignItems="center" gap="2">
            <LinkOverlay
              onClick={() => handleListSelect(item.slug)}
              display="grid"
              whiteSpace="nowrap"
            >
              <Text
                variant="body1"
                fontWeight="600"
                textOverflow="ellipsis"
                overflow="hidden"
              >
                {item.name}
              </Text>
            </LinkOverlay>
            <Tag
              variant="solid"
              size="sm"
              minW="min-content"
              backgroundColor="pebble.700"
              borderRadius="full"
              paddingTop="1px"
              textColor="text.dark"
            >
              {item.contracts.length}
            </Tag>
          </Flex>
          {showLastUpdated && (
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
    </LinkBox>
  );
};
