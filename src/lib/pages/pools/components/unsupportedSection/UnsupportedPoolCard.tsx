import type { Pool } from "lib/types";

import {
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Button,
  chakra,
  Flex,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { trackUseExpand, trackWebsite } from "lib/amplitude";
import { useInternalNavigate, usePoolConfig } from "lib/app-provider";
import { Copier } from "lib/components/copy";
import { CustomIcon } from "lib/components/icon";
import { TokenImageRender } from "lib/components/token";
import { Tooltip } from "lib/components/Tooltip";
import {
  formatUTokenWithPrecision,
  getTokenLabel,
  openNewTab,
} from "lib/utils";
import Link from "next/link";

import { getUndefinedTokenIcon } from "../../utils";
import { PoolHeader } from "../PoolHeader";

interface UnsupportedPoolCardProps {
  item: Pool;
}
const StyledIconButton = chakra(IconButton, {
  baseStyle: {
    alignItems: "center",
    color: "gray.600",
    display: "flex",
    fontSize: "24px",
  },
});

const hoverBgColor = "gray.700";

export const UnsupportedPoolCard = ({ item }: UnsupportedPoolCardProps) => {
  const poolConfig = usePoolConfig({ shouldRedirect: true });
  // Remark: the empty string has never been used when poolConfig is disabled
  const poolUrl = poolConfig.enabled ? poolConfig.url : "";

  const navigate = useInternalNavigate();
  const handleOnClick = () =>
    navigate({ pathname: `/pools/[poolId]`, query: { poolId: item.id } });

  return (
    <AccordionItem
      _hover={{ bg: "gray.800" }}
      bg="gray.900"
      cursor="pointer"
      mt={4}
      transition="all 0.25s ease-in-out"
    >
      {({ isExpanded }) => (
        <>
          <AccordionButton
            onClick={() =>
              trackUseExpand({
                action: !isExpanded ? "expand" : "collapse",
                component: "unsupported_pool",
                info: { poolId: item.id },
                section: "pool-list-page",
              })
            }
          >
            <Flex flexDirection="column" gap={4} p={4} w="full">
              <Flex alignItems="center" justifyContent="space-between">
                <PoolHeader
                  isSuperfluid={item.isSuperfluid}
                  liquidity={item.liquidity}
                  poolId={item.id}
                  poolType={item.type}
                />
                <Flex>
                  <Tooltip label="See in osmosis.zone">
                    <Link
                      href={`${poolUrl}/${item.id}`}
                      rel="noopener noreferrer"
                      target="_blank"
                      onClick={(e) => {
                        trackWebsite(`${poolUrl}/${item.id}`);
                        e.stopPropagation();
                      }}
                    >
                      <StyledIconButton
                        _hover={{ backgroundColor: hoverBgColor }}
                        aria-label="external"
                        icon={<CustomIcon name="launch" />}
                        variant="none"
                      />
                    </Link>
                  </Tooltip>
                  <StyledIconButton
                    _hover={{ backgroundColor: hoverBgColor }}
                    aria-label="external"
                    icon={
                      <CustomIcon
                        name="chevron-down"
                        transform={isExpanded ? "rotate(180deg)" : "rotate(0)"}
                        transition="all 0.25s ease-in-out"
                      />
                    }
                    variant="none"
                  />
                </Flex>
              </Flex>
            </Flex>
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Flex>
              <Text
                color="text.dark"
                fontWeight="600"
                variant="body2"
                w="144px"
              >
                Tokens in Pool
              </Text>
              <Flex flexDirection="column" gap={4}>
                <Flex flexDirection="column" gap={2}>
                  {item.liquidity.map((asset) => (
                    <Flex
                      key={asset.denom}
                      className="copier-wrapper"
                      alignItems="center"
                      gap={3}
                    >
                      <TokenImageRender
                        boxSize={6}
                        logo={asset.logo ?? getUndefinedTokenIcon(asset.denom)}
                      />
                      <Text color="text.main" fontWeight="bold" variant="body2">
                        {formatUTokenWithPrecision(
                          asset.amount,
                          asset.precision ?? 0
                        )}
                      </Text>
                      <Flex>
                        {getTokenLabel(asset.denom, asset.symbol, false)}
                      </Flex>
                      <Copier
                        copyLabel="Token ID copied!"
                        display="none"
                        ml="1px"
                        type={
                          asset.symbol ? "supported_asset" : "unsupported_asset"
                        }
                        value={asset.denom}
                      />
                    </Flex>
                  ))}
                </Flex>
                <Flex gap={3}>
                  <Button size="sm" onClick={handleOnClick}>
                    View Pool Details
                  </Button>
                  <Button
                    rightIcon={
                      <CustomIcon color="outline-primary" name="launch" />
                    }
                    size="sm"
                    variant="outline-primary"
                    onClick={() => {
                      trackWebsite(`${poolUrl}/${item.id}`);
                      openNewTab(`${poolUrl}/${item.id}`);
                    }}
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
