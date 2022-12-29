import { Flex, Icon, Text } from "@chakra-ui/react";
import { MdSearch, MdSearchOff } from "react-icons/md";

interface FalseStateProps {
  icon: string;
  text1: string;
  text2: string;
}
export const FalseState = ({ icon, text1, text2 }: FalseStateProps) => {
  return (
    <Flex borderY="1px solid" borderColor="divider.main" width="full" py="48px">
      <Icon
        as={icon === "off" ? MdSearchOff : MdSearch}
        mb="26px"
        w="70px"
        h="70px"
        color="gray.600"
      />
      <Text variant="body1" color="text.dark">
        {text1}
      </Text>

      <Text variant="body1" color="text.dark">
        {text2}
      </Text>
    </Flex>
  );
};
