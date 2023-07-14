import { Flex, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { useState } from "react";
import Linkify from "react-linkify";
import { useClampText } from "use-clamp-text/lib";

import { ShowMoreButton } from "./button";

interface PublicDescriptionProps {
  description: string;
  title: string;
  textLine: number;
  icon?: ReactNode;
}

export const PublicDescription = ({
  description,
  title,
  textLine,
  icon,
}: PublicDescriptionProps) => {
  const [showMore, setShowMore] = useState(false);

  const [ref, { noClamp, clampedText, key }] = useClampText({
    text: description,
    ellipsis: "...",
    lines: textLine,
  });

  return (
    <Flex
      direction="column"
      bg="gray.900"
      maxW="100%"
      borderRadius="8px"
      p={4}
      mt={{ base: 4, md: 6 }}
      flex="1"
    >
      <Flex align="center" gap={1} h="32px">
        {icon}
        <Text variant="body2" fontWeight={500} color="text.dark">
          {title}
        </Text>
      </Flex>
      <Text
        variant="body2"
        whiteSpace="pre-wrap"
        key={key}
        ref={ref as React.MutableRefObject<HTMLParagraphElement>}
      >
        <Linkify>{showMore ? description : clampedText}</Linkify>
      </Text>
      {!noClamp && (
        <ShowMoreButton
          showMoreText="View Full Description"
          showLessText="View Less Description"
          toggleShowMore={showMore}
          setToggleShowMore={() => setShowMore(!showMore)}
        />
      )}
    </Flex>
  );
};
