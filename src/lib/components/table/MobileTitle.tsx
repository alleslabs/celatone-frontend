import type { Option } from "lib/types";

import { Flex } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";

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
      opacity={isDisabled ? 0.5 : 1}
      onClick={isDisabled ? undefined : onViewMore}
    >
      <TableTitle count={count} mb={0} showCount={showCount} title={title} />
      <CustomIcon color="gray.600" name="chevron-right" />
    </Flex>
  );
};
