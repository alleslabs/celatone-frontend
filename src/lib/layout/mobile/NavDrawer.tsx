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

import type { MenuInfo } from "../navbar/types";
import { NetworkMenu } from "../NetworkMenu";
import { AmpEvent, track } from "lib/amplitude";
import {
  useGovConfig,
  useMoveConfig,
  useNftConfig,
  usePublicProjectConfig,
  useWasmConfig,
} from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import type { IconKeys } from "lib/components/icon";
import { CustomIcon } from "lib/components/icon";
import { useIsCurrentPage } from "lib/hooks";
import { usePublicProjectStore } from "lib/providers/store";

export const NavDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isCurrentPage = useIsCurrentPage();
  const { getSavedPublicProjects } = usePublicProjectStore();
  const wasmConfig = useWasmConfig({ shouldRedirect: false });
  const moveConfig = useMoveConfig({ shouldRedirect: false });
  const nftConfig = useNftConfig({ shouldRedirect: false });
  const govConfig = useGovConfig({ shouldRedirect: false });
  const publicProject = usePublicProjectConfig({ shouldRedirect: false });

  const mobileMenu: MenuInfo[] = [
    {
      category: "Overview",
      slug: "overview",
      submenu: [
        { name: "Overview", slug: "/", icon: "home" },
        {
          name: "Transactions",
          slug: "/txs",
          icon: "file",
        },
        {
          name: "Blocks",
          slug: "/blocks",
          icon: "block",
        },
        ...(wasmConfig.enabled
          ? [
              {
                name: "Codes",
                slug: "/codes",
                icon: "code" as IconKeys,
              },
              {
                name: "Contracts",
                slug: "/contracts",
                icon: "contract-address" as IconKeys,
              },
              {
                name: "Query",
                slug: "/contract-interaction",
                icon: "query" as IconKeys,
              },
            ]
          : []),
        ...(moveConfig.enabled
          ? [
              {
                name: "Modules",
                slug: "/modules",
                icon: "contract-address" as IconKeys,
              },
              {
                name: "0x1 Page",
                slug: "/account/0x1",
                icon: "hex" as IconKeys,
              },
            ]
          : []),
        ...(nftConfig.enabled
          ? [
              {
                name: "NFT Collections",
                slug: "/nft-collections",
                icon: "group" as IconKeys,
              },
            ]
          : []),
        ...(govConfig.enabled
          ? [
              {
                name: "Proposals",
                slug: "/proposals",
                icon: "proposal" as IconKeys,
              },
              {
                name: "Validators",
                slug: "/validators",
                icon: "validator" as IconKeys,
              },
            ]
          : []),
      ],
    },
  ];

  if (publicProject.enabled) {
    mobileMenu.push({
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
  }

  return (
    <>
      <Button variant="outline-gray" size="sm" gap={1} onClick={() => onOpen()}>
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
            {mobileMenu.map((item) => (
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
