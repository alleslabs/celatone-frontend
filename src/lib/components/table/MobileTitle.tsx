import { Flex } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
import type { Option } from "lib/types";

import { TableTitle } from "./TableTitle";

interface MobileTitleProps {
  count: Option<number>;
  onViewMore?: () => void;
  showCount?: boolean;
  title: string;
}
const cardProps = {
  borderRadius: "8px",
  justifyContent: "space-between",
  padding: "16px",
  width: "100%",
};

export const MobileTitle = ({
  count,
  onViewMore,
  showCount = true,
  title,
}: MobileTitleProps) => {
  const isDisabled = count === 0;
  return (
    <Flex
      style={cardProps}
      bg="gray.900"
      onClick={isDisabled ? undefined : onViewMore}
      opacity={isDisabled ? 0.5 : 1}
    >
      <TableTitle mb={0} title={title} count={count} showCount={showCount} />
      <CustomIcon name="chevron-right" color="gray.600" />
    </Flex>
  );
};
