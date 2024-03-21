import { Box, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

import { Loading } from "lib/components/Loading";
import { Tooltip } from "lib/components/Tooltip";
import { useValidatorUptime } from "lib/services/validatorService";
import { BlockVote } from "lib/types";
import type { ValidatorAddr } from "lib/types";
import { formatUTC } from "lib/utils";

interface BlockProps {
  height: number;
  vote: BlockVote;
  withCursor?: boolean;
}

const Block = ({ height, vote, withCursor = false }: BlockProps) => {
  let backgroundColor = "primary.main";

  if (vote === BlockVote.PROPOSE) {
    backgroundColor = "secondary.main";
  } else if (vote === BlockVote.ABSTAIN) {
    backgroundColor = "error.dark";
  }

  let voteLabel = "Signed";

  if (vote === BlockVote.PROPOSE) {
    voteLabel = "Proposed";
  } else if (vote === BlockVote.ABSTAIN) {
    voteLabel = "Missed";
  }

  return (
    <Tooltip label={`${height} (${voteLabel})`}>
      <Box position="relative">
        <Box
          width="12px"
          height="12px"
          backgroundColor={backgroundColor}
          borderRadius="2px"
        />
        {withCursor && (
          <Box
            id="most-recent-100-blocks-cursor"
            position="absolute"
            bottom="-16px"
            left="1px"
            width="0"
            height="0"
            borderBottom="6px solid var(--chakra-colors-text-dark)"
            borderLeft="5px solid transparent"
            borderRight="5px solid transparent"
          />
        )}
      </Box>
    </Tooltip>
  );
};

interface RecentBlocksSectionProps {
  validatorAddress: ValidatorAddr;
}

export const RecentBlocksSection = ({
  validatorAddress,
}: RecentBlocksSectionProps) => {
  const { data, isLoading, dataUpdatedAt } = useValidatorUptime(
    validatorAddress,
    100
  );

  const parentRef = useRef<HTMLDivElement>(null);
  const hoverTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const parentElement = parentRef.current;
      const cursorElement = document.getElementById(
        "most-recent-100-blocks-cursor"
      );
      const hoverTextElement = hoverTextRef.current;

      if (parentElement && cursorElement && hoverTextElement) {
        const parentRect = parentElement.getBoundingClientRect();
        const cursorRect = cursorElement.getBoundingClientRect();
        const diffLeft = cursorRect.left - parentRect.left;
        const diffRight = parentRect.right - cursorRect.right;

        if (diffLeft < parentRect.width / 2) {
          hoverTextElement.style.left = `${diffLeft}px`;
        } else {
          hoverTextElement.style.right = `${diffRight}px`;
        }
      }
    };

    window.addEventListener("resize", handleResize);

    // Call the handler right away to set initial state
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [dataUpdatedAt]);

  if (isLoading) return <Loading />;

  return (
    <Flex
      direction="column"
      w="full"
      gap={4}
      ref={parentRef}
      position="relative"
      pb={10}
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "start", md: "center" }}
        w="full"
      >
        <Heading as="h6" variant="h6" color="text.main">
          Most Recent 100 Blocks
        </Heading>
        <Text variant="body2" color="text.dark">
          Latest Update: {formatUTC(new Date(dataUpdatedAt))}
        </Text>
      </Flex>
      <Grid
        templateColumns="repeat(auto-fit, minmax(12px, 1fr))"
        gap={1}
        width="full"
      >
        {data?.recent100Blocks
          .map((block, index) => (
            <Block
              key={`block-${block.height}`}
              withCursor={index === 0}
              {...block}
            />
          ))
          .reverse()}
      </Grid>
      <Text
        variant="body2"
        color="text.dark"
        position="absolute"
        bottom="0"
        ref={hoverTextRef}
      >
        Most Recent Blocks: {data?.recent100Blocks[0].height ?? "N/A"}
      </Text>
    </Flex>
  );
};
