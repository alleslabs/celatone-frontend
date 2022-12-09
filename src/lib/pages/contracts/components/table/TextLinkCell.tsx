import { Flex, Link, Text } from "@chakra-ui/react";
import { useState } from "react";

import { Copier } from "lib/components/copier";
import { truncate } from "lib/utils";

interface LinkProps {
  value: string;
  url?: string;
  isTruncate?: boolean;
  isReadOnly?: boolean;
}

export const TextLink = ({
  value,
  url,
  isTruncate = false,
  isReadOnly = false,
}: LinkProps) => {
  const [isHover, setIsHover] = useState(false);
  const handleMouseEnter = () => {
    setIsHover(true);
  };
  const handleMouseOut = () => {
    setIsHover(false);
  };
  return (
    <Flex
      alignItems="center"
      onMouseOver={handleMouseEnter}
      onMouseOut={handleMouseOut}
      pointerEvents={isReadOnly ? "none" : "auto"}
    >
      <Link href={url} isExternal>
        <Text variant="body2" color="primary.main">
          {isTruncate ? truncate(value) : value}
        </Text>
      </Link>
      <Flex opacity={isHover ? 1 : 0}>
        <Copier value={value} />
      </Flex>
    </Flex>
  );
};
