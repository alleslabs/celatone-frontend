import { Flex } from "@chakra-ui/react";

import { PoolHeader } from "./PoolHeader";

export const PoolCard = () => {
  return (
    <Flex
      bg="pebble.900"
      borderRadius="8px"
      _hover={{ bg: "pebble.800" }}
      p={4}
      transition="all .25s ease-in-out"
    >
      <PoolHeader />
      {/* Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit explicabo
      impedit fugiat cupiditate ullam facilis delectus quo molestias reiciendis,
      non eveniet doloribus eaque. Maiores ipsam veniam accusamus cupiditate
      tenetur dolore? */}
    </Flex>
  );
};
