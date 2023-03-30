import { Flex, Heading, Text, Box, Image, IconButton } from "@chakra-ui/react";
import Link from "next/link";

import { CustomIcon } from "lib/components/icon";

import { PoolLogo } from "./PoolLogo";

export const PoolHeader = () => {
  const mockPool = {
    "@type": "/osmosis.gamm.v1beta1.Pool",
    address: "osmo1jkxwvg4dua49hsfymvfl9s2wenmguqrq3dl0ttms047w6zv2n5sqh4svnn",
    id: "31",
    pool_params: {
      swap_fee: "0.030000000000000000",
      exit_fee: "0.000000000000000000",
      smooth_weight_change_params: null,
    },
    future_pool_governor: "24h",
    total_shares: {
      denom: "gamm/pool/31",
      amount: "100000000000000000",
    },
    pool_assets: [
      {
        token: {
          denom: "ibc/1DC...76",
          amount: "3053",
        },
        weight: "268435456000000",
      },
      // {
      //   token: {
      //     denom: "ibc/2734F...5EB2",
      //     amount: "127",
      //   },
      //   weight: "268435456000000",
      // },
      {
        token: {
          denom: "ibc/A0CC...A9293",
          amount: "9226",
        },
        weight: "268435456000000",
      },
      {
        token: {
          denom: "uosmo",
          amount: "2825",
        },
        weight: "268435456000000",
      },
    ],
    total_weight: "1073741824000000",
  };

  return (
    <Flex justifyContent="space-between" w="full">
      <Flex alignItems="center" gap={4}>
        <PoolLogo />
        <Box>
          <Flex
            gap={1}
            css={{
              "h6:last-child": {
                display: "none",
              },
            }}
          >
            {mockPool.pool_assets.map((item) => (
              <>
                <Heading as="h6" fontWeight="600" variant="h6">
                  {item.token.denom}
                </Heading>
                <Heading
                  as="h6"
                  fontWeight="600"
                  variant="h6"
                  color="honeydew.main"
                >
                  /
                </Heading>
              </>
            ))}
          </Flex>
          <Flex alignItems="center" gap={2}>
            <Text variant="body2" color="lilac.main">
              #{mockPool.id}
            </Text>
            <Flex alignItems="center" gap={2}>
              <Flex
                backgroundColor="pebble.600"
                borderRadius="full"
                w="6px"
                h="6px"
              />
              <Flex alignItems="center" gap={1}>
                <Image
                  boxSize={4}
                  src="https://assets.alleslabs.dev/webapp-assets/pool/pool-balancer.svg"
                />
                <Text variant="body2" color="text.dark">
                  Balancer Pool
                </Text>
              </Flex>
            </Flex>
            <Flex alignItems="center" gap={2}>
              <Flex
                backgroundColor="pebble.600"
                borderRadius="full"
                w="6px"
                h="6px"
              />
              <Flex alignItems="center" gap={1}>
                <Image
                  boxSize={4}
                  src="https://assets.alleslabs.dev/webapp-assets/pool/pool-superfluid.svg"
                />
                <Text variant="body2" color="text.dark">
                  Superfluid
                </Text>
              </Flex>
            </Flex>
            {/* {mockPool.isSuperfluid && (
            <Flex alignItems="center" gap={2}>
              <Flex
                backgroundColor="pebble.600"
                borderRadius="full"
                w="6px"
                h="6px"
              />
              <Flex alignItems="center" gap={1}>
                <Image
                  boxSize={4}
                  src="https://assets.alleslabs.dev/webapp-assets/pool/pool-superfluid.svg"
                />
                <Text variant="body2" color="text.dark">
                  Superfluid
                </Text>
              </Flex>
            </Flex>
          )} */}
          </Flex>
        </Box>
      </Flex>
      <Flex w="72px" justifyContent="flex-end">
        <Link href="/">
          <IconButton
            fontSize="24px"
            variant="none"
            aria-label="external"
            _hover={{ backgroundColor: "pebble.700" }}
            color="pebble.600"
            icon={<CustomIcon name="external" />}
          />
        </Link>
        <Flex>
          <IconButton
            fontSize="24px"
            _hover={{ backgroundColor: "pebble.700" }}
            variant="none"
            aria-label="save"
            color="pebble.600"
            icon={<CustomIcon name="bookmark" />}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
