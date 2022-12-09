import {
  Flex,
  Icon,
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
import dayjs from "dayjs";
import { MdMoreHoriz, MdMode, MdDelete } from "react-icons/md";

import { EditList, RemoveList } from "../list";
import { getListIcon } from "lib/data";
import type { ContractListInfo } from "lib/stores/contract";

interface ListCardProps {
  item: ContractListInfo;
  handleListSelect: (value: string) => void;
  isReadOnly: boolean;
  showLastUpdated: boolean;
}
export const ListCard = ({
  item,
  handleListSelect,
  isReadOnly,
  showLastUpdated,
}: ListCardProps) => {
  const iconProps = {
    boxSize: "4",
    display: "flex",
    alignItems: "center",
  };
  return (
    <LinkBox cursor="pointer">
      <Flex
        p="4"
        alignItems="center"
        bg="gray.900"
        borderRadius="4"
        gap="4"
        h="75px"
      >
        <Icon as={getListIcon(item.name)} color="gray.600" boxSize="6" />
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
              backgroundColor="gray.800"
              borderRadius="10"
              textColor="gray.50"
            >
              {item.contracts.length}
            </Tag>
          </Flex>
          {showLastUpdated && (
            <Text variant="body3" color="gray.400">
              Updated {dayjs(item.lastUpdated).toNow(true)} ago
            </Text>
          )}
        </Flex>
        <Spacer />
        {!isReadOnly && (
          <Menu>
            <MenuButton
              m="0"
              h="full"
              variant="ghost-gray"
              focusBorderColor="primary.main"
              as={Button}
            >
              <MdMoreHoriz />
            </MenuButton>
            <MenuList>
              <EditList
                list={{ label: item.name, value: item.slug }}
                menuItemProps={{
                  icon: <Icon as={MdMode} style={iconProps} color="gray.600" />,
                  children: "Edit list name",
                }}
              />
              <RemoveList
                list={{ label: item.name, value: item.slug }}
                menuItemProps={{
                  icon: (
                    <Icon as={MdDelete} style={iconProps} color="error.light" />
                  ),
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
