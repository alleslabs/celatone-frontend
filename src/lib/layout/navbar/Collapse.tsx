import { Box, Flex, IconButton, Image } from "@chakra-ui/react";

import { AmpEvent, track } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { CustomIcon } from "lib/components/icon";
import { Tooltip } from "lib/components/Tooltip";

import type { NavMenuProps, SubmenuInfo } from "./types";

interface CollapseNavInfoProps {
  submenu: SubmenuInfo;
  isCurrentPage: (slug: string) => boolean;
}
const CollapseNavInfo = ({ submenu, isCurrentPage }: CollapseNavInfoProps) => (
  <Tooltip
    label={submenu.isDisable ? submenu.tooltipText : submenu.name}
    placement="right"
  >
    <Flex
      cursor={submenu.isDisable ? undefined : "pointer"}
      p={1}
      m={2}
      _hover={
        submenu.isDisable ? undefined : { bg: "gray.700", borderRadius: "8px" }
      }
      transition="all 0.25s ease-in-out"
      alignItems="center"
      position="relative"
      bgColor={isCurrentPage(submenu.slug) ? "gray.800" : "transparent"}
      borderRadius={isCurrentPage(submenu.slug) ? "8px" : "0px"}
    >
      <Flex
        opacity={isCurrentPage(submenu.slug) ? 1 : 0}
        width="3px"
        height="16px"
        bgColor="primary.light"
        position="absolute"
        top="8px"
        borderRadius="2px"
        left="0px"
      />
      {submenu.icon && <CustomIcon name={submenu.icon} color="gray.600" />}
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
);

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
            {!isMobile && item.category === "Your Account" && (
              <Tooltip label="Expand" placement="right">
                <IconButton
                  aria-label="overview"
                  variant="ghost-primary"
                  fontSize="24px"
                  height="fit-content"
                  minW="fit-content"
                  p={1}
                  mt={2}
                  mx={2}
                  icon={<CustomIcon name="double-chevron-right" />}
                  onClick={() => setIsExpand(true)}
                />
              </Tooltip>
            )}
          </Flex>
          {item.submenu.map((submenu) =>
            submenu.isDisable ? (
              <CollapseNavInfo
                key={submenu.slug}
                submenu={submenu}
                isCurrentPage={isCurrentPage}
              />
            ) : (
              <AppLink
                href={submenu.slug}
                key={submenu.slug}
                onClick={() => track(AmpEvent.USE_SIDEBAR)}
              >
                <CollapseNavInfo
                  submenu={submenu}
                  isCurrentPage={isCurrentPage}
                />
              </AppLink>
            )
          )}
          {item.subSection &&
            item.subSection.map((section) => (
              <div key={section.category}>
                {section.submenu.map((subitem) =>
                  subitem.isDisable ? (
                    <CollapseNavInfo
                      key={subitem.slug}
                      submenu={subitem}
                      isCurrentPage={isCurrentPage}
                    />
                  ) : (
                    <AppLink
                      href={subitem.slug}
                      key={subitem.slug}
                      onClick={() => track(AmpEvent.USE_SIDEBAR)}
                    >
                      <CollapseNavInfo
                        submenu={subitem}
                        isCurrentPage={isCurrentPage}
                      />
                    </AppLink>
                  )
                )}
              </div>
            ))}
        </Box>
      ))}
    </Box>
  );
};
