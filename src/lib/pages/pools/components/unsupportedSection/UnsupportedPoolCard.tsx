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
import { useWallet } from "@cosmos-kit/react";
import Link from "next/link";

import { getUndefinedTokenIcon } from "../../utils";
import { PoolHeader } from "../PoolHeader";
import { getPoolUrl } from "lib/app-fns/explorer";
import { useInternalNavigate } from "lib/app-provider";
import { Copier } from "lib/components/copy";
import { CustomIcon } from "lib/components/icon";
import type { Pool } from "lib/types";
import { formatUTokenWithPrecision } from "lib/utils";

interface PoolCardProps {
  item: Pool;
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
  const { currentChainName } = useWallet();
  const navigate = useInternalNavigate();
  const handleOnClick = () => {
    navigate({ pathname: `/pools/[poolId]`, query: { poolId } });
  };

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
          <AccordionButton>
            <Flex gap={4} flexDirection="column" p={4} w="full">
              <Flex alignItems="center" justifyContent="space-between">
                <PoolHeader
                  poolId={poolId}
                  isSuperFluid={item.isSuperfluid}
                  poolType={item.type}
                  poolLiquidity={item.poolLiquidity}
                />
                <Flex>
                  <Tooltip
                    hasArrow
                    label="See in osmosis.zone"
                    placement="top"
                    bg="honeydew.darker"
                    maxW="240px"
                  >
                    <Link
                      href={`${getPoolUrl(currentChainName)}/${item.id}`}
                      onClick={(e) => e.stopPropagation()}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <StyledIconButton
                        variant="none"
                        aria-label="external"
                        _hover={{ backgroundColor: pebble700 }}
                        icon={<CustomIcon name="launch" />}
                      />
                    </Link>
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
                    <Flex
                      className="copier-wrapper"
                      key={asset.denom}
                      gap={3}
                      alignItems="center"
                    >
                      <Image
                        boxSize={6}
                        src={asset.logo || getUndefinedTokenIcon(asset.denom)}
                      />
                      <Text variant="body2" color="text.main" fontWeight="bold">
                        {formatUTokenWithPrecision(
                          asset.amount,
                          asset.precision || 0
                        )}
                      </Text>
                      <Flex>{asset.symbol || asset.denom}</Flex>
                      <Copier
                        type={
                          asset.symbol ? "supported_asset" : "unsupported_asset"
                        }
                        value={asset.denom}
                        copyLabel="Token ID Copied!"
                        display="none"
                        ml="1px"
                      />
                    </Flex>
                  ))}
                </Flex>
                <Flex gap={3}>
                  <Button onClick={handleOnClick} size="sm">
                    View Pool Details
                  </Button>
                  <Button
                    onClick={() =>
                      window.open(
                        `${getPoolUrl(currentChainName)}/${item.id}`,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
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
