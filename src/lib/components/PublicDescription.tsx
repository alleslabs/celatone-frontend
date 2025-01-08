import { Flex, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { useState } from "react";
import Linkify from "react-linkify";
import { useClampText } from "use-clamp-text/lib";

import { ShowMoreButton } from "./button";

interface PublicDescriptionProps {
  description: string;
  icon?: ReactNode;
  textLine: number;
  title: string;
}

export const PublicDescription = ({
  description,
  icon,
  textLine,
  title,
}: PublicDescriptionProps) => {
  const [showMore, setShowMore] = useState(false);

  const [ref, { clampedText, key, noClamp }] = useClampText({
    ellipsis: "...",
    lines: textLine,
    text: description,
  });

  return (
    <Flex
      bg="gray.900"
      flex={1}
      maxW="100%"
      p={4}
      borderRadius="8px"
      direction="column"
    >
      <Flex align="center" gap={1} h="32px">
        {icon}
        <Text variant="body2" color="text.dark" fontWeight={500}>
          {title}
        </Text>
      </Flex>
      <Text
        key={key}
        variant="body2"
        whiteSpace="pre-wrap"
        ref={ref as React.MutableRefObject<HTMLParagraphElement>}
      >
        <Linkify>{showMore ? description : clampedText}</Linkify>
      </Text>
      {!noClamp && (
        <ShowMoreButton
          setToggleShowMore={() => setShowMore(!showMore)}
          showLessText="View Less Description"
          showMoreText="View Full Description"
          toggleShowMore={showMore}
        />
      )}
    </Flex>
  );
};
