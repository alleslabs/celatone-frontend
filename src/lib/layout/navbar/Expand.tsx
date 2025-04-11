import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Image,
  Text,
} from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useNavContext } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { CustomIcon } from "lib/components/icon";
import { Tooltip } from "lib/components/Tooltip";

import type { MenuInfo, NavMenuProps, SubmenuInfo } from "./types";

import { InformationFooter } from "../InformationFooter";

interface NavInfoProps {
  submenu: SubmenuInfo;
  isCurrentPage: (slug: string) => boolean;
}
const NavInfo = ({ submenu, isCurrentPage }: NavInfoProps) => (
  <Flex
    _hover={
      submenu.isDisable ? undefined : { bg: "gray.700", borderRadius: "4px" }
    }
    alignItems="center"
    bgColor={isCurrentPage(submenu.slug) ? "gray.800" : "transparent"}
    borderRadius={isCurrentPage(submenu.slug) ? "4px" : "0px"}
    cursor={submenu.isDisable ? undefined : "pointer"}
    gap={2}
    my="1px"
    p={2}
    position="relative"
    transition="all 0.25s ease-in-out"
  >
    <Box
      bgColor="primary.light"
      borderRadius="2px"
      height="20px"
      left="0px"
      opacity={isCurrentPage(submenu.slug) ? 1 : 0}
      position="absolute"
      top="10px"
      width="3px"
    />
    {submenu.icon && <CustomIcon color="gray.600" name={submenu.icon} />}
    {submenu.logo && (
      <Image
        alt={submenu.slug}
        borderRadius="full"
        boxSize={5}
        src={submenu.logo}
      />
    )}
    <Text
      className="ellipsis"
      color={submenu.isDisable ? "text.disabled" : "text.main"}
      variant="body2"
    >
      {submenu.name}
    </Text>
  </Flex>
);

interface SubMenuProps {
  submenu: SubmenuInfo[];
  isCurrentPage: (slug: string) => boolean;
}

const SubMenuRender = ({ submenu, isCurrentPage }: SubMenuProps) => (
  <>
    {submenu.map((subitem) =>
      subitem.isDisable ? (
        <Tooltip key={subitem.slug} label={subitem.tooltipText} maxW="240px">
          <NavInfo isCurrentPage={isCurrentPage} submenu={subitem} />
        </Tooltip>
      ) : (
        <AppLink
          key={subitem.slug}
          href={subitem.slug}
          onClick={() => {
            track(AmpEvent.USE_SIDEBAR);
            subitem.trackEvent?.();
          }}
        >
          <NavInfo isCurrentPage={isCurrentPage} submenu={subitem} />
        </AppLink>
      )
    )}
  </>
);

interface NavbarRenderProps {
  menuInfo: MenuInfo;
  isCurrentPage: (slug: string) => boolean;
}

const NavbarRender = ({ menuInfo, isCurrentPage }: NavbarRenderProps) => {
  // Add slug to StorageKeys and NavContext
  const { submenus } = useNavContext();
  const [isExpand, setIsExpand] = submenus[menuInfo.slug];
  const defaultIndex = isExpand ? [0] : [];

  const handleChange = (index: number[]) => {
    setIsExpand(index.includes(0));
  };

  return (
    <Accordion
      key={menuInfo.slug}
      allowMultiple
      borderColor="gray.700"
      borderTop="1px solid"
      defaultIndex={defaultIndex}
      mt={2}
      pt={2}
      sx={{
        "&:first-of-type": {
          borderTop: "none",
          paddingTop: "0px",
          marginTop: "0px",
        },
      }}
      onChange={handleChange}
    >
      <AccordionItem bg="transparent">
        <AccordionButton alignItems="center" justifyContent="space-between">
          <Text fontWeight={700} py={2} variant="body3">
            {menuInfo.category}
          </Text>
          <AccordionIcon color="gray.600" ml="auto" />
        </AccordionButton>
        <AccordionPanel p={0}>
          <SubMenuRender
            isCurrentPage={isCurrentPage}
            submenu={menuInfo.submenu}
          />
          {menuInfo.subSection?.map((subitem) => (
            <div key={subitem.category}>
              <Text color="text.dark" fontWeight={700} py={2} variant="small">
                {subitem.category}
              </Text>
              <SubMenuRender
                isCurrentPage={isCurrentPage}
                submenu={subitem.submenu}
              />
            </div>
          ))}
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
    <Flex
      direction="column"
      h="full"
      justifyContent="space-between"
      overflowY="auto"
      px={4}
      py={2}
    >
      <div>
        <Flex alignItems="center" justifyContent="space-between">
          <Text fontWeight={700} py={2} variant="body3">
            {yourAccountMenu.category}
          </Text>
          <Button
            iconSpacing={1}
            leftIcon={<CustomIcon boxSize={3} name="double-chevron-left" />}
            size="xs"
            variant="ghost-primary"
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
            key={item.slug}
            isCurrentPage={isCurrentPage}
            menuInfo={item}
          />
        ))}
      </div>
      <InformationFooter />
    </Flex>
  );
};
