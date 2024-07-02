import { Flex, Heading, Text } from "@chakra-ui/react";
import { isUndefined } from "lodash";

import { AmpEvent, track } from "lib/amplitude";
import type { IconKeys } from "lib/components/icon";
import { CustomIcon } from "lib/components/icon";

interface InfoCardProps {
  title: string;
  icon: IconKeys;
  content?: number;
  onClick: () => void;
  isDisabled: boolean;
}

export const InfoCard = ({
  title,
  icon,
  content,
  onClick,
  isDisabled,
}: InfoCardProps) => (
  <Flex
    p={4}
    transition="all .25s ease-in-out"
    borderRadius={8}
    w="full"
    alignItems="center"
    justifyContent="space-between"
    {...(isDisabled
      ? {
          bg: "gray.900",
          cursor: "not-allowed",
        }
      : {
          bg: "gray.800",
          _hover: { bg: "gray.700" },
          cursor: "pointer",
          onClick: () => {
            track(AmpEvent.USE_NFT_COLLECTION_INFO_CARD, { label: title });
            onClick();
          },
        })}
  >
    <Flex gap={3} alignItems="center">
      <CustomIcon name={icon} boxSize={6} color="gray.600" />
      <Flex flexDirection="column">
        <Text variant="body1" color="text.dark" fontWeight={600}>
          {title}
        </Text>
        {!isUndefined(content) && (
          <Heading as="h6" variant="h6" fontWeight={600}>
            {content}
          </Heading>
        )}
      </Flex>
    </Flex>
    <CustomIcon name="chevron-right" color="gray.600" />
  </Flex>
);
