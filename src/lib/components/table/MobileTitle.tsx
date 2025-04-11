import type { Option } from "lib/types";

import { Flex } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";

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
      bg="gray.900"
      opacity={isDisabled ? 0.5 : 1}
      onClick={isDisabled ? undefined : onViewMore}
    >
      <TableTitle count={count} mb={0} showCount={showCount} title={title} />
      <CustomIcon color="gray.600" name="chevron-right" />
    </Flex>
  );
};
