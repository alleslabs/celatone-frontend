import { Flex, Image, Text } from "@chakra-ui/react";

export const SuperfluidLabel = ({ isSmall = false }: { isSmall?: boolean }) => (
  <Flex alignItems="center" gap={1}>
    <Image
      boxSize={4}
      src="https://assets.alleslabs.dev/celatone-brand/webapp-assets/pools/superfluid.svg"
    />
    <Text variant={isSmall ? "body2" : "body1"} color="#ee64e8">
      Superfluid
    </Text>
  </Flex>
);
