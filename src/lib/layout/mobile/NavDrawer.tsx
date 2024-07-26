import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  Image,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useMemo } from "react";

import { NetworkMenu } from "../network-menu";
import { AmpEvent, track } from "lib/amplitude";
import {
  useGovConfig,
  useMoveConfig,
  useNftConfig,
  usePublicProjectConfig,
  useTierConfig,
  useWasmConfig,
} from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import type { IconKeys } from "lib/components/icon";
import { CustomIcon } from "lib/components/icon";
import { useIsCurrentPage } from "lib/hooks";
import { usePublicProjectStore } from "lib/providers/store";

import {
  getNavDrawerFull,
  getNavDrawerLite,
  getNavDrawerSequencer,
} from "./utils";

export const NavDrawer = () => {
  const { tier } = useTierConfig();
  const govConfig = useGovConfig({ shouldRedirect: false });
  const wasmConfig = useWasmConfig({ shouldRedirect: false });
  const moveConfig = useMoveConfig({ shouldRedirect: false });
  const nftConfig = useNftConfig({ shouldRedirect: false });
  const publicProject = usePublicProjectConfig({ shouldRedirect: false });

  const isCurrentPage = useIsCurrentPage();
  const { getSavedPublicProjects } = usePublicProjectStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const navMenu = useMemo(() => {
    let navMenuTmp = [];
    switch (tier) {
      case "full":
        navMenuTmp = getNavDrawerFull(
          govConfig.enabled,
          wasmConfig.enabled,
          moveConfig.enabled,
          nftConfig.enabled
        );
        break;
      case "sequencer":
        navMenuTmp = getNavDrawerSequencer(
          govConfig.enabled,
          wasmConfig.enabled,
          moveConfig.enabled
        );
        break;
      case "lite":
        navMenuTmp = getNavDrawerLite(
          govConfig.enabled,
          wasmConfig.enabled,
          moveConfig.enabled
        );
        break;
      default:
        throw new Error(`Invalid tier: ${tier}`);
    }

    if (publicProject.enabled)
      navMenuTmp.push({
        category: "Public Projects",
        slug: "public-projects",
        submenu: [
          ...getSavedPublicProjects().map((list) => ({
            name: list.name,
            slug: `/projects/${list.slug}`,
            logo: list.logo,
          })),
          {
            name: "View All Projects",
            slug: "/projects",
            icon: "public-project" as IconKeys,
          },
        ],
      });

    return navMenuTmp;
  }, [
    getSavedPublicProjects,
    govConfig.enabled,
    moveConfig.enabled,
    nftConfig.enabled,
    publicProject.enabled,
    tier,
    wasmConfig.enabled,
  ]);

  return (
    <>
      <Button
        variant="ghost-gray"
        h="full"
        borderRadius={0}
        gap={1}
        onClick={onOpen}
      >
        <CustomIcon name="menu" boxSize={3} />
        Menu
      </Button>
      <Drawer isOpen={isOpen} onClose={onClose} placement="right">
        <DrawerOverlay />
        <DrawerContent w="90%">
          <DrawerHeader alignItems="center" px={4}>
            <Flex align="center" justify="space-between" w="full">
              <NetworkMenu />
              <IconButton
                variant="gray"
                aria-label="close"
                onClick={() => onClose()}
                color="gray.600"
                icon={<CustomIcon name="close" />}
              />
            </Flex>
          </DrawerHeader>
          <DrawerBody overflowY="scroll" px={4}>
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
                <Text py={2} variant="body3" fontWeight={700}>
                  {item.category}
                </Text>
                {item.submenu.map((submenu) => (
                  <AppLink
                    href={submenu.slug}
                    key={submenu.slug}
                    onClick={() => {
                      track(AmpEvent.USE_SIDEBAR);
                      onClose();
                    }}
                  >
                    <Flex
                      gap={2}
                      p={2}
                      cursor="pointer"
                      _hover={{ bg: "gray.700", borderRadius: "8px" }}
                      my="1px"
                      transition="all 0.25s ease-in-out"
                      alignItems="center"
                      position="relative"
                      bgColor={
                        isCurrentPage(submenu.slug) ? "gray.800" : "transparent"
                      }
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
                      {submenu.icon && (
                        <CustomIcon name={submenu.icon} color="gray.600" />
                      )}
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
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
