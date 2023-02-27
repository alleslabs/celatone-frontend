import { Button, Flex, Icon } from "@chakra-ui/react";
import { MdExpandMore } from "react-icons/md";

interface ViewMoreProps {
  onClick: () => void;
}

export const ViewMore = ({ onClick }: ViewMoreProps) => (
  <Flex w="full" justifyContent="center" textAlign="center">
    <Button
      size="sm"
      variant="ghost"
      color="text.dark"
      rightIcon={<Icon as={MdExpandMore} boxSize={4} />}
      onClick={onClick}
    >
      View More
    </Button>
  </Flex>
);
