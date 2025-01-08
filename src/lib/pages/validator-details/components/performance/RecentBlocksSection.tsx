import { Box, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { forwardRef, useEffect, useRef } from "react";

import { useNavContext } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { ErrorFetching } from "lib/components/state";
import { Tooltip } from "lib/components/Tooltip";
import { useValidatorUptime } from "lib/services/validator";
import { BlockVote } from "lib/types";
import type { ValidatorAddr } from "lib/types";
import { formatUTC } from "lib/utils";

interface BlockProps {
  height: number;
  vote: BlockVote;
}

const Block = forwardRef<HTMLDivElement, BlockProps>(
  ({ height, vote }, ref) => {
    let backgroundColor = "recentBlocks.signed";
    let voteLabel = "Signed";

    if (vote === BlockVote.PROPOSE) {
      backgroundColor = "recentBlocks.proposed";
      voteLabel = "Proposed";
    } else if (vote === BlockVote.ABSTAIN) {
      backgroundColor = "recentBlocks.missed";
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
          {ref && (
            <Box
              width="0"
              height="0"
              left="1px"
              borderBottom="6px solid var(--chakra-colors-text-dark)"
              borderLeft="5px solid transparent"
              borderRight="5px solid transparent"
              bottom="-16px"
              position="absolute"
              ref={ref}
            />
          )}
        </Box>
      </Tooltip>
    );
  }
);

interface RecentBlocksSectionProps {
  validatorAddress: ValidatorAddr;
}

export const RecentBlocksSection = ({
  validatorAddress,
}: RecentBlocksSectionProps) => {
  const { data, dataUpdatedAt, isLoading } = useValidatorUptime(
    validatorAddress,
    100
  );
  const { isExpand } = useNavContext();
  const router = useRouter();

  const parentRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const hoverTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const parentElement = parentRef.current;
      const cursorElement = cursorRef.current;
      const hoverTextElement = hoverTextRef.current;

      if (parentElement && cursorElement && hoverTextElement) {
        const parentRect = parentElement.getBoundingClientRect();
        const cursorRect = cursorElement.getBoundingClientRect();
        const diffLeft = cursorRect.left - parentRect.left;
        const diffRight = parentRect.right - cursorRect.right;

        if (diffLeft < 0 || diffRight < 0) return;

        if (diffLeft < parentRect.width / 2) {
          hoverTextElement.style.left = `${diffLeft}px`;
          hoverTextElement.style.right = "auto";
        } else {
          hoverTextElement.style.right = `${diffRight}px`;
          hoverTextElement.style.left = "auto";
        }
      }
    };

    window.addEventListener("resize", handleResize);

    // Call the handler right away to set initial state
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [dataUpdatedAt, isExpand, router.asPath]);

  if (isLoading) return <Loading />;
  if (!data) return <ErrorFetching dataName="recent blocks data" />;

  return (
    <Flex
      gap={4}
      pb={10}
      w="full"
      direction="column"
      position="relative"
      ref={parentRef}
    >
      <Flex
        align={{ base: "start", md: "center" }}
        justify="space-between"
        w="full"
        direction={{ base: "column", md: "row" }}
      >
        <Heading as="h6" variant="h6" color="text.main">
          Most Recent 100 Blocks
        </Heading>
        <Text variant="body2" color="text.dark">
          Latest Update: {formatUTC(new Date(dataUpdatedAt))}
        </Text>
      </Flex>
      <Grid
        width="full"
        gap={1}
        templateColumns="repeat(auto-fit, minmax(12px, 1fr))"
      >
        {data.recent100Blocks
          .map((block, index) => (
            <Block
              key={`block-${block.height}`}
              ref={index === 0 ? cursorRef : undefined}
              {...block}
            />
          ))
          .reverse()}
      </Grid>
      <Text
        variant="body2"
        bottom="0"
        color="text.dark"
        position="absolute"
        ref={hoverTextRef}
      >
        Most Recent Block: {data.recent100Blocks[0]?.height ?? "N/A"}
      </Text>
    </Flex>
  );
};
