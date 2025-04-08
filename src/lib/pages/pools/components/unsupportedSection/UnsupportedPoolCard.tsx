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
import Link from "next/link";

import { trackUseExpand, trackWebsite } from "lib/amplitude";
import { useInternalNavigate, usePoolConfig } from "lib/app-provider";
import { Copier } from "lib/components/copy";
import { CustomIcon } from "lib/components/icon";
import { TokenImageRender } from "lib/components/token";
import { Tooltip } from "lib/components/Tooltip";
import type { Pool } from "lib/types";
import {
  formatUTokenWithPrecision,
  getTokenLabel,
  openNewTab,
} from "lib/utils";
import { getUndefinedTokenIcon } from "../../utils";
import { PoolHeader } from "../PoolHeader";

interface UnsupportedPoolCardProps {
  item: Pool;
}
const StyledIconButton = chakra(IconButton, {
  baseStyle: {
    display: "flex",
    alignItems: "center",
    fontSize: "24px",
    color: "gray.600",
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
      mt={4}
      bg="gray.900"
      _hover={{ bg: "gray.800" }}
      transition="all 0.25s ease-in-out"
      cursor="pointer"
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
            <Flex gap={4} flexDirection="column" p={4} w="full">
              <Flex alignItems="center" justifyContent="space-between">
                <PoolHeader
                  poolId={item.id}
                  isSuperfluid={item.isSuperfluid}
                  poolType={item.type}
                  liquidity={item.liquidity}
                />
                <Flex>
                  <Tooltip label="See in osmosis.zone">
                    <Link
                      href={`${poolUrl}/${item.id}`}
                      onClick={(e) => {
                        trackWebsite(`${poolUrl}/${item.id}`);
                        e.stopPropagation();
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <StyledIconButton
                        variant="none"
                        aria-label="external"
                        _hover={{ backgroundColor: hoverBgColor }}
                        icon={<CustomIcon name="launch" />}
                      />
                    </Link>
                  </Tooltip>
                  <StyledIconButton
                    variant="none"
                    aria-label="external"
                    _hover={{ backgroundColor: hoverBgColor }}
                    icon={
                      <CustomIcon
                        name="chevron-down"
                        transform={isExpanded ? "rotate(180deg)" : "rotate(0)"}
                        transition="all 0.25s ease-in-out"
                      />
                    }
                  />
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
                  {item.liquidity.map((asset) => (
                    <Flex
                      className="copier-wrapper"
                      key={asset.denom}
                      gap={3}
                      alignItems="center"
                    >
                      <TokenImageRender
                        logo={asset.logo ?? getUndefinedTokenIcon(asset.denom)}
                        boxSize={6}
                      />
                      <Text variant="body2" color="text.main" fontWeight="bold">
                        {formatUTokenWithPrecision(
                          asset.amount,
                          asset.precision ?? 0
                        )}
                      </Text>
                      <Flex>
                        {getTokenLabel(asset.denom, asset.symbol, false)}
                      </Flex>
                      <Copier
                        type={
                          asset.symbol ? "supported_asset" : "unsupported_asset"
                        }
                        value={asset.denom}
                        copyLabel="Token ID copied!"
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
                    onClick={() => {
                      trackWebsite(`${poolUrl}/${item.id}`);
                      openNewTab(`${poolUrl}/${item.id}`);
                    }}
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
