import { Flex, Image, Text } from "@chakra-ui/react";

export const SuperfluidLabel = ({ isSmall = false }: { isSmall?: boolean }) => (
  <Flex alignItems="center" gap={1}>
    <Image
      src="https://assets.alleslabs.dev/celatone-brand/webapp-assets/pools/superfluid.svg"
      boxSize={4}
    />
    <Text variant={isSmall ? "body2" : "body1"} color="#ee64e8">
      Superfluid
    </Text>
  </Flex>
);
