import type { ValidatorAddr } from "lib/types";

import { Box, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import { useNavContext } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { ErrorFetching } from "lib/components/state";
import { Tooltip } from "lib/components/Tooltip";
import { useValidatorUptime } from "lib/services/validator";
import { BlockVote } from "lib/types";
import { formatUTC } from "lib/utils";
import { useRouter } from "next/router";
import { forwardRef, useEffect, useRef } from "react";

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
            backgroundColor={backgroundColor}
            borderRadius="2px"
            height="12px"
            width="12px"
          />
          {ref && (
            <Box
              borderBottom="6px solid var(--chakra-colors-text-dark)"
              borderColor="transparent"
              borderLeftWidth="5px"
              borderRightWidth="5px"
              borderStyle="solid"
              bottom="-16px"
              height="0"
              left="1px"
              position="absolute"
              width="0"
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
  const { data, isLoading, dataUpdatedAt } = useValidatorUptime(
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
      direction="column"
      gap={4}
      pb={10}
      position="relative"
      w="full"
      ref={parentRef}
    >
      <Flex
        align={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        w="full"
      >
        <Heading as="h6" color="text.main" variant="h6">
          Most recent 100 blocks
        </Heading>
        <Text color="text.dark" variant="body2">
          Latest update: {formatUTC(new Date(dataUpdatedAt))}
        </Text>
      </Flex>
      <Grid
        gap={1}
        templateColumns="repeat(auto-fit, minmax(12px, 1fr))"
        width="full"
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
        bottom="0"
        color="text.dark"
        position="absolute"
        variant="body2"
        ref={hoverTextRef}
      >
        Most recent block: {data.recent100Blocks[0]?.height ?? "N/A"}
      </Text>
    </Flex>
  );
};
