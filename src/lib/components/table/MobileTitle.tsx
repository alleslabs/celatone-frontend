import { Flex } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
import type { Option } from "lib/types";

import { TableTitle } from "./TableTitle";

interface MobileTitleProps {
  title: string;
  count: Option<number>;
  showCount?: boolean;
  onViewMore?: () => void;
}
const cardProps = {
  width: "100%",
  justifyContent: "space-between",
  padding: "16px",
  borderRadius: "8px",
};

export const MobileTitle = ({
  title,
  count,
  showCount = true,
  onViewMore,
}: MobileTitleProps) => {
  const isDisabled = count === 0;
  return (
    <Flex
      style={cardProps}
      onClick={isDisabled ? undefined : onViewMore}
      opacity={isDisabled ? 0.5 : 1}
      bg="gray.900"
    >
      <TableTitle title={title} count={count} showCount={showCount} mb={0} />
      <CustomIcon name="chevron-right" color="gray.600" />
    </Flex>
  );
};
