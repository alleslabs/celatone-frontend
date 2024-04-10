import { Flex, Text } from "@chakra-ui/react";
import { useRef, useState } from "react";

import { MobileLabel } from "../MobileLabel";
import { useMobile } from "lib/app-provider";
import { DotSeparator } from "lib/components/DotSeparator";
import { Expedited } from "lib/components/Expedited";
import type { ProposalType } from "lib/types";

const RenderMsg = ({ types }: { types: string[] }) =>
  types.length
    ? types.map((msgType, index) => (
        <span key={msgType + index.toString()}>
          {index > 0 && (
            <span style={{ color: "var(--chakra-colors-accent-main)" }}>
              {" , "}
            </span>
          )}
          {msgType}
        </span>
      ))
    : "(No message)";

interface ProposalTextCellProps {
  title: string;
  types: ProposalType[];
  isExpedited: boolean;
  isDepositOrVoting: boolean;
}

export const ProposalTextCell = ({
  title,
  types,
  isExpedited,
  isDepositOrVoting,
}: ProposalTextCellProps) => {
  const isMobile = useMobile();
  const [isHoverText, setIsHoverText] = useState(false);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const typeRef = useRef<HTMLParagraphElement>(null);

  const showName =
    isHoverText &&
    (Number(titleRef.current?.scrollWidth) >
      Number(titleRef.current?.clientWidth) ||
      Number(typeRef.current?.scrollWidth) >
        Number(typeRef.current?.clientWidth));

  if (isMobile) {
    return (
      <Flex direction="column" gap={1}>
        <MobileLabel label="Proposal Title" />
        <Flex direction="column" gap={1}>
          <Text
            color="text.main"
            variant="body2"
            fontWeight={500}
            wordBreak="break-word"
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
            <Text ref={typeRef} variant="body3" color="text.dark">
              <RenderMsg types={types} />
            </Text>
          </Flex>
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex
      flexDirection="column"
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
          <RenderMsg types={types} />
        </Text>
      </Flex>
    </Flex>
  );
};
