import { Flex } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

export const ErrorFetching = () => (
  <Flex>
    <CustomIcon name="alert-circle-solid" color="gray.600" boxSize={4} mr={3} />
    <p>Error fetching data. Please try again later.</p>
  </Flex>
);
