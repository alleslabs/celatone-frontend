import {
  Flex,
  IconButton,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  chakra,
  Text,
  Image,
  Button,
} from "@chakra-ui/react";
import Link from "next/link";

import { getUndefinedTokenIcon } from "../../utils";
import { PoolHeader } from "../PoolHeader";
import { useInternalNavigate, usePoolConfig } from "lib/app-provider";
import { Copier } from "lib/components/copy";
import { CustomIcon } from "lib/components/icon";
import { Tooltip } from "lib/components/Tooltip";
import { AmpTrackExpand, AmpTrackWebsite } from "lib/services/amplitude";
import type { Pool } from "lib/types";
import { PoolType } from "lib/types";
import { formatUTokenWithPrecision, openNewTab } from "lib/utils";

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
  const handleOnClick = () => {
    // First version, navigate to contract details page if pool type is CosmWasm
    if (item?.type === PoolType.COSMWASM && item.contractAddress)
      navigate({
        pathname: `/contracts/[contractAddress]`,
        query: { contractAddress: item.contractAddress },
      });
    else {
      navigate({ pathname: `/pools/[poolId]`, query: { poolId: item.id } });
    }
  };

  return (
    <AccordionItem
      mt={4}
      bg="gray.900"
      _hover={{ bg: "gray.800" }}
      transition="all .25s ease-in-out"
      cursor="pointer"
    >
      {({ isExpanded }) => (
        <>
          <AccordionButton
            onClick={() =>
              AmpTrackExpand({
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
                  poolLiquidity={item.poolLiquidity}
                />
                <Flex>
                  <Tooltip label="See in osmosis.zone">
                    <Link
                      href={`${poolUrl}/${item.id}`}
                      onClick={(e) => {
                        AmpTrackWebsite(`${poolUrl}/${item.id}`);
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
                        transition="all .25s ease-in-out"
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
                  {item.poolLiquidity.map((asset) => (
                    <Flex
                      className="copier-wrapper"
                      key={asset.denom}
                      gap={3}
                      alignItems="center"
                    >
                      <Image
                        boxSize={6}
                        src={asset.logo ?? getUndefinedTokenIcon(asset.denom)}
                      />
                      <Text variant="body2" color="text.main" fontWeight="bold">
                        {formatUTokenWithPrecision(
                          asset.amount,
                          asset.precision ?? 0
                        )}
                      </Text>
                      <Flex>{asset.symbol ?? asset.denom}</Flex>
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
                    onClick={() => {
                      AmpTrackWebsite(`${poolUrl}/${item.id}`);
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
