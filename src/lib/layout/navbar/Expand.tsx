import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";

import { AppLink } from "lib/components/AppLink";
import { CustomIcon } from "lib/components/icon";
import { Tooltip } from "lib/components/Tooltip";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

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
}: NavMenuProps) => (
  <Box px={4} py={2} overflowY="auto">
    {navMenu.map((item) => (
      <Box
        pt={!item.isSubSection ? 4 : 2}
        mt={!item.isSubSection ? 4 : 0}
        key={item.category}
        borderTop={!item.isSubSection ? "1px solid" : "none"}
        borderColor={!item.isSubSection ? "gray.700" : "transparent"}
        sx={{
          "&:first-of-type": {
            borderTop: "none",
            paddingTop: "0px",
            marginTop: "0px",
          },
        }}
      >
        <Flex justifyContent="space-between" alignItems="center">
          {item.isSubSection ? (
            <Text py={2} variant="body3" fontWeight={700} color="text.dark">
              {item.category}
            </Text>
          ) : (
            <Text py={2} variant="body2" fontWeight={700}>
              {item.category}
            </Text>
          )}
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
              onClick={() => AmpTrack(AmpEvent.USE_SIDEBAR)}
            >
              <NavInfo submenu={submenu} isCurrentPage={isCurrentPage} />
            </AppLink>
          )
        )}
      </Box>
    ))}
  </Box>
);
