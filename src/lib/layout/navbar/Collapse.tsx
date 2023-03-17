import { Box, Flex, IconButton, Image, Tooltip } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { CustomIcon } from "lib/components/icon";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

import type { NavMenuProps } from "./type";

export const CollapseNavMenu = ({
  navMenu,
  isCurrentPage,
  setIsExpand,
}: NavMenuProps) => {
  const isMobile = useMobile();

  return (
    <Box overflowY="auto" overflowX="hidden">
      {navMenu.map((item) => (
        <Box
          minW="fit-content"
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
            {!isMobile && item.category === "Overview" && (
              <Tooltip
                label="Expand"
                hasArrow
                placement="right"
                bg="honeydew.darker"
              >
                <IconButton
                  aria-label="overview"
                  variant="ghost-info"
                  fontSize="24px"
                  height="fit-content"
                  minW="fit-content"
                  p={1}
                  mt={2}
                  mx={2}
                  icon={
                    <CustomIcon
                      name="double-chevron-right"
                      color="honeydew.main"
                    />
                  }
                  onClick={() => setIsExpand(true)}
                />
              </Tooltip>
            )}
          </Flex>
          {item.submenu.map((submenu) => (
            <AppLink
              href={submenu.slug}
              key={submenu.slug}
              onClick={() => AmpTrack(AmpEvent.USE_SIDEBAR)}
            >
              <Tooltip
                label={submenu.name}
                hasArrow
                placement="right"
                bg="honeydew.darker"
              >
                <Flex
                  cursor="pointer"
                  p={1}
                  m={2}
                  _hover={{ bg: "pebble.700", borderRadius: "8px" }}
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
                    height="16px"
                    bgColor="violet.light"
                    position="absolute"
                    top="8px"
                    borderRadius="2px"
                    left="0px"
                  />
                  {submenu.icon && <CustomIcon name={submenu.icon} />}
                  {submenu.logo && (
                    <Image
                      src={submenu.logo}
                      borderRadius="full"
                      alt={submenu.slug}
                      boxSize={6}
                    />
                  )}
                </Flex>
              </Tooltip>
            </AppLink>
          ))}
        </Box>
      ))}
    </Box>
  );
};
