import {
  Flex,
  IconButton,
  Tooltip,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  chakra,
  Text,
  Image,
  Button,
} from "@chakra-ui/react";
import Link from "next/link";

import { getUndefinedTokenIcon } from "../utils";
import { useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { useAssetInfos } from "lib/services/assetService";
import type { PoolDetail } from "lib/types/pool";
import { getTokenLabel } from "lib/utils";

import { PoolHeader } from "./PoolHeader";

interface PoolCardProps {
  item: PoolDetail;
  poolId: number;
}
const StyledIconButton = chakra(IconButton, {
  baseStyle: {
    display: "flex",
    alignItems: "center",
    fontSize: "24px",
    color: "pebble.600",
  },
});

const pebble700 = "pebble.700";

export const UnsupportedPoolCard = ({ item, poolId }: PoolCardProps) => {
  const navigate = useInternalNavigate();
  const handleOnClick = () => {
    navigate({ pathname: `/pool/[poolId]`, query: { poolId } });
  };
  const { assetInfos } = useAssetInfos();

  return (
    <AccordionItem
      mt={4}
      bg="pebble.900"
      _hover={{ bg: "pebble.800" }}
      transition="all .25s ease-in-out"
      cursor="pointer"
    >
      {({ isExpanded }) => (
        <>
          <h2>
            <AccordionButton>
              <Flex gap={4} flexDirection="column" p={4} w="full">
                <Flex alignItems="center" justifyContent="space-between">
                  <PoolHeader
                    poolId={poolId}
                    isSuperFluid={item.isSuperfluid}
                    poolType={item.type}
                    poolLiquidity={item.poolLiquidity}
                  />
                  <Flex w="128px">
                    <Tooltip
                      hasArrow
                      label="See in osmosis.zone"
                      placement="top"
                      bg="honeydew.darker"
                      maxW="240px"
                    >
                      <Link href="/">
                        <StyledIconButton
                          variant="none"
                          aria-label="external"
                          _hover={{ backgroundColor: pebble700 }}
                          icon={<CustomIcon name="launch" />}
                        />
                      </Link>
                    </Tooltip>
                    <Tooltip
                      hasArrow
                      label="Pin to top"
                      placement="top"
                      bg="honeydew.darker"
                      maxW="240px"
                    >
                      <Flex>
                        <StyledIconButton
                          _hover={{ backgroundColor: pebble700 }}
                          variant="none"
                          aria-label="save"
                          icon={<CustomIcon name="bookmark" />}
                        />
                      </Flex>
                    </Tooltip>
                    {isExpanded ? (
                      <StyledIconButton
                        variant="none"
                        aria-label="external"
                        _hover={{ backgroundColor: pebble700 }}
                        icon={<CustomIcon name="chevron-up" />}
                      />
                    ) : (
                      <StyledIconButton
                        variant="none"
                        aria-label="external"
                        _hover={{ backgroundColor: pebble700 }}
                        icon={<CustomIcon name="chevron-down" />}
                      />
                    )}
                  </Flex>
                </Flex>
              </Flex>
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Flex>
              <Text
                color="text.dark"
                variant="body2"
                fontWeight="600"
                w="144px"
              >
                Tokens in Pool
              </Text>
              <Flex gap={4} flexDirection="column">
                <Flex gap={2} flexDirection="column">
                  {item.poolLiquidity.map((asset) => (
                    <Flex gap={3}>
                      <Image
                        boxSize={6}
                        src={
                          assetInfos?.[asset.denom]?.logo ||
                          getUndefinedTokenIcon(asset.denom)
                        }
                      />
                      <Flex>
                        {assetInfos?.[asset.denom]?.symbol ||
                          getTokenLabel(asset.denom)}
                      </Flex>
                    </Flex>
                  ))}
                </Flex>
                <Flex gap={3}>
                  <Button onClick={handleOnClick} size="sm">
                    View Pool Details
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-primary"
                    rightIcon={
                      <CustomIcon name="launch" color="outline-primary" />
                    }
                  >
                    View in Osmosis
                  </Button>
                </Flex>
              </Flex>
            </Flex>
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  );
};
