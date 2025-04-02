import type { ProposalType } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { DotSeparator } from "lib/components/DotSeparator";
import { Expedited } from "lib/components/Expedited";
import { useRef, useState } from "react";

import { MobileLabel } from "../MobileLabel";

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

  if (isMobile)
    return (
      <Flex direction="column" gap={1}>
        <MobileLabel label="Proposal Title" />
        <Text color="text.main" variant="body2" wordBreak="break-word">
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
              color="text.dark"
              variant="body3"
              wordBreak="break-word"
            >
              {msgType}
            </Text>
          ))
        ) : (
          <Text color="text.dark" variant="body3">
            (No message)
          </Text>
        )}
      </Flex>
    );

  return (
    <Flex
      bgColor={showName ? "gray.800" : "undefined"}
      borderRadius="8px"
      cursor="initial"
      flexDirection="column"
      justify="center"
      maxW={showName ? undefined : "full"}
      px={4}
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
          color="text.dark"
          maxW={showName ? undefined : "full"}
          variant="body3"
          whiteSpace="nowrap"
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
