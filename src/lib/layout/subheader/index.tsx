import { Flex, Text } from "@chakra-ui/react";
import { useMemo } from "react";

import { AmpEvent, track } from "lib/amplitude";
import {
  useGovConfig,
  useMoveConfig,
  useNftConfig,
  usePoolConfig,
  useTierConfig,
  useWasmConfig,
} from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { CustomIcon } from "lib/components/icon";
import { useIsCurrentPage } from "lib/hooks";

import {
  getSubHeaderFull,
  getSubHeaderLite,
  getSubHeaderSequencer,
} from "./utils";

const ACTIVE_COLOR = "primary.main";

const SubHeader = () => {
  const { tier } = useTierConfig();
  const govConfig = useGovConfig({ shouldRedirect: false });
  const wasmConfig = useWasmConfig({ shouldRedirect: false });
  const moveConfig = useMoveConfig({ shouldRedirect: false });
  const nftConfig = useNftConfig({ shouldRedirect: false });
  const poolConfig = usePoolConfig({ shouldRedirect: false });

  const isCurrentPage = useIsCurrentPage();

  const subHeaderMenu = useMemo(() => {
    switch (tier) {
      case "full":
        return getSubHeaderFull(
          govConfig.enabled,
          wasmConfig.enabled,
          moveConfig.enabled,
          nftConfig.enabled,
          poolConfig.enabled
        );
      case "mesa":
      case "sequencer":
        return getSubHeaderSequencer(govConfig.enabled, wasmConfig.enabled);
      case "lite":
      default:
        return getSubHeaderLite(govConfig.enabled, wasmConfig.enabled);
    }
  }, [
    tier,
    govConfig.enabled,
    wasmConfig.enabled,
    moveConfig.enabled,
    nftConfig.enabled,
    poolConfig.enabled,
  ]);

  return (
    <Flex h="full" px={6}>
      {subHeaderMenu.map((item) => (
        <AppLink
          key={item.slug}
          onClick={() => track(AmpEvent.USE_TOPBAR, { tab: item.name })}
          href={item.slug}
        >
          <Flex
            borderBottomWidth={2}
            alignItems="center"
            gap={2}
            h="full"
            px={4}
            sx={{
              _hover: {
                "> svg, > p": {
                  color: ACTIVE_COLOR,
                  transition: "all .25s ease-in-out",
                },
                borderBottomWidth: 2,
                borderColor: ACTIVE_COLOR,
              },
            }}
            _hover={{ borderColor: ACTIVE_COLOR }}
            borderColor={
              isCurrentPage(item.slug) ? ACTIVE_COLOR : "transparent"
            }
            transition="all 0.25s ease-in-out"
          >
            <CustomIcon
              name={item.icon}
              boxSize={3}
              color={isCurrentPage(item.slug) ? ACTIVE_COLOR : "gray.600"}
            />
            <Text
              variant="body2"
              color={isCurrentPage(item.slug) ? ACTIVE_COLOR : "text.dark"}
              fontWeight={700}
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
