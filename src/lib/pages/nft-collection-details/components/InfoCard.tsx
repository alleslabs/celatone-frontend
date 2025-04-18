import type { IconKeys } from "lib/components/icon";

import { Flex, Heading, Text } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";
import { isUndefined } from "lodash";

interface InfoCardProps {
  title: string;
  icon: IconKeys;
  content?: number;
  onClick: () => void;
  isDisabled: boolean;
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
    borderRadius={8}
    justifyContent="space-between"
    p={4}
    transition="all .25s ease-in-out"
    w="full"
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
      <CustomIcon boxSize={6} color="gray.600" name={icon} />
      <Flex flexDirection="column">
        <Text color="text.dark" fontWeight={600} variant="body1">
          {title}
        </Text>
        {!isUndefined(content) && (
          <Heading as="h6" fontWeight={600} variant="h6">
            {content}
          </Heading>
        )}
      </Flex>
    </Flex>
    <CustomIcon color="gray.600" name="chevron-right" />
  </Flex>
);
