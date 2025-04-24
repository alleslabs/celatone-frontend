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
      _hover={
        submenu.isDisable ? undefined : { bg: "gray.700", borderRadius: "8px" }
      }
      alignItems="center"
      bgColor={isCurrentPage(submenu.slug) ? "gray.800" : "transparent"}
      borderRadius={isCurrentPage(submenu.slug) ? "8px" : "0px"}
      cursor={submenu.isDisable ? undefined : "pointer"}
      m={2}
      p={1}
      position="relative"
      transition="all 0.25s ease-in-out"
    >
      <Flex
        bgColor="primary.light"
        borderRadius="2px"
        height="16px"
        left="0px"
        opacity={isCurrentPage(submenu.slug) ? 1 : 0}
        position="absolute"
        top="8px"
        width="3px"
      />
      {submenu.icon && <CustomIcon color="gray.600" name={submenu.icon} />}
      {submenu.logo && (
        <Image
          alt={submenu.slug}
          borderRadius="full"
          boxSize={6}
          src={submenu.logo}
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
          borderBottomWidth="1px"
          borderColor="gray.700"
          minW="fit-content"
          sx={{
            "&:last-of-type": {
              borderBottom: "none",
              marginBottom: "0px",
              paddingBottom: "0px",
            },
          }}
        >
          <Flex alignItems="center" justifyContent="space-between">
            {!isMobile && item.category === "Your account" && (
              <Tooltip label="Expand" placement="right">
                <IconButton
                  aria-label="overview"
                  fontSize="24px"
                  height="fit-content"
                  icon={<CustomIcon name="double-chevron-right" />}
                  minW="fit-content"
                  mt={2}
                  mx={2}
                  p={1}
                  variant="ghost-primary"
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
                href={submenu.slug}
                onClick={() => track(AmpEvent.USE_SIDEBAR)}
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
                      href={subitem.slug}
                      onClick={() => track(AmpEvent.USE_SIDEBAR)}
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
