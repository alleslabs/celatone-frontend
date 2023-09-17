import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";

import { AmpEvent, useTrack } from "lib/amplitude";
import { AppLink } from "lib/components/AppLink";
import { CustomIcon } from "lib/components/icon";
import { Tooltip } from "lib/components/Tooltip";

import type { NavMenuProps, SubmenuInfo } from "./type";

interface NavInfoProps {
  submenu: SubmenuInfo;
  isCurrentPage: (slug: string) => boolean;
}
const NavInfo = ({ submenu, isCurrentPage }: NavInfoProps) => (
  <Flex
    gap={2}
    p={2}
    cursor={submenu.isDisable ? undefined : "pointer"}
    _hover={
      submenu.isDisable ? undefined : { bg: "gray.700", borderRadius: "8px" }
    }
    my="1px"
    transition="all .25s ease-in-out"
    alignItems="center"
    position="relative"
    bgColor={isCurrentPage(submenu.slug) ? "gray.800" : "transparent"}
    borderRadius={isCurrentPage(submenu.slug) ? "8px" : "0px"}
  >
    <Flex
      opacity={isCurrentPage(submenu.slug) ? 1 : 0}
      width="3px"
      height="20px"
      bgColor="primary.light"
      position="absolute"
      top="10px"
      borderRadius="2px"
      left="0px"
    />
    {submenu.icon && <CustomIcon name={submenu.icon} color="gray.600" />}
    {submenu.logo && (
      <Image
        src={submenu.logo}
        borderRadius="full"
        alt={submenu.slug}
        boxSize={5}
      />
    )}
    <Text
      variant="body2"
      className="ellipsis"
      color={submenu.isDisable ? "text.disabled" : "text.main"}
    >
      {submenu.name}
    </Text>
  </Flex>
);

export const ExpandNavMenu = ({
  navMenu,
  isCurrentPage,
  setIsExpand,
}: NavMenuProps) => {
  const { track } = useTrack();

  return (
    <Box px={4} py={2} overflowY="auto">
      {navMenu.map((item) => (
        <Box
          pb={4}
          mb={4}
          key={item.category}
          borderBottom="1px solid"
          borderColor="gray.700"
          sx={{
            "&:last-of-type": {
              borderBottom: "none",
              paddingBottom: "0px",
              marginBottom: "0px",
            },
          }}
        >
          <Flex justifyContent="space-between" alignItems="center">
            <Text py={2} variant="body3" fontWeight={700}>
              {item.category}
            </Text>
            {item.category === "Your Account" && (
              <Button
                variant="ghost-accent"
                size="xs"
                iconSpacing={1}
                leftIcon={<CustomIcon name="double-chevron-left" boxSize={3} />}
                onClick={() => setIsExpand(false)}
              >
                HIDE
              </Button>
            )}
          </Flex>
          {item.submenu.map((submenu) =>
            submenu.isDisable ? (
              <Tooltip
                key={submenu.slug}
                label={submenu.tooltipText}
                maxW="240px"
              >
                <div>
                  <NavInfo submenu={submenu} isCurrentPage={isCurrentPage} />
                </div>
              </Tooltip>
            ) : (
              <AppLink
                href={submenu.slug}
                key={submenu.slug}
                onClick={() => track(AmpEvent.USE_SIDEBAR)}
              >
                <NavInfo submenu={submenu} isCurrentPage={isCurrentPage} />
              </AppLink>
            )
          )}
        </Box>
      ))}
    </Box>
  );
};
