import { Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

export const Interaction = () => {
  const { query } = useRouter();

  return (
    <Flex>
      <h1>{query.type}</h1>
      <br />
      <Text>
        Interaction: Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Aliquam voluptas hic aperiam ad sint unde sapiente cupiditate! Quo et
        cupiditate iure, sequi deserunt tempora corrupti eum. Error facere
        placeat repellendus?
      </Text>
    </Flex>
  );
};
