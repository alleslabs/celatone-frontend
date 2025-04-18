import { Flex, Image, Text } from "@chakra-ui/react";

export const SuperfluidLabel = ({ isSmall = false }: { isSmall?: boolean }) => (
  <Flex alignItems="center" gap={1}>
    <Image
      boxSize={4}
      src="https://assets.alleslabs.dev/celatone-brand/webapp-assets/pools/superfluid.svg"
    />
    <Text color="#ee64e8" variant={isSmall ? "body2" : "body1"}>
      Superfluid
    </Text>
  </Flex>
);
