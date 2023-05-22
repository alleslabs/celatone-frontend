import { Text, Flex } from "@chakra-ui/react";
import { useRef, useState } from "react";

import { DotSeparator } from "lib/components/DotSeperator";
import { Expedited } from "lib/components/Expedited";

interface ProposalTextCellProps {
  title: string;
  type: string;
  isExpedited: boolean;
  isDepositOrVoting: boolean;
}

export const ProposalTextCell = ({
  title,
  type,
  isExpedited,
  isDepositOrVoting,
}: ProposalTextCellProps) => {
  const [isHoverText, setIsHoverText] = useState(false);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const typeRef = useRef<HTMLParagraphElement>(null);

  const showName =
    isHoverText &&
    (Number(titleRef.current?.scrollWidth) >
      Number(titleRef.current?.clientWidth) ||
      Number(typeRef.current?.scrollWidth) >
        Number(typeRef.current?.clientWidth));

  return (
    <Flex
      left={0}
      h="80%"
      flexDirection="column"
      position="absolute"
      justify="center"
      borderRadius="8px"
      bgColor={showName ? "gray.800" : "undefined"}
      px={4}
      maxW={showName ? undefined : "full"}
      onMouseOver={() => setIsHoverText(true)}
      onMouseOut={() => setIsHoverText(false)}
      onClick={(e) => e.stopPropagation()}
      cursor="initial"
    >
      <Text
        ref={titleRef}
        variant="body2"
        whiteSpace="nowrap"
        maxW={showName ? undefined : "full"}
        className={showName ? undefined : "ellipsis"}
      >
        {title}
      </Text>
      <Flex align="center" gap={2}>
        {isExpedited && (
          <>
            <Expedited isActiveExpedited={isDepositOrVoting} />
            <DotSeparator />
          </>
        )}

        <Text
          ref={typeRef}
          variant="body3"
          color="text.dark"
          whiteSpace="nowrap"
          maxW={showName ? undefined : "full"}
          className={showName ? undefined : "ellipsis"}
        >
          {type}
        </Text>
      </Flex>
    </Flex>
  );
};
