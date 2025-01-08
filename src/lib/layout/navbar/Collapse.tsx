import { Box, Flex, IconButton, Image } from "@chakra-ui/react";

import { AmpEvent, track } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { CustomIcon } from "lib/components/icon";
import { Tooltip } from "lib/components/Tooltip";

import type { NavMenuProps, SubmenuInfo } from "./types";

interface CollapseNavInfoProps {
  isCurrentPage: (slug: string) => boolean;
  submenu: SubmenuInfo;
}
const CollapseNavInfo = ({ isCurrentPage, submenu }: CollapseNavInfoProps) => (
  <Tooltip
    label={submenu.isDisable ? submenu.tooltipText : submenu.name}
    placement="right"
  >
    <Flex
      alignItems="center"
      m={2}
      p={1}
      _hover={
        submenu.isDisable ? undefined : { bg: "gray.700", borderRadius: "8px" }
      }
      bgColor={isCurrentPage(submenu.slug) ? "gray.800" : "transparent"}
      borderRadius={isCurrentPage(submenu.slug) ? "8px" : "0px"}
      cursor={submenu.isDisable ? undefined : "pointer"}
      position="relative"
      transition="all 0.25s ease-in-out"
    >
      <Flex
        width="3px"
        height="16px"
        left="0px"
        bgColor="primary.light"
        borderRadius="2px"
        opacity={isCurrentPage(submenu.slug) ? 1 : 0}
        position="absolute"
        top="8px"
      />
      {submenu.icon && <CustomIcon name={submenu.icon} color="gray.600" />}
      {submenu.logo && (
        <Image
          alt={submenu.slug}
          src={submenu.logo}
          borderRadius="full"
          boxSize={6}
        />
      )}
    </Flex>
  </Tooltip>
);

export const CollapseNavMenu = ({
  isCurrentPage,
  navMenu,
  setIsExpand,
}: NavMenuProps) => {
  const isMobile = useMobile();

  return (
    <Box overflowX="hidden" overflowY="auto">
      {navMenu.map((item) => (
        <Box
          key={item.category}
          minW="fit-content"
          sx={{
            "&:last-of-type": {
              borderBottom: "none",
              marginBottom: "0px",
              paddingBottom: "0px",
            },
          }}
          borderBottom="1px solid"
          borderColor="gray.700"
        >
          <Flex alignItems="center" justifyContent="space-between">
            {!isMobile && item.category === "Your Account" && (
              <Tooltip label="Expand" placement="right">
                <IconButton
                  aria-label="overview"
                  height="fit-content"
                  minW="fit-content"
                  mt={2}
                  mx={2}
                  p={1}
                  variant="ghost-primary"
                  fontSize="24px"
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
                isCurrentPage={isCurrentPage}
                submenu={submenu}
              />
            ) : (
              <AppLink
                key={submenu.slug}
                onClick={() => track(AmpEvent.USE_SIDEBAR)}
                href={submenu.slug}
              >
                <CollapseNavInfo
                  isCurrentPage={isCurrentPage}
                  submenu={submenu}
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
                      isCurrentPage={isCurrentPage}
                      submenu={subitem}
                    />
                  ) : (
                    <AppLink
                      key={subitem.slug}
                      onClick={() => track(AmpEvent.USE_SIDEBAR)}
                      href={subitem.slug}
                    >
                      <CollapseNavInfo
                        isCurrentPage={isCurrentPage}
                        submenu={subitem}
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
