import { Flex, Text } from "@chakra-ui/react";

import { AmpEvent, track } from "lib/amplitude";
import {
  useGovConfig,
  useMoveConfig,
  useNftConfig,
  usePoolConfig,
  useWasmConfig,
} from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import type { IconKeys } from "lib/components/icon";
import { CustomIcon } from "lib/components/icon";
import { useIsCurrentPage } from "lib/hooks";

interface SubHeaderMenuInfo {
  name: string;
  slug: string;
  icon: IconKeys;
}

const SubHeader = () => {
  const wasmConfig = useWasmConfig({ shouldRedirect: false });
  const moveConfig = useMoveConfig({ shouldRedirect: false });
  const poolConfig = usePoolConfig({ shouldRedirect: false });
  const govConfig = useGovConfig({ shouldRedirect: false });
  const nftConfig = useNftConfig({ shouldRedirect: false });

  const subHeaderMenu: SubHeaderMenuInfo[] = [
    { name: "Overview", slug: "/", icon: "home" },
    { name: "Transactions", slug: "/txs", icon: "file" },
    { name: "Blocks", slug: "/blocks", icon: "block" },
  ];

  if (wasmConfig.enabled)
    subHeaderMenu.push(
      { name: "Codes", slug: "/codes", icon: "code" },
      { name: "Contracts", slug: "/contracts", icon: "contract-address" }
    );

  if (moveConfig.enabled)
    subHeaderMenu.push({
      name: "Modules",
      slug: "/modules",
      icon: "contract-address",
    });

  if (nftConfig.enabled)
    subHeaderMenu.push({
      name: "NFTs",
      slug: "/nft-collections",
      icon: "group",
    });

  if (govConfig.enabled)
    subHeaderMenu.push(
      { name: "Proposals", slug: "/proposals", icon: "proposal" },
      { name: "Validators", slug: "/validators", icon: "validator" }
    );

  if (poolConfig.enabled)
    subHeaderMenu.push({ name: "Osmosis Pools", slug: "/pools", icon: "pool" });

  const isCurrentPage = useIsCurrentPage();

  const activeColor = "primary.light";

  const trackOnClick = (tab: string) => {
    track(AmpEvent.USE_TOPBAR, { tab });
  };

  return (
    <Flex px={6} h="full">
      {subHeaderMenu.map((item) => (
        <AppLink
          href={item.slug}
          key={item.slug}
          onClick={() => trackOnClick(item.name)}
        >
          <Flex
            alignItems="center"
            px={4}
            gap={2}
            h="full"
            borderBottomWidth={2}
            borderColor={isCurrentPage(item.slug) ? activeColor : "transparent"}
            transition="all 0.25s ease-in-out"
            _hover={{ borderColor: activeColor }}
            sx={{
              _hover: {
                "> svg, > p": {
                  color: activeColor,
                  transition: "all .25s ease-in-out",
                },
                borderBottomWidth: 2,
                borderColor: activeColor,
              },
            }}
          >
            <CustomIcon
              boxSize={3}
              name={item.icon}
              color={isCurrentPage(item.slug) ? activeColor : "gray.600"}
            />
            <Text
              variant="body2"
              fontWeight={700}
              color={isCurrentPage(item.slug) ? activeColor : "text.dark"}
            >
              {item.name}
            </Text>
          </Flex>
        </AppLink>
      ))}
    </Flex>
  );
};

export default SubHeader;
