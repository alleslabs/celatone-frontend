import { Flex, Heading, Text } from "@chakra-ui/react";
import { isUndefined } from "lodash";

import { AmpEvent, track } from "lib/amplitude";
import type { IconKeys } from "lib/components/icon";
import { CustomIcon } from "lib/components/icon";

interface InfoCardProps {
  content?: number;
  icon: IconKeys;
  isDisabled: boolean;
  onClick: () => void;
  title: string;
}

export const InfoCard = ({
  content,
  icon,
  isDisabled,
  onClick,
  title,
}: InfoCardProps) => (
  <Flex
    alignItems="center"
    p={4}
    w="full"
    borderRadius={8}
    justifyContent="space-between"
    transition="all .25s ease-in-out"
    {...(isDisabled
      ? {
          bg: "gray.900",
          cursor: "not-allowed",
        }
      : {
          _hover: { bg: "gray.700" },
          bg: "gray.800",
          cursor: "pointer",
          onClick: () => {
            track(AmpEvent.USE_NFT_COLLECTION_INFO_CARD, { label: title });
            onClick();
          },
        })}
  >
    <Flex alignItems="center" gap={3}>
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
