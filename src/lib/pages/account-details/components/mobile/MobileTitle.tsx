import { Flex } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
import { TableTitle } from "lib/components/table";

interface MobileTitleProps {
  title: string;
  count: string | number;
  onViewMore?: () => void;
}

export const MobileTitle = ({ onViewMore, title, count }: MobileTitleProps) => {
  return (
    <Flex
      justify="space-between"
      w="full"
      bg="gray.900"
      borderRadius="8px"
      p={4}
      onClick={onViewMore}
    >
      <TableTitle title={title} count={count} mb={0} />
      <CustomIcon name="chevron-right" color="gray.600" />
    </Flex>
  );
};
