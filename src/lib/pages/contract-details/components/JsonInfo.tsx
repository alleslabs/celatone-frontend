import { Flex, Heading, Icon } from "@chakra-ui/react";
import { FiChevronDown } from "react-icons/fi";

interface JsonInfoProps {
  header: string;
}

export const JsonInfo = ({ header }: JsonInfoProps) => {
  return (
    <Flex justify="space-between" align="center" p="8px 16px">
      <Heading as="h6" variant="h6">
        {header}
      </Heading>
      <Icon as={FiChevronDown} color="text.dark" boxSize={5} />
    </Flex>
  );
};
