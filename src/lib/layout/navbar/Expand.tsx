import {
  Box,
  Button,
  Flex,
  Image,
  Text,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/react";

import { AmpEvent, useTrack } from "lib/amplitude";
import { AppLink } from "lib/components/AppLink";
import { CustomIcon } from "lib/components/icon";
import { Tooltip } from "lib/components/Tooltip";
import { useLocalStorage } from "lib/hooks";

import type { MenuInfo, NavMenuProps, SubmenuInfo } from "./type";

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
    transition="all 0.25s ease-in-out"
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

interface SubMenuProps {
  submenu: SubmenuInfo[];
  isCurrentPage: (slug: string) => boolean;
}

const SubMenuRender = ({ isCurrentPage, submenu }: SubMenuProps) => {
  const { track } = useTrack();

  return (
    <>
      {submenu.map((subitem) =>
        subitem.isDisable ? (
          <Tooltip key={subitem.slug} label={subitem.tooltipText} maxW="240px">
            <div>
              <NavInfo submenu={subitem} isCurrentPage={isCurrentPage} />
            </div>
          </Tooltip>
        ) : (
          <AppLink
            href={subitem.slug}
            key={subitem.slug}
            onClick={() => {
              track(AmpEvent.USE_SIDEBAR);
              subitem.trackEvent?.();
            }}
          >
            <NavInfo submenu={subitem} isCurrentPage={isCurrentPage} />
          </AppLink>
        )
      )}
    </>
  );
};

interface NavbarRenderProps {
  menuInfo: MenuInfo;
  isCurrentPage: (slug: string) => boolean;
}

const NavbarRender = ({ menuInfo, isCurrentPage }: NavbarRenderProps) => {
  const { track } = useTrack();
  const [isExpand, setIsExpand] = useLocalStorage(menuInfo.slug, true);
  const defaultIndex = isExpand ? [0] : [];

  const handleChange = (index: number[]) => {
    setIsExpand(index.includes(0));
  };

  return (
    <Accordion
      pt={2}
      allowMultiple
      defaultIndex={defaultIndex}
      mt={2}
      key={menuInfo.slug}
      borderTop="1px solid"
      borderColor="gray.700"
      sx={{
        "&:first-of-type": {
          borderTop: "none",
          paddingTop: "0px",
          marginTop: "0px",
        },
      }}
      onChange={handleChange}
    >
      <AccordionItem>
        <AccordionButton justifyContent="space-between" alignItems="center">
          <Text py={2} variant="body3" fontWeight={700}>
            {menuInfo.category}
          </Text>
          <AccordionIcon color="gray.600" ml="auto" />
        </AccordionButton>
        <AccordionPanel p={0}>
          <SubMenuRender
            isCurrentPage={isCurrentPage}
            submenu={menuInfo.submenu}
          />
          {menuInfo.subSection && (
            <Text py={2} variant="small" fontWeight={700} color="text.dark">
              {menuInfo.subSection.map((subitem) => (
                <div key={subitem.category}>
                  <Text
                    py={2}
                    variant="small"
                    fontWeight={700}
                    color="text.dark"
                  >
                    {subitem.category}
                  </Text>
                  {subitem.submenu.map((submenu) =>
                    submenu.isDisable ? (
                      <Tooltip
                        key={submenu.slug}
                        label={submenu.tooltipText}
                        maxW="240px"
                      >
                        <div>
                          <NavInfo
                            submenu={submenu}
                            isCurrentPage={isCurrentPage}
                          />
                        </div>
                      </Tooltip>
                    ) : (
                      <AppLink
                        href={submenu.slug}
                        key={submenu.slug}
                        onClick={() => track(AmpEvent.USE_SIDEBAR)}
                      >
                        <NavInfo
                          submenu={submenu}
                          isCurrentPage={isCurrentPage}
                        />
                      </AppLink>
                    )
                  )}
                </div>
              ))}
            </Text>
          )}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export const ExpandNavMenu = ({
  navMenu,
  isCurrentPage,
  setIsExpand,
}: NavMenuProps) => {
  const yourAccountMenu = navMenu[0];
  const restNavMenu = navMenu.slice(1);

  return (
    <Box px={4} py={2} overflowY="auto">
      <Flex justifyContent="space-between" alignItems="center">
        <Text py={2} variant="body3" fontWeight={700}>
          {yourAccountMenu.category}
        </Text>

        <Button
          variant="ghost-accent"
          size="xs"
          iconSpacing={1}
          leftIcon={<CustomIcon name="double-chevron-left" boxSize={3} />}
          onClick={() => setIsExpand(false)}
        >
          HIDE
        </Button>
      </Flex>
      <SubMenuRender
        isCurrentPage={isCurrentPage}
        submenu={yourAccountMenu.submenu}
      />

      {restNavMenu.map((item) => (
        <NavbarRender
          menuInfo={item}
          key={item.slug}
          isCurrentPage={isCurrentPage}
        />
      ))}
    </Box>
  );
};
