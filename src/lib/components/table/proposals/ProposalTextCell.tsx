import { Flex, Text } from "@chakra-ui/react";
import { useRef, useState } from "react";

import { MobileLabel } from "../MobileLabel";
import { useMobile } from "lib/app-provider";
import { DotSeparator } from "lib/components/DotSeparator";
import { Expedited } from "lib/components/Expedited";
import type { ProposalType } from "lib/types";

interface ProposalTextCellProps {
  isDepositOrVoting: boolean;
  isExpedited: boolean;
  title: string;
  types: ProposalType[];
}

export const ProposalTextCell = ({
  isDepositOrVoting,
  isExpedited,
  title,
  types,
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

  if (isMobile)
    return (
      <Flex gap={1} direction="column">
        <MobileLabel label="Proposal Title" />
        <Text variant="body2" color="text.main" wordBreak="break-word">
          {title}
          {isExpedited && (
            <span
              style={{
                display: "inline-block",
                marginLeft: "8px",
                verticalAlign: "middle",
              }}
            >
              <Expedited isActiveExpedited={isDepositOrVoting} />
            </span>
          )}
        </Text>
        {types.length ? (
          types.map((msgType, index) => (
            <Text
              key={msgType + index.toString()}
              variant="body3"
              color="text.dark"
              wordBreak="break-word"
            >
              {msgType}
            </Text>
          ))
        ) : (
          <Text variant="body3" color="text.dark">
            (No message)
          </Text>
        )}
      </Flex>
    );

  return (
    <Flex
      justify="center"
      maxW={showName ? undefined : "full"}
      px={4}
      bgColor={showName ? "gray.800" : "undefined"}
      borderRadius="8px"
      cursor="initial"
      flexDirection="column"
      onClick={(e) => e.stopPropagation()}
      onMouseOut={() => setIsHoverText(false)}
      onMouseOver={() => setIsHoverText(true)}
    >
      <Text
        className={showName ? undefined : "ellipsis"}
        maxW={showName ? undefined : "full"}
        variant="body2"
        whiteSpace="nowrap"
        ref={titleRef}
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
          className={showName ? undefined : "ellipsis"}
          maxW={showName ? undefined : "full"}
          variant="body3"
          whiteSpace="nowrap"
          color="text.dark"
          ref={typeRef}
        >
          {types.length
            ? types.map((msgType, index) => (
                <span key={msgType + index.toString()}>
                  {index > 0 && (
                    <span
                      style={{ color: "var(--chakra-colors-primary-main)" }}
                    >
                      {" , "}
                    </span>
                  )}
                  {msgType}
                </span>
              ))
            : "(No message)"}
        </Text>
      </Flex>
    </Flex>
  );
};
