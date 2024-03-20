import { track } from "@amplitude/analytics-browser";
import { Flex, Text } from "@chakra-ui/react";
import Link from "next/link";

import { AmpEvent } from "lib/amplitude";

import { CustomIcon } from "./icon";

export const FeedbackLink = () => (
  <Link
    href="https://feedback.alleslabs.com"
    target="_blank"
    rel="noopener noreferrer"
    onClick={() => track(AmpEvent.FEEDBACK)}
  >
    <Flex
      gap={1}
      py={1}
      px={2}
      borderRadius={4}
      align="center"
      _hover={{ background: "gray.800" }}
      transition="all 0.25s ease-in-out"
    >
      <CustomIcon name="feedback" color="gray.600" boxSize={3} />
      <Text variant="body3" color="text.dark">
        Feedback
      </Text>
    </Flex>
  </Link>
);
