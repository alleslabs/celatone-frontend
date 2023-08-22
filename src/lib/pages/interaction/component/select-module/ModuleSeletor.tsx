import { Button, Flex } from "@chakra-ui/react";

import { CopyLink } from "lib/components/CopyLink";
import { CustomIcon } from "lib/components/icon";
import { LabelText } from "lib/components/LabelText";

export const ModuleSelectorInput = () => {
  return (
    <Flex
      justifyContent="space-between"
      w="full"
      bgColor="gray.800"
      px={4}
      py={3}
      mb={6}
      gap={4}
      borderRadius={8}
    >
      <Flex bg="teal.300" w="full">
        input here
      </Flex>
      <Flex gap={2}>
        <Button variant="primary" size="sm">
          Submit
        </Button>
        <Button variant="outline-white" size="sm">
          Cancel
        </Button>
      </Flex>
    </Flex>
  );
};

export const ModuleSelectorDisplay = () => {
  return (
    <Flex
      justifyContent="space-between"
      w="full"
      bgColor="gray.800"
      px={4}
      py={3}
      mb={6}
      borderRadius={8}
      alignItems="center"
    >
      <LabelText flex="1" label="Viewing Address">
        <CopyLink
          value="cltn1m9y7um59yxtmek68qkwg3ykm28s52rrell6prx"
          type="user_address"
        />
      </LabelText>
      <LabelText flex="1" label="Hex">
        <CopyLink
          value="0xe688b84b23f322a994A53dbF8E15FA82CDB71127"
          type="user_address"
        />
      </LabelText>
      <Button variant="outline-white" size="sm">
        <CustomIcon name="swap" boxSize={3} />
        Change Address
      </Button>
    </Flex>
  );
};
