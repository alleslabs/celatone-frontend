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

import { InformationFooter } from "../InformationFooter";
import { AmpEvent, track } from "lib/amplitude";
import { useNavContext } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { CustomIcon } from "lib/components/icon";
import { Tooltip } from "lib/components/Tooltip";

import type { MenuInfo, NavMenuProps, SubmenuInfo } from "./types";

interface NavInfoProps {
  isCurrentPage: (slug: string) => boolean;
  submenu: SubmenuInfo;
}
const NavInfo = ({ isCurrentPage, submenu }: NavInfoProps) => (
  <Flex
    alignItems="center"
    gap={2}
    my="1px"
    p={2}
    _hover={
      submenu.isDisable ? undefined : { bg: "gray.700", borderRadius: "4px" }
    }
    bgColor={isCurrentPage(submenu.slug) ? "gray.800" : "transparent"}
    borderRadius={isCurrentPage(submenu.slug) ? "4px" : "0px"}
    cursor={submenu.isDisable ? undefined : "pointer"}
    position="relative"
    transition="all 0.25s ease-in-out"
  >
    <Box
      width="3px"
      height="20px"
      left="0px"
      bgColor="primary.light"
      borderRadius="2px"
      opacity={isCurrentPage(submenu.slug) ? 1 : 0}
      position="absolute"
      top="10px"
    />
    {submenu.icon && <CustomIcon name={submenu.icon} color="gray.600" />}
    {submenu.logo && (
      <Image
        alt={submenu.slug}
        src={submenu.logo}
        borderRadius="full"
        boxSize={5}
      />
    )}
    <Text
      className="ellipsis"
      variant="body2"
      color={submenu.isDisable ? "text.disabled" : "text.main"}
    >
      {submenu.name}
    </Text>
  </Flex>
);

interface SubMenuProps {
  isCurrentPage: (slug: string) => boolean;
  submenu: SubmenuInfo[];
}

const SubMenuRender = ({ isCurrentPage, submenu }: SubMenuProps) => (
  <>
    {submenu.map((subitem) =>
      subitem.isDisable ? (
        <Tooltip key={subitem.slug} label={subitem.tooltipText} maxW="240px">
          <NavInfo isCurrentPage={isCurrentPage} submenu={subitem} />
        </Tooltip>
      ) : (
        <AppLink
          key={subitem.slug}
          onClick={() => {
            track(AmpEvent.USE_SIDEBAR);
            subitem.trackEvent?.();
          }}
          href={subitem.slug}
        >
          <NavInfo isCurrentPage={isCurrentPage} submenu={subitem} />
        </AppLink>
      )
    )}
  </>
);

interface NavbarRenderProps {
  isCurrentPage: (slug: string) => boolean;
  menuInfo: MenuInfo;
}

const NavbarRender = ({ isCurrentPage, menuInfo }: NavbarRenderProps) => {
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
      defaultIndex={defaultIndex}
      mt={2}
      pt={2}
      sx={{
        "&:first-of-type": {
          borderTop: "none",
          marginTop: "0px",
          paddingTop: "0px",
        },
      }}
      allowMultiple
      borderColor="gray.700"
      borderTop="1px solid"
      onChange={handleChange}
    >
      <AccordionItem bg="transparent">
        <AccordionButton alignItems="center" justifyContent="space-between">
          <Text py={2} variant="body3" fontWeight={700}>
            {menuInfo.category}
          </Text>
          <AccordionIcon ml="auto" color="gray.600" />
        </AccordionButton>
        <AccordionPanel p={0}>
          <SubMenuRender
            isCurrentPage={isCurrentPage}
            submenu={menuInfo.submenu}
          />
          {menuInfo.subSection?.map((subitem) => (
            <div key={subitem.category}>
              <Text py={2} variant="small" color="text.dark" fontWeight={700}>
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
  isCurrentPage,
  navMenu,
  setIsExpand,
}: NavMenuProps) => {
  const yourAccountMenu = navMenu[0];
  const restNavMenu = navMenu.slice(1);

  return (
    <Flex
      h="full"
      px={4}
      py={2}
      direction="column"
      justifyContent="space-between"
      overflowY="auto"
    >
      <div>
        <Flex alignItems="center" justifyContent="space-between">
          <Text py={2} variant="body3" fontWeight={700}>
            {yourAccountMenu.category}
          </Text>
          <Button
            size="xs"
            variant="ghost-primary"
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
