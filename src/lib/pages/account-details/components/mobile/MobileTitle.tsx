import { Flex } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
import { TableTitle } from "lib/components/table";
import type { Option } from "lib/types";

interface MobileTitleProps {
  title: string;
  count: Option<number>;
  onViewMore?: () => void;
}
const cardProps = {
  width: "100%",
  justifyContent: "space-between",
  background: "gray.900",
  padding: "16px",
  borderRadius: "8px",
};
export const MobileTitle = ({ onViewMore, title, count }: MobileTitleProps) => {
  return (
    <Flex
      style={cardProps}
      onClick={count === 0 ? undefined : onViewMore}
      bg="gray.900"
      opacity={count === 0 ? 0.5 : 1}
    >
      <TableTitle title={title} count={count} mb={0} />
      <CustomIcon name="chevron-right" color="gray.600" />
    </Flex>
  );
};
