import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";

import { AppLink } from "lib/components/AppLink";
import { CustomIcon } from "lib/components/icon";
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
              iconSpacing={1}
              leftIcon={
                <CustomIcon
                  name="double-chevron-left"
                  color="honeydew.main"
                  boxSize="3"
                />
              }
              onClick={() => setIsExpand(false)}
            >
              HIDE
            </Button>
          )}
          {item.category === "Contracts" && (
            <CreateNewListModal
              buttonProps={{
                variant: "ghost-info",
                iconSpacing: 1,
                size: "xs",
                leftIcon: (
                  <CustomIcon name="plus" color="honeydew.main" boxSize="3" />
                ),
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
              position="relative"
              bgColor={
                isCurrentPage(submenu.slug) ? "pebble.800" : "transparent"
              }
              borderRadius={isCurrentPage(submenu.slug) ? "8px" : "0px"}
            >
              <Flex
                opacity={isCurrentPage(submenu.slug) ? 1 : 0}
                width="3px"
                height="20px"
                bgColor="violet.light"
                position="absolute"
                top="10px"
                borderRadius="2px"
                left="0px"
              />
              {submenu.icon && <CustomIcon name={submenu.icon} />}
              {submenu.logo && (
                <Image
                  src={submenu.logo}
                  borderRadius="full"
                  alt={submenu.slug}
                  boxSize={5}
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
