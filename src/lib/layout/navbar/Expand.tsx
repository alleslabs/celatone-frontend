import { Box, Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import { MdAdd, MdDoubleArrow } from "react-icons/md";

import { AppLink } from "lib/components/AppLink";
import { CreateNewListModal } from "lib/components/modal";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

import type { NavMenuProps } from "./type";

export const ExpandNavMenu = ({
  navMenu,
  isCurrentPage,
  setIsExpand,
}: NavMenuProps) => (
  <Box px={4} py={2} overflowY="auto">
    {navMenu.map((item) => (
      <Box
        pb="4"
        mb="4"
        key={item.category}
        borderBottom="1px solid"
        borderColor="pebble.700"
        sx={{
          "&:last-of-type": {
            borderBottom: "none",
            paddingBottom: "0px",
            marginBottom: "0px",
          },
        }}
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Text py="2" variant="body3" fontWeight="600">
            {item.category}
          </Text>
          {item.category === "Overview" && (
            <Button
              variant="ghost-info"
              size="xs"
              leftIcon={<MdDoubleArrow transform="rotate(180)" />}
              onClick={() => setIsExpand(false)}
            >
              HIDE
            </Button>
          )}
          {item.category === "Contracts" && (
            <CreateNewListModal
              buttonProps={{
                variant: "ghost-info",
                size: "xs",
                leftIcon: <MdAdd />,
                children: "NEW LIST",
                onClick: () => AmpTrack(AmpEvent.USE_SIDEBAR),
              }}
            />
          )}
        </Flex>
        {item.submenu.map((submenu) => (
          <AppLink
            href={submenu.slug}
            key={submenu.slug}
            onClick={() => AmpTrack(AmpEvent.USE_SIDEBAR)}
          >
            <Flex
              gap="2"
              p={2}
              cursor="pointer"
              _hover={{ bg: "pebble.700", borderRadius: "8px" }}
              my="1px"
              transition="all .25s ease-in-out"
              alignItems="center"
              bgColor={
                isCurrentPage(submenu.slug) ? "pebble.800" : "transparent"
              }
              borderRadius={isCurrentPage(submenu.slug) ? "8px" : "0px"}
            >
              {submenu.icon && (
                <Icon as={submenu.icon} color="pebble.600" boxSize="4" />
              )}
              {submenu.logo && (
                <Image
                  src={submenu.logo}
                  borderRadius="full"
                  alt={submenu.slug}
                  boxSize={4}
                />
              )}
              <Text variant="body2" className="ellipsis">
                {submenu.name}
              </Text>
            </Flex>
          </AppLink>
        ))}
      </Box>
    ))}
  </Box>
);
